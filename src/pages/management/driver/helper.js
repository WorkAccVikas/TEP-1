import { EMAIL_REGEX_PATTERN, MOBILE_NUMBER_REGEX_PATTERN, PIN_CODE_REGEX_PATTERN, ALPHA_NUMERIC_REGEX_PATTERN } from 'constant';
// Modified validation functions to include detailed error messages
export const isRequiredString = (value) => {
  if (typeof value === 'string' && value.trim() !== '') return true;
  else if (typeof value === 'number') {
    throw new Error('Expected a string');
  }
  throw new Error('This field is required');
};

export const isValidEmail = (value) => {
  if (typeof value === 'string' && EMAIL_REGEX_PATTERN.test(value)) return true;
  throw new Error('Expected a valid email format');
};

export const isValidEmailOptional = (value) => {
  // Skip validation for undefined
  if (typeof value === 'undefined' || value === null) return true;

  if (typeof value === 'string' && EMAIL_REGEX_PATTERN.test(value)) return true;
  throw new Error('Expected a valid email format');
};

export const isMobileNumber = (value) => {
  if ((typeof value === 'number' || typeof value === 'string') && MOBILE_NUMBER_REGEX_PATTERN.test(value.toString())) return true;
  throw new Error('Expected a 10-digit mobile number');
};

export const isMobileNumberOptional = (value) => {
  // Skip validation for undefined
  if (typeof value === 'undefined' || value === null) return true;

  // Guard clause: Check if the value is a number or a string
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new Error('Expected a 10-digit mobile number');
  }

  // Guard clause: Check if the value matches the regex pattern
  if (!MOBILE_NUMBER_REGEX_PATTERN.test(value.toString())) {
    throw new Error('Expected a 10-digit mobile number');
  }

  return true; // Return true if all conditions are satisfied
};

export const isString = (value) => {
  if (typeof value === 'string' || typeof value === 'undefined' || value === null) return true;
  throw new Error('Value should be a string or left empty');
};

export const isNumber = (value) => {
  if (typeof value === 'number' || typeof value === 'undefined' || value === null) return true;
  throw new Error('Value should be a number or left empty');
};

// Validation function for date
export const isValidDate = (value) => {
  // If the value is undefined, consider it valid
  if (value === undefined) return true;

  // Check if the value is a valid string date in the DD/MM/YYYY format
  if (typeof value === 'string' && moment(value, 'DD/MM/YYYY', true).isValid()) {
    return true;
  }

  throw new Error('Expected a valid date in DD/MM/YYYY format');
};

// Validation function to check if the date is in the future
export const isDateInFuture = (value) => {
  // If the value is undefined, consider it valid (optional based on your requirements)
  if (value === undefined) return true;

  // Check if the value is a string and a valid date
  if (typeof value === 'string') {
    const date = moment(value, 'DD/MM/YYYY', true);

    if (!date.isValid()) {
      throw new Error('Expected a valid date in DD/MM/YYYY format');
    }

    // Check if the date is in the future
    if (date.isBefore(moment(), 'day')) {
      throw new Error('Date must be later than or equal to the current date');
    }

    return true;
  }

  throw new Error('Expected a valid date in DD/MM/YYYY format');
};

export const isPinCodeOptional = (value) => {
  // Skip validation for undefined
  if (typeof value === 'undefined' || value === null) return true;

  if (typeof value === 'number' && PIN_CODE_REGEX_PATTERN.test(value.toString())) return true;
  throw new Error('Expected a 6-digit pin code');
};

export const isAnythingRequired = (value) => {
  if (!value) {
    throw new Error('This field is required');
  }

  return true;
};

export const isPositiveNumberRequired = (value) => {
  if (typeof value !== 'number' && !value) {
    throw new Error('This field is required');
  }
  if (typeof value !== 'number') {
    throw new Error('Expected a number');
  }

  if (value < 0) {
    throw new Error('Expected a positive number');
  }

  return true;
};

// Validation function to check if the value is in the expected values array (guard clause style)
export const isValueInExpectedValues = (value, expectedValues) => {
  // Allow undefined values (guard clause)
  if (typeof value === 'undefined') {
    return true;
  }

  // Guard clause: If the value is not in the expectedValues, throw an error
  if (!expectedValues.includes(value)) {
    throw new Error(`Value must be one of the following: ${expectedValues.join(', ')}`);
  }

  // If value is valid, return true
  return true;
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

export const isValidVehicleNumber = (value) => {
  if (!value) {
    throw new Error('This field is required');
  }

  if (!ALPHA_NUMERIC_REGEX_PATTERN.test(value)) {
    throw new Error('Expected a valid vehicle number');
  }

  return true;
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

const validateArrayItemWithGenericDependencies = (item, fieldMapping) => {
  const errors = {};

  // Validate individual fields
  Object.entries(fieldMapping).forEach(([key, { validation, name }]) => {
    if (key === 'dependencies') return; // Skip dependencies
    try {
      validation(item[Number(key)]);
    } catch (error) {
      errors[name] = error.message;
    }
  });

  // Validate dependencies
  if (fieldMapping.dependencies) {
    fieldMapping.dependencies.forEach(({ fields, validation, errorField }) => {
      const values = fields.map((index) => item[index]);
      try {
        validation(values);
      } catch (error) {
        errors[errorField] = error.message;
      }
    });
  }

  return Object.keys(errors).length === 0 ? null : errors;
};

export const separateValidAndInvalidItemsWithGenericDependencies = (data, fieldMapping) => {
  const validItems = [];
  const invalidItems = [];

  data.forEach((item) => {
    const errors = validateArrayItemWithGenericDependencies(item, fieldMapping);
    if (!errors) {
      validItems.push(item);
    } else {
      invalidItems.push({ item, errors });
    }
  });

  return { validItems, invalidItems };
};
