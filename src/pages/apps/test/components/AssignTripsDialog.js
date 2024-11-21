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
import { Autocomplete, Checkbox, FormControl, MenuItem, Select, TextField, Tooltip } from '@mui/material';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AssignTripsDialog({ data: tripData, open, handleClose, setInitateRender, fileData }) {
  const [data, setData] = useState([]);

  const [payload1, setPayload1] = useState([]);
  const [zoneInfo, setZoneInfo] = useState([]);
  const [vehicleTypeInfo, setVehicleTypeInfo] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cabOptions, setCabOptions] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // This will return the date in yyyy-mm-dd format
  };

  const generateTrips = async () => {
    const assignedTripsArray = payload1.map((item) => {
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

    console.log({ assignedTripsArray });
    const rosterUploadArray = payload1.map((item) => {
      return {
        vehicleTypeArray: item._vehicleType ? [{ _id: item._vehicleType._id, vehicleTypeName: item._vehicleType.vehicleTypeName }] : [],

        zoneNameArray: item._zoneName ? [{ _id: item._zoneName._id, zoneName: item._zoneName.zoneName }] : [],

        zoneTypeArray: item._zoneType ? [{ _id: item._zoneType._id, zoneTypeName: item._zoneType.zoneTypeName }] : [],

        cabOptionsArray: item._cab ? [{ _id: item._cab._id, vehicleNumber: item._cab.vehicleNumber }] : [],
        driverOptionsArray: item._driver ? [{ _id: item._driver._id, userName: item._driver.userName }] : [],
        zoneName: item._zoneName?.zoneName || 'N/A',
        zoneType: item._zoneType?.zoneTypeName || 'N/A',
        vehicleType: item._vehicleType?.vehicleTypeName || 'N/A',
        vehicleNumber: item._driver?.assignedVehicle?.vehicleId?.vehicleNumber || 'N/A',
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
        // vehicleNumber: item._cab?.vehicleNumber || 'N/A',
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
      const response = await axiosServices.post('/assignTrip/to/driver', _generateTripPayLoad);
      if (response.status === 201) {
        const response1 = await axiosServices.put('/tripData/map/roster/update', _mappedRosterDataPayload);
        if (response1.data.success) {
          alert(`${payload1.length} Trips Created`);
          handleClose();
          setPayload1([]);
          setInitateRender((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
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
          _guardRequired: item.guardPrice > 0 ? true : false,

          _incomingCompanyRate: item.vehicleRate,
          _incomingGuardRate: item.guardPrice,
          _inccomingVehicleType: item.vehicleType,

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
              : { _id: null, vehicleNumber: item.vehicleNumber || 'N/A' },
          _zoneName_options: zoneInfo || [],
          _vehicleType_options: vehicleTypeInfo || [],
          _drivers_options: drivers || [],
          _cab_options: cabOptions || []
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
  console.log({ data });

  const handleChange = (rowIndex, key, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = value; // Update the specific field
    const { _zoneName, _zoneType, _vehicleType, _driver, _cab } = updatedData[rowIndex];

    if (_zoneName._id && _zoneType._id && _vehicleType._id && _driver._id && _cab._id) {
      setPayload1((prevPayload) => {
        // Check if the current `_id` already exists in `prevPayload`
        const existingIndex = prevPayload.findIndex((item) => item._id === updatedData[rowIndex]._id);

        if (existingIndex !== -1) {
          // If it exists, replace the existing entry
          const updatedPayload = [...prevPayload];
          updatedPayload[existingIndex] = updatedData[rowIndex];
          return updatedPayload;
        } else {
          // If it doesn't exist, add it to the array
          return [...prevPayload, updatedData[rowIndex]];
        }
      });
    }

    setData(updatedData);
  };

  const bulkSync = () => {
    const updatedData = [...data];

    payload1.forEach(async (trip) => {
      console.log({ trip });
      const { _id, _zoneName, _zoneType, _vehicleType, _driver, _cab, companyID } = trip;
      console.log({ companyID });
      if (_zoneName._id && _zoneType._id && _vehicleType._id && _driver._id && _cab._id ) {
        console.log(companyID._id);
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
          console.log(response.data);
          const amounts = response.data.data;
          // Update all rows in updatedData with the same _id
          updatedData.forEach((row) => {
            if (row._id === _id) {
              row['_companyRate'] = amounts.companyAmount;
              row['_vendorRate'] = amounts.vendorAmount;
              row['_driverRate'] = amounts.driverAmount;

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

              row['_companyDualRate'] = amounts.companyDualAmount;
              row['_vendorDualRate'] = amounts.vendorDualAmount;
              row['_driverDualRate'] = amounts.driverDualAmount;

              row['_driverRate_or_vendorRate'] = amounts.driverAmount || amounts.vendorAmount;

              row['_driverDualRate_or_vendorDualRate'] = amounts.driverDualAmount || amounts.vendorDualAmount;
            }
          });

          console.log({ updatedData });
          // Update state after all async operations
          setData([...updatedData]);
        } catch (error) {
          console.error('Error syncing data:', error);
        }
      } else {
        alert('Error found');
      }
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
                {zoneInfo.map((zone) => (
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
                {row._zoneName.zoneType
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
              {row._cab_options.map((cab) => (
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
              {row._vehicleType_options.map((cab) => (
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
              {row._drivers_options.map((driver) => (
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
      /* break omitted */
      default:
        return null;
    }
  };

  const displayKeys = [
    'rosterTripId',
    'tripDate',
    'tripTime',
    'tripType',
    '_zoneName',
    '_zoneType',
    'location',
    '_vehicleType',
    '_cab',
    '_driver',
    '_guardRequired',
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
    _tollCharge: 'Toll Charges'
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
            {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {`Trips Ready: ${payload1.length}`}
            </Typography> */}
            <Button sx={{ ml: 2, flex: 0.2 }} color="secondary" variant="contained" onClick={bulkSync}>
              {`Sync ${payload1.length} Trips`}
            </Button>
            <Button sx={{ ml: 2, flex: 0.2 }} color="success" variant="contained" disabled={payload1.length === 0} onClick={generateTrips}>
              {/* Save */}
              {`Generate ${payload1.length} Trips`}
            </Button>
          </Toolbar>
        </AppBar>

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
      </Dialog>
    </>
  );
}
