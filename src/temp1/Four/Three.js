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
    .required('Price is required')
});

const Three = () => {
  const formik = useFormik({
    initialValues: { guardPrice: 0 },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form values:', values);
    }
  });

  const { handleSubmit, values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const handleBlurGuardPrice = (event) => {
    const value = event.target.value;
    console.log(`🚀 ~ handleBlurGuardPrice ~ value:`, value);
    setFieldValue('guardPrice', value === '' ? 0 : Number(value), true);
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
          onBlur={handleBlurGuardPrice}
          error={touched.guardPrice && Boolean(errors.guardPrice)}
          helperText={touched.guardPrice && errors.guardPrice}
          currencySymbol="₹"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </form>
    </FormikProvider>
  );
};

export default Three;
