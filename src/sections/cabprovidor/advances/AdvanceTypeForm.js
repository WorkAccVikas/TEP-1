import PropTypes from 'prop-types';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project-imports
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { addAdvanceType, updateAdvanceType } from 'store/slice/cabProvidor/advanceTypeSlice';

const CustomerSchema = Yup.object().shape({
  advanceTypeName: Yup.string().max(255).required('Advance Type is required'),
  interestRate: Yup.number()
    .required('Interest Rate is required')
    .min(0, 'Interest Rate must be greater than or equal to 0')
    .max(100, 'Interest Rate must be less than or equal to 100')
});

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

const AdvanceTypeForm = ({ customer, onCancel, updateKey, setUpdateKey }) => {
  const isCreating = !customer;
  // const [openAlert, setOpenAlert] = useState(false);


  const formik = useFormik({
    initialValues: { advanceTypeName: customer?.advanceTypeName || '', interestRate: customer?.interestRate || '' },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {

      try {
        if (isCreating) {
          // POST request for adding new record
          const resultAction = await dispatch(
            addAdvanceType({
              advanceTypeName: values.advanceTypeName,
              interestRate: values.interestRate
            })
          );

          if (addAdvanceType.fulfilled.match(resultAction)) {
            // If the action was fulfilled
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Advance Type added successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
          } else {
            // If the action was rejected
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload || 'Failed to add Advance Type.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }
        } else {
          // Handle editing an existing advance type
          const resultAction = await dispatch(
            updateAdvanceType({
              _id: customer._id,
              advanceTypeName: values.advanceTypeName,
              interestRate: values.interestRate
            })
          );

          if (updateAdvanceType.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Advance Type updated successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload || 'Failed to update Advance Type.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }
        }

        onCancel();
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'An error occurred. Please try again.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
    }
  });

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>{isCreating ? 'New Advance Type' : 'Edit Advance Type'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }} direction="row">
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="advanceTypeName">Advance Type</InputLabel>
                  <TextField
                    fullWidth
                    id="advanceTypeName"
                    name="advanceTypeName"
                    value={formik.values.advanceTypeName}
                    onChange={formik.handleChange}
                    placeholder="Enter Advance Type"
                    error={Boolean(formik.touched.advanceTypeName && formik.errors.advanceTypeName)}
                    helperText={formik.touched.advanceTypeName && formik.errors.advanceTypeName}
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel htmlFor="interestRate">Interest Rate</InputLabel>
                  <TextField
                    fullWidth
                    id="interestRate"
                    name="interestRate"
                    value={formik.values.interestRate}
                    onChange={formik.handleChange}
                    placeholder="Enter Interest Rate"
                    type="number"
                    error={Boolean(formik.touched.interestRate && formik.errors.interestRate)}
                    helperText={formik.touched.interestRate && formik.errors.interestRate}
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
                <Button type="submit" variant="contained">
                  {isCreating ? 'Add' : 'Edit'}
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

AdvanceTypeForm.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func
};

export default AdvanceTypeForm;
