// material-ui
import { Autocomplete, Button, DialogActions, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useCallback, useEffect, useState } from 'react';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import MultiFileUpload from 'components/third-party/dropzone/MultiFile';
import { useLocation, useNavigate } from 'react-router-dom';
import { addBranch, fetchCompanies } from 'store/slice/cabProvidor/companySlice';
import ConfigurableAutocomplete from 'components/autocomplete/ConfigurableAutocomplete';
import { LoadingButton } from '@mui/lab';
import { Save2 } from 'iconsax-react';

// ==============================|| LAYOUTS -  COLUMNS ||============================== //

function AddBranch() {
  const [branchData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [list] = useState(false);
  const [, setPdf] = useState([]);
  const location = useLocation();
  const [, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const rowOriginal = location.state;

  const handleCancel = () => {
    navigate(-1);
  };

  // const { companies = [] } = useSelector((state) => state.companies || {});

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

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

  const TAX = {
    No: 0,
    'Per Trip': 1,
    Monthly: 2
  };

  const validationSchema = yup.object({
    parentCompanyID: yup.string().required('Company Name is required'), //
    companyBranchName: yup
      .string()
      .trim()
      .min(YupValidationConfig.company_name.min, ({ min }) => `Branch Name must be at least ${min} characters`)
      .max(YupValidationConfig.company_name.max, ({ max }) => `Branch Name must be at most ${max} characters`)
      .test('no-leading-digit', 'Branch Name cannot start with a number', (value) => {
        return /^[^0-9]/.test(value);
      })
      .required('Branch Name is required'),
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
      .matches(/^[0-9]{10}$/, {
        message: 'Please enter valid mobile number',
        excludeEmptyString: false
      })
      .required('Mobile Number is required'),
    landline: yup
      .string()
      .trim()
      .matches(/^[0-9]{10}$/, {
        message: 'Please enter valid landline number',
        excludeEmptyString: false
      })
      .test('not-same-as-phone', 'Landline phone number should be different from mobile number', function (value) {
        const { mobile: phone } = this.parent;
        return typeof phone === 'undefined' ? true : value !== phone;
      })
      .required('Landline Number is required'),
    // PAN: yup
    //   .string()
    //   .required('PAN is required')
    //   .matches(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, 'Enter a valid PAN'),

    // GSTIN: yup
    //   .string()
    //   .required('GSTIN is required')
    //   .matches(/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z1-9]{1}Z[A-Z0-9]{1})$/, 'Enter a valid GSTIN'),
    postal_code: yup
      .string()
      .matches(/^[0-9]{6}$/, {
        message: 'Please enter valid pin code',
        excludeEmptyString: false
      })
      .required('Pin Code is required'),
    address: yup
      .string()
      .trim()
      .test('is-not-only-whitespace', 'Permanent Address cannot contain only whitespace', (value) =>
        typeof value === 'undefined' ? true : value.length !== 0
      )
      .max(MAX_TEXTFIELD_LENGTH.address, 'Address is too long')
      .required('Address is required'),
    city: yup.string().trim().required('City is required'),
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
      .test('single-file', 'You can only upload one file', (value) => {
        return Array.isArray(value) && value.length === 1 && value[0] instanceof File;
      })
      .required('Company Contract is required')
  });

  const formik = useFormik({
    initialValues: {
      parentCompanyID: branchData.parentCompanyID || '',
      parentCompanyName: '',
      companyBranchName: branchData.companyBranchName || '',
      contact_person: branchData.contact_person || '',
      company_email: branchData.company_email || '',
      mobile: branchData.mobile || '',
      landline: branchData.landline || '',
      PAN: branchData.PAN || '',
      GSTIN: branchData.GSTIN || '',
      postal_code: branchData.postal_code || '',
      address: branchData.address || '',
      city: branchData.city || '',
      state: branchData.state || '',
      MCDTax: branchData.MCDTax || '',
      MCDAmount: branchData.MCDAmount || '',
      stateTax: branchData.stateTax || '',
      stateTaxAmount: branchData.stateTaxAmount || '',
      files: branchData.companyContract || null
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('parentCompanyID', values.parentCompanyID);
        formData.append('companyBranchName', values.companyBranchName);
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

        const resultAction = await dispatch(addBranch(formData));

        if (addBranch.fulfilled.match(resultAction)) {
          // Company successfully added
          resetForm();
          dispatch(
            openSnackbar({
              open: true,
              message: 'Company branch added successfully',
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
      }
      finally{
        setLoading(false);
      }
    }
  });

  const handleSelectionChange = useCallback(
    (value) => {
      setSelectedOption(value);
      formik.setFieldValue('parentCompanyID', value?._id || '');
    },
    [formik]
  );

  useEffect(() => {
    if (rowOriginal) {
      formik.setValues({
        parentCompanyID: rowOriginal.parentCompanyID || '',
        companyBranchName: rowOriginal.companyBranchName || '',
        contact_person: rowOriginal.contact_person || '',
        company_email: rowOriginal.company_email || '',
        mobile: rowOriginal.mobile || '',
        landline: rowOriginal.landline || '',
        PAN: rowOriginal.PAN || '',
        GSTIN: rowOriginal.GSTIN || '',
        postal_code: rowOriginal.postal_code || '',
        address: rowOriginal.address || '',
        city: rowOriginal.city || '',
        state: rowOriginal.state || '',
        MCDTax: rowOriginal.MCDTax || '',
        MCDAmount: rowOriginal.MCDAmount || '',
        stateTax: rowOriginal.stateTax || '',
        stateTaxAmount: rowOriginal.stateTaxAmount || '',
        files: [{ name: 'files', url: rowOriginal.companyContract }] || null
      });
    }
  }, [rowOriginal]);

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={'ADD BRANCH INFORMATION'}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel id="demo-simple-select-helper-label">Company Name</InputLabel>
                  <FormControl>
                    <ConfigurableAutocomplete
                      apiUrl="/company/getCompanyByName" // Replace with your actual API URL
                      onChange={handleSelectionChange} // Handle selected item
                      label="Search Company" // Input field label
                      maxItems={3} // Limit the results to 3 items
                      optionLabelKey="company_name" // Key to display from API response
                      searchParam="filter"
                      noOptionsText="No Company Found"
                      placeHolderText="Type to search for company" // Pass placeholder text
                      autoHighlight // Enable auto highlight
                    />
                  </FormControl>

                  {/* {selectedOption && (
                    <div>
                      <h3>Selected Option:</h3>
                      <p>{selectedOption.company_name}</p>
                    </div>
                  )} */}
                </Stack>
                {formik.touched.parentCompanyID && formik.errors.parentCompanyID && <FormHelperText error>{formik.errors.parentCompanyID}</FormHelperText>}
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Branch Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Branch Name"
                    id="companyBranchName"
                    name="companyBranchName"
                    value={branchData.companyBranchName || formik.values.companyBranchName}
                    onChange={formik.handleChange}
                    error={formik.touched.companyBranchName && Boolean(formik.errors.companyBranchName)}
                    helperText={formik.touched.companyBranchName && formik.errors.companyBranchName}
                    autoComplete="companyBranchName"
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
                    value={branchData.contact_person || formik.values.contact_person}
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
                    value={branchData.company_email || formik.values.company_email}
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
                    value={branchData.mobile || formik.values.mobile}
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
                    value={branchData.landline || formik.values.landline}
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
                    value={branchData.PAN || formik.values.PAN}
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
                    value={branchData.GSTIN || formik.values.GSTIN}
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
                    value={branchData.postal_code || formik.values.postal_code}
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
                    value={branchData.address || formik.values.address}
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
                    value={branchData.city || formik.values.city}
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
                    value={branchData.state || formik.values.state}
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
                      placeholder="Enter MCD Tax"
                      defaultValue=""
                      id="MCDTax"
                      name="MCDTax"
                      value={branchData.MCDTax || formik.values.MCDTax}
                      onChange={formik.handleChange}
                      error={formik.touched.MCDTax && Boolean(formik.errors.MCDTax)}
                      helperText={formik.touched.MCDTax && formik.errors.MCDTax}
                      autoComplete="MCDTax"
                    >
                      {Object.entries(TAX).map(([key, value]) => (
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
                    value={branchData.MCDAmount || formik.values.MCDAmount}
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
                      placeholder="Enter State Tax"
                      defaultValue=""
                      id="stateTax"
                      name="stateTax"
                      value={branchData.stateTax || formik.values.stateTax}
                      onChange={formik.handleChange}
                      error={formik.touched.stateTax && Boolean(formik.errors.stateTax)}
                      helperText={formik.touched.stateTax && formik.errors.stateTax}
                      autoComplete="stateTax"
                    >
                      {Object.entries(TAX).map(([key, value]) => (
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
                    value={branchData.stateTaxAmount || formik.values.stateTaxAmount}
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
                disabled={loading} // Disable button while loading
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

export default AddBranch;
