// material-ui
import { Autocomplete, Button, DialogActions, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useNavigate } from 'react-router-dom';
import { addCompany } from 'store/slice/cabProvidor/companySlice';
import MultiFileUpload from 'components/third-party/dropzone/MultiFile';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Save2 } from 'iconsax-react';

// ==============================|| LAYOUTS -  COLUMNS ||============================== //
const taxOptions = {
  No: 0,
  'Per Trip': 1,
  Monthly: 2
};

function AddCompany() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyData] = useState(null);
  const [list] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const YupValidationConfig = {
    company_name: {
      min: 3,
      max: 20
    },
    contact_person: {
      min: 3,
      max: 20
    }
  };

  const MAX_TEXTFIELD_LENGTH = {
    details: 20,
    comments: 50,
    address: 50
  };

  const DIGITS_ONLY_PATTERN = /^\d+$/;

  // List of Indian states
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Ladakh',
    'Jammu and Kashmir'
  ];

  const validationSchema = yup.object({
    company_name: yup
      .string()
      .trim()
      .min(YupValidationConfig.company_name.min, ({ min }) => `Company Name must be at least ${min} characters`)
      .max(YupValidationConfig.company_name.max, ({ max }) => `Company Name must be at most ${max} characters`)
      .test('no-leading-digit', 'Company Name cannot start with a number', (value) => {
        return /^[^0-9]/.test(value);
      })
      .required('Company Name is required'),
    // contact_person: yup
    //   .string()
    //   .trim()
    //   .min(YupValidationConfig.contact_person.min, ({ min }) => `Person Name must be at least ${min} characters`)
    //   .max(YupValidationConfig.contact_person.max, ({ max }) => `Person Name must be at most ${max} characters`)
    //   .test('no-leading-digit', 'Person Name cannot start with a number', (value) => {
    //     return /^[^0-9]/.test(value);
    //   })
    //   .required('Person Name is required'),
    company_email: yup.string().trim().email('Invalid email').required('Email is required'),
    mobile: yup
      .string()
      .trim()
      .matches(/^[0-9]{10}$/, { message: 'Please enter valid mobile number', excludeEmptyString: false })
      .required('Mobile Number is required'),
    landline: yup
      .string()
      .trim()
      .matches(/^[0-9]{10}$/, { message: 'Please enter valid landline number', excludeEmptyString: false })
      .test('not-same-as-phone', 'Landline phone number should be different from mobile number', function (value) {
        const { mobile: phone } = this.parent;
        return typeof phone === 'undefined' ? true : value !== phone;
      })
      .required('Landline Number is required'),
    PAN: yup
      .string()
      .required('PAN is required')
      .matches(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, 'Enter a valid PAN'),

    GSTIN: yup
      .string()
      .required('GSTIN is required')
      .matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z1-9]{1}Z[A-Z0-9]{1})$/, 'Enter a valid GSTIN'),
    // postal_code: yup
    //   .string()
    //   .matches(/^[0-9]{6}$/, { message: 'Please enter valid pin code', excludeEmptyString: false })
    //   .required('Pin Code is required'),
    // address: yup
    //   .string()
    //   .trim()
    //   .test('is-not-only-whitespace', 'Permanent Address cannot contain only whitespace', (value) =>
    //     typeof value === 'undefined' ? true : value.length !== 0
    //   )
    //   .max(MAX_TEXTFIELD_LENGTH.address, 'Address is too long')
    //   .required('Address is required'),
    // city: yup.string().trim().required('City is required'),
    state: yup.string().trim().required('State is required'),
    // MCDTax: yup.string().required('MCD Tax is required'),
    // MCDAmount: yup
    //   .string()
    //   .trim()
    //   .matches(DIGITS_ONLY_PATTERN, {
    //     message: 'Please enter valid rate',
    //     excludeEmptyString: false
    //   })
    //   .required('MCD Amount is required'),
    // stateTax: yup.string().required('State Tax is required'),
    // stateTaxAmount: yup
    //   .string()
    //   .trim()
    //   .matches(DIGITS_ONLY_PATTERN, {
    //     message: 'Please enter valid rate',
    //     excludeEmptyString: false
    //   })
    //   .required('State Amount is required'),
    files: yup
      .mixed()
      .test('fileSize', 'File size is too large', (value) => {
        if (value && value[0]) {
          // Check if file size is within acceptable range (e.g., 5MB)
          return value[0].size <= 5 * 1024 * 1024;
        }
        return true; // Allow empty
      })
      .test('single-file', 'You can only upload one file', (value) => {
        return Array.isArray(value) && value.length === 1 && value[0] instanceof File;
      })
      .required('Company Contract is required')
    // companyContract: yup.mixed().required('Company Contract is required')
  });

  const formik = useFormik({
    initialValues: {
      company_name: companyData?.company_name || '',
      contact_person: companyData?.contact_person || '',
      company_email: companyData?.company_email || '',
      mobile: companyData?.mobile || '',
      landline: companyData?.landline || '',
      PAN: companyData?.PAN || '',
      GSTIN: companyData?.GSTIN || '',
      postal_code: companyData?.postal_code || '',
      address: companyData?.address || '',
      city: companyData?.city || '',
      state: companyData?.state || '',
      MCDTax: companyData?.MCDTax || '',
      MCDAmount: companyData?.MCDAmount || '',
      stateTax: companyData?.stateTax || '',
      stateTaxAmount: companyData?.stateTaxAmount || '',
      files: companyData?.companyContract || null
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('company_name', values.company_name);
        formData.append('contact_person', values.contact_person);
        formData.append('company_email', values.company_email);
        formData.append('mobile', values.mobile);
        formData.append('landline', values.landline);
        formData.append('PAN', values.PAN);
        formData.append('GSTIN', values.GSTIN);
        formData.append('postal_code', values.postal_code);
        formData.append('city', values.city);
        formData.append('state', values.state);
        formData.append('address', values.address);
        formData.append('MCDTax', values.MCDTax);
        formData.append('MCDAmount', values.MCDAmount);
        formData.append('stateTax', values.stateTax);
        formData.append('stateTaxAmount', values.stateTaxAmount);
        formData.append('companyContract', values.files[0]);

        const resultAction = await dispatch(addCompany(formData));

        if (addCompany.fulfilled.match(resultAction)) {
          // Company successfully added
          resetForm();
          dispatch(
            openSnackbar({
              open: true,
              message: 'Company added successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );

          navigate('/management/company/view');
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
        setLoading(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={'ADD COMPANY INFORMATION'}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Company Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Company Name"
                    id="company_name"
                    name="company_name"
                    value={formik.values.company_name}
                    onChange={formik.handleChange}
                    error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                    helperText={formik.touched.company_name && formik.errors.company_name}
                    autoComplete="company_name"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Contact Person Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Person Name"
                    id="contact_person"
                    name="contact_person"
                    value={formik.values.contact_person}
                    onChange={formik.handleChange}
                    error={formik.touched.contact_person && Boolean(formik.errors.contact_person)}
                    helperText={formik.touched.contact_person && formik.errors.contact_person}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Company Email"
                    id="company_email"
                    name="company_email"
                    value={formik.values.company_email}
                    onChange={formik.handleChange}
                    error={formik.touched.company_email && Boolean(formik.errors.company_email)}
                    helperText={formik.touched.company_email && formik.errors.company_email}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Mobile Number</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Mobile Number"
                    id="mobile"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        formik.handleChange(event);
                      }
                    }}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Landline Number</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Landline Number"
                    id="landline"
                    name="landline"
                    value={formik.values.landline}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        formik.handleChange(event);
                      }
                    }}
                    error={formik.touched.landline && Boolean(formik.errors.landline)}
                    helperText={formik.touched.landline && formik.errors.landline}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>PAN</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter PAN"
                    id="PAN"
                    name="PAN"
                    value={formik.values.PAN}
                    onChange={formik.handleChange}
                    error={formik.touched.PAN && Boolean(formik.errors.PAN)}
                    helperText={formik.touched.PAN && formik.errors.PAN}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>GSTIN</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter GSTIN"
                    id="GSTIN"
                    name="GSTIN"
                    value={formik.values.GSTIN}
                    onChange={formik.handleChange}
                    error={formik.touched.GSTIN && Boolean(formik.errors.GSTIN)}
                    helperText={formik.touched.GSTIN && formik.errors.GSTIN}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Pincode</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Pincode"
                    id="postal_code"
                    name="postal_code"
                    value={formik.values.postal_code}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        formik.handleChange(event);
                      }
                    }}
                    error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                    helperText={formik.touched.postal_code && formik.errors.postal_code}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Address</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Address"
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>City</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter City"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Stack>
              </Grid>
              {/* <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>State</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter State"
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Stack>
              </Grid> */}
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>State</InputLabel>
                  <Autocomplete
                    fullWidth
                    id="state"
                    name="state"
                    options={indianStates}
                    value={formik.values.state}
                    onChange={(event, newValue) => formik.setFieldValue('state', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select State"
                        error={formik.touched.state && Boolean(formik.errors.state)}
                        helperText={formik.touched.state && formik.errors.state}
                      />
                    )}
                  />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard title="MCD/TAX INFORMATION">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>MCD Tax</InputLabel>
                  <FormControl>
                    <InputLabel>MCD Tax</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      id="MCDTax"
                      name="MCDTax"
                      value={formik.values.MCDTax}
                      onChange={formik.handleChange}
                      error={formik.touched.MCDTax && Boolean(formik.errors.MCDTax)}
                      helperText={formik.touched.MCDTax && formik.errors.MCDTax}
                      autoComplete="MCDTax"
                    >
                      {Object.entries(taxOptions).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>MCD Amount</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter MCD Amount"
                    id="MCDAmount"
                    name="MCDAmount"
                    type="number"
                    disabled={formik.values.MCDTax === 0 || formik.values.MCDTax === ''}
                    value={formik.values.MCDAmount}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        formik.handleChange(event);
                      }
                    }}
                    error={formik.touched.MCDAmount && Boolean(formik.errors.MCDAmount)}
                    helperText={formik.touched.MCDAmount && formik.errors.MCDAmount}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>State Tax</InputLabel>
                  <FormControl>
                    <InputLabel>State Tax</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      id="stateTax"
                      name="stateTax"
                      value={formik.values.stateTax}
                      onChange={formik.handleChange}
                      error={formik.touched.stateTax && Boolean(formik.errors.stateTax)}
                      helperText={formik.touched.stateTax && formik.errors.stateTax}
                      autoComplete="stateTax"
                    >
                      {Object.entries(taxOptions).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>State Amount</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter State Amount"
                    id="stateTaxAmount"
                    name="stateTaxAmount"
                    type="number"
                    disabled={formik.values.stateTax === 0 || formik.values.stateTax === ''}
                    value={formik.values.stateTaxAmount}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^\d*$/.test(value)) {
                        formik.handleChange(event);
                      }
                    }}
                    error={formik.touched.stateTaxAmount && Boolean(formik.errors.stateTaxAmount)}
                    helperText={formik.touched.stateTaxAmount && formik.errors.stateTaxAmount}
                  />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard title="CONTRACT INFORMATION">
            {/* <SingleFileUpload
              id="companyContract"
              name="companyContract"
              setFieldValue={formik.setFieldValue}
              value={formik.values.files}
              file={formik.values.files}
              error={formik.touched.companyContract && Boolean(formik.errors.companyContract)}
              helperText={formik.touched.companyContract && formik.errors.companyContract}
            /> */}
            <>
              <MultiFileUpload
                name="files"
                showList={list}
                setFieldValue={formik.setFieldValue}
                files={formik.values.files}
                onUpload={async () => {
                  setPdf(formik.values.files);
                }}
                error={formik.touched.files && !!formik.errors.files}
              />
              {formik.touched.files && formik.errors.files && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {formik.errors.files}
                </FormHelperText>
              )}
            </>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <DialogActions>
              {!loading && (
                <Button variant="outlined" color="error" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <LoadingButton
                variant="contained"
                loading={loading}
                loadingPosition="start"
                startIcon={<Save2 />}
                sx={{ my: 3, ml: 1 }}
                type="submit"
                disabled={loading && !formik.errors} // Disable only if loading and no error
              >
                {loading ? 'Saving...' : 'Save'}
              </LoadingButton>
            </DialogActions>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddCompany;
