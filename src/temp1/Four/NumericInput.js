import PropTypes from 'prop-types'; // Import PropTypes for validation
import { TextField, InputAdornment } from '@mui/material';

// Reusable Numeric Input Component
const NumericInput = ({ fieldName, label, value, onChange, onBlur, error, helperText, currencySymbol = '₹', ...props }) => {
  const handleValueChange = (event) => {
    const newValue = event.target.value;
    // Allow only numeric values and update the state
    if (/^\d+$/.test(newValue) || newValue === '') {
      onChange(event);
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      name={fieldName}
      value={value}
      onChange={handleValueChange}
      onBlur={onBlur}
      error={Boolean(error)}
      helperText={helperText}
      InputProps={{
        startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>
      }}
      margin="normal"
      {...props} // Allow for other props like sx, etc.
    />
  );
};

// Prop validation
NumericInput.propTypes = {
  fieldName: PropTypes.string.isRequired, // The field name should be a required string
  label: PropTypes.string.isRequired, // The label should be a required string
  value: PropTypes.oneOfType([
    // Value can be either a string or a number
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func.isRequired, // onChange should be a required function
  onBlur: PropTypes.func.isRequired, // onBlur should be a required function
  error: PropTypes.bool, // error should be a boolean
  helperText: PropTypes.string, // helperText should be a string
  currencySymbol: PropTypes.string // currencySymbol should be a string (optional, default '₹')
};

export default NumericInput;

/**
 * NumericInput is a reusable input component designed for handling numeric values,
 * with optional currency symbol support and validation for numeric input.
 *
 * This component leverages Material-UI's `TextField` and `InputAdornment` to render an
 * input field with a prefix currency symbol (default is '₹'). It allows only numeric
 * input (including empty input) and provides a helper text for error messages. The
 * component also supports custom props for styling and configuration.
 *
 * Props:
 * - `fieldName`: The name of the input field (required).
 * - `label`: The label for the input field (required).
 * - `value`: The current value of the input, which can be a string or a number (required).
 * - `onChange`: The handler function to update the value when the user types (required).
 * - `onBlur`: The handler function to be called when the input field loses focus (required).
 * - `error`: A boolean indicating if there is an error with the input (optional).
 * - `helperText`: A string containing the helper text, typically used to show error messages (optional).
 * - `currencySymbol`: A string representing the currency symbol to be displayed before the input value (optional, default is '₹').
 *
 * Usage:
 * This component can be used to create numeric input fields, such as for entering
 * monetary amounts, with clear validation and error handling.
 */
