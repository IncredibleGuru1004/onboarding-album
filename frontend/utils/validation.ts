/**
 * Validation utilities for forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates that a string is not empty after trimming
 */
export function validateRequired(
  value: string,
  fieldName: string,
): ValidationResult {
  if (!value.trim()) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
}

/**
 * Validates that a value exists (for non-string fields)
 */
export function validateExists<T>(
  value: T | null | undefined,
  fieldName: string,
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
}

/**
 * Validates that a string has minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string,
): ValidationResult {
  if (value.trim().length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true };
}

/**
 * Validates that a category name doesn't already exist
 */
export function validateUniqueCategoryName(
  name: string,
  existingCategories: Array<{ id: string; title: string }>,
  excludeId?: string,
): ValidationResult {
  const trimmedName = name.trim().toLowerCase();
  const exists = existingCategories.some(
    (category) =>
      category.title.toLowerCase() === trimmedName && category.id !== excludeId,
  );

  if (exists) {
    return {
      isValid: false,
      error: "Category name already exists",
    };
  }

  return { isValid: true };
}

/**
 * Combines multiple validation results
 */
export function combineValidations(
  ...validations: ValidationResult[]
): ValidationResult {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
}
