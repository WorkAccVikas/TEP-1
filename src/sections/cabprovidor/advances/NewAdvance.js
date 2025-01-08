import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project-imports
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';

const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required') // Validate that the amount is provided
    .positive('Amount must be a positive number') // Validate that the amount is positive
    .typeError('Amount must be a number'), // Ensure it's a number type

  remarks: Yup.string().required('Remarks are required'), // Validate that remarks are provided

  paymentType: Yup.string().required('Payment type is required'), // Ensure that payment type is selected

  transactionId: Yup.string().when('paymentType', {
    is: 'Online', // Only required if paymentType is 'Online'
    then: Yup.string().required('Transaction ID is required'),
    otherwise: Yup.string().notRequired() // Not required if paymentType is 'Cash'
  }),

  advanceType: Yup.string().required('Advance Type is required'), // Validate that advance type is selected

  interestRate: Yup.number()
    .required('Interest rate is required') // Ensure that interest rate is provided
    .positive('Interest rate must be a positive number')
    .typeError('Interest rate must be a number'),

  finalAmount: Yup.number()
    .required('Final amount is required') // Ensure that final amount is provided
    .positive('Final amount must be a positive number')
    .typeError('Final amount must be a number')
});

// ==============================|| Advance Vendor - ADD / EDIT ||============================== //

const NewAdvance = ({ onCancel, key, setKey }) => {
  const token = localStorage.getItem('serviceToken');
  const [loading, setLoading] = useState(true);

  const [fetchAllAdvance, setFetchAllAdvance] = useState(null);
  const [advanceProvider, setAdvanceProvider] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInformation'));

  const cabProviderId = userInfo.userId;

  //useEffect for Advance type list by cabProviderID
  useEffect(() => {
    const fetchdata = async () => {
      const response = await axiosServices.get(`/advanceType/all?cabProviderId=${cabProviderId}`);

      if (response.status === 200) {
        setLoading(false);
      }
      setFetchAllAdvance(response.data.dataList);
    };

    fetchdata();
  }, []);

  const formik = useFormik({
    initialValues: {
      amount: '',
      remarks: '',
      advanceType: '',
      advanceTypeId: '',
      requestedById: null,
      isDriver: 0,
      isVendor: 1,
      transactionId: '',
      paymentType: 'Cash'
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axiosServices.put(`/advance/status/update`, {
          data: {
            amount: formik.values.amount,
            remarks: formik.values.remarks,
            advanceTypeId: values.advanceType,
            requestedById: cabProviderId,
            isDriver: formik.values.isDriver,
            isVendor: formik.values.isVendor,
            transactionId: formik.values.transactionId,
            paymentType: formik.values.paymentType
          }
        });

        if (response.status === 200) {
          const snackbarColor = 'success'; // Green for approved, red for rejected
          dispatch(
            openSnackbar({
              open: true,
              message: 'Advance Status approved successfully.',
              variant: 'alert',
              alert: {
                color: snackbarColor
              },
              close: false,
              sx: {
                backgroundColor: theme.palette.success.main
              }
            })
          );
          setKey(key + 1);
          // window.location.reload();
        }
      } catch (error) {
        console.error('Error updating status:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to update status.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            sx: {
              backgroundColor: theme.palette.error.main
            }
          })
        );
      } finally {
        onCancel();
      }
    }
  });

  useEffect(() => {
    const { amount, interestRate } = formik.values;

    if (amount && interestRate) {
      const requestedAmount = parseFloat(amount);
      const rate = parseFloat(interestRate);

      if (!isNaN(requestedAmount) && !isNaN(rate)) {
        const finalAmount = requestedAmount + requestedAmount * (rate / 100);
        formik.setFieldValue('finalAmount', finalAmount.toFixed(2)); // Update payableAmount with the calculated value
      }
    }
  }, [formik.values.amount, formik.values.interestRate]);

  const handleCancel = () => {
    formik.resetForm({
      values: {
        ...formik.initialValues,
        interestRate: '',
        finalAmount: ''
      }
    });
    onCancel(); // Call the onCancel prop function
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Add Advance</DialogTitle>
            <Divider />

            <DialogContent sx={{ p: 2.5 }} direction="row">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="amount"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      placeholder="Enter Amount"
                      type="number"
                      error={Boolean(formik.touched.amount && formik.errors.amount)}
                      helperText={formik.touched.amount && formik.errors.amount}
                      InputProps={{
                        // readOnly: true,

                        inputProps: {
                          sx: {
                            '::-webkit-outer-spin-button': { display: 'none' },
                            '::-webkit-inner-spin-button': { display: 'none' },
                            '-moz-appearance': 'textfield' // Firefox
                          }
                        }
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  {' '}
                  <Stack spacing={1}>
                    <InputLabel htmlFor="remarks">Remarks</InputLabel>
                    <TextField
                      fullWidth
                      id="remarks"
                      name="remarks"
                      value={formik.values.remarks}
                      onChange={formik.handleChange}
                      placeholder="Please Add Remarks"
                      error={Boolean(formik.touched.remarks && formik.errors.remarks)}
                      helperText={formik.touched.remarks && formik.errors.remarks}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="paymentType">Payment Type</InputLabel>
                    <Select
                      fullWidth
                      id="paymentType"
                      name="paymentType"
                      value={formik.values.paymentType}
                      onChange={(e) => {
                        formik.handleChange(e);
                        // If "Cash" is selected, disable and clear transactionId
                        if (e.target.value === 'Cash') {
                          formik.setFieldValue('transactionId', ''); // Clear the transactionId value
                        }
                      }}
                      error={Boolean(formik.touched.paymentType && formik.errors.paymentType)}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.paymentType && formik.errors.paymentType}</FormHelperText>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="transactionId">Transaction Id</InputLabel>
                    <TextField
                      fullWidth
                      id="transactionId"
                      name="transactionId"
                      value={formik.values.transactionId}
                      onChange={formik.handleChange}
                      placeholder="Enter Transaction Id"
                      error={Boolean(formik.touched.transactionId && formik.errors.transactionId)}
                      helperText={formik.touched.transactionId && formik.errors.transactionId}
                      disabled={formik.values.paymentType === 'Cash'} // Disable field if paymentType is "Cash"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="advanceType">Advance Type</InputLabel>
                    <FormControl>
                      <InputLabel>Advance Type</InputLabel>
                      <Select
                        fullWidth
                        placeholder="Enter Advance Type"
                        defaultValue=""
                        id="advanceType"
                        name="advanceType"
                        value={formik.values.advanceType}
                        onChange={(e) => {
                          const selectedAdvanceType = fetchAllAdvance.find((item) => item._id === e.target.value);
                          console.log('fetchAllAdvance', fetchAllAdvance);

                          formik.setFieldValue('advanceType', e.target.value); // Update the advance type
                          formik.setFieldValue('interestRate', selectedAdvanceType?.interestRate || ''); // Update the interest rate
                        }}
                        error={formik.touched.advanceType && Boolean(formik.errors.advanceType)}
                        helperText={formik.touched.advanceType && formik.errors.advanceType}
                        autoComplete="advanceType"
                      >
                        {fetchAllAdvance &&
                          fetchAllAdvance.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                              {item.advanceTypeName}
                            </MenuItem>
                          ))}
                      </Select>
                      {formik.touched.advanceType && formik.errors.advanceType && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {formik.errors.advanceType}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="interestRate">Interest Rate</InputLabel>
                    <TextField
                      fullWidth
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      value={formik.values.interestRate}
                      onChange={formik.handleChange} // Allow manual updates if needed
                      placeholder="Enter Interest Rate"
                      error={Boolean(formik.touched.interestRate && formik.errors.interestRate)}
                      helperText={formik.touched.interestRate && formik.errors.interestRate}
                      InputProps={{
                        readOnly: true,

                        inputProps: {
                          sx: {
                            '::-webkit-outer-spin-button': { display: 'none' },
                            '::-webkit-inner-spin-button': { display: 'none' },
                            '-moz-appearance': 'textfield' // Firefox
                          }
                        }
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="finalAmount">Final Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="finalAmount"
                      name="finalAmount"
                      value={formik.values.finalAmount}
                      onChange={formik.handleChange}
                      placeholder="Enter Final Amount"
                      error={Boolean(formik.touched.finalAmount && formik.errors.finalAmount)}
                      helperText={formik.touched.finalAmount && formik.errors.finalAmount}
                      InputProps={{
                        readOnly: true // Make the field read-only since it's auto-calculated
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!(formik.values.amount && formik.values.advanceType) || !formik.isValid || !formik.dirty}
                >
                  Add
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </LocalizationProvider>
      </FormikProvider>
      {/* {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} />} */}
    </>
  );
};

NewAdvance.propTypes = {
  onCancel: PropTypes.func
};

export default NewAdvance;
