import React, { useEffect, useState } from 'react';
import { Button, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'utils/axios';
import { Form, FormikProvider, useFormik } from 'formik';
import { fetchCabs } from 'store/slice/cabProvidor/cabSlice';
import ReactTable from 'components/tables/reactTable1/ReactTable';
import { fetchDrivers1 } from 'store/slice/cabProvidor/driverSlice';
import MultipleAutoCompleteWithDeleteConfirmation1 from 'components/autocomplete/MultipleAutoCompleteWithDeleteConfirmation1';

const ReportDriver = () => {
  const dispatch = useDispatch();
  const [companyData, setCompanyData] = useState([]);
  // const [tableData, setTableData] = useState([]); // State for table data
  const [showTable, setShowTable] = useState(false); // State to toggle table visibility
  const { cabs } = useSelector((state) => state.cabs);
  const limit = 5000;

  const driverList = useSelector((state) => state.drivers.drivers1) || [];

  console.log('driverList', driverList);
  console.log('cabs', cabs);

  useEffect(() => {
    dispatch(fetchCabs({ limit }));
    dispatch(fetchDrivers1({ limit }));
    // .then((res) => console.log('Dispatched fetchCabs, response:', res))
    // .catch((err) => console.error('Error dispatching fetchCabs:', err));
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get('/company/all');
        setCompanyData(response.data.companies);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    fetchCompanyData();
  }, [dispatch]);

  const tableData = [
    {
      companyName: 'ABC Logistics',
      driverName: 'John Doe',
      vehicleNumber: 'MH12AB1234',
      totalPickup: 15,
      totalDrop: 12,
      totalTrip: 27,
      action: 'View Details'
    },
    {
      companyName: 'XYZ Transport',
      driverName: 'Jane Smith',
      vehicleNumber: 'DL01XY5678',
      totalPickup: 10,
      totalDrop: 8,
      totalTrip: 18,
      action: 'View Details'
    },
    {
      companyName: 'PQR Cargo',
      driverName: 'Michael Johnson',
      vehicleNumber: 'KA05MN9876',
      totalPickup: 20,
      totalDrop: 18,
      totalTrip: 38,
      action: 'View Details'
    },
    {
      companyName: 'LMN Movers',
      driverName: 'Emily Davis',
      vehicleNumber: 'TN22KL5432',
      totalPickup: 25,
      totalDrop: 22,
      totalTrip: 47,
      action: 'View Details'
    },
    {
      companyName: 'OPQ Freight',
      driverName: 'Chris Wilson',
      vehicleNumber: 'UP32GH6789',
      totalPickup: 12,
      totalDrop: 10,
      totalTrip: 22,
      action: 'View Details'
    }
  ];

  const formik = useFormik({
    initialValues: {
      companyId: [],
      vendorId: [],
      vehicleId: [],
      startDate: null,
      endDate: null
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Fetch table data
        // const response = await axios.post('/reports', values);
        // setTableData(response.data); // Assuming the API returns an array of objects for the table
        console.log('values', values);

        setShowTable(true); // Show the table
      } catch (error) {
        console.error('Error submitting form:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to fetch reports',
            variant: 'alert',
            alert: { color: 'error' },
            close: true
          })
        );
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { getFieldProps, setFieldValue, values, handleSubmit } = formik;

  const columns = [
    {
      Header: 'Company Name',
      accessor: 'companyName'
    },
    {
      Header: 'Driver Name',
      accessor: 'driverName'
    },
    {
      Header: 'Vehicle No.',
      accessor: 'vehicleNumber'
    },
    {
      Header: 'Total Pickup',
      accessor: 'totalPickup'
    },
    {
      Header: 'Total Drop',
      accessor: 'totalDrop'
    },
    {
      Header: 'Total Trip',
      accessor: 'totalTrip'
    },
    {
      Header: 'Action',
      accessor: 'action'
    }
  ];

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <Stack gap={2}>
            <MainCard>
              <Grid container spacing={3} alignItems="center">
                {/* Company Name */}
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="companyId">Company Name</InputLabel>
                    <MultipleAutoCompleteWithDeleteConfirmation1
                      label="Company Name"
                      id="companyId"
                      options={companyData}
                      getOptionLabel={(option) => option.company_name}
                      placeholder="Select Company"
                      onChange={(e, value) =>
                        setFieldValue(
                          'companyId',
                          value.map((company) => company._id)
                        )
                      }
                      matchID="_id"
                      disableConfirmation
                      disableCloseOnSelect
                    />
                  </Stack>
                </Grid>

                {/* Driver */}
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="vendorId">Driver</InputLabel>
                    <MultipleAutoCompleteWithDeleteConfirmation1
                      label="Driver Name"
                      id="driverId"
                      options={driverList}
                      getOptionLabel={(option) => option.userName}
                      placeholder="Select Driver"
                      onChange={(e, value) =>
                        setFieldValue(
                          'driverId',
                          value.map((driver) => driver._id)
                        )
                      }
                      matchID="_id"
                      disableConfirmation
                      disableCloseOnSelect
                    />
                  </Stack>
                </Grid>

                {/* Vehicle No. */}
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="vehicleId">Vehicle Number</InputLabel>
                    <MultipleAutoCompleteWithDeleteConfirmation1
                      label="Vehicle Number"
                      id="vehicleId"
                      options={cabs}
                      getOptionLabel={(option) => option.vehicleNumber}
                      placeholder="Select Vehicle"
                      onChange={(e, value) =>
                        setFieldValue(
                          'vehicleId',
                          value.map((vehicle) => vehicle._id)
                        )
                      }
                      matchID="_id"
                      disableConfirmation
                      disableCloseOnSelect
                    />
                  </Stack>
                </Grid>

                {/* Vehicle No. */}
                {/* <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="vehicleId">Vehicle Number</InputLabel>
                    <Select
                      label="Vehicle Number"
                      id="vehicleId"
                      value={values.vehicleId || defaultVehicle || ''} // Set to assigned vehicle if available, otherwise fallback to defaultVehicle
                      onChange={(e) => setFieldValue('vehicleId', e.target.value)}
                      fullWidth
                    >
                      {cabs.map((vehicle) => {
                        const assignedVehicle = driverList.find((driver) => driver._id === values.driverId)?.assignedVehicle;
                        const defaultVehicle = assignedVehicle ? assignedVehicle.vehicleId._id : null;

                        return (
                          <MenuItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.vehicleNumber}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Stack>
                </Grid> */}

                {/* Start Date */}
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="startDate">Start Date</InputLabel>
                    <DatePicker
                      label="Start Date"
                      inputFormat="MM/dd/yyyy"
                      value={values.startDate}
                      onChange={(newValue) => setFieldValue('startDate', newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="endDate">End Date</InputLabel>
                    <DatePicker
                      label="End Date"
                      inputFormat="MM/dd/yyyy"
                      value={values.endDate}
                      onChange={(newValue) => setFieldValue('endDate', newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </Grid>

                {/* Search Button */}
                <Grid item xs={12} sm={2}>
                  <Button variant="contained" color="primary" fullWidth type="submit">
                    Search
                  </Button>
                </Grid>
              </Grid>
            </MainCard>

            {/* Table */}
            {showTable && (
              <MainCard>
                <ReactTable data={tableData} columns={columns} defaultPageSize={10} className="-striped -highlight" hideHeader />
              </MainCard>
            )}
          </Stack>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default ReportDriver;
