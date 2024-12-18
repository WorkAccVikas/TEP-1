import { EMAIL_REGEX_PATTERN, MOBILE_NUMBER_REGEX_PATTERN, PIN_CODE_REGEX_PATTERN } from 'constant';

// Modified validation functions to include detailed error messages
export const isRequiredString = (value) => {
  if (typeof value === 'string' && value.trim() !== '') return true;
  throw new Error('Expected a non-empty string');
};

export const isValidEmail = (value) => {
  if (typeof value === 'string' && EMAIL_REGEX_PATTERN.test(value)) return true;
  throw new Error('Expected a valid email format');
};

export const isMobileNumber = (value) => {
  if ((typeof value === 'number' || typeof value === 'string') && MOBILE_NUMBER_REGEX_PATTERN.test(value.toString())) return true;
  throw new Error('Expected a 10-digit mobile number');
};

export const isString = (value) => {
  if (typeof value === 'string' || typeof value === 'undefined') return true;
  throw new Error('Expected a string or undefined');
};

export const isNumber = (value) => {
  if (typeof value === 'number' || typeof value === 'undefined') return true;
  throw new Error('Expected a number or undefined');
};

// Validation function for array items
export const validateArrayItem = (item, rules, fieldMapping) => {
  const errors = {};
  Object.entries(rules).forEach(([index, validationFn]) => {
    const fieldName = fieldMapping[index];
    try {
      validationFn(item[Number(index)]);
    } catch (error) {
      errors[fieldName] = error.message;
      //   errors['message'] = error.message;
    }
  });
  return Object.keys(errors).length === 0 ? null : errors;
};

// Function to separate valid and invalid items
export const separateValidAndInvalidItems = (data, rules, fieldMapping) => {
  const validItems = [];
  const invalidItems = [];

  data.forEach((item) => {
    const errors = validateArrayItem(item, rules, fieldMapping);
    if (!errors) {
      validItems.push(item);
    } else {
      invalidItems.push({ item, errors });
    }
  });

  return { validItems, invalidItems };
};
