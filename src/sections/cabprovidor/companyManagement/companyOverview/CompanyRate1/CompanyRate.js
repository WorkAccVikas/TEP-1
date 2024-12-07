import React, { useEffect, useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { Add, Trash } from 'iconsax-react';
import MainCard from 'components/MainCard';
import { formatDateUsingMoment, getNestedComplexProperty } from 'utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import MultipleAutoCompleteWithDeleteConfirmation1 from 'components/autocomplete/MultipleAutoCompleteWithDeleteConfirmation1';
import FormikSelectField1 from 'components/select/Select1';
import FormikTextField from 'components/textfield/TextField';
import AlertDelete from 'components/alertDialog/AlertDelete';
// import axios from 'axios';
import { openSnackbar } from 'store/reducers/snackbar';
import { useNavigate } from 'react-router';
import axiosServices from 'utils/axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CompanyRate = ({ id, companyName, onBackToList }) => {
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [rateIndex, setRateIndex] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('serviceToken');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllVehicleTypesForAll());
    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
  }, [dispatch]);

  const vehicleTypeList = useSelector((state) => state.vehicleTypes.vehicleTypes) || [];
  const zoneTypeList = useSelector((state) => state.zoneType.zoneTypes) || [];
  const zoneList = useSelector((state) => state.zoneName.zoneNames) || [];

  const optionsForDualTrip = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' }
  ];

  const initialValues = {
    rateData: [
      {
        zoneNameID: '',
        zoneTypeID: null,
        cabRate: 0,
        billingCycle: '',
        cabAmount: [
          // {
          //   vehicleTypeID: null,
          //   amount: 0
          // }
        ],
        dualTrip: 0,
        dualTripAmount: [],
        guard: 0,
        guardPrice: 0
      }
    ]
  };

  const handleSubmit = async (values, { resetForm }) => {
    const zoneNameIDs = values.rateData.map((rateData) => rateData.zoneNameID);

    if (zoneNameIDs.some((zoneNameID) => zoneNameID === '')) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select zone name',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      return;
    }

    // Process the rateData structure and ensure it aligns with the expected API structure
    const formValues = {
      rateData: values.rateData.map((rateData) => ({
        zoneNameID: rateData.zoneNameID, // Ensure we map zoneNameID
        zoneTypeID: rateData.zoneTypeID, // Ensure we map zoneTypeID
        cabAmount: rateData.cabAmount.length ? rateData.cabAmount : [], // Ensure cabAmount array is handled correctly
        dualTrip: rateData.dualTrip, // Ensure dualTrip is mapped
        dualTripAmount: rateData.dualTripAmount.length ? rateData.dualTripAmount : [], // Ensure dualTripAmount array is handled correctly
        guard: rateData.guard, // Ensure guard is mapped
        guardPrice: rateData.guardPrice,
        cabRate: 0,
        billingCycle: ''
      }))
    };

    // Prepare the final data to be sent to the API
    const finalData = formValues.rateData.map((data) => ({
      zoneNameID: data.zoneNameID,
      zoneTypeID: data.zoneTypeID,
      cabAmount: data.cabAmount,
      dualTrip: data.dualTrip,
      dualTripAmount: data.dualTripAmount,
      guard: data.guardPrice > 0 ? 1 : 0,
      guardPrice: data.guardPrice,
      cabRate: 0,
      billingCycle: ''
    }));

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const response = await axiosServices.post(
        `/company/add/rates`,
        {
          data: {
            companyID: id,
            effectiveDate,
            ratesForCompany: finalData
          }
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );

      if (response.status === 201) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
      }
      resetForm({ values: initialValues });
      setSelectedVehicleTypes([]);
      onBackToList(); // Navigate back to list after successful submission
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const handleSelectChangeForDualTrip = (event, values, setFieldValue) => {
    const { name, value } = event.target;

    const output = name.replace(/dualTrip$/, 'cabAmount');

    const result = Number(value) > 0 ? getNestedComplexProperty(values, output) : [];

    const output1 = name.replace(/dualTrip$/, 'dualTripAmount');
    setFieldValue(output1, result);
    setFieldValue(name, value);
  };

  const handleOpenDialog = (index) => {
    setRateIndex(index);
    setRemoveDialogOpen(true);
  };

  const handleCloseDialog = (event, confirm, removeFn, rateID) => {
    if (confirm) {
      removeFn(rateID);
    }
    setRateIndex(null);
    setRemoveDialogOpen(false);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting, dirty, setFieldValue, getFieldProps }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off">
            <Stack gap={2}>
              {values.rateData.length > 0 && (
                <Box sx={{ p: 1 }}>
                  <Grid container spacing={3}>
                    {/* {values.rateData.map((item, index) => ( */}
                    <Grid item xs={12}>
                      <MainCard
                        title={
                          <Stack direction="row" spacing={1} alignItems="center" gap={1}>
                            Add Company Rate for <Chip label={companyName} color="primary" />
                          </Stack>
                        }
                        secondary={
                          <DatePicker
                            label="Select Effective Date"
                            sx={{ width: '100%' }}
                            value={effectiveDate ? new Date(effectiveDate) : null} // Convert to Date object if needed
                            format="dd/MM/yyyy"
                            onChange={(newValue) => {
                              if (newValue && !isNaN(new Date(newValue))) {
                                // Check if newValue is a valid date
                                setEffectiveDate(formatDateUsingMoment(newValue, 'YYYY-MM-DD'));
                              } else {
                                console.error('Invalid date selected.');
                              }
                            }}
                          />
                        }
                      >
                        {/* {values.rateData.map((item, index) => ( */}
                        <FieldArray
                          name="rateData"
                          render={(arrayHelpers) => (
                            <Stack spacing={2}>
                              {/* {values.rateData.map((item, index) => ( */}
                              <TableContainer>
                                <Box sx={{ overflowX: 'auto' }}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Zone Name</TableCell>
                                        <TableCell>Zone Type</TableCell>
                                        <TableCell>Vehicle Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Dual Trip</TableCell>
                                        <TableCell>Dual Trip Amount</TableCell>
                                        {/* <TableCell>Guard</TableCell> */}
                                        <TableCell>Guard Price</TableCell>
                                        <TableCell>Action</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {values.rateData.map((item, index) => (
                                      <TableBody key={index}>
                                        <TableRow key={index}>
                                          <TableCell>{index + 1}</TableCell>

                                          {/* Zone Name */}
                                          <TableCell>
                                            <FormikAutocomplete
                                              name={`rateData.${index}.zoneNameID`}
                                              options={zoneList}
                                              placeholder="Select Zone Name"
                                              sx={{ width: '150px' }}
                                              getOptionLabel={(option) => option['zoneName']}
                                              saveValue="_id"
                                              value={
                                                zoneList?.find(
                                                  (item) => item['_id'] === getNestedComplexProperty(values, `rateData.${index}.zoneNameID`)
                                                ) || null
                                              }
                                              renderOption={(props, option) => (
                                                <Box component="li" {...props}>
                                                  {option['zoneName']}
                                                </Box>
                                              )}
                                            />
                                          </TableCell>

                                          {/* Zone Type */}
                                          <TableCell>
                                            <FormikAutocomplete
                                              name={`rateData.${index}.zoneTypeID`}
                                              options={zoneTypeList
                                                .filter(
                                                  (zoneType) =>
                                                    zoneType.zoneId._id === getNestedComplexProperty(values, `rateData.${index}.zoneNameID`)
                                                )
                                                .sort((a, b) => a.zoneTypeName.localeCompare(b.zoneTypeName))}
                                              placeholder="Select Zone Type"
                                              sx={{ width: '150px' }}
                                              getOptionLabel={(option) => option['zoneTypeName']}
                                              saveValue="_id"
                                              value={
                                                zoneTypeList?.find(
                                                  (item) => item['_id'] === getNestedComplexProperty(values, `rateData.${index}.zoneTypeID`)
                                                ) || null
                                              }
                                              renderOption={(props, option) => (
                                                <Box component="li" {...props}>
                                                  {option['zoneTypeName']}
                                                </Box>
                                              )}
                                              disabled={!getNestedComplexProperty(values, `rateData.${index}.zoneNameID`)}
                                            />
                                          </TableCell>

                                          {/* Vehicle Type and Amount */}
                                          <TableCell>
                                            <MultipleAutoCompleteWithDeleteConfirmation1
                                              label="Vehicle Type"
                                              id="vehicleType"
                                              options={vehicleTypeList}
                                              getOptionLabel={(option) => option['vehicleTypeName']}
                                              sx={{ width: '350px' }}
                                              placeholder="Select Vehicle Type"
                                              saveToFun={(e, value) => {
                                                const vehicleTypeIds = value.map((vehicleType) => vehicleType._id);
                                                setSelectedVehicleTypes(value);
                                                setFieldValue(
                                                  `rateData.${index}.cabAmount`,
                                                  vehicleTypeIds.map((vehicleTypeID) => ({
                                                    vehicleTypeID,
                                                    amount: 0
                                                  }))
                                                );
                                              }}
                                              matchID="_id"
                                              displayDeletedKeyName="vehicleTypeName"
                                              deleteAllMessage="Vehicle Types"
                                              disableClearable // To hide the clear button
                                            />
                                          </TableCell>

                                          {/* Check if any vehicle types are selected */}
                                          {values.rateData[0].cabAmount[0]?.vehicleTypeID === '' ||
                                          values.rateData[index].cabAmount.length === 0 ? (
                                            <TableCell sx={{ width: '150px' }}>
                                              <TextField label="Amount (No Vehicle)" disabled sx={{ width: '150px' }} />
                                            </TableCell>
                                          ) : (
                                            <TableCell
                                              sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '16px',
                                                width:
                                                  values.rateData[index].cabAmount.length > 2
                                                    ? '510px'
                                                    : `${170 * values.rateData[index].cabAmount.length}px`,
                                                transform: values.rateData[index].cabAmount.length !== 3 ? 'none' : 'translate(0%, 25%)'
                                              }}
                                            >
                                              {values.rateData[index].cabAmount.map((cab, cabIndex) => (
                                                <TextField
                                                  key={cab.vehicleTypeID}
                                                  label={`${
                                                    vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName ||
                                                    'Unknown Vehicle'
                                                  }`}
                                                  sx={{ width: '150px' }}
                                                  value={cab.amount}
                                                  onChange={(e) => {
                                                    setFieldValue(`rateData.${index}.cabAmount.${cabIndex}.amount`, e.target.value);
                                                  }}
                                                />
                                              ))}
                                            </TableCell>
                                          )}

                                          {/* Dual Trip Selection */}
                                          <TableCell>
                                            <FormikSelectField1
                                              label="Dual Trip"
                                              name={`rateData.${index}.dualTrip`}
                                              options={optionsForDualTrip}
                                              sx={{ width: '150px' }}
                                              onChange={(event) => {
                                                handleSelectChangeForDualTrip(event, values, setFieldValue);
                                                if (event.target.value === 1) {
                                                  setFieldValue(
                                                    `rateData.${index}.dualTripAmount`,
                                                    selectedVehicleTypes.map(() => ({ amount: '', vehicleTypeID: '' }))
                                                  );
                                                }
                                              }}
                                            />
                                          </TableCell>

                                          {selectedVehicleTypes.length === 0 ? (
                                            <TableCell sx={{ width: '150px' }}>
                                              <TextField label="Dual Trip Amount (No Vehicle Type)" sx={{ width: '150px' }} disabled />
                                            </TableCell>
                                          ) : (
                                            <TableCell
                                              sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '16px',
                                                width: selectedVehicleTypes.length > 2 ? '510px' : `${170 * selectedVehicleTypes.length}px`,
                                                transform: selectedVehicleTypes.length !== 3 ? 'none' : 'translate(0%, 25%)'
                                              }}
                                            >
                                              {selectedVehicleTypes.map((vehicleType, cabIndex) => (
                                                <TextField
                                                  key={vehicleType._id}
                                                  label={`${vehicleType.vehicleTypeName}`}
                                                  name={`rateData.${index}.dualTripAmount.${cabIndex}`}
                                                  value={values.rateData[index].dualTripAmount[cabIndex]?.amount || ''}
                                                  disabled={getFieldProps(`rateData.${index}.dualTrip`).value !== 1}
                                                  sx={{ width: '150px' }}
                                                  onChange={(event) =>
                                                    setFieldValue(`rateData.${index}.dualTripAmount.${cabIndex}`, {
                                                      amount: event.target.value,
                                                      vehicleTypeID: selectedVehicleTypes[cabIndex]._id
                                                    })
                                                  }
                                                />
                                              ))}
                                            </TableCell>
                                          )}

                                          {/* Guard Price */}
                                          <TableCell>
                                            <FormikTextField
                                              name={`rateData.${index}.guardPrice`}
                                              label="Guard Price"
                                              sx={{ width: '150px' }}
                                            />
                                          </TableCell>

                                          {/* Delete */}
                                          <TableCell>
                                            <IconButton
                                              onClick={(event) => {
                                                handleOpenDialog(index);
                                              }}
                                            >
                                              <Trash color="red" />
                                            </IconButton>
                                          </TableCell>
                                          <AlertDelete
                                            title={`Rate ${rateIndex + 1}`}
                                            subtitle={'all its value will be deleted.'}
                                            open={removeDialogOpen}
                                            handleClose={(event, confirm) => {
                                              handleCloseDialog(event, confirm, arrayHelpers.remove, rateIndex);
                                            }}
                                          />
                                        </TableRow>
                                      </TableBody>
                                    ))}
                                  </Table>
                                </Box>
                              </TableContainer>
                              {/* ))} */}

                              {/* Add Rate Button */}
                              <Stack direction={'row'}>
                                <Button
                                  variant="outlined"
                                  startIcon={<Add />}
                                  onClick={() =>
                                    arrayHelpers.push({
                                      zoneNameID: '',
                                      zoneTypeID: null,
                                      cabAmount: [],
                                      dualTrip: 0,
                                      dualTripAmount: [],
                                      guard: 0,
                                      guardPrice: 0
                                    })
                                  }
                                >
                                  Add Rate
                                </Button>
                              </Stack>
                            </Stack>
                          )}
                        />
                        {/* ))} */}
                      </MainCard>
                    </Grid>
                    {/* ))} */}
                  </Grid>
                </Box>
              )}

              <Stack direction={'row'} justifyContent="center" alignItems="center" gap={2}>
                <Button
                  type="button"
                  color="secondary"
                  variant="outlined"
                  onClick={() => {
                    navigate(0); // Redirects to the previous page
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting || !dirty}>
                  {' '}
                  Add
                </Button>
              </Stack>
            </Stack>
          </Form>
        </LocalizationProvider>
      )}
    </Formik>
  );
};

export default CompanyRate;
