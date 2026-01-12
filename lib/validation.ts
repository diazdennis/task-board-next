import { ValidationRule, ValidationSchema } from '@/types/form';

export function validateField<T>(
  value: T,
  rule: ValidationRule<T>
): string | null {
  const isEmpty = !value || (typeof value === 'string' && value.trim() === '');

  // Check required first
  if (rule.required && isEmpty) {
    return rule.message || 'This field is required';
  }

  // Skip all validations if field is empty and not required
  if (isEmpty && !rule.required) {
    return null;
  }

  if (typeof value === 'string') {
    // Min length
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Must be at least ${rule.minLength} characters`;
    }

    // Max length
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Must be less than ${rule.maxLength} characters`;
    }

    // Pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Format is invalid';
    }
  }

  // Custom validate function (only called for non-empty values now)
  if (rule.validate && !rule.validate(value)) {
    return rule.message || 'Value is invalid';
  }

  // Enum check
  if (rule.enum && !rule.enum.includes(value as T)) {
    return rule.message || `Must be one of: ${rule.enum.join(', ')}`;
  }

  return null;
}

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: ValidationSchema<T>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(schema).forEach((key) => {
    const rule = schema[key as keyof T];
    if (!rule) return;

    const error = validateField(data[key as keyof T], rule);
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
}


