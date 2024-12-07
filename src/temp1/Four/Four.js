import React from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import NumericInput from './NumericInput'; // Import the reusable component

const validationSchema = Yup.object({
  guardPrice: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Price must be at least ₹0')
    .max(1000, 'Price cannot exceed ₹1000')
    .required('Price is required'),
  anotherField: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Amount must be at least ₹0')
    .max(5000, 'Amount cannot exceed ₹5000')
    .required('Amount is required')
});

const Four = () => {
  const formik = useFormik({
    initialValues: { guardPrice: 0, anotherField: 0 },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form values:', values);
      alert(JSON.stringify(values, null, 2));
    }
  });

  const { handleSubmit, values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  // Generic handleBlur function for numeric fields
  const handleBlurField =
    (fieldName, defaultValue = 0) =>
    (event) => {
      const value = event.target.value;
      // Convert the value to a number or set it to the default value if empty
      setFieldValue(fieldName, value === '' ? defaultValue : Number(value), true);
      handleBlur(event); // Trigger Formik's blur handling
    };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit}>
        <NumericInput
          fieldName="guardPrice"
          label="Guard Price"
          value={values.guardPrice}
          onChange={handleChange}
          onBlur={handleBlurField('guardPrice')}
          error={touched.guardPrice && Boolean(errors.guardPrice)}
          helperText={touched.guardPrice && errors.guardPrice}
        />
        <NumericInput
          fieldName="anotherField"
          label="Amount"
          value={values.anotherField}
          onChange={handleChange}
          onBlur={handleBlurField('anotherField', 77)}
          error={touched.anotherField && Boolean(errors.anotherField)}
          helperText={touched.anotherField && errors.anotherField}
          currencySymbol="$"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </form>
    </FormikProvider>
  );
};

export default Four;
