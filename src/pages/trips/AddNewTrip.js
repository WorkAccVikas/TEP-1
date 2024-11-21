import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Form, Formik, FormikProvider, useFormik } from 'formik';
import { Add } from 'iconsax-react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dispatch } from 'store';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import ConfigurableAutocomplete from 'components/autocomplete/ConfigurableAutocomplete';
import { useCallback, useRef } from 'react';

const validationSchema = Yup.object().shape({
  companyID: Yup.string().required('Company is required'),
  tripDate: Yup.date().required('Trip date is required'),
  tripTime: Yup.string().required('Trip time is required'),
  tripType: Yup.number().required('Trip type is required'),
  zoneNameID: Yup.string().required('Zone name is required'),
  vehicleTypeID: Yup.string().required('Vehicle type is required'),
  vehicleNumber: Yup.string().required('Vehicle number is required'),
  driverId: Yup.string().required('Driver is required'),
  remarks: Yup.string().required('Remarks is required')
});

const AddNewTrip = ({ handleClose, handleRefetch }) => {
  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      alert('Form submitted');

      resetForm();
      dispatch(
        openSnackbar({
          open: true,
          message: 'Trip added successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );

      handleClose();
      handleRefetch();
    } catch (error) {
      console.log('Error :: onSubmit =', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      companyID: '',
      tripDate: null,
      tripTime: '',
      tripType: 0,
      zoneNameID: '',
      zoneTypeID: '',
      vehicleTypeID: '',
      vehicleNumber: '',
      driverId: '',
      location: '',
      guard: 0,
      guardPrice: '',
      companyRate: '',
      vendorRate: '',
      driverRate: '',
      addOnRate: '',
      penalty: '',
      remarks: ''
    },
    validationSchema,
    onSubmit
  });

  const handleCompanySelection = useCallback(
    (selectedCompany) => {
      console.log(selectedCompany);
      formik.setFieldValue('companyID', selectedCompany?._id || ''); // Update companyID in formik
    },
    [formik]
  );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form onSubmit={formik.handleSubmit} noValidate>
            <DialogTitle id="alert-dialog-title">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3">Add New Trip</Typography>
                <IconButton color="secondary" onClick={handleClose}>
                  <Add style={{ transform: 'rotate(45deg)', color: 'red' }} />
                </IconButton>
              </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Grid container spacing={2}>
                {/* Trip Details */}
                <Grid item xs={12}>
                  <MainCard title="Trip Details">
                    <Grid container spacing={2}>
                      {/* Company Name */}
                      <Grid item xs={12}>
                        <Stack gap={1}>
                          {/* <Typography variant="subtitle1">Company Name</Typography> */}
                          <InputLabel htmlFor="companyID">Company Name</InputLabel>

                          <ConfigurableAutocomplete
                            id="companyID"
                            apiUrl="/company/getCompanyByName" // Replace with your actual API URL
                            onChange={handleCompanySelection} // Handle selected item
                            label="Search Company" // Input field label
                            maxItems={3} // Limit the results to 3 items
                            optionLabelKey="company_name" // Key to display from API response
                            searchParam="filter"
                            noOptionsText="No Company Found"
                            placeHolderText="Type to search for company" // Pass placeholder text
                            autoHighlight // Enable auto highlight
                          />

                          {formik.touched.companyID && formik.errors.companyID && (
                            <Typography variant="caption" color="error">
                              {formik.errors.companyID}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>

                      {/* Trip Date */}
                      <Grid item xs={3}>
                        <Stack gap={1}>
                          {/* <Typography variant="subtitle1">Trip Date</Typography> */}
                          <InputLabel htmlFor="tripDate">Trip Date</InputLabel>

                          <DatePicker
                            id="tripDate" // Set the id here for association
                            value={formik.values.tripDate}
                            onChange={(date) => {
                              formik.setFieldTouched('tripDate', true, true); // Mark the field as touched

                              formik.setFieldValue('tripDate', date);
                            }}
                            renderInput={(params) => <TextField {...params} id="tripDate" />}
                          />
                          {formik.touched.tripDate && formik.errors.tripDate && (
                            <Typography variant="caption" color="error">
                              {formik.errors.tripDate}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>

                      {/* Trip Time */}
                      <Grid item xs={3}>
                        <Stack gap={1}>
                          <InputLabel htmlFor="tripTime">Trip Time</InputLabel>

                          <TextField
                            id="tripTime"
                            name="tripTime"
                            type="time"
                            value={formik.values.tripTime}
                            onChange={formik.handleChange}
                            error={formik.touched.tripTime && Boolean(formik.errors.tripTime)}
                            helperText={formik.touched.tripTime && formik.errors.tripTime}
                            fullWidth
                            autoComplete="tripTime"
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                {/* Others */}
                <Grid item xs={12}>
                  <MainCard title="Others">
                    <Grid container spacing={2}>
                      {/* Remarks */}
                      <Grid item xs={6}>
                        <Stack gap={1}>
                          <Typography variant="subtitle1">Remarks</Typography>
                          <TextField fullWidth label="Remarks" variant="outlined" {...formik.getFieldProps('remarks')} />
                          {formik.touched.remarks && formik.errors.remarks && (
                            <Typography variant="caption" color="error">
                              {formik.errors.remarks}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                Add
              </Button>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default AddNewTrip;
