import PropTypes from 'prop-types';
import axios from 'axios';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, Stack, TextField, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project-imports
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import axiosServices from 'utils/axios';

const CustomerSchema = Yup.object().shape({});

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

const AdvanceForm = ({ onCancel, advanceData, key, setKey }) => {
  const token = localStorage.getItem('serviceToken');
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleReject = async () => {
    try {
      const response = await axiosServices.put(
        `/advance/status/update`,
        {
          data: {
            _id: advanceData._id, // Assuming `_id` is part of row data
            isApproved: 2,
            approved_amount: advanceData.approved_amount
          }
        },
      );

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
    initialValues: { amount: advanceData?.amount || '', approved_amount: advanceData?.approved_amount || '' },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await axiosServices.put(
          `/advance/status/update`,
          {
            data: {
              _id: advanceData._id, // Assuming `_id` is part of row data
              isApproved: 1,
              approved_amount: values.approved_amount
            }
          },
        );

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

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Approve/Reject Advance</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }} direction="row">
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="advanceTypeName">Requested Amount</InputLabel>
                  <TextField
                    fullWidth
                    id="amount"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    placeholder="Enter Requested Amount"
                    error={Boolean(formik.touched.amount && formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel htmlFor="interestRate">Approved Amount</InputLabel>
                  <TextField
                    fullWidth
                    id="approved_amount"
                    name="approved_amount"
                    value={formik.values.approved_amount}
                    onChange={formik.handleChange}
                    placeholder="Enter Approved Amount"
                    type="number"
                    error={Boolean(formik.touched.approved_amount && formik.errors.approved_amount)}
                    helperText={formik.touched.approved_amount && formik.errors.approved_amount}
                  />
                </Stack>
              </Stack>
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
                <Button type="submit" variant="contained">
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
