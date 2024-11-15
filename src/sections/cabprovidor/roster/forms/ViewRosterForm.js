import { Button, DialogActions, DialogContent, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { formatDateUsingMoment } from 'utils/helper';
import { useSelector } from 'react-redux';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { useNavigate } from 'react-router';

const validationSchema = Yup.object().shape({
  //   parentCompanyID: Yup.string().required('Company name is required'),
  //   startDate: Yup.date().nullable().required('Start date is required').typeError('Start date must be a valid date'),
  //   endDate: Yup.date()
  //     .nullable()
  //     .required('End date is required')
  //     .typeError('End date must be a valid date')
  //     .min(Yup.ref('startDate'), 'End date must be after start date'),
  //   rosterFiles: Yup.array()
  //     .max(1, 'You can only upload one file')
  //     .min(1, 'Please upload at least one file')
  //     .required('Please upload a file')
  //     .test('fileType', 'Only .xlsx files are allowed', (value) => {
  //       if (!value || value.length === 0) return false;
  //       return value[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  //     })
});

const ViewRosterForm = ({ handleClose, companyName, companyID }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.rosterFile);

  const handleSearch = async (formData) => { 
    try {
      navigate('/roster/view-roster', { state: { formData: formData } });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      parentCompanyID: '',
      startDate: null,
      endDate: null
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = {
        companyId: companyID,
        endDate: formatDateUsingMoment(values.endDate, 'YYYY-MM-DD'),
        startDate: formatDateUsingMoment(values.startDate, 'YYYY-MM-DD')
      };
      handleSearch(formData);

      resetForm();
      handleClose();
    }
  });

  if (loading) {
    return <CustomCircularLoader />;
  }

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <MainCard title="Select Dates to view Roster" sx={{ scrollbarWidth: 'none', overflow: 'scroll' }}>
        <DialogContent sx={{ p: 1.5 }} direction="row">
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="parentCompanyID">Company Name</InputLabel>
                  <TextField
                    fullWidth
                    id="parentCompanyID"
                    defaultValue={"companyName"}
                    InputProps={{
                      readOnly: true
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="startDate">Start Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="startDate"
                      label="Select Start Date"
                      value={formik.values.startDate || null}
                      onChange={(newValue) => formik.setFieldValue('startDate', newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                          helperText={formik.touched.startDate && formik.errors.startDate}
                        />
                      )}
                    />
                    {!!formik.errors.startDate && formik.touched.startDate && (
                      <Typography
                        sx={{
                          color: 'red',
                          fontSize: '12px',
                          paddingBlock: '0',
                          marginTop: '3px !important',
                          marginBottom: '0 !important'
                        }}
                      >
                        {formik.errors.startDate || ''}
                      </Typography>
                    )}
                  </LocalizationProvider>
                </Stack>
              </Grid>

              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="endDate">End Date</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="endDate"
                      label="Select End Date"
                      value={formik.values.endDate || null}
                      onChange={(newValue) => formik.setFieldValue('endDate', newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                          helperText={formik.touched.endDate && formik.errors.endDate}
                        />
                      )}
                    />
                    {!!formik.errors.endDate && formik.touched.endDate && (
                      <Typography
                        sx={{
                          color: 'red',
                          fontSize: '12px',
                          paddingBlock: '0',
                          marginTop: '3px !important',
                          marginBottom: '0 !important'
                        }}
                      >
                        {formik.errors.endDate || ''}
                      </Typography>
                    )}
                  </LocalizationProvider>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </MainCard>
    </form>
  );
};

ViewRosterForm.propTypes = {
  handleClose: PropTypes.func,
  companyName: PropTypes.string,
  companyID: PropTypes.string
};

export default ViewRosterForm;
