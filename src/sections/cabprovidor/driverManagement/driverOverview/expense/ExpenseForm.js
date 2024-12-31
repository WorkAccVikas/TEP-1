import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';
import { useFormik, FormikProvider } from 'formik';
import { useDispatch } from 'store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { openSnackbar } from 'store/reducers/snackbar';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { useEffect, useState } from 'react';
import { addZoneType, updateZoneType } from 'store/slice/cabProvidor/zoneTypeSlice';
import axiosServices from 'utils/axios';

const ExpenseForm = ({ data, onCancel, updateKey, setUpdateKey, driverId, setSelectedData }) => {
  const dispatch = useDispatch();

  console.log({ data, onCancel, updateKey, setUpdateKey, driverId });

  const formik = useFormik({
    initialValues: {
      amount: data?.amount || '',
      expenseName: data?.expenseName || ''
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = !data
          ? await axiosServices.post('/expense/add', {
              data: {
                driverId: driverId,
                amount: values.amount,
                expenseName: values.expenseName
              }
            })
          : await axiosServices.put('/expense/edit', {
              data: {
                expenseId: data._id,
                amount: values.amount,
                name: values.expenseName
              }
            });

        if (response.status === 200) {
          setUpdateKey(updateKey + 1);
          formik.resetForm();
          dispatch(
            openSnackbar({
              open: true,
              message: response.data?.message || (!data ? 'Expense added successfully.' : 'Expense updated successfully.'),
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          throw new Error(response.data?.message || 'Unexpected error occurred.');
        }
        onCancel();
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: error.message || 'An error occurred. Please try again.',
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
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{!data ? 'Add Expense' : 'Edit Expense'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="expenseName">Expense Name</InputLabel>
                <TextField
                  fullWidth
                  id="expenseName"
                  name="expenseName"
                  value={formik.values.expenseName}
                  onChange={formik.handleChange}
                  placeholder="Enter Expense Name"
                  error={Boolean(formik.touched.expenseName && formik.errors.expenseName)}
                  helperText={formik.touched.expenseName && formik.errors.expenseName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <TextField
                  fullWidth
                  id="amount"
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  placeholder="Enter Amount"
                  error={Boolean(formik.touched.amount && formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="error" onClick={()=>{setSelectedData(null);
                onCancel();
              }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!formik.dirty || formik.isSubmitting}>
                {!data ? 'Add' : 'Edit'}
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default ExpenseForm;
