import PropTypes from 'prop-types';

// material-ui
import { TableCell, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { DISCOUNT_BY, DISCOUNT_TYPE, TAX_TYPE } from 'pages/setting/invoice/constant';

// ==============================|| INVOICE - TEXT FIELD ||============================== //

const InvoiceField = ({ onEditItem, cellData, settings }) => {
  console.log(`🚀 ~ InvoiceField ~ settings:`, settings);
  const formik = useFormikContext();
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    onEditItem(event);

    const arr = name.split('.').pop();
    console.log(`🚀 ~ handleChange ~ arr:`, arr);

    const [fieldName, remainingField] = getLastAndRemaining(name);
    console.log(`🚀 ~ handleChange ~ fieldName:`, fieldName);
    console.log(`🚀 ~ handleChange ~ remainingField:`, remainingField);

    if (fieldName === 'quantity') {
      const oldRate = formik.getFieldProps(`${remainingField}.rate`).value;
      const oldTaxRate = formik.getFieldProps(`${remainingField}.itemTax`).value;
      const oldDiscountRate = formik.getFieldProps(`${remainingField}.itemDiscount`).value;

      console.log({ oldRate, oldTaxRate, oldDiscountRate });

      const amount = oldRate * value;
      formik.setFieldValue(`${remainingField}.amount`, amount);

      if (settings?.tax?.apply === TAX_TYPE.INDIVIDUAL) {
        const taxAmount = (oldRate * value * oldTaxRate) / 100;
        formik.setFieldValue(`${remainingField}.taxAmount`, taxAmount);
      }

      if (settings?.discount?.apply === DISCOUNT_TYPE.INDIVIDUAL) {
        let discountAmount;

        if (settings?.discount?.by === DISCOUNT_BY.PERCENTAGE) {
          console.log('Discount Percentage');
          discountAmount = (oldRate * value * oldDiscountRate) / 100;
        } else {
          console.log('Discount Amount');
          discountAmount = oldDiscountRate;
        }
        formik.setFieldValue(`${remainingField}.discountAmount`, discountAmount);
      }
    }

    if (fieldName === 'rate') {
      const oldQuantity = formik.getFieldProps(`${remainingField}.quantity`).value;
      const oldTaxRate = formik.getFieldProps(`${remainingField}.itemTax`).value;
      const oldDiscountRate = formik.getFieldProps(`${remainingField}.itemDiscount`).value;

      const amount = oldQuantity * value;
      formik.setFieldValue(`${remainingField}.amount`, amount);

      if (settings?.tax?.apply === TAX_TYPE.INDIVIDUAL) {
        const taxAmount = (oldQuantity * value * oldTaxRate) / 100;
        formik.setFieldValue(`${remainingField}.taxAmount`, taxAmount);
      }

      if (settings?.discount?.apply === DISCOUNT_TYPE.INDIVIDUAL) {
        let discountAmount;

        if (settings?.discount?.by === DISCOUNT_BY.PERCENTAGE) {
          console.log('Discount Percentage');
          discountAmount = (oldQuantity * value * oldDiscountRate) / 100;
        } else {
          console.log('Discount Amount');
          discountAmount = oldDiscountRate;
        }
        formik.setFieldValue(`${remainingField}.discountAmount`, discountAmount);
      }
    }

    if (fieldName === 'itemDiscount') {
      const oldRate = formik.getFieldProps(`${remainingField}.rate`).value;
      const oldQuantity = formik.getFieldProps(`${remainingField}.quantity`).value;

      if (settings?.discount?.apply === DISCOUNT_TYPE.INDIVIDUAL) {
        let discountAmount;

        if (settings?.discount?.by === DISCOUNT_BY.PERCENTAGE) {
          console.log('Discount Percentage');
          discountAmount = (oldQuantity * value * oldRate) / 100;
        } else {
          console.log('Discount Amount');
          discountAmount = value;
        }
        formik.setFieldValue(`${remainingField}.discountAmount`, discountAmount);
      }
    }

    if (fieldName === 'itemTax') {
      const oldRate = formik.getFieldProps(`${remainingField}.rate`).value;
      const oldQuantity = formik.getFieldProps(`${remainingField}.quantity`).value;

      if (settings?.tax?.apply === TAX_TYPE.INDIVIDUAL) {
        const taxAmount = (oldQuantity * value * oldRate) / 100;
        formik.setFieldValue(`${remainingField}.taxAmount`, taxAmount);
      }
    }
  };

  return (
    <TableCell sx={{ '& .MuiFormHelperText-root': { position: 'absolute', bottom: -24, ml: 0 } }}>
      <TextField
        type={cellData.type}
        placeholder={cellData.placeholder}
        name={cellData.name}
        id={cellData.id}
        value={cellData.type === 'number' ? (cellData.value > 0 ? cellData.value : '') : cellData.value}
        // onChange={onEditItem} 
        onChange={handleChange}
        label={cellData.label}
        error={Boolean(cellData.errors && cellData.touched)}
        inputProps={{
          ...(cellData.type === 'number' && { min: 0 })
        }}
        sx={{
          '& .MuiInputBase-input': {
            padding: '8px'
          }
        }}
      />
    </TableCell>
  );
};

InvoiceField.propTypes = {
  onEditItem: PropTypes.func,
  cellData: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.number,
  value: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.bool,
  touched: PropTypes.bool
};

export default InvoiceField;

function getLastAndRemaining(str) {
  const arr = str.split('.');
  if (arr.length === 0) return [null, []]; // Return null and an empty array if the input array is empty

  const lastValue = arr[arr.length - 1]; // Get the last value
  const remainingArray = arr.slice(0, arr.length - 1); // Get the remaining elements

  return [lastValue, remainingArray.join('.'), remainingArray];
}
