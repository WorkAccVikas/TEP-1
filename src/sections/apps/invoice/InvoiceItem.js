import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Stack, TableCell, Tooltip, Typography } from '@mui/material';

// third-party
import { getIn } from 'formik';

// project-imports
import InvoiceField from './InvoiceField';
import AlertProductDelete from './AlertProductDelete';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { ThemeMode } from 'config';

// assets
import { Trash } from 'iconsax-react';
import { DISCOUNT_BY } from 'pages/setting/invoice/constant';

// ==============================|| INVOICE - ITEMS ||============================== //

const InvoiceItem = ({
  id,
  itemName,
  quantity,
  rate,
  itemTax,
  code,
  taxIndividual,
  discountIndividual,
  itemDiscount,
  discountBy,
  settings,
  onDeleteItem,
  onEditItem,
  index,
  Blur,
  errors,
  touched
}) => {
  const { country } = useSelector((state) => state.invoice);

  const theme = useTheme();
  const mode = theme.palette.mode;

  const [open, setOpen] = useState(false);
  const handleModalClose = (status) => {
    setOpen(false);
    if (status) {
      onDeleteItem(index);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Product Deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
  };

  const Name = `invoice_detail[${index}].name`;
  const touchedName = getIn(touched, Name);
  const errorName = getIn(errors, Name);

  // const textFieldItem = [
  //   {
  //     placeholder: 'Item name',
  //     label: 'Item Name',
  //     name: `invoice_detail.${index}.itemName`,
  //     type: 'text',
  //     id: id + '_itemName',
  //     value: itemName,
  //     errors: errorName,
  //     touched: touchedName
  //   },
  //   { placeholder: '', label: 'Qty', type: 'number', name: `invoice_detail.${index}.quantity`, id: id + '_quantity', value: quantity },
  //   { placeholder: '', label: 'Rate', type: 'number', name: `invoice_detail.${index}.rate`, id: id + '_rate', value: rate },
  //   { placeholder: '', label: 'code', type: 'string', name: `invoice_detail.${index}.code`, id: id + '_code', value: code },
  //   { placeholder: '', label: 'tax', type: 'number', name: `invoice_detail.${index}.itemTax`, id: id + '_tax', value: itemTax }
  // ];

  // Basic fields
  const textFieldItem = [
    {
      index,
      placeholder: 'Item name',
      label: 'Item Name',
      name: `invoice_detail.${index}.itemName`,
      type: 'text',
      id: `${id}_itemName`,
      value: itemName,
      errors: errorName,
      touched: touchedName
    },
    { index, placeholder: '', label: 'Rate', type: 'number', name: `invoice_detail.${index}.rate`, id: `${id}_rate`, value: rate },
    {
      index,
      placeholder: '',
      label: 'Qty',
      type: 'number',
      name: `invoice_detail.${index}.quantity`,
      id: `${id}_quantity`,
      value: quantity
    }
  ];

  // Add conditionally based on taxIndividual
  if (taxIndividual) {
    textFieldItem.push(
      { index, placeholder: '', label: 'Code', type: 'text', name: `invoice_detail.${index}.code`, id: `${id}_code`, value: code },
      { index, placeholder: '', label: 'Tax', type: 'number', name: `invoice_detail.${index}.itemTax`, id: `${id}_tax`, value: itemTax }
    );
  }

  // Add conditionally based on discountIndividual
  if (discountIndividual) {
    textFieldItem.push({
      index,
      placeholder: '',
      label: 'Discount',
      type: 'number',
      name: `invoice_detail.${index}.itemDiscount`,
      id: `${id}_itemDiscount`,
      value: itemDiscount
    });
  }

  return (
    <>
      {textFieldItem.map((item) => {
        return (
          <InvoiceField
            onEditItem={(event) => onEditItem(event)}
            onBlur={(event) => Blur(event)}
            cellData={{
              index: item.index,
              placeholder: item.placeholder,
              name: item.name,
              type: item.type,
              id: item.id,
              value: item.value,
              errors: item.errors,
              touched: item.touched
            }}
            key={item.label}
            settings={settings}
          />
        );
      })}

      {/* Tax Amount */}
      {taxIndividual && (
        <TableCell>
          <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
            <Box sx={{ pr: 2, pl: 2 }}>
              <Typography>{country?.prefix + '' + ((rate * quantity * itemTax) / 100)?.toFixed(2) || 0}</Typography>
            </Box>
          </Stack>
        </TableCell>
      )}

      {/* Discount Amount */}
      {discountIndividual && (
        <TableCell>
          <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
            <Box sx={{ pr: 2, pl: 2 }}>
              {discountBy === DISCOUNT_BY.PERCENTAGE ? (
                <Typography>{country?.prefix + '' + ((rate * quantity * itemDiscount) / 100)?.toFixed(2)}</Typography>
              ) : (
                <Typography>{country?.prefix + '' + itemDiscount?.toFixed(2)}</Typography>
              )}
            </Box>
          </Stack>
        </TableCell>
      )}

      {/* Total Amount */}
      <TableCell>
        <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography>{country?.prefix + '' + (rate * quantity)?.toFixed(2) || 0}</Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                opacity: 0.9
              }
            }
          }}
          title="Remove Item"
        >
          <Button color="error" onClick={() => setOpen(true)}>
            <Trash />
          </Button>
        </Tooltip>
      </TableCell>
      <AlertProductDelete title={name} open={open} handleClose={handleModalClose} />
    </>
  );
};

InvoiceItem.propTypes = {
  id: PropTypes.string,
  itemName: PropTypes.string,
  quantity: PropTypes.number,
  rate: PropTypes.number,
  itemTax: PropTypes.number,
  taxIndividual: PropTypes.bool,
  discountIndividual: PropTypes.bool,
  itemDiscount: PropTypes.number,
  discountBy: PropTypes.string,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  index: PropTypes.number,
  Blur: PropTypes.func,
  errors: PropTypes.object,
  touched: PropTypes.object
};

export default InvoiceItem;
