import PropTypes from 'prop-types';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project-imports
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import axiosServices from 'utils/axios';

// ==============================|| SIMPLE FORM ||============================== //

const SimpleSchema = Yup.object().shape({
  requestedAmount: Yup.number().required('Requested Amount is required'),
  approvedAmount: Yup.number().required('Approved Amount is required'),
  transactionId: Yup.string().required('Transaction ID is required'),
  approvedRemark: Yup.string().required('Remarks are required')
});

const NewAdvance = ({ onCancel }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      requestedAmount: '',
      approvedAmount: '',
      transactionId: '',
      approvedRemark: ''
    },
    validationSchema: SimpleSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosServices.put('/advance/status/update', {
          data: {
            isApproved: 1,
            approvedAmount: values.approvedAmount,
            transactionId: values.transactionId,
            approvedRemark: values.approvedRemark
          }
        });

        if (response.status === 200) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Advance Status approved successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
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
            close: false
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
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Advance</DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="requestedAmount">Requested Amount</InputLabel>
                  <TextField
                    fullWidth
                    id="requestedAmount"
                    name="requestedAmount"
                    value={formik.values.requestedAmount}
                    onChange={formik.handleChange}
                    placeholder="Enter Requested Amount"
                    error={Boolean(formik.touched.requestedAmount && formik.errors.requestedAmount)}
                    helperText={formik.touched.requestedAmount && formik.errors.requestedAmount}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="approvedAmount">Approved Amount</InputLabel>
                  <TextField
                    fullWidth
                    id="approvedAmount"
                    name="approvedAmount"
                    value={formik.values.approvedAmount}
                    onChange={formik.handleChange}
                    placeholder="Enter Approved Amount"
                    error={Boolean(formik.touched.approvedAmount && formik.errors.approvedAmount)}
                    helperText={formik.touched.approvedAmount && formik.errors.approvedAmount}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
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

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="approvedRemark">Remark</InputLabel>
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
          <DialogActions>
            <Button color="error" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={!(formik.values.transactionId && formik.values.approvedAmount)}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </>
  );
};

NewAdvance.propTypes = {
  onCancel: PropTypes.func
};

export default NewAdvance;
