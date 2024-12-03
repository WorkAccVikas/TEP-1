import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Form, FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    //  .nullable()
    .test('is-greater', 'End date must be greater than start date', function (value) {
      const { startDate } = this.parent;
      return !startDate || !value || new Date(value) > new Date(startDate);
    })
});

const CustomDateRangePickerDialog = ({
  isOpen,
  onClose,
  onDateRangeChange,
  prevRange,
  selectedRange,
  initialStartDate,
  initialEndDate
}) => {
  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null
    },
    validationSchema,
    onSubmit: (values) => {
      const result = {
        startDate: values.startDate,
        // endDate: values.endDate
        // endDate: values.endDate ? new Date(new Date(values.endDate).setHours(23, 59, 59, 999)) : null // with Date Object
        endDate: values.endDate ? moment(values.endDate).endOf('day').toDate() : null // using moment
      };
      console.log('result = ', result);
      onDateRangeChange(result, true);
    }
  });

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm">
        <DialogTitle>Select Date Range</DialogTitle>
        <FormikProvider value={formik}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form onSubmit={formik.handleSubmit} noValidate>
              <DialogContent>
                <Grid direction="row" container spacing={2}>
                  {/* Start Date */}
                  <Grid item xs={6}>
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
                  </Grid>

                  {/* End Date */}
                  <Grid item xs={6}>
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
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={onClose} color="error" variant='outlined'>
                  Cancel
                </Button>
                <Button color="primary" type="submit" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Form>
          </LocalizationProvider>
        </FormikProvider>
      </Dialog>
    </>
  );
};

export default CustomDateRangePickerDialog;
