import PropTypes from 'prop-types';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { DISCOUNT_TYPE, TAX_TYPE, STATUS, DISCOUNT_BY } from './constant';
import { handleNumericInput } from 'utils/material-ui-helper';

const taxOptions = [
  { value: TAX_TYPE.INDIVIDUAL, label: 'At Line Item Level' },
  { value: TAX_TYPE.GROUP, label: 'At Group Level' }
];

// Options for the discount radio group
const discountOptions = [
  { value: DISCOUNT_TYPE.NO, label: "I don't give discounts" },
  { value: DISCOUNT_TYPE.INDIVIDUAL, label: 'At Line Item Level' },
  { value: DISCOUNT_TYPE.GROUP, label: 'At Transaction Level' }
];

const discountByOptions = [
  { value: DISCOUNT_BY.PERCENTAGE, label: 'Percentage (%)' },
  { value: DISCOUNT_BY.AMOUNT, label: 'Amount (₹)' }
];

const additionalChargesOptions = [
  { value: STATUS.NO, label: 'No' },
  { value: STATUS.YES, label: 'Yes' }
];

const roundingOptions = [
  { value: STATUS.NO, label: 'No' },
  { value: STATUS.YES, label: 'Yes' }
];

const InvoiceSettingsFormContent = ({ redirect }) => {
  const formik = useFormikContext();

  return (
    <>
      <Stack gap={2}>
        <Grid container spacing={2}>
          {/* Tax Handling Option */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomRadioGroup
              label="Handle Tax at:"
              name="taxType"
              value={formik.values.taxType}
              onChange={formik.handleChange}
              options={taxOptions}
            />
          </Grid>

          {/* Discount Option */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomRadioGroup
              label="Do you give discounts?"
              name="discountType"
              value={formik.values.discountType}
              onChange={formik.handleChange}
              options={discountOptions}
            />
          </Grid>

          {/* Discount By */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomRadioGroup
              label="Discount by?"
              name="discountBy"
              value={formik.values.discountBy}
              onChange={formik.handleChange}
              options={discountByOptions}
            />
          </Grid>

          {/* Additional Charges Option */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomRadioGroup
              label="Do you want to add any additional charges?"
              name="additionalCharges"
              value={formik.values.additionalCharges}
              onChange={formik.handleChange}
              options={additionalChargesOptions}
            />
          </Grid>

          {/* Rounding Off Option */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomRadioGroup
              label="Rounding off in Transactions?"
              name="roundOff"
              value={formik.values.roundOff}
              onChange={formik.handleChange}
              options={roundingOptions}
            />
          </Grid>
        </Grid>

        {!redirect && (
          <>
            {/* Invoice */}
            <Stack spacing={2}>
              <Typography variant="subtitle1">Invoice</Typography>

              <Stack gap={1}>
                <Grid container spacing={2}>
                  {/* Invoice Prefix */}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Invoice Prefix"
                      name="invoicePrefix"
                      value={formik.values.invoicePrefix}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>

                  {/* Invoice Number */}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={formik.values.invoiceNumber}
                      onChange={formik.handleChange}
                      onInput={handleNumericInput}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
};

InvoiceSettingsFormContent.propTypes = {
  redirect: PropTypes.string
};

export default InvoiceSettingsFormContent;

const CustomRadioGroup = ({ label, name, value, onChange, options = [], direction = 'column', gap = 2 }) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    // Automatically convert to a number if the options' values are numbers
    const isNumeric = options.every((option) => typeof option.value === 'number');
    const transformedValue = isNumeric ? Number(newValue) : newValue;

    onChange({ target: { name, value: transformedValue } });
  };
  return (
    <Stack gap={gap}>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <RadioGroup
        name={name}
        value={value}
        //   onChange={onChange}
        onChange={handleChange}
        row={direction === 'row'}
      >
        {options.map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
    </Stack>
  );
};

// Define prop types for validation
CustomRadioGroup.propTypes = {
  label: PropTypes.string, // Optional label for the radio group
  name: PropTypes.string.isRequired, // Name of the Formik field
  value: PropTypes.oneOfType([
    // Value bound to Formik state
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func.isRequired, // Formik's onChange handler
  options: PropTypes.arrayOf(
    // Array of radio options
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  direction: PropTypes.oneOf(['row', 'column']), // Layout direction (row/column)
  gap: PropTypes.number // Gap between radio items
};

// Define default prop values
CustomRadioGroup.defaultProps = {
  label: '',
  direction: 'column',
  gap: 2
};
