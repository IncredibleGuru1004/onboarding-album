# Category Redux Implementation

This document describes the Redux implementation for category management in the frontend application.

## Overview

The category management system provides a complete CRUD (Create, Read, Update, Delete) interface for categories, integrated with the backend API.

## Architecture

### 1. API Routes (`/app/api/categories/`)

#### GET `/api/categories`

Fetches all categories from the backend.

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Category Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST `/api/categories`

Creates a new category. Requires authentication.

**Request Body:**

```json
{
  "title": "New Category"
}
```

**Response:** Returns the created category object.

#### GET `/api/categories/[id]`

Fetches a single category by ID.

**Response:** Returns the category object with related auctions.

#### PATCH `/api/categories/[id]`

Updates a category. Requires authentication.

**Request Body:**

```json
{
  "title": "Updated Category Name"
}
```

**Response:** Returns the updated category object.

#### DELETE `/api/categories/[id]`

Deletes a category. Requires authentication.

**Response:** 204 No Content

### 2. Redux Slice (`/store/categorySlice.ts`)

#### State Structure

```typescript
interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Async Thunks

- **`fetchCategories`**: Fetches all categories
- **`fetchCategoryById`**: Fetches a single category by ID
- **`createCategory`**: Creates a new category
- **`updateCategoryThunk`**: Updates an existing category
- **`deleteCategoryThunk`**: Deletes a category

#### Synchronous Actions

- **`setCategories`**: Manually set categories array
- **`clearError`**: Clear error message
- **`clearCurrentCategory`**: Clear the current category

#### Selectors

- **`selectCategories`**: Get all categories
- **`selectCurrentCategory`**: Get the current category
- **`selectCategoriesLoading`**: Get loading state
- **`selectCategoriesError`**: Get error message

### 3. Custom Hook (`/hooks/useCategories.ts`)

The `useCategories` hook provides a convenient interface for components to interact with category state and actions.

#### Usage Example

```typescript
import { useCategories } from "@/hooks/useCategories";

function MyComponent() {
  const {
    categories,
    isLoading,
    error,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Fetch categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Create a category
  const handleCreate = async () => {
    try {
      await addCategory({ title: "New Category" });
      toast.success("Category created!");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  // Update a category
  const handleUpdate = async (id: string) => {
    try {
      await updateCategory(id, { title: "Updated Name" });
      toast.success("Category updated!");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  // Delete a category
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {categories.map((cat) => (
        <div key={cat.id}>{cat.title}</div>
      ))}
    </div>
  );
}
```

### 4. Category Initializer (`/components/categories/CategoryInitializer.tsx`)

A component that automatically fetches categories when the app loads. It's included in the root layout to ensure categories are available throughout the application.

```typescript
// In app/[locale]/layout.tsx
<ReduxProvider>
  <CategoryInitializer />
  {children}
</ReduxProvider>
```

## Type Definitions

### Category

```typescript
export interface Category {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### CreateCategoryDto

```typescript
export interface CreateCategoryDto {
  title: string;
}
```

### UpdateCategoryDto

```typescript
export interface UpdateCategoryDto {
  title?: string;
}
```

## Component Integration

### Sidebar Component

The Sidebar component has been updated to use the new Redux async thunks:

```typescript
import { useCategories } from "@/hooks/useCategories";

const Sidebar = () => {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } =
    useCategories();

  const handleAddCategory = async () => {
    try {
      await addCategory({ title: "New Category" });
      toast.success("Category created!");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  // ... rest of the component
};
```

## Error Handling

All async operations include proper error handling:

1. **API Routes**: Return appropriate HTTP status codes and error messages
2. **Redux Thunks**: Use `rejectWithValue` to pass errors to the state
3. **Components**: Use try-catch blocks and display toast notifications

## Authentication

Category creation, update, and deletion operations require authentication. The API routes automatically extract the JWT token from cookies:

```typescript
const token = request.cookies.get("accessToken")?.value;
```

## Best Practices

1. **Always use the `useCategories` hook** instead of directly dispatching actions
2. **Handle loading states** in your UI to provide feedback to users
3. **Display error messages** using toast notifications
4. **Validate input** before making API calls
5. **Use the CategoryInitializer** to ensure categories are loaded on app start

## Testing

To test the category functionality:

1. Ensure the backend is running
2. Login to get an authentication token
3. Use the Sidebar component to create, edit, and delete categories
4. Check the Redux DevTools to see state changes
5. Verify API calls in the Network tab

## Future Enhancements

- Add pagination for large category lists
- Implement category search/filter
- Add category icons/images
- Implement category ordering/sorting
- Add bulk operations (delete multiple, reorder)
