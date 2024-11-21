import {
  Autocomplete,
  Box,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { openSnackbar } from 'store/reducers/snackbar';
import SearchComponent from 'pages/apps/test/CompanySearch';
import GenericSelect from 'components/select/GenericSelect';
import { useSelector } from 'store';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import NumericInput from 'components/textfield/NumericInput';

const NUMERIC_INPUT_FIELD = {
  guardPrice: {
    defaultValue: 0
  }
};

const validationSchema = Yup.object().shape({
  companyID: Yup.string().required('Company is required'),
  tripDate: Yup.date().required('Trip date is required'),
  tripTime: Yup.string().required('Trip time is required'),
  tripType: Yup.number().required('Trip type is required'),
  zoneNameID: Yup.string().required('Zone name is required'),
  vehicleTypeID: Yup.string().required('Vehicle type is required'),
  vehicleNumber: Yup.string().required('Vehicle number is required'),
  driverId: Yup.string().required('Driver is required'),
  remarks: Yup.string().required('Remarks is required'),

  guardPrice: Yup.number().typeError('Must be a number').min(0, 'Guard Price must be at least ₹0')
});

const TRIP_TYPE = {
  PICKUP: 1,
  DROP: 2
};

const optionsForTripType = [
  { value: TRIP_TYPE.PICKUP, label: 'Pickup' },
  { value: TRIP_TYPE.DROP, label: 'Drop' }
];

const AddNewTrip = ({ handleClose, handleRefetch, id }) => {
  const [details, setDetails] = useState(null);

  const zoneList = useSelector((state) => state.zoneName.zoneNames);
  const zoneTypeList = useSelector((state) => state.zoneType.zoneTypes);
  const vehicleTypeList = useSelector((state) => state.vehicleTypes.vehicleTypes);
  const vehicleNumberList = useSelector((state) => state.cabs.cabs1);
  const driverList = useSelector((state) => state.drivers.drivers1);

  useEffect(() => {
    console.log('id', id);

    function fetchDetails() {
      try {
        // TODO : API call FOR GETTING DETAILS
        console.log('Api call for get details (At Trip Updating)');
      } catch (error) {
        console.log('Error :: fetchDetails =', error);
        dispatch(
          openSnackbar({
            open: true,
            message: error?.message || 'Something went wrong',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      }
    }

    if (id) {
      fetchDetails();
    }
  }, [id]);

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
      // companyID: '',
      // companyID: {
      //   _id: '673747f2625e65ed39170463',
      //   effectiveDate: '2024-09-05T00:00:00.000Z',
      //   company_name: '12NovNewCompany69',
      //   billingCycle: '15 days'
      // },

      companyID: {
        companyContract: '',
        _id: '665868063d44db9cf1622592',
        company_name: 'IN TECHNOLOGIES'
      },
      tripDate: null,
      // tripDate: new Date("2023-01-01"),
      tripTime: '',
      // tripTime: '18:29',
      tripType: 0,
      // tripType: TRIP_TYPE.DROP,
      zoneNameID: '',
      // zoneNameID: '6683a39f6b40c6fd23bdf10e',
      zoneTypeID: '',
      // zoneTypeID: '67064e03b01e45d7dc31577f',
      vehicleTypeID: '',
      // vehicleTypeID: '66ea730fd326be54846fe25d',
      vehicleNumber: '',
      // vehicleNumber: '66c5e12165a3fdb07835b284',
      driverId: '',
      // driverId: '66cd81f8fd138969b5fe2e78',
      // location: '',
      location: 'NSP',
      guard: 0,
      guardPrice: 0,
      // guardPrice: 90,
      companyRate: 0,
      // companyRate: 136,
      vendorRate: 0,
      // vendorRate: 86,
      driverRate: 0,
      // driverRate: 40,
      addOnRate: 0,
      // addOnRate: 30,
      // penalty: 0,
      penalty: 0,
      // penalty: 115,
      remarks: ''
    },
    validationSchema,
    onSubmit
  });

  const handleCompanySelection = useCallback(
    (selectedCompany) => {
      console.log(selectedCompany);
      // formik.setFieldValue('companyID', selectedCompany?._id || ''); // Update companyID in formik
      formik.setFieldValue('companyID', selectedCompany); // Update companyID in formik
    },
    [formik]
  );

  const handleTripTypeChange = useCallback(
    (event) => {
      const selectedType = event.target.value;
      console.log(`🚀 ~ AddNewTrip ~ selectedType:`, selectedType);
      formik.setFieldValue('tripType', selectedType);
    },
    [formik]
  );

  const handleBlurField =
    (fieldName, defaultValue = 0) =>
    (event) => {
      const value = event.target.value;
      // Convert the value to a number or set it to the default value if empty
      formik.setFieldValue(fieldName, value === '' ? defaultValue : Number(value), true);
      formik.handleBlur(event); // Trigger Formik's blur handling
    };

  const handleChangeNumeric = (fieldName) => (event) => {
    const value = event.target.value;
    formik.setFieldValue(fieldName, value === '' ? '' : Number(value));
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form onSubmit={formik.handleSubmit} noValidate style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                  <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Trip Details
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Company Name */}
                    <Grid item xs={12}>
                      <Stack gap={1}>
                        {/* <Typography variant="subtitle1">Company Name</Typography> */}
                        <InputLabel htmlFor="companyID">Company Name</InputLabel>

                        {/* <ConfigurableAutocomplete
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
                        /> */}

                        <SearchComponent setSelectedCompany={handleCompanySelection} value={formik.values.companyID} />

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

                    {/* Trip Type */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="tripType">Trip Type</InputLabel>

                        <GenericSelect
                          // label="Trip Type"
                          placeholder="Select Trip Type"
                          id="tripType"
                          name="tripType"
                          options={optionsForTripType}
                          value={formik.values.tripType}
                          onChange={handleTripTypeChange}
                          fullWidth
                        />
                      </Stack>
                    </Grid>

                    {/* Location */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="location">Location</InputLabel>

                        <TextField id="location" name="location" type="text" placeholder="Location" {...formik.getFieldProps('location')} />
                      </Stack>
                    </Grid>

                    {/* Zone Name */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="zoneNameID">Zone Name</InputLabel>

                        <Autocomplete
                          id="zoneNameID"
                          name="zoneNameID"
                          // value={formik.values.zoneNameID}
                          // onChange={(event, newValue) => {
                          //   formik.setFieldValue('zoneNameID', newValue);
                          // }}
                          value={zoneList.find((zone) => zone._id === formik.values.zoneNameID) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('zoneNameID', newValue ? newValue._id : null);
                          }}
                          options={zoneList}
                          getOptionLabel={(option) => option.zoneName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Zone'}
                              error={formik.touched.zoneNameID && Boolean(formik.errors.zoneNameID)}
                              helperText={formik.touched.zoneNameID && formik.errors.zoneNameID}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Zone Type */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="zoneTypeID">Zone Type</InputLabel>

                        <Autocomplete
                          id="zoneTypeID"
                          name="zoneTypeID"
                          value={zoneTypeList.find((zone) => zone._id === formik.values.zoneTypeID) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('zoneTypeID', newValue ? newValue._id : null);
                          }}
                          // options={zoneTypeList}
                          options={zoneTypeList
                            .filter((zoneType) => zoneType.zoneId._id === formik.values.zoneNameID)
                            .sort((a, b) => a.zoneTypeName.localeCompare(b.zoneTypeName))}
                          getOptionLabel={(option) => option.zoneTypeName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Zone Type'}
                              error={formik.touched.zoneTypeID && Boolean(formik.errors.zoneTypeID)}
                              helperText={formik.touched.zoneTypeID && formik.errors.zoneTypeID}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Vehicle Type */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="vehicleTypeID">Vehicle Type</InputLabel>

                        <Autocomplete
                          id="vehicleTypeID"
                          name="vehicleTypeID"
                          value={vehicleTypeList.find((item) => item._id === formik.values.vehicleTypeID) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('vehicleTypeID', newValue ? newValue._id : null);
                          }}
                          options={vehicleTypeList}
                          getOptionLabel={(option) => option.vehicleTypeName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Vehicle Type'}
                              error={formik.touched.vehicleTypeID && Boolean(formik.errors.vehicleTypeID)}
                              helperText={formik.touched.vehicleTypeID && formik.errors.vehicleTypeID}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Vehicle Number */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="vehicleNumber">Vehicle Number</InputLabel>

                        <Autocomplete
                          id="vehicleNumber"
                          name="vehicleNumber"
                          value={vehicleNumberList.find((item) => item._id === formik.values.vehicleNumber) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('vehicleNumber', newValue ? newValue._id : null);
                          }}
                          options={vehicleNumberList}
                          getOptionLabel={(option) => option.vehicleNumber}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Vehicle Number'}
                              error={formik.touched.vehicleNumber && Boolean(formik.errors.vehicleNumber)}
                              helperText={formik.touched.vehicleNumber && formik.errors.vehicleNumber}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Driver */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="driverId">Driver</InputLabel>

                        <Autocomplete
                          id="driverId"
                          name="driverId"
                          value={driverList.find((item) => item._id === formik.values.driverId) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('driverId', newValue ? newValue._id : null);
                          }}
                          options={driverList}
                          getOptionLabel={(option) => option.userName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Driver'}
                              error={formik.touched.driverId && Boolean(formik.errors.driverId)}
                              helperText={formik.touched.driverId && formik.errors.driverId}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={2}></Grid>

                    {/* Guard Price */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="guardPrice">Guard Price</InputLabel>

                        <NumericInput
                          id="guardPrice"
                          fieldName="guardPrice"
                          // label="Guard Price"
                          value={formik.values.guardPrice}
                          // onChange={formik.handleChange}
                          onChange={handleChangeNumeric('guardPrice')}
                          onBlur={handleBlurField('guardPrice')}
                          error={formik.touched.guardPrice && Boolean(formik.errors.guardPrice)}
                          helperText={formik.touched.guardPrice && formik.errors.guardPrice}
                        />
                      </Stack>
                    </Grid>

                    {/* Company Rate */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="companyRate">Company Rate</InputLabel>

                        <NumericInput
                          id="companyRate"
                          fieldName="companyRate"
                          value={formik.values.companyRate}
                          onChange={handleChangeNumeric('companyRate')}
                          onBlur={handleBlurField('companyRate')}
                          error={formik.touched.companyRate && Boolean(formik.errors.companyRate)}
                          helperText={formik.touched.companyRate && formik.errors.companyRate}
                        />
                      </Stack>
                    </Grid>

                    {/* Vendor Rate */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="vendorRate">Vendor Rate</InputLabel>

                        <NumericInput
                          id="vendorRate"
                          fieldName="vendorRate"
                          value={formik.values.vendorRate}
                          onChange={handleChangeNumeric('vendorRate')}
                          onBlur={handleBlurField('vendorRate')}
                          error={formik.touched.vendorRate && Boolean(formik.errors.vendorRate)}
                          helperText={formik.touched.vendorRate && formik.errors.vendorRate}
                        />
                      </Stack>
                    </Grid>

                    {/* Driver Rate */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="driverRate">Driver Rate</InputLabel>

                        <NumericInput
                          id="driverRate"
                          fieldName="driverRate"
                          value={formik.values.driverRate}
                          onChange={handleChangeNumeric('driverRate')}
                          onBlur={handleBlurField('driverRate')}
                          error={formik.touched.driverRate && Boolean(formik.errors.driverRate)}
                          helperText={formik.touched.driverRate && formik.errors.driverRate}
                        />
                      </Stack>
                    </Grid>

                    {/* Add On Rate */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="addOnRate">Add On Rate</InputLabel>

                        <NumericInput
                          id="addOnRate"
                          fieldName="addOnRate"
                          value={formik.values.addOnRate}
                          onChange={handleChangeNumeric('addOnRate')}
                          onBlur={handleBlurField('addOnRate')}
                          error={formik.touched.addOnRate && Boolean(formik.errors.addOnRate)}
                          helperText={formik.touched.addOnRate && formik.errors.addOnRate}
                        />
                      </Stack>
                    </Grid>

                    {/* Penalty */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="penalty">Penalty</InputLabel>

                        <NumericInput
                          id="penalty"
                          fieldName="penalty"
                          value={formik.values.penalty}
                          onChange={handleChangeNumeric('penalty')}
                          onBlur={handleBlurField('penalty')}
                          error={formik.touched.penalty && Boolean(formik.errors.penalty)}
                          helperText={formik.touched.penalty && formik.errors.penalty}
                        />
                      </Stack>
                    </Grid>

                    {/* Remarks */}
                    <Grid item xs={3}>
                      <Stack gap={1}>
                        <Typography variant="subtitle1">Remarks</Typography>
                        <TextField fullWidth placeholder="Remarks" {...formik.getFieldProps('remarks')}  />
                      </Stack>
                    </Grid>
                  </Grid>
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
