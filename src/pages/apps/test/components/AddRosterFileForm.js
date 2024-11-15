import { Button, DialogActions, DialogContent, Grid, InputLabel, Select, Stack, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { formatDateUsingMoment } from 'utils/helper';
import { uploadRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { useNavigate } from 'react-router';
import SearchComponent from '../CompanySearch';
import TemplateSelector from '../TemplateSelector';
// import MultiFileUpload from './MultiFileUpload';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import MultiFileUpload from './MultiFileUpload';

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

const AddRosterFileForm = ({ handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.rosterFile);
  const [templates, setTemplates] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  //
  console.log(selectedCompany);
  // Set today's date and the date 30 days from now
  const today = new Date();
  const endDateLimit = new Date();
  endDateLimit.setDate(today.getDate() + 30); // 30 days from today

  useEffect(() => {
    // Load templates from localStorage
    const storedTemplate = localStorage.getItem('excelHeaderTemplate');
    if (storedTemplate) {
      setTemplates([JSON.parse(storedTemplate)]);
    }
  }, []);

  const handleUpload = async (formData) => {
    try {
      const resultAction = await dispatch(uploadRosterFile(formData));
      if (uploadRosterFile.fulfilled.match(resultAction)) {
        // Upload successful
        if (resultAction.payload.data) {
          handleSuccessUpload(resultAction.payload.data);
        }
      } else {
        // Handle the rejected case
        console.error('Upload failed:', resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleSuccessUpload = (data) =>
    enqueueSnackbar('File Uploaded Successfully', {
      action: (key) => actionTask(key, data),
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      }
    });

  // Validation schema
  const validationSchema = Yup.object({
    rosterFiles: Yup.array().required('Roster files are required').min(1, 'file is required')
  });

  const formik = useFormik({
    initialValues: {
      parentCompanyID: '',
      rosterFiles: [] // File state
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('companyId', selectedCompany._id);
      formData.append('endDate', formatDateUsingMoment(values.endDate, 'YYYY-MM-DD'));
      formData.append('startDate', formatDateUsingMoment(values.startDate, 'YYYY-MM-DD'));
      formData.append('rosterFile', values.rosterFiles?.[0]);

      console.log();
      handleUpload(formData);

      resetForm();
      handleClose();
    }
  });

  const { closeSnackbar } = useSnackbar();
  const actionTask = (snackbarId, data) => (
    <Stack direction="row" spacing={0.5}>
      <Button
        size="small"
        color="error"
        variant="contained"
        onClick={() => {
          // Use data here if needed
          navigate('/apps/roster/file-management', { state: { fileData: data } });
        }}
      >
       View Excel
      </Button>
      <Button size="small" color="secondary" variant="contained" onClick={() => closeSnackbar(snackbarId)}>
        Dismiss
      </Button>
    </Stack>
  );

  if (loading) {
    return <CustomCircularLoader />;
  }

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <MainCard title="Upload Roster">
        <DialogContent direction="row" sx={{height:"56vh"}}>
          <Stack spacing={1}>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <InputLabel htmlFor="parentCompanyID">Company Name</InputLabel>
                <SearchComponent setSelectedCompany={setSelectedCompany} />
              </Stack>
            </Grid>
         

            <Grid item xs={12} sx={{ height: '200px' }}>
              <Stack spacing={1} >
                <InputLabel htmlFor="uploadFile">Upload Roster</InputLabel>
                <MultiFileUpload
                  files={formik.values.rosterFiles}
                  setFieldValue={(key, value) => formik.setFieldValue('rosterFiles', value)}
                  error={formik.touched.rosterFiles && Boolean(formik.errors.rosterFiles)}
                  showList={true}
                />
                {formik.touched.rosterFiles && formik.errors.rosterFiles && <p style={{ color: 'red' }}>{formik.errors.rosterFiles}</p>}
              </Stack>
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

AddRosterFileForm.propTypes = {
  handleClose: PropTypes.func,
  companyName: PropTypes.string,
  companyID: PropTypes.string
};

export default AddRosterFileForm;
