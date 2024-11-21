import PropTypes from 'prop-types';
import axios from 'axios';

// material-ui
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project-imports
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import axiosServices from 'utils/axios';
import { useEffect } from 'react';

const CustomerSchema = Yup.object().shape({});

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

const AdvanceForm = ({ onCancel, advanceData, key, setKey }) => {
  const token = localStorage.getItem('serviceToken');
  const dispatch = useDispatch();
  const theme = useTheme();

  console.log('advanceData', advanceData);
  console.log('key', key);

  const handleReject = async () => {
    try {
      const response = await axiosServices.put(`/advance/status/update`, {
        data: {
          _id: advanceData._id, // Assuming `_id` is part of row data
          isApproved: 2,
        }
      });

      if (response.status === 200) {
        const snackbarColor = 'error'; // Green for approved, red for rejected
        dispatch(
          openSnackbar({
            open: true,
            message: 'Advance Status Rejected Successfully.',
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
        window.location.reload();
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
  };

  const formik = useFormik({
    initialValues: {
      requestedAmount: advanceData?.requestedAmount || ''
    },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await axiosServices.put(`/advance/status/update`, {
          data: {
            _id: advanceData._id,
            isApproved: 1,
            approvedAmount: values.approvedAmount,
            finalAmount: values.finalPayableAmount,
            approvedRemark: values.approvedRemark,
            transactionId: values.transactionId
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
          window.location.reload();
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
    if (formik.values.requestedAmount && advanceData?.advanceTypeId?.interestRate) {
      // Calculate the payable amount
      const requestedAmount = parseFloat(formik.values.requestedAmount);
      const interestRate = advanceData?.advanceTypeId?.interestRate;

      if (!isNaN(requestedAmount) && !isNaN(interestRate)) {
        const payableAmount = requestedAmount - requestedAmount * (interestRate / 100);
        formik.setFieldValue('payableAmount', payableAmount.toFixed(2)); // Set the calculated payable amount
      }
    }
  }, [formik.values.requestedAmount, advanceData?.advanceTypeId?.interestRate]);

  useEffect(() => {
    if (formik.values.approvedAmount && advanceData?.advanceTypeId?.interestRate) {
      // Calculate the final payable amount
      const approvedAmount = parseFloat(formik.values.approvedAmount);
      const interestRate = advanceData?.advanceTypeId?.interestRate;

      if (!isNaN(approvedAmount) && !isNaN(interestRate)) {
        const finalPayableAmount = approvedAmount - approvedAmount * (interestRate / 100);
        formik.setFieldValue('finalPayableAmount', finalPayableAmount.toFixed(2)); // Set the calculated final payable amount
      }
    }
  }, [formik.values.approvedAmount, advanceData?.advanceTypeId?.interestRate]);

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
              <DialogTitle style={{ margin: 0, padding: 0 }}>Approve/Reject Advance</DialogTitle>
              <Chip label={`Interest Rate: ${advanceData?.advanceTypeId?.interestRate}%`} size="small" color="success" variant="light" />
            </div>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                {/* Row 1: 2 Fields */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="requestedAmount">Requested Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="requestedAmount"
                      name="requestedAmount"
                      value={formik.values.requestedAmount}
                      defaultValue="Read Only"
                      onChange={formik.handleChange}
                      placeholder="Enter Requested Amount"
                      error={Boolean(formik.touched.requestedAmount && formik.errors.requestedAmount)}
                      helperText={formik.touched.requestedAmount && formik.errors.requestedAmount}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="finalAmount">Payable Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="payableAmount"
                      name="payableAmount"
                      value={formik.values.payableAmount}
                      onChange={formik.handleChange}
                      placeholder="Enter Final Amount"
                      error={Boolean(formik.touched.payableAmount && formik.errors.payableAmount)}
                      helperText={formik.touched.payableAmount && formik.errors.payableAmount}
                    />
                  </Stack>
                </Grid>

                {/* Row 2: 2 Fields */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="approvedAmount">Approved Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="approvedAmount"
                      name="approvedAmount"
                      value={formik.values.approvedAmount}
                      type="number"
                      onChange={formik.handleChange}
                      placeholder="Enter Approved Amount"
                      error={Boolean(formik.touched.approvedAmount && formik.errors.approvedAmount)}
                      helperText={formik.touched.approvedAmount && formik.errors.approvedAmount}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="finalAmount">Final Payable Amount</InputLabel>
                    <TextField
                      fullWidth
                      id="finalPayableAmount"
                      name="finalPayableAmount"
                      value={formik.values.finalPayableAmount}
                      onChange={formik.handleChange}
                      placeholder="Enter Final Amount"
                      error={Boolean(formik.touched.finalPayableAmount && formik.errors.finalPayableAmount)}
                      helperText={formik.touched.finalPayableAmount && formik.errors.finalPayableAmount}
                    />
                  </Stack>
                </Grid>

                {/* Row 3: 2 Fields */}
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
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="finalAmount">Remark</InputLabel>
                    <TextField
                      fullWidth
                      id="approvedRemark"
                      name="approvedRemark"
                      value={formik.values.approvedRemark}
                      onChange={formik.handleChange}
                      placeholder="Enter Remarks"
                      error={Boolean(formik.touched.approvedRemark && formik.errors.approvedRemark)}
                      helperText={formik.touched.approvedRemark && formik.errors.approvedRemark}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleReject} variant="contained" color="error">
                  Reject
                </Button>
                <Button type="submit" variant="contained" disabled={!(formik.values.transactionId && formik.values.approvedAmount)}>
                  Approve
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

AdvanceForm.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func
};

export default AdvanceForm;
