import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project-imports
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const CustomerSchema = Yup.object().shape({
  amount: Yup.number().required('Amount is required').positive('Amount must be a positive number'),
  remarks: Yup.string().required('Remarks are required').max(250, 'Remarks should not exceed 250 characters')
});

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

const AdvanceVendorForm = ({ customer, onCancel, key, setKey }) => {
  const isCreating = !customer;
  const token = localStorage.getItem('serviceToken');
  const [loading, setLoading] = useState(true);

  console.log('customer', customer);

  const [fetchAllAdvance, setFetchAllAdvance] = useState(null);
  const [advanceProvider, setAdvanceProvider] = useState(null);

  useEffect(() => {
    const providerId = localStorage.getItem('providerId');

    const fetchdata = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/advanceType/cab/providerId`, {
        headers: {
          Authorization: `${token}`
        }
      });
      if (response.status === 200) {
        setLoading(false);
      }
      console.log('response', response.data.cabProviderId);
      localStorage.setItem('providerId', JSON.stringify(response.data.cabProviderId));
      setAdvanceProvider(response.data.cabProviderId);
    };

    if (!providerId) {
      fetchdata();
    } else {
      setAdvanceProvider(JSON.parse(providerId));
    }
  }, []);

  console.log('advanceProvider', advanceProvider);

  useEffect(() => {
    const providerId1 = JSON.parse(localStorage.getItem('providerId'));
    const fetchdata = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/advanceType/all?cabProviderId=${providerId1}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      if (response.status === 200) {
        setLoading(false);
      }
      setFetchAllAdvance(response.data.dataList);
    };

    fetchdata();
  }, []);

  console.log('fetchAllAdvance', fetchAllAdvance);

  const formik = useFormik({
    initialValues: {
      amount: customer?.amount || '',
      remarks: customer?.remarks || '',
      advanceTypeId: customer?.["advanceTypeId._id"] || '',
      advanceType: customer?.["advanceTypeId._id"] || ''
    },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('values', values);

      try {
        if (isCreating) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/advance/request`,
            {
              data: {
                cabProviderId: advanceProvider,
                amount: values.amount,
                remarks: values.remarks,
                vendorId: '',
                advanceTypeId: values.advanceType
              }
            },
            {
              headers: {
                Authorization: `${token}`
              }
            }
          );
          console.log('res', response);
          if (response.status === 201) {
            setKey(key + 1);
          }
          setKey(key + 1);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Advance added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          // PUT request for editing existing record
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/advance/edit`,
            {
              data: {
                _id: advanceProvider,
                amount: values.amount,
                remarks: values.remarks,
                vendorId: '',
                advanceTypeId: values.advanceType
              }
            },
            {
              headers: {
                Authorization: `${token}`
              }
            }
          );
          console.log('resEdit', response);
          if (response.status === 200) {
            setKey(key + 1);
          }
          dispatch(
            openSnackbar({
              open: true,
              message: 'Advance updated successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }
        onCancel();
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'An error occurred. Please try again.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
    }
  });

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>{isCreating ? 'New Advance' : 'Edit Advance'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }} direction="row">
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="amount">Amount</InputLabel>
                  <TextField
                    fullWidth
                    id="amount"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    placeholder="Enter Amount"
                    type="number"
                    error={Boolean(formik.touched.amount && formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                  />
                </Stack>
                <Stack spacing={1}>
                  <InputLabel htmlFor="remarks">Remarks</InputLabel>
                  <TextField
                    fullWidth
                    id="remarks"
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    placeholder="Please Add Remarks"
                    error={Boolean(formik.touched.remarks && formik.errors.remarks)}
                    helperText={formik.touched.remarks && formik.errors.remarks}
                  />
                </Stack>
                <Stack spacing={1}>
                  <FormControl>
                    <InputLabel>Advance Type</InputLabel>
                    <Select
                      fullWidth
                      placeholder="Enter Advance Type"
                      defaultValue=""
                      id="advanceType"
                      name="advanceType"
                      value={formik.values.advanceType}
                      onChange={formik.handleChange}
                      error={formik.touched.advanceType && Boolean(formik.errors.advanceType)}
                      helperText={formik.touched.advanceType && formik.errors.advanceType}
                      autoComplete="advanceType"
                    >
                      {fetchAllAdvance &&
                        fetchAllAdvance.map((item, index) => (
                          <MenuItem key={index} value={item._id}>
                            {item.advanceTypeName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {isCreating ? 'Add' : 'Edit'}
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </LocalizationProvider>
      </FormikProvider>
      {/* {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} />} */}
    </>
  );
};

AdvanceVendorForm.propTypes = {
  customer: PropTypes.any,
  onCancel: PropTypes.func
};

export default AdvanceVendorForm;
