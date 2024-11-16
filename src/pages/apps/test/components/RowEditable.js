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
import { InfoCircle } from 'iconsax-react';

// project-imports
// ==============================|| EDITABLE ROW ||============================== //

function getCompanyRate(data, zoneNameId, vehicleTypeId, zoneTypeId = null, guard, dualTrip) {
  // Check for missing required arguments
  if (!data || !zoneNameId || !vehicleTypeId || guard === undefined || dualTrip === undefined) {
    console.warn('Missing required arguments for getCompanyRate');
    return { guardPrice: 0, companyRate: 0 }; // or return null;
  }

  let guardPrice;
  let companyRate;

  // Filter to find the matching object
  const obj = data.filter(
    (item) =>
      item.zoneNameID._id === zoneNameId &&
      item.VehicleTypeName._id === vehicleTypeId &&
      (zoneTypeId === null || (item.zoneTypeID && item.zoneTypeID._id === zoneTypeId))
  );

  if (obj.length === 0) {
    // No matching object found
    console.warn('No matching data found for the specified criteria');
    return { guardPrice: 0, companyRate: 0 };
  }

  // Determine guardPrice based on the guard parameter
  guardPrice = guard === 1 ? obj[0].guardPrice || 0 : 0;

  // Determine companyRate based on the dualTrip parameter
  companyRate = dualTrip === 0 ? obj[0].cabAmount.amount || 0 : obj[0].dualTripAmount.amount || 0;

  return { guardPrice, companyRate };
}

export default function RowEditable({ getValue: initialValue, row, column, table }) {
  const [value, setValue] = useState(initialValue);
  const tableMeta = table.options.meta;
  const { original, index } = row;
  const { id, columnDef } = column;
  const { _zoneName_options, _vehicleType_options, _drivers_options, _company_Rate } = original;
  console.log({ original });

  const { guardPrice, companyRate } = getCompanyRate(
    _company_Rate,
    original._zoneName._id,
    original._vehicleType._id,
    original._zoneType._id,
    original._guard_1,
    original._dualTrip_1
  );
  const onChange = (e) => {
    if (id === '_guard_1' || id === '_dual_trip') {
      setValue(e.target.checked ? 1 : 0);
    } else {
      setValue(e.target?.value);
    }
    console.log({ original });
  };

  const onBlur = () => {
    tableMeta.updateData(row.index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let element;
  let userInfoSchema;
  switch (id) {
    case 'email':
      userInfoSchema = yup.object().shape({
        userInfo: yup.string().email('Enter valid email ').required('Email is a required field')
      });
      break;
    case 'age':
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .number()
          .typeError('Age must be number')
          .required('Age is required')
          .min(18, 'You must be at least 18 years')
          .max(65, 'You must be at most 65 years')
      });
      break;
    case 'visits':
      userInfoSchema = yup.object().shape({
        userInfo: yup.number().typeError('Visits must be number').required('Required')
      });
      break;
    default:
      userInfoSchema = yup.object().shape({
        userInfo: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }

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
              onChange={(e) => setValue(e.target.value)}
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
