import PropTypes from 'prop-types';
import { Box, FormHelperText, Grid, InputLabel, Stack, TextField } from '@mui/material';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import MainCard from 'components/MainCard';
import FormikTextField from 'components/textfield/TextField';
import { USERTYPE } from 'constant';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

const SpecificInfo = ({ handlePermission }) => {
  const userType = useSelector((state) => state.auth.userType);
  // const userID = useSelector((state) => state.users.userDetails?._id);
  const roleOptions = useSelector((state) => state.roles.roles) || [];
  const formik = useFormikContext();

  const { values, handleBlur, handleChange } = useFormikContext();

  return (
    <>
      <Grid container spacing={3}>
        {/* Bank Details */}
        <Grid item xs={12} md={7}>
          <MainCard title="Bank Details">
            <Grid container spacing={2} alignItems="center">
              {/* Bank Name */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>Bank Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormikTextField name="bankName" placeholder="Enter Bank Name" fullWidth />
              </Grid>

              {/* Branch Name */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>Branch Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormikTextField name="branchName" placeholder="Enter Branch Name" fullWidth />
              </Grid>

              {/* Account Number */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>Account Number</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormikTextField name="accountNumber" placeholder="Enter Account Number" fullWidth />
              </Grid>

              {/* Account Holder Name */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>Account Holder Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormikTextField name="accountHolderName" placeholder="Enter Account Holder Name" fullWidth />
              </Grid>

              {/* PAN */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>PAN</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormikTextField name="PAN" placeholder="Enter PAN" fullWidth />
              </Grid>

              {/* IFSC Code */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>IFSC Code</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <FormikTextField name="IFSC_code" placeholder="Enter IFSC Code" fullWidth />
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                <InputLabel>Bank Address</InputLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  id="bankAddress"
                  value={values.bankAddress}
                  name="bankAddress"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter ank Address"
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <Grid container rowGap={3}>
            {/* Role Assignment */}
            <Grid item xs={12}>
              <MainCard title="Role Assignment">
                {/* ROLE NAME */}
                <Stack spacing={2}>
                  <InputLabel>Role</InputLabel>
                  <FormikAutocomplete
                    name="roleId"
                    options={roleOptions}
                    placeholder="Select Role"
                    getOptionLabel={(option) => option['role_name']}
                    saveValue="_id"
                    otherValue="permissions"
                    extraWork={handlePermission}
                    onBlur={() => formik.setFieldTouched('roleId', true)}
                    value={roleOptions?.find((item) => item['_id'] === values['roleId']) || null}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option['role_name']}
                      </Box>
                    )}
                    error={Boolean(formik.errors.roleId)}
                    helperText={formik.errors.roleId}
                  />
                  {/* {Boolean(formik.errors.roleId) && <FormHelperText error>{formik.errors.roleId}</FormHelperText>} */}
                </Stack>
              </MainCard>
            </Grid>

            {/* Other Details */}
            {userType === USERTYPE.isVendor && (
              <Grid item xs={12}>
                <MainCard title="Other Details">
                  <Grid container rowGap={3}>
                    {/* Office Charge Amount */}
                    <Grid item xs={12}>
                      <Stack gap={2}>
                        <InputLabel>Office Charge Amount</InputLabel>
                        <FormikTextField name="officeChargeAmount" placeholder="Enter Office Charge Amount" fullWidth />
                      </Stack>
                    </Grid>

                    {/* ESI Number */}
                    <Grid item xs={12}>
                      <Stack gap={2}>
                        <InputLabel>ESI Number</InputLabel>
                        <FormikTextField name="ESI_Number" placeholder="Enter ESI Number" fullWidth />
                      </Stack>
                    </Grid>

                    {/* PF Number */}
                    <Grid item xs={12}>
                      <Stack gap={2}>
                        <InputLabel>PF Number</InputLabel>
                        <FormikTextField name="PF_Number" placeholder="Enter PF Number" fullWidth />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

SpecificInfo.propTypes = {
  handlePermission: PropTypes.func.isRequired
};

export default SpecificInfo;
