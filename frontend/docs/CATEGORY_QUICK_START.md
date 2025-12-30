# Category Management - Quick Start Guide

## 🚀 Quick Start

### Using Categories in Your Component

```typescript
import { useCategories } from "@/hooks/useCategories";
import { toast } from "react-toastify";

export default function MyComponent() {
  const {
    categories,           // Array of all categories
    isLoading,           // Loading state
    error,               // Error message (if any)
    loadCategories,      // Fetch all categories
    addCategory,         // Create new category
    updateCategory,      // Update existing category
    deleteCategory,      // Delete category
  } = useCategories();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 📝 Common Operations

### 1. Create a Category

```typescript
const handleCreate = async () => {
  try {
    const newCategory = await addCategory({ title: "New Category" });
    toast.success("Category created successfully!");
    console.log("Created:", newCategory);
  } catch (error) {
    toast.error("Failed to create category");
    console.error(error);
  }
};
```

### 2. Update a Category

```typescript
const handleUpdate = async (categoryId: string) => {
  try {
    const updated = await updateCategory(categoryId, {
      title: "Updated Name",
    });
    toast.success("Category updated successfully!");
    console.log("Updated:", updated);
  } catch (error) {
    toast.error("Failed to update category");
    console.error(error);
  }
};
```

### 3. Delete a Category

```typescript
const handleDelete = async (categoryId: string) => {
  try {
    await deleteCategory(categoryId);
    toast.success("Category deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete category");
    console.error(error);
  }
};
```

### 4. Get Category by ID

```typescript
const { getCategoryById } = useCategories();

const category = getCategoryById("some-category-id");
if (category) {
  console.log("Found:", category.title);
}
```

## 🎯 Using Redux Directly (Advanced)

If you need more control, you can use Redux directly:

```typescript
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchCategories,
  createCategory,
  selectCategories,
  selectCategoriesLoading,
} from "@/store/categorySlice";

export default function AdvancedComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesLoading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      await dispatch(createCategory({ title: "New" })).unwrap();
      toast.success("Created!");
    } catch (error) {
      toast.error("Failed!");
    }
  };

  return <div>{/* Your UI */}</div>;
}
```

## 🔑 Available Selectors

```typescript
import {
  selectCategories, // Get all categories
  selectCurrentCategory, // Get current category
  selectCategoriesLoading, // Get loading state
  selectCategoriesError, // Get error message
} from "@/store/categorySlice";

const categories = useSelector(selectCategories);
const loading = useSelector(selectCategoriesLoading);
const error = useSelector(selectCategoriesError);
```

## 🎨 UI Integration Examples

### Display Categories as List

```typescript
function CategoryList() {
  const { categories, isLoading } = useCategories();

  if (isLoading) return <Spinner />;

  return (
    <ul className="space-y-2">
      {categories.map(cat => (
        <li key={cat.id} className="p-2 border rounded">
          {cat.title}
        </li>
      ))}
    </ul>
  );
}
```

### Category Dropdown

```typescript
function CategoryDropdown() {
  const { categories, loadCategories } = useCategories();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="border rounded p-2"
    >
      <option value="">Select a category</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.title}
        </option>
      ))}
    </select>
  );
}
```

### Category Filter Checkboxes

```typescript
function CategoryFilter() {
  const { categories } = useCategories();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-2">
      {categories.map(cat => (
        <label key={cat.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(cat.id)}
            onChange={() => toggleCategory(cat.id)}
          />
          <span>{cat.title}</span>
        </label>
      ))}
    </div>
  );
}
```

## 🔒 Authentication Requirements

Operations that require authentication:

- ✅ **GET** `/api/categories` - No auth required
- ✅ **GET** `/api/categories/:id` - No auth required
- 🔐 **POST** `/api/categories` - Auth required
- 🔐 **PATCH** `/api/categories/:id` - Auth required
- 🔐 **DELETE** `/api/categories/:id` - Auth required

If not authenticated, these operations will return a 401 error.

## 🐛 Troubleshooting

### Categories not loading?

```typescript
// Check if CategoryInitializer is in your layout
// frontend/app/[locale]/layout.tsx should have:
<ReduxProvider>
  <CategoryInitializer />
  {children}
</ReduxProvider>
```

### Getting 401 errors?

```typescript
// Make sure user is logged in for create/update/delete operations
import { useAuth } from "@/hooks/useAuth";

const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  toast.error("Please login first");
  return;
}
```

### Categories not updating in UI?

```typescript
// Make sure you're using the hook or selectors
// Redux state updates automatically when operations succeed
const { categories } = useCategories(); // ✅ Correct
// Don't store categories in local state unnecessarily
```

## 📚 More Information

- Full documentation: `frontend/docs/CATEGORY_REDUX.md`
- Implementation summary: `CATEGORY_IMPLEMENTATION_SUMMARY.md`
- Example usage: See `frontend/components/layout/Sidebar.tsx`

## 💡 Tips

1. **Always use `useCategories` hook** - It's the easiest way
2. **Handle loading states** - Show spinners or skeletons
3. **Show error messages** - Use toast notifications
4. **Validate input** - Check before making API calls
5. **Use try-catch** - Always wrap async operations
6. **Check authentication** - Before create/update/delete
