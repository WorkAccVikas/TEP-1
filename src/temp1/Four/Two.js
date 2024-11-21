import React from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { TextField, InputAdornment, Button } from '@mui/material';

// Constants for validation and configuration
const FIELD_NAMES = {
  GUARD_PRICE: 'guardPrice'
};

const VALIDATION_MESSAGES = {
  REQUIRED: 'Price is required',
  TYPE_ERROR: 'Must be a number',
  MIN: 'Price must be at least ₹0',
  MAX: 'Price cannot exceed ₹1000'
};

const VALIDATION_LIMITS = {
  MIN_PRICE: 0,
  MAX_PRICE: 1000
};

const INPUT_PATTERNS = {
  NUMERIC: /^[0-9]*\.?[0-9]*$/ // Allow numeric and decimal input
};

// Validation Schema
const validationSchema = Yup.object({
  [FIELD_NAMES.GUARD_PRICE]: Yup.number()
    .typeError(VALIDATION_MESSAGES.TYPE_ERROR)
    .min(VALIDATION_LIMITS.MIN_PRICE, VALIDATION_MESSAGES.MIN)
    .max(VALIDATION_LIMITS.MAX_PRICE, VALIDATION_MESSAGES.MAX)
    .required(VALIDATION_MESSAGES.REQUIRED)
});

const Two = () => {
  const formik = useFormik({
    initialValues: { [FIELD_NAMES.GUARD_PRICE]: 0 }, // Stored as a number
    validationSchema,
    onSubmit: (values) => {
      console.log('Form values:', values); // Values are stored as numbers
    }
  });

  const { handleSubmit, values, setFieldValue, errors, touched, handleBlur } = formik;

  const handleGuardPriceChange = (event) => {
    const value = event.target.value;
    // Allow only numeric and decimal values
    if (INPUT_PATTERNS.NUMERIC.test(value)) {
      setFieldValue(FIELD_NAMES.GUARD_PRICE, value === '' ? '' : value);
    }
  };

  const handleGuardPriceBlur = (event) => {
    const value = event.target.value;
    console.log(`🚀 ~ handleGuardPriceBlur ~ value:`, value);
    // Ensure the value is stored as a number in Formik
    setFieldValue(FIELD_NAMES.GUARD_PRICE, value === '' ? 0 : parseFloat(value), true);
    handleBlur(event); // Trigger Formik's blur handling
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Guard Price"
          variant="outlined"
          name={FIELD_NAMES.GUARD_PRICE}
          value={values[FIELD_NAMES.GUARD_PRICE]}
          onChange={handleGuardPriceChange}
          onBlur={handleGuardPriceBlur}
          error={touched[FIELD_NAMES.GUARD_PRICE] && Boolean(errors[FIELD_NAMES.GUARD_PRICE])}
          helperText={touched[FIELD_NAMES.GUARD_PRICE] && errors[FIELD_NAMES.GUARD_PRICE]}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>
          }}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </form>
    </FormikProvider>
  );
};

export default Two;

// Decimals are allowed