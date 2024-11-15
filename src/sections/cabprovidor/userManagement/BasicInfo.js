import { Avatar, Box, Divider, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material';
import FormikTextField from 'components/textfield/TextField';
import { useFormikContext } from 'formik';
import { Camera } from 'iconsax-react';
import { useTheme } from '@emotion/react';
import { ThemeMode } from 'config';
import { useEffect, useMemo, useState } from 'react';
import PasswordField from 'components/textfield/PasswordField';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import { USERTYPE } from 'constant';
import { useSelector } from 'react-redux';
import { generateArrayFromObject } from 'utils/helper';

const UserTypeNamesForSuperAdmin = {
  [USERTYPE.iscabProvider]: 'Cab Provider'
};

const UserTypeNamesForCabProvider = {
  [USERTYPE.iscabProviderUser]: 'Cab Provider User'
};

const UserTypeNamesForVendor = {
  [USERTYPE.isVendorUser]: 'Vendor User'
};

const AvailableUserTypeOptionsSuperAdmin = generateArrayFromObject(UserTypeNamesForSuperAdmin);
const AvailableUserTypeOptionsCabProvider = generateArrayFromObject(UserTypeNamesForCabProvider);
const AvailableUserTypeOptionsVendor = generateArrayFromObject(UserTypeNamesForVendor);

const AvailableUserTypeOptions = {
  [USERTYPE.superAdmin]: AvailableUserTypeOptionsSuperAdmin,
  [USERTYPE.iscabProvider]: AvailableUserTypeOptionsCabProvider,
  [USERTYPE.isVendor]: AvailableUserTypeOptionsVendor
};

const BasicInfo = () => {
  const theme = useTheme();
  const formik = useFormikContext();
  console.log(formik);

  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(null);

  const userType = useSelector((state) => state.auth.userType);

  const optionsUserType = useMemo(() => {
    return AvailableUserTypeOptions[userType];
  }, [userType]);

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const { values, setFieldValue, handleBlur, handleChange } = useFormikContext();

  return (
    <>
      <Grid container spacing={3}>
        {/* Profile Image */}
        <Grid item xs={12} md={3}>
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                '&:hover .MuiBox-root': { opacity: 1 },
                cursor: 'pointer'
              }}
            >
              <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <Camera
                    style={{
                      color: theme.palette.secondary.lighter,
                      fontSize: '2rem'
                    }}
                  />
                  <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                </Stack>
              </Box>
            </FormLabel>
            <TextField
              type="file"
              id="change-avtar"
              placeholder="Outlined"
              variant="outlined"
              sx={{ display: 'none' }}
              onChange={(e) => {
                setFieldValue('userImage', e.target.files?.[0]);
                setSelectedImage(e.target.files?.[0]);
              }}
            />
          </Stack>
        </Grid>

        {/* Form */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {/* Personal Info */}
            <Grid item xs={12}>
              <Typography variant="h5" component="div">
                A. Personal Info:
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ paddingLeft: '2rem !important' }}>
              <Grid container spacing={3}>
                {/* Username */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <FormLabel>Username</FormLabel>
                    <FormikTextField
                      name="userName"
                      placeholder="Enter Username"
                      fullWidth
                      inputProps={{ autoComplete: 'off' }}
                      // error={Boolean(formik.errors.userName)}
                      // helperText={formik.errors.userName}
                    />
                  </Stack>
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <FormLabel>Email</FormLabel>
                    <FormikTextField
                      name="userEmail"
                      placeholder="Enter Email"
                      fullWidth
                      inputProps={{ autoComplete: 'off' }}
                      // error={Boolean(formik.errors.userEmail)}
                      // helperText={formik.errors.userEmail}
                    />
                  </Stack>
                </Grid>

                {/* Password */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <FormLabel>Password</FormLabel>

                    <PasswordField
                      name="userPassword"
                      placeholder="Enter Password"
                      inputProps={{ autoComplete: 'new-password' }}
                      // error={Boolean(formik.errors.userPassword)}
                      // helperText={formik.errors.userPassword}
                    />
                  </Stack>
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <FormLabel>Confirm Password</FormLabel>
                    <PasswordField
                      name="userConfirmPassword"
                      placeholder="Enter Confirm Password"
                      inputProps={{ autoComplete: 'new-password' }}
                      // error={Boolean(formik.errors.userConfirmPassword)}
                      // helperText={formik.errors.userConfirmPassword}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12}>
              <Typography variant="h5" component="div">
                B. Contact Info:
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ paddingLeft: '2rem !important' }}>
              <Grid container spacing={3}>
                {/* Contact Number */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <FormLabel>Contact Number</FormLabel>
                    <FormikTextField
                      name="contactNumber"
                      placeholder="Enter Contact Number"
                      fullWidth
                      onChange={(event) => {
                        const value = event.target.value;
                        if (/^\d*$/.test(value)) {
                          handleChange(event);
                        }
                      }}
                      error={Boolean(formik.errors.contactNumber)}
                      helperText={formik.errors.contactNumber}
                    />
                  </Stack>
                </Grid>

                {/* Alternate Contact Number */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <FormLabel>Alternate Contact Number</FormLabel>
                    <FormikTextField
                      name="alternateContactNumber"
                      placeholder="Enter Alternate Contact Number"
                      fullWidth
                      onChange={(event) => {
                        const value = event.target.value;
                        if (/^\d*$/.test(value)) {
                          handleChange(event);
                        }
                      }}
                      error={Boolean(formik.errors.alternateContactNumber)}
                      helperText={formik.errors.alternateContactNumber}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Address Info */}
            <Grid item xs={12}>
              <Typography variant="h5" component="div">
                C. Address Info:
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ paddingLeft: '2rem !important' }}>
              <Grid container spacing={3}>
                {/* Pin Code */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <FormLabel>Pin Code</FormLabel>
                    <FormikTextField
                      name="pinCode"
                      placeholder="Enter Pin Code"
                      fullWidth
                      onChange={(event) => {
                        const value = event.target.value;
                        if (/^\d*$/.test(value)) {
                          handleChange(event);
                        }
                      }}
                      error={Boolean(formik.errors.pinCode)}
                      helperText={formik.errors.pinCode}
                    />
                  </Stack>
                </Grid>

                {/* City */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <FormLabel>City</FormLabel>
                    <FormikTextField
                      name="city"
                      placeholder="Enter City"
                      fullWidth
                      error={Boolean(formik.errors.city)}
                      helperText={formik.errors.city}
                    />
                  </Stack>
                </Grid>

                {/* State */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <FormLabel>State</FormLabel>
                    <FormikTextField
                      name="state"
                      placeholder="Enter State"
                      fullWidth
                      error={Boolean(formik.errors.state)}
                      helperText={formik.errors.state}
                    />
                  </Stack>
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <FormLabel>Address</FormLabel>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      id="address"
                      value={values.address}
                      name="address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Address"
                      error={Boolean(formik.errors.address)}
                      helperText={formik.errors.address}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Other Info */}
            {/* <Grid item xs={12}>
              <Typography variant="h5" component="div">
                D. Other Info:
              </Typography>
            </Grid> */}

            {/* <Grid item xs={12} sx={{ paddingLeft: '2rem !important' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <FormLabel>User Type</FormLabel>
                    <FormikAutocomplete
                      name="userType"
                      options={optionsUserType}
                      placeholder="Choose a user type"
                      getOptionLabel={(option) => option.value}
                      saveValue="id"
                      value={optionsUserType.find((item) => item['id'] === values['userType']) || null}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.value}
                        </Box>
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default BasicInfo;
