import PropTypes from 'prop-types';

import { Button, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, Stack, TextField } from '@mui/material';

import { useFormik, FormikProvider } from 'formik';
import { dispatch } from 'store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { openSnackbar } from 'store/reducers/snackbar';
import * as yup from 'yup';
import { addZoneName, updateZoneName } from 'store/slice/cabProvidor/ZoneNameSlice';

const ZoneAddForm = ({ zone, onCancel, updateKey, setUpdateKey }) => {
  const isCreating = !zone;

  const CustomerSchema = yup.object().shape({
    zoneName: yup
      .string()
      .required('Zone Name is required') // Required field validation
      .min(3, 'Zone Name must be at least 3 characters') // Minimum length validation
      .max(50, 'Zone Name cannot exceed 50 characters'), // Maximum length validation
    // zoneDescription: yup
    //   .string()
    //   .required('Zone Description is required') // Required field validation
    //   .min(5, 'Zone Description must be at least 5 characters') // Minimum length validation
    //   .max(200, 'Zone Description cannot exceed 200 characters'), // Maximum length validation
  });
  
  const formik = useFormik({
    initialValues: { zoneName: zone?.zoneName || '', zoneDescription: zone?.zoneDescription || '' },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isCreating) {
          // POST request for adding new record
          const resultAction = await dispatch(
            addZoneName({
              data: {
                zoneName: values.zoneName,
                zoneDescription: values.zoneDescription
              }
            })
          );
          if (addZoneName.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            formik.resetForm();
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload?.message || 'Zone added successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            onCancel();
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload?.message || 'Error adding Zone Type.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }
        } else {
          // PUT request for editing existing record

          const resultAction = await dispatch(
            updateZoneName({
              data: {
                _id: zone._id,
                zoneName: values.zoneName,
                zoneDescription: values.zoneDescription
              }
            })
          );

          if (updateZoneName.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload?.message || 'Zone  updated successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            onCancel();
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload?.message || 'Error updating Zone.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: true
              })
            );
          }
        }
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
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{isCreating ? 'Add Zone' : 'Edit Zone'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }} direction="row">
            <Stack spacing={3}>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneName">Zone Name</InputLabel>
                <TextField
                  fullWidth
                  id="zoneName"
                  name="zoneName"
                  value={formik.values.zoneName}
                  onChange={formik.handleChange}
                  placeholder="Enter Zone Name"
                  error={Boolean(formik.touched.zoneName && formik.errors.zoneName)}
                  helperText={formik.touched.zoneName && formik.errors.zoneName}
                />
              </Stack>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneDescription">Zone Description</InputLabel>
                <TextField
                  fullWidth
                  id="zoneDescription"
                  name="zoneDescription"
                  value={formik.values.zoneDescription}
                  onChange={formik.handleChange}
                  placeholder="Enter Zone Description"
                  error={Boolean(formik.touched.zoneDescription && formik.errors.zoneDescription)}
                  helperText={formik.touched.zoneDescription && formik.errors.zoneDescription}
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
              <Button type="submit" variant="contained" disabled={!formik.dirty || formik.isSubmitting}>
                {isCreating ? 'Add' : 'Edit'}
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

ZoneAddForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sliceName: PropTypes.string.isRequired,
  title: PropTypes.shape({
    ADD: PropTypes.string,
    EDIT: PropTypes.string
  }),
  initialValuesFun: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ),
  fetchAllData: PropTypes.func.isRequired,
  fetchSingleDetails: PropTypes.func.isRequired
};

export default ZoneAddForm;
