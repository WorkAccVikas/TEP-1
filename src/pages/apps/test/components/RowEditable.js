import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// third-party
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { Checkbox, FormHelperText, IconButton, Tooltip, Typography } from '@mui/material';
import { formatIndianDate } from 'utils/dateFormat_dbTOviewDate';
import axiosServices from 'utils/axios';
import {
  ArchiveTick,
  ArrowDown2,
  CardSend,
  CloudAdd,
  CloudConnection,
  Code,
  Code1,
  DirectDown,
  DocumentCloud,
  Dropbox,
  Edit2,
  FolderCloud,
  Illustrator,
  Import,
  ImportSquare,
  InfoCircle,
  ReceiveSquare,
  ReceiveSquare2,
  Send
} from 'iconsax-react';

// project-imports
// ==============================|| EDITABLE ROW ||============================== //

export default function RowEditable({ getValue: initialValue, row, column, table }) {
  const [value, setValue] = useState(initialValue);
  const tableMeta = table.options.meta;
  const { original, index } = row;
  const { id, columnDef } = column;
  const { _zoneName_options, _vehicleType_options, _drivers_options, _company_Rate } = original;

  const onChange = async (e) => {
    // Destructure with fallback values
    const newValue = id === '_guard_1' || id === '_dual_trip' ? (e.target.checked ? 1 : 0) : e.target?.value;

    // Update the value in state
    setValue(newValue);

    // Extract the necessary values
    const {
      companyID: { _id: companyID } = {},
      _zoneName: { _id: zoneNameId } = {},
      _zoneType: { _id: zoneTypeId } = {},
      _vehicleType: { _id: vehicleTypeId } = {},
      _driver: { _id: driverId } = {},
      _dual_trip = 0, // Default to 0
      _guard_1 = 0 // Default to 0
    } = original;

    console.log({ companyID, zoneNameId, zoneTypeId, vehicleTypeId, driverId, _dual_trip, _guard_1 });
    console.log({ id });
    console.log({ original });

    // Check if the change is in the fields that require an API call
    const isRelevantId = ['_zoneName', '_zoneType', '_vehicleType', '_driver'].includes(id);

    // Store fetched values in state to be used for reassigning prices later
    let apiResponseData = null; // This will hold the response data for later use

    if (isRelevantId && companyID && zoneNameId && vehicleTypeId && driverId && zoneTypeId) {
      try {
        // Prepare the payload without _dual_trip and _guard_1
        const payload = {
          companyID,
          vehicleTypeID: vehicleTypeId,
          zoneNameID: zoneNameId,
          zoneTypeID: zoneTypeId,
          driverId
        };

        const response = await axiosServices.post(
          '/tripData/amount/by/driver/id',
          //    {
          //   data: payload
          // }
          {
            data: {
              companyID: '66e010556265e5aad31f9b40',
              vehicleTypeID: '66c57911777b0e58991125f3',
              zoneNameID: '6683e597643aeaa0469223a3',
              zoneTypeID: '6683e5c6643aeaa0469223b3',
              driverId: '66ed052952b00bf1e93a4abb'
            }
          }
        );

        console.log('API Response:', response);

        if (response.data.success) {
          // Store the data in apiResponseData for later use
          apiResponseData = response.data.data;

          const {
            driverGuardPrice,
            driverAmount,
            driverDualAmount,
            vendorGuardPrice,
            vendorAmount,
            vendorDualAmount,
            companyGuardPrice,
            companyAmount,
            companyDualAmount
          } = apiResponseData;

          // Perform the assignment logic based on _dual_trip and _guard_1 values
          const _companyRate = _dual_trip === 0 ? companyAmount ?? 0 : companyDualAmount ?? 0;
          const _guard_price_1 = _guard_1 === 0 ? 0 : companyGuardPrice ?? 0;
          const _driverRate_or_vendorRate =
            _dual_trip === 0 ? driverAmount ?? vendorAmount ?? 0 : driverDualAmount ?? vendorDualAmount ?? 0;

          console.log({ _companyRate, _guard_price_1, _driverRate_or_vendorRate });

          // Update the original object with the calculated values
          original._companyRate = _companyRate;
          original._guard_price_1 = _guard_price_1;
          original._driverRate_or_vendorRate = _driverRate_or_vendorRate;
        }
      } catch (error) {
        console.error('API Error:', error.message || error);
      }
    }

    // Handle price reassignment for _dual_trip and _guard_1 changes
    if (id === '_dual_trip' || id === '_guard_1') {
      if (apiResponseData) {
        // Use the previously fetched response data to reassign prices
        const { companyGuardPrice, companyAmount, companyDualAmount, driverAmount, driverDualAmount, vendorAmount, vendorDualAmount } =
          apiResponseData;

        const _companyRate = _dual_trip === 0 ? companyAmount ?? 0 : companyDualAmount ?? 0;
        const _guard_price_1 = _guard_1 === 0 ? 0 : companyGuardPrice ?? 0;
        const _driverRate_or_vendorRate = _dual_trip === 0 ? driverAmount ?? vendorAmount ?? 0 : driverDualAmount ?? vendorDualAmount ?? 0;

        console.log({ _companyRate, _guard_price_1, _driverRate_or_vendorRate });

        // Update the original object with reassigned values
        original._companyRate = _companyRate;
        original._guard_price_1 = _guard_price_1;
        original._driverRate_or_vendorRate = _driverRate_or_vendorRate;
      } else {
        console.log('Error: API response data not available for price reassignment');
      }
    }
  };

  const onBlur = () => {
    tableMeta.updateData(row.index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let element;

  const isEditable = tableMeta?.selectedRow[row.id];

  switch (columnDef.dataType) {
    case 'text':
      element = (
        <>
          {isEditable ? (
            <>
              <Formik
                initialValues={{
                  _penalty_1: value
                }}
                enableReinitialize
                validationSchema={userInfoSchema}
                onSubmit={() => {}}
              >
                {({ values, handleChange, handleBlur, errors, touched }) => (
                  <Form>
                    <TextField
                      value={values._penalty_1}
                      id={`${id}`}
                      name="_penalty_1"
                      onChange={(e) => {
                        handleChange(e);
                        onChange(e);
                      }}
                      onBlur={handleBlur}
                      error={touched._penalty_1 && Boolean(errors._penalty_1)}
                      helperText={touched._penalty_1 && errors._penalty_1 && errors._penalty_1}
                      sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                    />
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            value
          )}
        </>
      );
      break;
    case 'zoneName':
      element = (
        <>
          {isEditable ? (
            <>
              {/* <FormHelperText>Without label</FormHelperText> */}
              <Select
                labelId="editable-select-label"
                sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                label="Company Rate"
                id="editable-select"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                renderValue={(selected) => selected?.zoneName || 'Select a zone'}
              >
                {_zoneName_options.map((zone) => {
                  return (
                    <MenuItem key={zone?._id} value={zone}>
                      <Typography>{zone.zoneName}</Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </>
          ) : (
            <Typography>
              {value?.zoneName}{' '}
              {!value._id && (
                <Tooltip title={'select Zone Name'}>
                  <IconButton size="small" color="error">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          )}
        </>
      );
      break;
    case 'zoneType':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={!original._zoneName?.zoneType}
              renderValue={(selected) => selected?.zoneTypeName || 'Select a zonetype'}
            >
              {original._zoneName.zoneType &&
                original._zoneName.zoneType.map((type) => {
                  return (
                    <MenuItem key={type?._id} value={type}>
                      <Typography>{type.zoneTypeName}</Typography>
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            <Typography>
              {value?.zoneTypeName}{' '}
              {!value?._id && (
                <Tooltip title={'select Zone type'}>
                  <IconButton size="small" color="info">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          )}
        </>
      );
      break;
    case 'vehicleType':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              displayEmpty
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              renderValue={(selected) => selected?.vehicleTypeName || 'Select a vehicleype'}
            >
              {_vehicleType_options.map((type) => {
                return (
                  <MenuItem key={type._id} value={type}>
                    <Typography>{type.vehicleTypeName}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            <Typography>
              {value?.vehicleTypeName}{' '}
              {!value._id && (
                <Tooltip title={'select vehicle type'}>
                  <IconButton size="small" color="error">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          )}
        </>
      );
      break;
    case 'driver':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              displayEmpty
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            >
              {_drivers_options.map((driver) => {
                return (
                  <MenuItem key={driver._id} value={driver}>
                    <Typography>{driver.userName}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            <Typography>
              {value?.userName}{' '}
              {!value._id && (
                <Tooltip title={'select Driver'}>
                  <IconButton size="small" color="error">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          )}
        </>
      );
      break;
    case 'cab':
      element = (
        <>
          {/* <Typography variant="body1">
            {original._driver.assignedVehicle ? original._driver.assignedVehicle.vehicleId.vehicleNumber : 'N/A'} 
          </Typography> */}
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={!original._driver.assignedVehicle}
            >
              <MenuItem value={original._driver.assignedVehicle ? original._driver.assignedVehicle.vehicleId : null}>
                <Typography>
                  {original._driver.assignedVehicle ? original._driver.assignedVehicle?.vehicleId?.vehicleNumber : 'N/A'}
                </Typography>
              </MenuItem>
            </Select>
          ) : (
            <Typography>
              {value?.vehicleNumber}{' '}
              {!value._id && (
                <Tooltip title={'select Driver'}>
                  <IconButton size="small" color="info">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          )}
        </>
      );
      break;
    case 'plain_text':
      element = (
        <>
          <Typography variant="body1">
            {value} {/* Display plain text */}
          </Typography>
        </>
      );
      break;
    case 'companyRate':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Company Rate"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;

    case 'driverVendorRate':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Driver Rate"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'penalty':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="penalty"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'additionalRate':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Additional Rate"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'guardPrice':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Guard Price"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
              disabled={!original._guard_1}
            />
          ) : (
            value
          )}
        </>
      );
      break;

    case 'date':
      element = (
        <>
          <Typography variant="body1">
            {formatIndianDate(value)} {/* Display formatted date */}
          </Typography>
        </>
      );
      break;

    case 'checkbox':
      element = (
        <>
          {isEditable ? (
            <Checkbox id={`checkbox`} name="checkbox" checked={value === 1} onChange={onChange} onBlur={onBlur} color="primary" />
          ) : (
            <Checkbox id={`${index}-${id}`} checked={value === 1} color="primary" disabled />
          )}
        </>
      );
      break;

    default:
      element = <span></span>;
      break;
  }

  return element;
}

RowEditable.propTypes = { getValue: PropTypes.func, row: PropTypes.object, column: PropTypes.object, table: PropTypes.object };
