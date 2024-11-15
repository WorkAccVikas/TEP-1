/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';

import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'store';
import FormikTextField from 'components/textfield/TextField';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import { openSnackbar } from 'store/reducers/snackbar';
import { USERTYPE } from 'constant';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
  userName: Yup.string().required('Username is required'),
  userEmail: Yup.string().email('Invalid email format').required('Email is required'),
  contactNumber: Yup.string().required('Contact Number is required').min(10, 'Contact Number must be at least 10 characters')
});

const DriverRegister = ({
  open,
  handleClose,
  sliceName,
  title,
  initialValuesFun,
  yupSchema = null,
  onSubmit,
  fetchAllData,
  fetchSingleDetails
}) => {
  const dispatch = useDispatch();
  const { isCreating, getSingleDetails } = useSelector((state) => state[sliceName]);

  const vendors = useSelector((state) => state.vendors.vendors);
  const userType = useSelector((state) => state.auth.userType);

  const data = isCreating ? null : getSingleDetails;

  //   useEffect(() => {
  //     if (!isCreating) {
  //       fetchSingleDetails();
  //     }
  //   }, []);

  const formikHandleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onSubmit(values, isCreating);
      resetForm();
      handleClose();

      const message = isCreating ? 'Driver details have been successfully added' : 'Driver details have been successfully updated';

      dispatch(
        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );

      // fetchAllData();
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
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValuesFun(data),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: formikHandleSubmit
  });

  const { handleSubmit, isSubmitting, values } = formik;

  const style = [USERTYPE.iscabProvider, USERTYPE.iscabProviderUser].includes(userType) ? 6 : 4;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <Box sx={{ p: 1, py: 1.5 }}>
          <FormikProvider value={formik}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <DialogTitle>{isCreating ? title.ADD : title.EDIT}</DialogTitle>

              <DialogContent>
                <Grid container spacing={2} alignItems="center" rowGap={2}>
                  {/* Username */}
                  <Grid item xs={12} sm={style}>
                    <Stack spacing={1}>
                      <InputLabel>Username</InputLabel>

                      <FormikTextField name="userName" placeholder="Enter Username" fullWidth />
                    </Stack>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={style}>
                    <Stack spacing={1}>
                      <InputLabel>Email</InputLabel>

                      <FormikTextField name="userEmail" placeholder="Enter Email" fullWidth />
                    </Stack>
                  </Grid>

                  {/* Contact Number */}
                  <Grid item xs={12} sm={style}>
                    <Stack spacing={1}>
                      <InputLabel>Contact Number</InputLabel>

                      <FormikTextField name="contactNumber" placeholder="Enter Contact Number" fullWidth />
                    </Stack>
                  </Grid>

                  {/* Vendor Company Name */}
                  {[USERTYPE.iscabProvider, USERTYPE.iscabProviderUser].includes(userType) && (
                    <Grid item xs={12} sm={style}>
                      <Stack spacing={1}>
                        <InputLabel>Vendor Company Name</InputLabel>

                        <FormikAutocomplete
                          name="vendorId"
                          options={vendors}
                          placeholder="Vendor company name"
                          getOptionLabel={(option) => option['vendorCompanyName']}
                          saveValue="vendorId"
                          defaultValue={null}
                          value={vendors?.find((item) => item['vendorId'] === values['vendorId']) || null}
                          renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              {option['vendorCompanyName']}
                            </Box>
                          )}
                        />
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button color="error" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  {isCreating ? 'Add' : 'Save'}
                </Button>
              </DialogActions>
            </Form>
          </FormikProvider>
        </Box>
      </Dialog>
    </>
  );
};

export default DriverRegister;
