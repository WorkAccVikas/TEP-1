import React, { useEffect, useState } from 'react';
import { Grid, Stack, InputLabel, TextField, Button } from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router';
import axiosServices from 'utils/axios';
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import { formatDateUsingMoment } from 'utils/helper';
import { format } from 'date-fns';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// function formatUnixTimeToTime(unixTimestamp) {
//   return format(new Date(unixTimestamp * 1000), 'HH:mm');
// }

const TripView = () => {
  const { id } = useParams();
  const tripId = id;
  const queryParams = new URLSearchParams(location.search);
  const rowId = queryParams.get('id');
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  console.log('tripDetails', tripDetails);
  console.log('rowId', rowId);

  // Fetch trip details on mount
  useEffect(() => {
    axiosServices
      .get(`/assignTrip/details/by?tripId=${tripId}`)
      .then((response) => {
        console.log('response', response);

        setTripDetails(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching trip details:', error);
      });
  }, [tripId]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      company_name: tripDetails?.companyID?.company_name || null,
      //   tripDate: tripDetails?.tripDate ? moment(tripDetails?.tripDate).format('YYYY-MM-DD')  || '',
      // tripDate: tripDetails?.tripDate ? moment(tripDetails?.tripDate).format('MM-DD-YYYY') : null,
      tripDate: tripDetails?.tripDate ? formatDateUsingMoment(tripDetails?.tripDate, 'YYYY-MM-DD') : '',
      // tripTime: tripDetails?.tripTime ? formatUnixTimeToTime(tripDetails?.tripTime) : '',
      tripTime: tripDetails?.tripTime || '',
      zoneName: tripDetails?.zoneNameID?.zoneName || '',
      zoneType: tripDetails?.zoneTypeID?.zoneTypeName || '',
      cab: tripDetails?.vehicleNumber?.vehicleNumber || '',
      cabType: tripDetails?.vehicleTypeID?.vehicleTypeName || '',
      driver: tripDetails?.driverId?.userName || '',
      guard: tripDetails?.guard ?? '',
      guardPrice: tripDetails?.guardPrice || '',
      companyRate: tripDetails?.companyRate ?? '',
      vendorRate: tripDetails?.vendorRate ?? '',
      driverRate: tripDetails?.driverRate ?? '',
      additionalRate: tripDetails?.addOnRate || '',
      penalty: tripDetails?.penalty || '',
      location: tripDetails?.location || '',
      remarks: tripDetails?.remarks || ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      //   tripDate: Yup.date().required('Trip Date is required'),
      //   tripTime: Yup.string().required('Trip Time is required')
      // Add validation for other fields as needed
    }),
    onSubmit: (values) => {
      setIsApiLoading(true); // Disable the button during API call

      const updatedTripData = {
        data: {
          assignTripsData: [
            {
              assignTripId: rowId,
              company_name: values?.company_name,
              tripDate: values?.tripDate,
              tripTime: values?.tripTime,
              zoneName: values?.zoneName,
              zoneType: values?.zoneType,
              cab: values?.cab,
              cabType: values?.cabType,
              driver: values?.driver,
              guard: values?.guard,
              guardPrice: values?.guardPrice,
              companyRate: values?.companyRate,
              vendorRate: values?.vendorRate,
              driverRate: values?.driverRate,
              additionalRate: values?.additionalRate,
              penalty: values?.penalty,
              location: values?.location,
              remarks: values?.remarks
            }
          ]
        }
      };

      try {
        const response = axiosServices.put(`/assignTrip/edit/trip/data`, updatedTripData);
        console.log('Trip updated successfully', response.data);

        dispatch(
          openSnackbar({
            open: true,
            message: response.data?.message || 'Trip updated successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        formik.resetForm({ values }); // Resets the form with current values
      } catch (error) {
        console.error('Error updating trip:', error);

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
      } finally {
        setIsApiLoading(false); // Re-enable the button after API call
      }
    }
  });

  const handleCancelEdit = () => {
    navigate('/apps/trips/list');
  };

  if (!tripDetails) return <CustomCircularLoader />;

  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Trips', to: '/apps/trips/list' }, { title: 'Trip Details' }];

  return (
    <>
      <Breadcrumbs custom links={breadcrumbLinks} />

      <MainCard title="Trip Details">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Company Name */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Company Name</InputLabel>
                  <TextField
                    id="company_name"
                    name="company_name"
                    value={formik.values.company_name}
                    onChange={formik.handleChange}
                    error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                    helperText={formik.touched.company_name && formik.errors.company_name}
                    fullWidth
                    autoComplete="company_name"
                  />
                </Stack>
              </Grid>

              {/* Trip Date */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Trip Date</InputLabel>
                  <TextField
                    id="tripDate"
                    name="tripDate"
                    type="date"
                    value={formik.values.tripDate}
                    onChange={formik.handleChange}
                    error={formik.touched.tripDate && Boolean(formik.errors.tripDate)}
                    helperText={formik.touched.tripDate && formik.errors.tripDate}
                    fullWidth
                    autoComplete="tripDate"
                  />
                </Stack>
              </Grid>

              {/* Trip Time */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Trip Time</InputLabel>
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

              {/* Zone Name */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Zone Name</InputLabel>
                  <TextField
                    id="zoneName"
                    name="zoneName"
                    value={formik.values.zoneName}
                    onChange={formik.handleChange}
                    error={formik.touched.zoneName && Boolean(formik.errors.zoneName)}
                    helperText={formik.touched.zoneName && formik.errors.zoneName}
                    fullWidth
                    autoComplete="zoneName"
                  />
                </Stack>
              </Grid>

              {/* Zone Type */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Zone Type</InputLabel>
                  <TextField
                    id="zoneType"
                    name="zoneType"
                    value={formik.values.zoneType}
                    onChange={formik.handleChange}
                    error={formik.touched.zoneType && Boolean(formik.errors.zoneType)}
                    helperText={formik.touched.zoneType && formik.errors.zoneType}
                    fullWidth
                    autoComplete="zoneType"
                  />
                </Stack>
              </Grid>

              {/* Cab */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Cab</InputLabel>
                  <TextField
                    id="cab"
                    name="cab"
                    value={formik.values.cab}
                    onChange={formik.handleChange}
                    error={formik.touched.cab && Boolean(formik.errors.cab)}
                    helperText={formik.touched.cab && formik.errors.cab}
                    fullWidth
                    autoComplete="cab"
                  />
                </Stack>
              </Grid>

              {/* Cab Type */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Cab Type</InputLabel>
                  <TextField
                    id="cabType"
                    name="cabType"
                    value={formik.values.cabType}
                    onChange={formik.handleChange}
                    error={formik.touched.cabType && Boolean(formik.errors.cabType)}
                    helperText={formik.touched.cabType && formik.errors.cabType}
                    fullWidth
                    autoComplete="cabType"
                  />
                </Stack>
              </Grid>

              {/* Driver */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Driver</InputLabel>
                  <TextField
                    id="driver"
                    name="driver"
                    value={formik.values.driver}
                    onChange={formik.handleChange}
                    error={formik.touched.driver && Boolean(formik.errors.driver)}
                    helperText={formik.touched.driver && formik.errors.driver}
                    fullWidth
                    autoComplete="driver"
                  />
                </Stack>
              </Grid>

              {/* Guard */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Guard</InputLabel>
                  <TextField
                    id="guard"
                    name="guard"
                    value={formik.values.guard}
                    onChange={formik.handleChange}
                    error={formik.touched.guard && Boolean(formik.errors.guard)}
                    helperText={formik.touched.guard && formik.errors.guard}
                    fullWidth
                    autoComplete="guard"
                  />
                </Stack>
              </Grid>

              {/* Guard Price */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Guard Price</InputLabel>
                  <TextField
                    id="guardPrice"
                    name="guardPrice"
                    value={formik.values.guardPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.guardPrice && Boolean(formik.errors.guardPrice)}
                    helperText={formik.touched.guardPrice && formik.errors.guardPrice}
                    fullWidth
                    autoComplete="guardPrice"
                  />
                </Stack>
              </Grid>

              {/* Company Rate */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Company Rate</InputLabel>
                  <TextField
                    id="companyRate"
                    name="companyRate"
                    value={formik.values.companyRate}
                    onChange={formik.handleChange}
                    error={formik.touched.companyRate && Boolean(formik.errors.companyRate)}
                    helperText={formik.touched.companyRate && formik.errors.companyRate}
                    fullWidth
                    autoComplete="companyRate"
                  />
                </Stack>
              </Grid>

              {/* Vendor Rate */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Vendor Rate</InputLabel>
                  <TextField
                    id="vendorRate"
                    name="vendorRate"
                    value={formik.values.vendorRate}
                    onChange={formik.handleChange}
                    error={formik.touched.vendorRate && Boolean(formik.errors.vendorRate)}
                    helperText={formik.touched.vendorRate && formik.errors.vendorRate}
                    fullWidth
                    autoComplete="vendorRate"
                  />
                </Stack>
              </Grid>

              {/* Driver Rate */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Driver Rate</InputLabel>
                  <TextField
                    id="driverRate"
                    name="driverRate"
                    value={formik.values.driverRate}
                    onChange={formik.handleChange}
                    error={formik.touched.driverRate && Boolean(formik.errors.driverRate)}
                    helperText={formik.touched.driverRate && formik.errors.driverRate}
                    fullWidth
                    autoComplete="driverRate"
                  />
                </Stack>
              </Grid>

              {/* Additional Rate */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Additional Rate</InputLabel>
                  <TextField
                    id="additionalRate"
                    name="additionalRate"
                    value={formik.values.additionalRate}
                    onChange={formik.handleChange}
                    error={formik.touched.additionalRate && Boolean(formik.errors.additionalRate)}
                    helperText={formik.touched.additionalRate && formik.errors.additionalRate}
                    fullWidth
                    autoComplete="additionalRate"
                  />
                </Stack>
              </Grid>

              {/* Penalty */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Penalty</InputLabel>
                  <TextField
                    id="penalty"
                    name="penalty"
                    value={formik.values.penalty}
                    onChange={formik.handleChange}
                    error={formik.touched.penalty && Boolean(formik.errors.penalty)}
                    helperText={formik.touched.penalty && formik.errors.penalty}
                    fullWidth
                    autoComplete="penalty"
                  />
                </Stack>
              </Grid>

              {/* Location */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Location</InputLabel>
                  <TextField
                    id="location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    fullWidth
                    autoComplete="location"
                  />
                </Stack>
              </Grid>

              {/* Remarks */}
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel>Remarks</InputLabel>
                  <TextField
                    id="remarks"
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                    helperText={formik.touched.remarks && formik.errors.remarks}
                    fullWidth
                    autoComplete="remarks"
                  />
                </Stack>
              </Grid>

              {/* Save / Cancel buttons */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isApiLoading || formik.isSubmitting || !formik.dirty}
                    >
                      {isApiLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </FormikProvider>
      </MainCard>
    </>
  );
};

export default TripView;
