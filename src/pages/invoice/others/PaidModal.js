import {
  AppBar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { Add } from 'iconsax-react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';

const remainingAmount = (totalAmount, receivedAmount, TDS) => {
  return totalAmount - receivedAmount - (totalAmount * TDS) / 100;
};

const validationSchema = Yup.object({
  receivedAmount: Yup.number()
    .min(1, 'The amount you enter must be more than zero.')
    .test('max-remaining', function (value) {
      const { totalAmount, TDS } = this.parent; // Access sibling fields
      const maxAllowed = remainingAmount(totalAmount, 0, TDS);
      if (value > maxAllowed) {
        return this.createError({
          path: this.path,
          message: `Received amount exceeds the allowable limit of ₹${maxAllowed}`
        });
      }
      return true;
    })
    .required('Received Amount is required'),
  TDS: Yup.number().min(0, 'TDS must be at least 0').max(100, 'TDS cannot exceed 100').required('TDS is required'),
  transactionID: Yup.string().required('Transaction ID is required')
});

const PaidModal = ({ open, onClose, amount, onConfirm }) => {
  console.log('amount', amount);

  const formik = useFormik({
    initialValues: {
      totalAmount: amount || 0,
      transactionID: '',
      receivedAmount: 0,
      TDS: 0
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('form data', values);
        onConfirm('Paid', {
          transactionID: values.transactionID,
          receivedAmount: values.receivedAmount,
          TDS: values.TDS,
          status: 1
        });
      } catch (error) {
        console.log('error', error);
      }
    }
  });

  const remainingBalance = remainingAmount(formik.values.totalAmount, formik.values.receivedAmount, formik.values.TDS);
  console.log(`🚀 ~ PaidModal ~ remainingBalance:`, remainingBalance);

  return (
    <>
      <FormikProvider value={formik}>
        <Form
          onSubmit={formik.handleSubmit}
          noValidate
          //  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
            <DialogTitle id="alert-dialog-title">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Payment ?</Typography>
                <IconButton onClick={onClose} color="inherit" aria-label="close">
                  <Add style={{ transform: 'rotate(45deg)' }} />
                </IconButton>
              </Stack>
            </DialogTitle>
          </AppBar>

          <Divider />

          <DialogContent>
            <Grid container spacing={2}>
              {/* Total Amount */}
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <InputLabel>Total Amount</InputLabel>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ₹ {formik.values.totalAmount}
                  </Typography>
                </Stack>
              </Grid>

              {/* Transaction ID */}
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <InputLabel required htmlFor="transactionID" title="Transaction ID">
                    Transaction ID
                  </InputLabel>
                  <TextField
                    name="transactionID"
                    id="transactionID"
                    type="text"
                    value={formik.values.transactionID}
                    onChange={formik.handleChange}
                    error={formik.touched.transactionID && Boolean(formik.errors.transactionID)}
                    helperText={formik.touched.transactionID && formik.errors.transactionID}
                  />
                </Stack>
              </Grid>

              {/* Received Amount */}
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <InputLabel required htmlFor="receivedAmount" title="Received Amount">
                    Received Amount
                  </InputLabel>
                  <TextField
                    name="receivedAmount"
                    id="receivedAmount"
                    type="number"
                    value={formik.values.receivedAmount}
                    // onChange={(e) => {
                    //   const receivedAmount = e.target.value;
                    //   console.log('receivedAmount = ', receivedAmount);
                    //   const formattedValue = receivedAmount === '' ? '' : Number(receivedAmount);
                    //   console.log('receivedAmount = ', formattedValue);
                    //   formik.setFieldValue('receivedAmount', formattedValue);
                    // }}
                    onChange={formik.handleChange}
                    error={formik.touched.receivedAmount && Boolean(formik.errors.receivedAmount)}
                    helperText={formik.touched.receivedAmount && formik.errors.receivedAmount}
                    inputProps={{
                      min: 0
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                </Stack>
              </Grid>

              {/* TDS */}
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <InputLabel required htmlFor="TDS" title="TDS">
                    TDS
                  </InputLabel>
                  <TextField
                    name="TDS"
                    id="TDS"
                    type="number"
                    value={formik.values.TDS}
                    onChange={formik.handleChange}
                    error={formik.touched.TDS && Boolean(formik.errors.TDS)}
                    helperText={formik.touched.TDS && formik.errors.TDS}
                    inputProps={{
                      min: 0
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                  />
                </Stack>
              </Grid>

              {/* Remaining Balance */}
              {/* <Grid item xs={12}>
                <Stack gap={1} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
                  <InputLabel>Remaining Balance</InputLabel>
                  {remainingBalance <= 0 ? (
                    <Stack direction="row" alignItems="center" gap={1} color="success.main">
                      <FaCheckCircle size={20} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Cleared
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      ₹ {remainingBalance.toFixed(2)}
                    </Typography>
                  )}
                </Stack>
              </Grid> */}
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              p: 2
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" width={'100%'}>
              <Stack direction="row" gap={1}>
                <InputLabel sx={{ fontWeight: 'bold' }}>Remaining Balance</InputLabel>
                {remainingBalance <= 0 ? (
                  <Stack direction="row" alignItems="center" gap={1} color="success.main">
                    <FaCheckCircle size={20} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Cleared
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    ₹ {remainingBalance.toFixed(2)}
                  </Typography>
                )}
              </Stack>

              {/* Buttons */}
              <Stack direction="row" alignItems="center" gap={2}>
                <Button color="error" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" color="success" variant="contained" disabled={formik.isSubmitting || !formik.dirty}>
                  Proceed
                </Button>
              </Stack>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

export default PaidModal;
