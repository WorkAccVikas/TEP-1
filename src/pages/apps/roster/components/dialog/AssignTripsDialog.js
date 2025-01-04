import PropTypes from 'prop-types';
import { useState, forwardRef, useEffect } from 'react';

import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Add } from 'iconsax-react';
import axiosServices from 'utils/axios';
import { Autocomplete, Box, Checkbox, FormControl, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import ScrollX from 'components/ScrollX';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AssignTripsDialog({ data: tripData, open, handleClose, setInitateRender }) {
  const [data, setData] = useState([]);

  const [payload1, setPayload1] = useState([]);
  const [zoneInfo, setZoneInfo] = useState([]);
  const [vehicleTypeInfo, setVehicleTypeInfo] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cabOptions, setCabOptions] = useState([]);

  const [tripPayload, setTripPayload] = useState([]);
  console.log(`🚀 ~ AssignTripsDialog ~ tripPayload:`, tripPayload);

  const [errorMessages, setErrorMessages] = useState([]);

  const [syncLoading, setSyncLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // This will return the date in yyyy-mm-dd format
  };

  const generateTrips = async () => {
    setTripLoading(true);
    const assignedTripsArray = tripPayload.map((item) => {
      return {
        _roster_id: item._roster_id,
        tripId: item._roster_id,
        companyID: item._company_info?._id,
        tripDate: formatDate(item._trip_date),
        tripTime: item._trip_time,
        tripType: item.tripType,
        zoneNameID: item._zoneName._id,
        zoneTypeID: item._zoneType._id,
        location: item.location,
        vehicleTypeID: item._vehicleType._id,
        vehicleNumber: item._cab._id,
        driverId: item._driver._id,
        remarks: item.remarks,

        guard: item._guardRequired ? 1 : 0,
        addOnRate: item._additional_rate,

        companyRate: item._companyRate,
        vendorRate: item._vendorRate,
        driverRate: item._driverRate,

        companyGuardPrice: item._companyGuardRate,
        driverGuardPrice: item._driverGuardRate,
        vendorGuardPrice: item._vendorGuardRate,

        companyPenalty: item._companyPenaltyRate,
        driverPenalty: item._driverPenaltyRate,
        vendorPenalty: item._vendorPenaltyRate,
        rosterTripId: item.rosterTripId,
        mcdCharge: item._mcdRate,
        tollCharge: item._tollCharge
      };
    });

    console.log('tripPayload = ', tripPayload);

    const rosterUploadArray = tripPayload.map((item) => {
      return {
        vehicleTypeArray: item._vehicleType ? [{ _id: item._vehicleType._id, vehicleTypeName: item._vehicleType.vehicleTypeName }] : [],

        zoneNameArray: item._zoneName ? [{ _id: item._zoneName._id, zoneName: item._zoneName.zoneName }] : [],

        zoneTypeArray: item._zoneType ? [{ _id: item._zoneType._id, zoneTypeName: item._zoneType.zoneTypeName }] : [],

        cabOptionsArray: item._cab ? [{ _id: item._cab._id, vehicleNumber: item._cab.vehicleNumber }] : [],
        driverOptionsArray: item._driver ? [{ _id: item._driver._id, userName: item._driver.userName }] : [],
        zoneName: item._zoneName?.zoneName || 'N/A',
        zoneType: item._zoneType?.zoneTypeName || 'N/A',
        vehicleType: item._vehicleType?.vehicleTypeName || 'N/A',
        // vehicleNumber: item._driver?.assignedVehicle?.vehicleId?.vehicleNumber || 'N/A',
        rosterMapDataId: item._roster_id,
        _roster_id: item._roster_id,
        tripId: item._roster_id,
        companyID: item._company_info?._id,
        tripDate: formatDate(item._trip_date),
        tripTime: item._trip_time,
        tripType: item.tripType,
        zoneNameID: item._zoneName?._id,
        zoneTypeID: item._zoneType?._id,
        location: item.location,
        guard: item._guard_1,
        guardPrice: item._guard_price_1,
        vehicleTypeID: item._vehicleType?._id,
        vehicleNumber: item._cab?.vehicleNumber || 'N/A',
        driverId: item._driver?._id,
        companyRate: item._companyRate,
        vendorRate: 0,
        driverRate: item._driverRate_or_vendorRate,
        _driverRate_or_vendorRate: item._driverRate_or_vendorRate,
        addOnRate: item._additional_rate,
        penalty: item._penalty_1,
        remarks: 'gg1',
        status: 3
      };
    });

    console.log('rosterUploadArray = ', rosterUploadArray);

    const fileId = tripData[0].rosterFileId;

    const _generateTripPayLoad = {
      data: {
        rosterFileId: fileId,
        assignTripsData: assignedTripsArray
      }
    };

    const _mappedRosterDataPayload = {
      data: {
        tripsData: rosterUploadArray
      }
    };

    try {
      // xl;
      const response = await axiosServices.post('/assignTrip/to/driver', _generateTripPayLoad);
      if (response.status === 201) {
        const response1 = await axiosServices.put('/tripData/map/roster/update', _mappedRosterDataPayload);
        if (response1.data.success) {
          // alert(`${payload1.length} Trips Created`);
          dispatch(
            openSnackbar({
              open: true,
              // message: `${payload1.length} trips successfully Generated!`,
              message: response?.data?.message || 'Trips Generated Successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          handleClose();
          setPayload1([]);
          setInitateRender((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(
        openSnackbar({
          open: true,
          message: err?.response?.data?.message || 'Something went wrong',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
    } finally {
      setPayload1([]);
      setTripPayload([]);
      setTripLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllZoneInfo = async () => {
      const response = await axiosServices.get('/zoneType/grouped/by/zone');
      setZoneInfo(response.data.data);
    };

    const fetchAllVehicleTypeInfo = async () => {
      const response = await axiosServices.get('/vehicleType');
      setVehicleTypeInfo(response.data.data);
    };

    const fetchDrivers = async () => {
      const response = await axiosServices.get('/driver/all?drivertype=1');
      setDrivers(response.data.data.result);
    };

    const fetchCabs = async () => {
      const response = await axiosServices.get('/vehicle/all/linked/drivers');
      setCabOptions(response.data.data);
    };

    fetchAllZoneInfo();
    fetchAllVehicleTypeInfo();
    fetchDrivers();
    fetchCabs();
  }, []);

  useEffect(() => {
    if (tripData?.length > 0) {
      const mappedData = tripData
        .filter((item) => item.status !== 3)
        .map((item) => ({
          ...item, // Spread existing properties
          _location: item.location,
          _trip_date: item.tripDate,
          _trip_time: item.tripTime,
          _trip_status: item.status,
          _file_id: item.rosterFileId,
          _roster_id: item?._id,
          _company_info: item?.companyID,

          _incomingCompanyRate: item.vehicleRate,
          _incomingGuardRate: item.guardPrice,
          _inccomingVehicleType: item.vehicleType,

          _guardRequired: item.guardPrice > 0 ? true : false,
          _isDualTrip: 0,

          _companyRate: item.vehicleRate,
          _companyDualRate: 0,
          _companyGuardRate: 0,
          _companyPenaltyRate: item.penalty,

          _driverRate: 0,
          _driverDualRate: 0,
          _driverGuardRate: 0,
          _driverPenaltyRate: 0,

          _vendorRate: 0,
          _vendorDualRate: 0,
          _vendorGuardRate: 0,
          _vendorPenaltyRate: 0,

          _driverRate_or_vendorRate: 0,
          _driverDualRate_or_vendorDualRate: 0,
          _driverGuardRate_or_vendorGuardRate: 0,
          _driverPenaltyRate_or_vendorPenaltyRate: 0,

          _additional_rate: item.addOnRate,
          _mcdRate: 0,
          _tollCharge: 0,

          _zoneName:
            item.zoneNameArray?.length === 1
              ? {
                  _id: item.zoneNameArray[0]?._id || null,
                  zoneName: item.zoneNameArray[0]?.zoneName || 'N/A',
                  zoneType: zoneInfo?.find((zone) => zone?._id === item.zoneNameArray[0]?._id)?.zoneType || []
                }
              : {
                  _id: null,
                  zoneName: item.zoneName || 'N/A',
                  zoneType: []
                },

          _zoneType:
            item.zoneTypeArray?.length === 1
              ? {
                  _id: item.zoneTypeArray[0]?._id || null,
                  zoneTypeName: item.zoneTypeArray[0]?.zoneTypeName || 'N/A'
                }
              : { _id: null, zoneTypeName: item.zoneType || 'N/A' },

          _vehicleType:
            item.vehicleTypeArray?.length === 1
              ? {
                  _id: item.vehicleTypeArray[0]?._id || null,
                  vehicleTypeName: item.vehicleTypeArray[0]?.vehicleTypeName || 'N/A'
                }
              : { _id: null, vehicleTypeName: item.vehicleType || 'N/A' },

          _driver:
            item.driverOptionsArray?.length === 1
              ? {
                  _id: item.driverOptionsArray[0]?._id || null,
                  userName: item.driverOptionsArray[0]?.userName || 'N/A'
                }
              : { _id: null, userName: item.userName || 'N/A' },

          _cab:
            item.cabOptionsArray?.length === 1
              ? {
                  _id: item.cabOptionsArray[0]?._id || null,
                  vehicleNumber: item.cabOptionsArray[0]?.vehicleNumber || 'N/A'
                }
              : { _id: null, vehicleNumber: item.vehicleNumber || 'N/A' }
        }));

      // Filter mapped data where all required `_id` fields are present
      const validData = mappedData.filter(
        (item) =>
          item.status !== 3 && item._zoneName._id && item._zoneType._id && item._vehicleType._id && item._driver._id && item._cab._id
      );

      // Update the state with filtered valid data
      setPayload1((prevPayload) => [
        ...prevPayload.filter((p) => !validData.some((d) => d._roster_id === p._roster_id)), // Remove duplicates
        ...validData
      ]);

      setData(mappedData); // Update main data state
    }
  }, [tripData, drivers, vehicleTypeInfo, zoneInfo]);

  const handleChange = (rowIndex, key, value) => {
    setData((prevData) => {
      // Update only the specific row
      const updatedRow = { ...prevData[rowIndex], [key]: value };
      const { _zoneName, _zoneType, _vehicleType, _driver, _cab } = updatedRow;

      if (_zoneName._id && _zoneType._id && _vehicleType._id && _driver._id && _cab._id) {
        setPayload1((prevPayload) => {
          const existingIndex = prevPayload.findIndex((item) => item._id === updatedRow._id);

          if (existingIndex !== -1) {
            // Update the existing entry in the payload
            const updatedPayload = [...prevPayload];
            updatedPayload[existingIndex] = updatedRow;
            return updatedPayload;
          } else {
            // Add the new row to the payload
            return [...prevPayload, updatedRow];
          }
        });
      }

      // Return the updated data array with only the specific row modified
      return prevData.map((row, index) => (index === rowIndex ? updatedRow : row));
    });
  };

  const bulkSync = async () => {
    const updatedData = [...data];
    const successTrips = [];
    const generateTripPayload = [];
    const errors = []; // Temporary array to collect error messages

    setSyncLoading(true);
    for (const trip of payload1) {
      const { _id, _zoneName, _zoneType, _vehicleType, _driver, _cab, companyID } = trip;

      if (_zoneName._id && _zoneType._id && _vehicleType._id && _driver._id && _cab._id) {
        const payload = {
          data: {
            companyID: companyID._id,
            vehicleTypeID: _vehicleType._id,
            zoneNameID: _zoneName._id,
            zoneTypeID: _zoneType._id,
            driverId: _driver._id
          }
        };

        try {
          const response = await axiosServices.post('/tripData/amount/by/driver/id', payload);
          const amounts = response.data.data;

          // Update all rows in updatedData with the same _id

          updatedData.forEach((row) => {
            if (row._id === _id) {
              if (row._isDualTrip > 0) {
                // Validation for dual trip rates
                if (!amounts.companyDualAmount || (!amounts.driverDualAmount && !amounts.vendorDualAmount)) {
                  errors.push(
                    `Row with ID ${row?.rosterTripId} has invalid dual trip rates. companyDualAmount, driverDualAmount, or vendorDualAmount cannot be 0.`
                  );
                  return; // Skip further processing for this row
                } else {
                  generateTripPayload.push(row);
                }

                // Set rates for dual trip
                row['_companyRate'] = amounts.companyDualAmount ? amounts.companyDualAmount / 2 : 0;
                row['_vendorRate'] = amounts.vendorDualAmount ? amounts.vendorDualAmount / 2 : 0;
                row['_driverRate'] = amounts.driverDualAmount ? amounts.driverDualAmount / 2 : 0;
              } else {
                // Validation for non-dual trip rates
                if (!amounts.companyAmount || (!amounts.driverAmount && !amounts.vendorAmount)) {
                  errors.push(
                    `Row with ID ${row.rosterTripId} has invalid non-dual trip rates. companyAmount, driverAmount, or vendorAmount cannot be 0.`
                  );
                  return; // Skip further processing for this row
                } else {
                  generateTripPayload.push(row);
                }

                // Set rates for non-dual trip
                row['_companyRate'] = amounts.companyAmount;
                row['_vendorRate'] = amounts.vendorAmount;
                row['_driverRate'] = amounts.driverAmount;
              }

              // Handle guard rates
              if (row._guardRequired) {
                row['_vendorGuardRate'] = amounts.vendorGuardPrice;
                row['_driverGuardRate'] = amounts.driverGuardPrice;
                row['_companyGuardRate'] = amounts.companyGuardPrice;
                row['_driverGuardRate_or_vendorGuardRate'] = amounts.driverGuardPrice || amounts.vendorGuardPrice;
              } else {
                row['_companyGuardRate'] = 0;
                row['_driverGuardRate'] = 0;
                row['_vendorGuardRate'] = 0;
                row['_driverGuardRate_or_vendorGuardRate'] = 0;
              }

              // Store additional rates
              row['_companyDualRate'] = amounts.companyDualAmount;
              row['_vendorDualRate'] = amounts.vendorDualAmount;
              row['_driverDualRate'] = amounts.driverDualAmount;
              row['_driverRate_or_vendorRate'] = amounts.driverAmount || amounts.vendorAmount;
              row['_driverDualRate_or_vendorDualRate'] = amounts.driverDualAmount || amounts.vendorDualAmount;
            }
          });

          // Update error messages in state
          setErrorMessages(errors);
          setTripPayload(generateTripPayload);
          successTrips.push(trip);
        } catch (error) {
          console.error(`Error syncing trip with _id ${_id}:`, error);
        }
      } else {
        console.error(`Validation error for trip with _id ${_id}`);
      }
    }

    // Update state after all operations
    setData([...updatedData]);

    console.log(errors);

    if (errors.length > 0) {
      console.log('here');
      dispatch(
        openSnackbar({
          open: true,
          message: `${errors.length} trips successfully synced!`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      );
    }
    // Show alert based on success count
    if (successTrips.length > 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: `${successTrips.length} trips successfully synced!`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      );
    } else {
      openSnackbar({
        open: true,
        message: `${successTrips.length} trips synced! failed`,
        variant: 'alert',
        alert: {
          color: 'error'
        },
        close: false,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      });
    }

    setSyncLoading(false);
  };

  const [currentGroup, setCurrentGroup] = useState(1); // Track the next group number
  const [pairs, setPairs] = useState({}); // Map of row indices to group numbers

  const handleCheckboxChange = (rowIndex, key) => {
    setData((prevData) => {
      // Directly mutate the part of data that changes
      const updatedData = [...prevData];
      const newPairs = { ...pairs }; // Create a copy of pairs

      const isSelected = newPairs[rowIndex]; // Check if the current row is part of a pair

      if (isSelected) {
        // Deselect the row
        delete newPairs[rowIndex];

        // Find all rows in the same group
        const groupMembers = Object.entries(newPairs).filter(([_, group]) => group === isSelected);

        if (groupMembers.length === 0) {
          // Reset the group number if the pair is incomplete
          setCurrentGroup((prev) => Math.min(prev, isSelected));
        }

        // Reset the value in the data
        updatedData[rowIndex][key] = 0;

        // Reset the other row in the pair if it was incomplete
        if (groupMembers.length === 1) {
          const [incompleteRowIndex] = groupMembers[0];
          updatedData[parseInt(incompleteRowIndex, 10)][key] = 0;
        }
      } else {
        // Select the row and handle pairing logic
        const groupMembers = Object.entries(newPairs).filter(([_, group]) => group === currentGroup);

        if (groupMembers.length < 2) {
          newPairs[rowIndex] = currentGroup; // Add to current group
          updatedData[rowIndex][key] = currentGroup;

          if (groupMembers.length === 1) {
            // Pair the rows and increment the group number
            const [firstRowIndex] = groupMembers[0];
            updatedData[parseInt(firstRowIndex, 10)][key] = currentGroup;
            setCurrentGroup((prev) => prev + 1); // Increment group for next pair
          }
        } else {
          alert('Group is full, select another pair.');
        }
      }

      // Only update pairs and data if there is a change
      setPairs(newPairs);

      return updatedData; // Return updated data for state change
    });
  };

  const renderInputField = (key, value, rowIndex, row) => {
    switch (key) {
      case 'tripDate': {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
          return `${day}-${month}-${year}`;
        };
        return (
          <Tooltip title={formatDate(value) || ''} arrow>
            <TextField
              id="outlined-number-read-only"
              value={formatDate(value)}
              InputProps={{
                readOnly: true
              }}
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '80px' // Ensures enough space for full date
              }}
            />
          </Tooltip>
        );
      }
      /* break omitted */
      case 'tripTime': {
        return (
          <Tooltip title={value || ''} arrow>
            <TextField
              id="outlined-number-read-only"
              value={value}
              InputProps={{
                readOnly: true
              }}
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '80px' // Ensures enough space for full date
              }}
            />
          </Tooltip>
        );
      }
      /* break omitted */
      case 'location': {
        return (
          <Tooltip title={value || ''} arrow>
            <TextField
              id="outlined-number-read-only"
              value={value}
              InputProps={{
                readOnly: true
              }}
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '200px', // Ensures enough space for minimum display
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'wrap' // Prevents text from wrapping
              }}
            />
          </Tooltip>
        );
      }
      case 'rosterTripId': {
        return (
          <Tooltip title={value || ''} arrow>
            <TextField
              id="outlined-number-read-only"
              value={value}
              InputProps={{
                readOnly: true
              }}
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '120px', // Ensures enough space for minimum display
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'wrap' // Prevents text from wrapping
              }}
            />
          </Tooltip>
        );
      }
      /* break omitted */
      case '_companyRate':
      case '_companyGuardRate':
      case '_companyPenalty':
      case '_driverRate_or_vendorRate':
      case '_driverGuardRate_or_vendorGuardRate':
        return (
          <Tooltip title={value || 0} arrow>
            <TextField
              placeholder={value || 0}
              id="outlined-start-adornment"
              value={value} // Use value to make it fixed
              type="number"
              InputProps={{
                readOnly: true,
                // startAdornment: '₹',

                inputProps: {
                  sx: {
                    '::-webkit-outer-spin-button': { display: 'none' },
                    '::-webkit-inner-spin-button': { display: 'none' },
                    '-moz-appearance': 'textfield' // Firefox
                  }
                }
              }}
              sx={{
                input: {
                  textAlign: 'left' // Optional: Align text to the right
                }
              }}
            />
          </Tooltip>
        );
      /* break omitted */
      case 'tripType': {
        return (
          <Tooltip title={value == 1 ? 'Pickup' : value == 2 ? 'Drop' : 'Unknown'} arrow>
            <TextField
              id="outlined-number-read-only"
              value={value == 1 ? 'Pickup' : value == 2 ? 'Drop' : 'Unknown'}
              InputProps={{
                readOnly: true
              }}
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '60px', // Ensures enough space for minimum display
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' // Prevents text from wrapping
              }}
            />
          </Tooltip>
        );
      }
      /* break omitted */
      case '_zoneName': {
        return (
          <Tooltip title={value._id ? value.zoneName : 'N/A' || ''} arrow>
            <FormControl sx={{ width: 120 }} error={!value?._id}>
              {/* Optional Helper Text */}
              <Select
                value={JSON.stringify(value)} // Using stringified value
                onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
                displayEmpty
                inputProps={{ 'aria-label': 'Zone Name' }}
                sx={{ width: '100%', color: value?._id ? 'inherit' : 'red' }}
              >
                {/* Placeholder item when value is missing */}
                {!value?._id && (
                  <MenuItem value="" sx={{ color: 'text.secondary' }}>
                    Select Zone
                  </MenuItem>
                )}

                {/* Option for the selected zone */}
                {value && (
                  <MenuItem key={value._id} value={JSON.stringify(value)}>
                    {value.zoneName}
                  </MenuItem>
                )}

                {/* Map over all zones */}
                {zoneInfo?.map((zone) => (
                  <MenuItem key={zone._id} value={JSON.stringify(zone)}>
                    {zone.zoneName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        );
      }
      /* break omitted */
      case '_zoneType': {
        return (
          <Tooltip title={value._id ? value.zoneTypeName : 'N/A' || ''} arrow>
            <FormControl sx={{ width: '100%', maxWidth: 200 }} error={!value?._id}>
              {/* Optional Helper Text */}
              <Select
                value={JSON.stringify(value)} // Using stringified value
                onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
                displayEmpty
                inputProps={{ 'aria-label': 'Zone Type' }}
                sx={{ width: '100%', color: value?._id ? 'inherit' : 'red' }}
              >
                {/* Placeholder item when value is missing */}
                {!value?._id && (
                  <MenuItem value="" sx={{ color: 'text.secondary' }}>
                    Select Zone Type
                  </MenuItem>
                )}

                {/* Option for the selected zone type */}
                {value && (
                  <MenuItem key={value._id} value={JSON.stringify(value)}>
                    {value.zoneTypeName}
                  </MenuItem>
                )}

                {/* Map over all zoneTypes, excluding the selected one */}
                {row._zoneName?.zoneType
                  .filter((zone) => zone._id !== value._id) // Exclude selected value if needed
                  .map((zone) => (
                    <MenuItem key={zone._id} value={JSON.stringify(zone)}>
                      {zone.zoneTypeName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Tooltip>
        );
      }
      /* break omitted */
      case '_cab': {
        return (
          <FormControl sx={{ width: '100%', maxWidth: 200 }} error={!value?._id}>
            {/* Optional Helper Text */}

            <Select
              value={JSON.stringify(value)} // Using stringified value
              onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
              displayEmpty
              inputProps={{ 'aria-label': 'Cab' }}
              sx={{ width: '100%' }} // Make the Select element fill the FormControl's width
            >
              {/* Placeholder item when value is missing */}
              {!value?._id && (
                <MenuItem value="" sx={{ color: 'text.secondary' }}>
                  Select Cab
                </MenuItem>
              )}

              {/* Option for the selected cab */}
              {value && (
                <MenuItem key={value._id} value={JSON.stringify(value)}>
                  {value.vehicleNumber}
                </MenuItem>
              )}

              {/* Map over all cab options */}
              {cabOptions?.map((cab) => (
                <MenuItem key={cab._id} value={JSON.stringify(cab)}>
                  {cab.vehicleNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      /* break omitted */
      case '_vehicleType': {
        return (
          <FormControl sx={{ width: '100%', maxWidth: 200 }} error={!value?._id}>
            {/* Optional Helper Text */}

            <Select
              value={JSON.stringify(value)} // Using stringified value
              onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
              displayEmpty
              inputProps={{ 'aria-label': 'Cab' }}
              sx={{ width: '100%' }} // Make the Select element fill the FormControl's width
            >
              {/* Placeholder item when value is missing */}
              {!value?._id && (
                <MenuItem value="" sx={{ color: 'text.secondary' }}>
                  Select Vehicle Type
                </MenuItem>
              )}

              {/* Option for the selected cab */}
              {value && (
                <MenuItem key={value._id} value={JSON.stringify(value)}>
                  {value.vehicleTypeName}
                </MenuItem>
              )}

              {/* Map over all cab options */}
              {vehicleTypeInfo.map((cab) => (
                <MenuItem key={cab._id} value={JSON.stringify(cab)}>
                  {cab.vehicleTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      /* break omitted */
      case '_driver': {
        return (
          <FormControl sx={{ width: '100%', maxWidth: 150 }} error={!value?._id}>
            {/* Optional Helper Text */}
            <Select
              value={JSON.stringify(value)} // Using stringified value
              onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
              displayEmpty
              inputProps={{ 'aria-label': 'Driver' }}
              sx={{ width: '100%', color: value?._id ? 'inherit' : 'red' }} // Make the Select element fill the FormControl's width
            >
              {/* Option for the selected driver */}
              {!value._id && (
                <MenuItem key={value._id} value={JSON.stringify(value)}>
                  {'N/A'}
                </MenuItem>
              )}
              {value._id && (
                <MenuItem key={value._id} value={JSON.stringify(value)}>
                  {value.userName}
                </MenuItem>
              )}

              {/* Map over driverOptionsArray or _drivers_options */}
              {drivers.map((driver) => (
                <MenuItem key={driver._id} value={JSON.stringify(driver)}>
                  {driver.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      /* break omitted */
      case '_guardRequired':
        return (
          <Checkbox
            checked={!!value} // Convert 1/0 to true/false
            onChange={(e) => handleChange(rowIndex, key, e.target.checked ? 1 : 0)} // Convert true/false back to 1/0
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto' // Ensures it's centered horizontally
            }}
          />
        );
      /* break omitted */
      case '_driverPenalty':
      case '_additional_rate':
      case '_tollCharge':
      case '_mcdRate':
      case '_driverPenaltyRate_or_vendorPenaltyRate': {
        return (
          <Tooltip title={value || 0} arrow>
            <TextField
              placeholder="0"
              id="outlined-start-adornment"
              onChange={(e) => handleChange(rowIndex, key, e.target.value)}
              type="number"
              InputProps={{
                // startAdornment: '₹',
                inputProps: {
                  sx: {
                    '::-webkit-outer-spin-button': { display: 'none' },
                    '::-webkit-inner-spin-button': { display: 'none' },
                    '-moz-appearance': 'textfield' // Firefox
                  }
                }
              }}
              sx={{
                input: {
                  textAlign: 'left' // Optional: Align text to the right
                },
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '60px', // Ensures enough space for minimum display
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' // Prevents text from wrapping
              }}
            />
          </Tooltip>
        );
      }
      case '_isDualTrip': {
        return (
          <Checkbox
            checked={data[rowIndex][key] > 0} // Check if value is 1 to show as checked
            onChange={() => handleCheckboxChange(rowIndex, key)} // Call the checkbox change handler
            icon={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '2px solid gray', // Border color when unchecked
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent' // No background color when unchecked
                }}
              >
                <Typography variant="body2" color="gray">
                  {data[rowIndex][key]} {/* Display number 0 or 1 */}
                </Typography>
              </Box>
            }
            checkedIcon={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'green', // Green background when checked
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid darkgreen' // Dark green border for distinction
                }}
              >
                <Typography variant="body2" color="white">
                  {data[rowIndex][key]} {/* Display the number 1 */}
                </Typography>
              </Box>
            }
          />
        );
      }

      /* break omitted */
      default:
        return null;
    }
  };

  const displayKeys = [
    'rosterTripId',
    '_zoneName',
    '_zoneType',
    'location',
    'tripDate',
    'tripTime',
    'tripType',

    '_vehicleType',
    '_cab',
    '_driver',
    '_guardRequired',
    '_isDualTrip',
    // 'sync',
    '_companyRate',
    '_companyGuardRate',
    '_companyPenalty',
    '_driverRate_or_vendorRate',
    '_driverGuardRate_or_vendorGuardRate',
    '_driverPenaltyRate_or_vendorPenaltyRate',
    '_additional_rate',
    '_mcdRate',
    '_tollCharge'
  ];
  const headerMap = {
    tripDate: 'Date',
    tripTime: 'Time',
    rosterTripId: 'Trip ID',
    tripType: 'Type',
    _zoneName: 'Zone Name',
    _zoneType: 'Zone Type',
    location: 'Location',
    _vehicleType: 'Vehicle Type',
    _cab: 'Vehicle',
    _driver: 'Driver',
    _guardRequired: 'Guard',
    sync: 'Sync',
    _companyRate: 'Company Rate',
    _companyGuardRate: 'Company Guard Rate',
    _companyPenalty: 'Company Penalty Rate',
    _driverRate_or_vendorRate: 'Driver Rate',
    _driverGuardRate_or_vendorGuardRate: 'Driver Guard Rate',
    _driverPenaltyRate_or_vendorPenaltyRate: 'Driver Penalty Rate',
    _additional_rate: 'Extra Charges',
    _mcdRate: 'MCD charge',
    _tollCharge: 'Toll Charges',
    _isDualTrip: 'Dual Trip'
  };

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Add style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Assign New Trips
            </Typography>
            <Button
              sx={{ ml: 2, flex: 0.2 }}
              color="secondary"
              variant="contained"
              onClick={bulkSync}
              disabled={payload1.length === 0 || syncLoading || tripLoading}
            >
              {`Sync ${payload1.length} Trips`}
            </Button>
            <Button
              sx={{ ml: 2, flex: 0.2 }}
              color="success"
              variant="contained"
              disabled={tripPayload.length === 0 || syncLoading || tripLoading}
              onClick={generateTrips}
            >
              {/* Save */}
              {`Generate ${tripPayload.length} Trips`}
            </Button>
          </Toolbar>
        </AppBar>

        <ScrollX>
          {data.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      textAlign: 'left'
                    }}
                  >
                    Sr No
                  </th>
                  {displayKeys.map((key) => (
                    <th
                      key={key}
                      style={{
                        border: '1px solid black',
                        padding: '8px',
                        textAlign: 'left'
                      }}
                    >
                      {headerMap[key] || key} {/* Use the mapped header or fallback to key */}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: rowIndex % 2 === 1 ? '#fff' : '#f0f9f9' // Alternate row colors
                    }}
                  >
                    <td
                      style={{
                        border: '1px solid black',
                        padding: '8px',
                        textAlign: 'center'
                      }}
                    >
                      {rowIndex + 1} {/* Serial Number */}
                    </td>
                    {displayKeys.map((key) => (
                      <td
                        key={key}
                        style={{
                          border: '1px solid black',
                          padding: '0px',
                          height: '50px'
                        }}
                      >
                        {renderInputField(key, row[key], rowIndex, row)} {/* Pass the entire row */}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ScrollX>
      </Dialog>
    </>
  );
}
