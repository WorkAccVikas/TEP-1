import { Button, DialogActions, DialogContent, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { useLocation, useNavigate } from 'react-router';
import { formatDateUsingMoment } from 'utils/helper';
import CompanyWiseRoster from './CompanyWiseRoster';
import axiosServices from 'utils/axios';

const validationSchema = yup.object().shape({
  fromDate: yup.date().nullable().required('Start date is required').typeError('Start date must be a valid date'),
  toDate: yup
    .date()
    .nullable()
    .required('End date is required')
    .typeError('End date must be a valid date')
    .min(yup.ref('fromDate'), 'End date must be after start date')
});
const ViewRoster = ({ id }) => {
  const [rosterData, setRosterData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosServices.post(`/tripData/trip/requests/company`, {
        data: {
          companyId: id,
          fromDate: values.fromDate,
          toDate: values.toDate,
          tripStatus: 1
        }
      });

      if (response?.status === 200) {
        resetForm();

        const responseData = response.data.data;
        setRosterData(responseData);
        setIsSubmitted(true);
        setLoading(false);

        dispatch(
          openSnackbar({
            open: true,
            message: response?.data?.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
      }
    } catch (error) {
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
      handleClose();
      setSubmitting(false);
    }
  };

  const location = useLocation();

  // Function to update the URL with search params
  const updateURLSearchParams = (key, value) => {
    const searchParams = new URLSearchParams(location.search);
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  React.useEffect(() => {
    if (isSubmitted && rosterData) {
      setLoading(false);
    }
  }, [isSubmitted, rosterData]);

  return (
    <MainCard sx={{ scrollbarWidth: 'none', overflow: 'scroll' }}>
      {!isSubmitted ? (
        <Formik
          initialValues={{
            fromDate: null,
            toDate: null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <DialogContent sx={{ p: 1.5 }}>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    {/* Start Date Field */}
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="fromDate">Start Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Field name="fromDate">
                            {({ field }) => (
                              <DatePicker
                                {...field}
                                id="fromDate"
                                label="Select Start Date"
                                value={values.fromDate}
                                onChange={(newValue) => {
                                  setFieldValue('fromDate', newValue);
                                  const res = formatDateUsingMoment(newValue, 'YYYY-MM-DD');
                                  // updateURLWithFromDate(res);
                                  updateURLSearchParams('fromDate', res);
                                }}
                                renderInput={(params) => <TextField {...params} error={Boolean(errors.fromDate)} />}
                              />
                            )}
                          </Field>
                        </LocalizationProvider>
                        {touched.fromDate && errors.fromDate && (
                          <Typography variant="body2" color="error">
                            {errors.fromDate}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                    {/* End Date Field */}
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="toDate">End Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Field name="toDate">
                            {({ field }) => (
                              <DatePicker
                                {...field}
                                id="toDate"
                                label="Select End Date"
                                value={values.toDate}
                                onChange={(newValue) => {
                                  setFieldValue('toDate', newValue);
                                  const res = formatDateUsingMoment(newValue, 'YYYY-MM-DD');
                                  updateURLSearchParams('toDate', res);
                                }}
                                renderInput={(params) => <TextField {...params} error={Boolean(errors.toDate)} />}
                              />
                            )}
                          </Field>
                        </LocalizationProvider>
                        {touched.toDate && errors.toDate && (
                          <Typography variant="body2" color="error">
                            {errors.toDate}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </Stack>
              </DialogActions>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <CompanyWiseRoster rosterData={rosterData} id={id} />
        </>
      )}
    </MainCard>
  );
};

export default ViewRoster;
