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
        guard: item._guard_1,
        guardPrice: item._guard_price_1,
        vehicleTypeID: item._vehicleType._id,
        vehicleNumber: item._cab._id,
        driverId: item._driver._id,
        companyRate: item._companyRate,
        _driverRate_or_vendorRate: item._driverRate_or_vendorRate,
        addOnRate: item._additional_rate,
        penalty: item._penalty_1,
        remarks: 'gg1'
      };
    });

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
      const mappedData = tripData.map((item) => ({
        ...item, // Spread existing properties
        location: item.location,
        _trip_date: item.tripDate,
        _trip_time: item.tripTime,
        _discount_1: 0, // Default values
        _penalty_1: item.penalty,
        _dual_trip: 0,
        _trip_status: item.status,
        _file_id: item.rosterFileId,
        _roster_id: item?._id,
        _dualTrip_1: 0,
        _guard_1: item.guard,
        _company_info: item?.companyID,
        _additional_rate: item.addOnRate,
        _guard_price_1: item.guardPrice,
        _tax_1: 0,
        _companyRate: item.vehicleRate,
        _driverRate_or_vendorRate: 0,
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
        (item) => item._zoneName._id && item._zoneType._id && item._vehicleType._id && item._driver._id && item._cab._id
      );

      // Update the state with filtered valid data
      setPayload1((prevPayload) => [
        ...prevPayload.filter((p) => !validData.some((d) => d._roster_id === p._roster_id)), // Remove duplicates
        ...validData
      ]);

      setData(mappedData); // Update main data state
    }
  }, [tripData, drivers, vehicleTypeInfo, zoneInfo]);
  console.log({ tripData });

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
      console.log(trip);
      const { _id, _zoneName, _zoneType, _vehicleType, _driver, _cab } = trip;

      if (_zoneName._id && _zoneType._id && _vehicleType._id && _driver._id && _cab._id) {
        const payload = {
          data: {
            companyID: '66e010556265e5aad31f9b40',
            vehicleTypeID: '66c57911777b0e58991125f3',
            zoneNameID: '6683e597643aeaa0469223a3',
            zoneTypeID: '6683e5c6643aeaa0469223b3',
            driverId: '66ed052952b00bf1e93a4abb'
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
              row['_companyGuardPrice'] = amounts.companyGuardPrice;
              row['_driverRate'] = amounts.vendorAmount;
              row['_driverGuardPrice'] = amounts.vendorGuardPrice;
            }
          });

          // Update state after all async operations
          setData([...updatedData]);
        } catch (error) {
          console.error('Error syncing data:', error);
        }
      }
    });
  };

  const renderInputField = (key, value, rowIndex, row) => {
    switch (key) {
      case 'sync': {
        const handleRateSync = async (rowIndex) => {
          const updatedData = [...data];
          // Update the specific field
          console.log('updatedData[rowIndex]', updatedData[rowIndex]);

          const { _zoneName, _zoneType, _vehicleType, _driver, _cab, companyID } = updatedData[rowIndex];

          if (_zoneName._id && _zoneType._id && _vehicleType._id && _driver._id && _cab._id && companyID._id) {
            const payload = {
              data: {
                companyID: companyID._id,
                vehicleTypeID: _vehicleType._id,
                zoneNameID: _zoneName._id,
                zoneTypeID: _zoneType._id,
                driverId: _driver._id
              }
            };
            const response = await axiosServices.post('/tripData/amount/by/driver/id', payload);
            console.log(response.data);
            const amounts = response.data.data;

            console.log(updatedData[rowIndex]['_guard']);
            updatedData[rowIndex]['_companyRate'] = amounts.companyAmount;
            updatedData[rowIndex]['_companyGuardPrice'] = amounts.companyGuardPrice;
            updatedData[rowIndex]['_driverRate'] = amounts.vendorAmount;
            updatedData[rowIndex]['_driverGuardPrice'] = amounts.vendorGuardPrice;
            setData(updatedData);
          }
        };

        return (
          <button style={{ width: '100%', height: '100%' }} onClick={() => handleRateSync(rowIndex)}>
            Sync Rates
          </button>
        );
      }
      case 'tripDate':
      case 'tripTime':
      case 'rosterTripId':
      case 'location':
      case '_companyRate':
      case '_companyGuardPrice':
      case '_companyPenalty':
      case '_driverRate':
      case '_driverGuardPrice':
        return <div style={{ width: '100%', height: '100%', padding: '8px' }}>{value}</div>;
      case 'tripType':
        return <div style={{ width: '100%', height: '100%', padding: '8px' }}>{value == 1 ? 'Pickup' : 'Drop'}</div>;

      case '_zoneName': {
        return (
          <select
            value={JSON.stringify(value)} // Assuming value is the full zone object
            onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
            style={{
              width: '100%',
              height: '100%',
              border: value?._id ? '1px solid #ccc' : '1px solid red', // Red border if value._id is missing
              backgroundColor: value?._id ? 'white' : '#fdd' // Light red background if value._id is missing
            }}
          >
            {value && (
              <option key={value._id} value={JSON.stringify(value)}>
                {value.zoneName}
              </option>
            )}
            {zoneInfo.map((zone) => (
              <option key={zone._id} value={JSON.stringify(zone)}>
                {zone.zoneName}
              </option>
            ))}
          </select>
        );
      }

      case '_zoneType': {
        return (
          <select
            value={JSON.stringify(value)} // Assuming value is the full zoneType object
            onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
            style={{
              width: '100%',
              height: '100%',
              border: value?._id ? '1px solid #ccc' : '1px solid red', // Red border if value._id is missing
              backgroundColor: value?._id ? 'white' : '#fdd' // Light red background if value._id is missing
            }}
          >
            {value && (
              <option key={value._id} value={JSON.stringify(value)}>
                {value.zoneTypeName}
              </option>
            )}
            {row._zoneName.zoneType
              .filter((zone) => zone._id !== value._id) // Exclude selected value if needed
              .map((zone) => (
                <option key={zone._id} value={JSON.stringify(zone)}>
                  {zone.zoneTypeName}
                </option>
              ))}
          </select>
        );
      }

      case '_cab': {
        return (
          <select
            value={JSON.stringify(value)} // Assuming value is the full zone object
            onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
            style={{
              width: '100%',
              height: '100%',
              border: value?._id ? '1px solid #ccc' : '1px solid red', // Red border if value._id is missing
              backgroundColor: value?._id ? 'white' : '#fdd' // Light red background if value._id is missing
            }}
          >
            {value && (
              <option key={value._id} value={JSON.stringify(value)}>
                {value.vehicleNumber}
              </option>
            )}
            {row._cab_options.map((cab) => (
              <option key={cab._id} value={JSON.stringify(cab)}>
                {cab.vehicleNumber}
              </option>
            ))}
          </select>
        );
      }
      case '_driver': {
        // console.log({ value });
        // console.log({ row });
        return (
          <select
            value={JSON.stringify(value)} // Assuming value is the full driver object
            onChange={(e) => handleChange(rowIndex, key, JSON.parse(e.target.value))}
            style={{
              width: '100%',
              height: '100%',
              border: value?._id ? '1px solid #ccc' : '1px solid red', // Red border if value._id is missing
              backgroundColor: value?._id ? 'white' : '#fdd' // Light red background if value._id is missing
            }}
          >
            {value._id && (
              <option key={value._id} value={JSON.stringify(value)}>
                {value._id ? value.userName : 'No Drivers'}
              </option>
            )}
            {row.driverOptionsArray.length === 0
              ? row._drivers_options.map((driver) => (
                  <option key={driver._id} value={JSON.stringify(driver)}>
                    {driver.userName}
                  </option>
                ))
              : row.driverOptionsArray.map((driver) => (
                  <option key={driver._id} value={JSON.stringify(driver)}>
                    {driver.userName}
                  </option>
                ))}
          </select>
        );
      }

      case '_guard':
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(rowIndex, key, e.target.checked)}
              style={{
                margin: 0,
                transform: 'scale(1.5)' // Scales the checkbox size by 1.5x
                // Alternatively, you can directly adjust the width and height:
                // width: '30px',
                // height: '30px',
              }}
            />
          </div>
        );

      case '_driverPenalty':
      case '_additional_rate': {
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(rowIndex, key, e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textAlign: 'right' // Align text to the right for numbers
            }}
          />
        );
      }

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
    '_cab',
    '_driver',
    '_guard',
    'sync',
    '_companyRate',
    '_companyGuardPrice',
    '_companyPenalty',
    '_driverRate',
    '_driverGuardPrice',
    '_driverPenalty',
    '_additional_rate'
  ];
  const headerMap = {
    tripDate: 'Date',
    tripTime: 'Time',
    rosterTripId: 'Trip ID',
    tripType: 'Type',
    _zoneName: 'Zone Name',
    _zoneType: 'Zone Type',
    location: 'Location',
    _cab: 'Vehicle',
    _driver: 'Driver',
    _guard: 'Guard',
    sync: 'Sync',
    _companyRate: 'Company Rate',
    _companyGuardPrice: 'Company Guard Rate',
    _companyPenalty: 'Company Penalty Rate',
    _driverRate: 'Driver Rate',
    _driverGuardPrice: 'Driver Guard Rate',
    _driverPenalty: 'Driver Penalty Rate',
    _additional_rate: 'Addon Rate'
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {`Trips Ready: ${payload1.length}`}
            </Typography>
            <Button sx={{ ml: 2, flex: 0.2 }} color="secondary" variant="contained" onClick={bulkSync}>
              Sync
            </Button>
            <Button sx={{ ml: 2, flex: 0.2 }} color="success" variant="contained" onClick={generateTrips}>
              Save
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
                    backgroundColor: rowIndex % 2 === 0 ? '#e0e0e0' : '#ffffff' // Alternate row colors
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
