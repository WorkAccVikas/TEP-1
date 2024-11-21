import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, TextField } from '@mui/material';

import { useFormik, FormikProvider } from 'formik';
import { dispatch } from 'store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { openSnackbar } from 'store/reducers/snackbar';
import * as yup from 'yup';
import axiosServices from 'utils/axios';

const DriverEditForm = ({ driverEdit, onCancel, updateKey, setUpdateKey }) => {
  console.log('driverEdit', driverEdit);

  function restructureObject(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = value === 0 ? null : value;
      return acc;
    }, {});
  }

  const CustomerSchema = yup.object().shape({
    // zoneName: yup
    //   .string()
    //   .required('Zone Name is required') // Required field validation
    //   .min(3, 'Zone Name must be at least 3 characters') // Minimum length validation
    //   .max(50, 'Zone Name cannot exceed 50 characters') // Maximum length validation
    // zoneDescription: yup
    //   .string()
    //   .required('Zone Description is required') // Required field validation
    //   .min(5, 'Zone Description must be at least 5 characters') // Minimum length validation
    //   .max(200, 'Zone Description cannot exceed 200 characters'), // Maximum length validation
  });

  const formik = useFormik({
    initialValues: {
      zoneName: driverEdit?.zoneNameID?.zoneName || 'None',
      zoneType: driverEdit?.zoneTypeID?.zoneTypeName || 'None',
      vehicleType: driverEdit?.VehicleTypeName?.vehicleTypeName || 'None',
      amount: driverEdit?.cabAmount?.amount || 0,
      dualTripAmount: driverEdit?.dualTripAmount?.amount || 0,
      guardPrice: driverEdit?.guardPrice || 0
    },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axiosServices.put('/cabRateMasterDriver/single/edit', {
          data: {
            _id: driverEdit._id,
            vehicleTypeId: driverEdit.VehicleTypeName._id,
            rate: values.amount,
            dualTripRate: values.dualTripAmount,
            guardPrice: values.guardPrice
          }
        });

        console.log('response', response);

        if (response.status === 200) {
          setUpdateKey(updateKey + 1);
          dispatch(
            openSnackbar({
              open: true,
              message: response?.data?.message || 'Driver Rates updated successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          // Reset the form to initial values
          resetForm();
          onCancel();
        }

        console.log('formik.values', restructureObject(formik.values));
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: error?.response?.data?.message || 'An error occurred. Please try again.',
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
          <DialogTitle>
            Edit driver rate for <span style={{ color: 'rgb(70, 128, 255)' }}>{driverEdit?.companyID?.company_name}</span>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              {/* Zone Name Field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="zoneName"
                  label="Zone Name"
                  value={formik.values.zoneName}
                  onChange={formik.handleChange}
                  error={formik.touched.zoneName && Boolean(formik.errors.zoneName)}
                  helperText={formik.touched.zoneName && formik.errors.zoneName}
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
              </Grid>

              {/* Zone Type Field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="zoneType"
                  label="Zone Type"
                  value={formik.values.zoneType}
                  onChange={formik.handleChange}
                  error={formik.touched.zoneType && Boolean(formik.errors.zoneType)}
                  helperText={formik.touched.zoneType && formik.errors.zoneType}
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
              </Grid>

              {/* Vehicle Type Field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="vehicleType"
                  label="Vehicle Type"
                  value={formik.values.vehicleType}
                  onChange={formik.handleChange}
                  error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                  helperText={formik.touched.vehicleType && formik.errors.vehicleType}
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
              </Grid>

              {/* Amount Field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="amount"
                  label="Amount"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
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
              </Grid>

              {/* Dual Trip Amount Field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="dualTripAmount"
                  label="Dual Trip Amount"
                  value={formik.values.dualTripAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.dualTripAmount && Boolean(formik.errors.dualTripAmount)}
                  helperText={formik.touched.dualTripAmount && formik.errors.dualTripAmount}
                  type="number"
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
              </Grid>

              {/* Guard Price Field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  name="guardPrice"
                  label="Guard Price"
                  type="number"
                  value={formik.values.guardPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.guardPrice && Boolean(formik.errors.guardPrice)}
                  helperText={formik.touched.guardPrice && formik.errors.guardPrice}
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
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2}>
              <Button color="error" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!formik.dirty || formik.isSubmitting}>
                Save
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default DriverEditForm;
