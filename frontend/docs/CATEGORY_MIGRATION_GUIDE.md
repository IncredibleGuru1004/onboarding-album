# Category Redux Migration Guide

This guide helps you migrate existing components from the old category implementation to the new Redux-based system.

## Overview of Changes

### Before (Old Implementation)

- Categories were hardcoded in Redux state
- No API integration
- Synchronous actions only
- No loading or error states
- Local ID generation with `crypto.randomUUID()`

### After (New Implementation)

- Categories fetched from backend API
- Full CRUD operations with API
- Async thunks for all operations
- Loading and error state management
- Server-generated IDs

## Migration Steps

### Step 1: Update Imports

#### Before:

```typescript
import {
  addCategory,
  updateCategory,
  deleteCategory,
  setCategories,
} from "@/store/categorySlice";
```

#### After:

```typescript
import {
  createCategory,
  updateCategoryThunk,
  deleteCategoryThunk,
  fetchCategories,
  setCategories,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "@/store/categorySlice";

// Or better yet, use the hook:
import { useCategories } from "@/hooks/useCategories";
```

### Step 2: Update Component Logic

#### Before:

```typescript
const MyComponent = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);

  const handleAdd = () => {
    dispatch(addCategory({
      id: crypto.randomUUID(),
      title: "New Category"
    }));
  };

  const handleUpdate = (id: string, title: string) => {
    dispatch(updateCategory({ id, title }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCategory(id));
  };

  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>{cat.title}</div>
      ))}
    </div>
  );
};
```

#### After (Using Hook - Recommended):

```typescript
const MyComponent = () => {
  const {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    loadCategories,
  } = useCategories();

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    try {
      await addCategory({ title: "New Category" });
      toast.success("Category created!");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id: string, title: string) => {
    try {
      await updateCategory(id, { title });
      toast.success("Category updated!");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>{cat.title}</div>
      ))}
    </div>
  );
};
```

#### After (Using Redux Directly):

```typescript
const MyComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAdd = async () => {
    try {
      await dispatch(createCategory({ title: "New Category" })).unwrap();
      toast.success("Category created!");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id: string, title: string) => {
    try {
      await dispatch(updateCategoryThunk({ id, data: { title } })).unwrap();
      toast.success("Category updated!");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategoryThunk(id)).unwrap();
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>{cat.title}</div>
      ))}
    </div>
  );
};
```

### Step 3: Add Loading States

Always handle loading states in your UI:

```typescript
// Simple loading indicator
{isLoading && <div>Loading categories...</div>}

// Skeleton loader
{isLoading && (
  <div className="space-y-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
    ))}
  </div>
)}

// Spinner
{isLoading && <Spinner />}

// Disable buttons during loading
<button disabled={isLoading}>
  {isLoading ? "Creating..." : "Create Category"}
</button>
```

### Step 4: Add Error Handling

Always handle errors gracefully:

```typescript
// Display error message
{error && (
  <div className="bg-red-50 border border-red-200 p-3 rounded">
    <p className="text-red-600">{error}</p>
  </div>
)}

// Toast notification
try {
  await addCategory({ title: "New" });
  toast.success("Success!");
} catch (error) {
  toast.error(error instanceof Error ? error.message : "An error occurred");
}

// Clear errors
const { clearErrorMessage } = useCategories();
clearErrorMessage();
```

### Step 5: Remove Hardcoded Data

#### Before:

```typescript
const initialCategories: Category[] = [
  { id: "weapons", title: "Weapons" },
  { id: "skulls", title: "Skulls" },
  // ... more hardcoded categories
];
```

#### After:

```typescript
// Remove hardcoded data
// Categories are now fetched from the API
// CategoryInitializer handles initial loading
```

## Common Migration Patterns

### Pattern 1: Category List Component

#### Before:

```typescript
function CategoryList() {
  const categories = useSelector((state: RootState) => state.categories.categories);

  return (
    <ul>
      {categories.map(cat => (
        <li key={cat.id}>{cat.title}</li>
      ))}
    </ul>
  );
}
```

#### After:

```typescript
function CategoryList() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ul>
      {categories.map(cat => (
        <li key={cat.id}>{cat.title}</li>
      ))}
    </ul>
  );
}
```

### Pattern 2: Category Form

#### Before:

```typescript
function CategoryForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(addCategory({
      id: crypto.randomUUID(),
      title,
    }));
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
```

#### After:

```typescript
function CategoryForm() {
  const { addCategory, isLoading } = useCategories();
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addCategory({ title });
      setTitle("");
      toast.success("Category created!");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
```

### Pattern 3: Category Filter

#### Before:

```typescript
function CategoryFilter({ onFilterChange }: Props) {
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id];
    setSelected(newSelected);
    onFilterChange(newSelected);
  };

  return (
    <div>
      {categories.map(cat => (
        <label key={cat.id}>
          <input
            type="checkbox"
            checked={selected.includes(cat.id)}
            onChange={() => handleToggle(cat.id)}
          />
          {cat.title}
        </label>
      ))}
    </div>
  );
}
```

#### After:

```typescript
function CategoryFilter({ onFilterChange }: Props) {
  const { categories, isLoading, loadCategories } = useCategories();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id];
    setSelected(newSelected);
    onFilterChange(newSelected);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      {categories.map(cat => (
        <label key={cat.id}>
          <input
            type="checkbox"
            checked={selected.includes(cat.id)}
            onChange={() => handleToggle(cat.id)}
          />
          {cat.title}
        </label>
      ))}
    </div>
  );
}
```

## Breaking Changes

### 1. Action Names Changed

| Old              | New                                 |
| ---------------- | ----------------------------------- |
| `addCategory`    | `createCategory` (async thunk)      |
| `updateCategory` | `updateCategoryThunk` (async thunk) |
| `deleteCategory` | `deleteCategoryThunk` (async thunk) |
| N/A              | `fetchCategories` (new)             |
| N/A              | `fetchCategoryById` (new)           |

### 2. Action Payloads Changed

#### Old:

```typescript
dispatch(addCategory({ id: "123", title: "New" }));
dispatch(updateCategory({ id: "123", title: "Updated" }));
dispatch(deleteCategory("123"));
```

#### New:

```typescript
dispatch(createCategory({ title: "New" })); // No ID needed
dispatch(updateCategoryThunk({ id: "123", data: { title: "Updated" } }));
dispatch(deleteCategoryThunk("123"));
```

### 3. All Operations Are Now Async

You must use `await` or `.then()` with all category operations:

```typescript
// Old (synchronous)
dispatch(addCategory({ id: "123", title: "New" }));
console.log("Added!");

// New (asynchronous)
await dispatch(createCategory({ title: "New" })).unwrap();
console.log("Added!");
```

### 4. State Structure Changed

#### Old:

```typescript
{
  categories: {
    categories: Category[]
  }
}
```

#### New:

```typescript
{
  categories: {
    categories: Category[],
    currentCategory: Category | null,
    isLoading: boolean,
    error: string | null
  }
}
```

## Testing Your Migration

1. **Test Loading State**: Verify loading indicators appear
2. **Test Error Handling**: Disconnect backend and check error messages
3. **Test CRUD Operations**: Create, read, update, delete categories
4. **Test Authentication**: Ensure auth-required operations fail when logged out
5. **Test Redux DevTools**: Check state updates in Redux DevTools
6. **Test Network Tab**: Verify API calls are made correctly

## Checklist

- [ ] Updated all imports
- [ ] Converted synchronous actions to async thunks
- [ ] Added loading states to UI
- [ ] Added error handling
- [ ] Removed hardcoded category data
- [ ] Added `useEffect` to load categories
- [ ] Updated all dispatch calls to use `.unwrap()`
- [ ] Added toast notifications
- [ ] Tested all CRUD operations
- [ ] Verified authentication requirements
- [ ] Checked Redux DevTools
- [ ] Tested error scenarios

## Need Help?

- Check the Quick Start Guide: `frontend/docs/CATEGORY_QUICK_START.md`
- Review the full documentation: `frontend/docs/CATEGORY_REDUX.md`
- See the Sidebar component for a complete example: `frontend/components/layout/Sidebar.tsx`
