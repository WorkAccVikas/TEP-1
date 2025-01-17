import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// third-party
import * as yup from 'yup';
import { Formik, Form } from 'formik';

// project-imports
import IconButton from 'components/@extended/IconButton';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

// assets
import { Send } from 'iconsax-react';
import { Checkbox, Typography } from '@mui/material';
import { formatIndianDate } from 'utils/dateFormat_dbTOviewDate';

// ==============================|| EDITABLE CELL ||============================== //



const updateObjectValue = (obj, path, newValue) => {
  // Split the path into keys
  const keys = path.split('.');

  // Create a copy of the original object to avoid mutation
  const newObj = { ...obj };

  // Reduce the keys to find the target object for updating
  const lastKey = keys.pop();
  const target = keys.reduce((acc, key) => {
      // Create nested objects if they do not exist
      if (!acc[key]) {
          acc[key] = {};
      }
      return acc[key];
  }, newObj);

  // Set the new value at the last key
  target[lastKey] = newValue;

  return newObj; // Return the new object with the updated value
};


export default function CellEditable({ getValue: initialValue, row, column: { id, columnDef }, table }) {
  const [value, setValue] = useState(initialValue);
  const [showSelect, setShowSelect] = useState(false);
  const { original, index } = row;
  const onChange = (e) => {
    setValue(e.target?.value);
  };
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
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

  switch (columnDef.dataType) {
    case 'plain_text':
      element = (
        <>
          <Formik
            initialValues={{
              date: value
            }}
            enableReinitialize
            validationSchema={userInfoSchema}
            onSubmit={() => {}}
          >
            {() => (
              <Typography variant="body1">
                {value} {/* Adjust the date formatting function as needed */}
              </Typography>
            )}
          </Formik>
        </>
      );
      break;
    case 'date':
      element = (
        <>
          <Formik
            initialValues={{
              date: value
            }}
            enableReinitialize
            validationSchema={userInfoSchema}
            onSubmit={() => {}}
          >
            {() => (
              <Typography variant="body1">
                {formatIndianDate(value)} {/* Adjust the date formatting function as needed */}
              </Typography>
            )}
          </Formik>
        </>
      );
      break;
    case 'zoneName':
      element = (
        <>
          <Formik
            initialValues={{
              zoneName: value
            }}
            enableReinitialize
            validationSchema={userInfoSchema}
            onSubmit={() => {}}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <TextField
                  fullWidth
                  value={values.zoneName}
                  id={`${index}-${id}`}
                  name="zoneName"
                  onChange={(e) => {
                    handleChange(e);
                    onChange(e);
                  }}
                  onBlur={handleBlur}
                  error={touched.zoneName && Boolean(errors.zoneName)}
                  helperText={touched.zoneName && errors.zoneName && errors.zoneName}
                  sx={{
                    '& .MuiOutlinedInput-input': { py: 0.75, px: 1, minWidth: { xs: 100 } },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                />
              </Form>
            )}
          </Formik>
        </>
      );
      break;
    case 'checkbox':
      element = (
        <Formik
          initialValues={{
            guard: value === 1 // Convert 1 to true and 0 to false
          }}
          enableReinitialize
          onSubmit={() => {}}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <Checkbox
                id={`${index}-${id}`}
                name="guard"
                checked={values.guard} // Checked is boolean, true for 1, false for 0
                onChange={(e) => {
                  handleChange(e); // Handle Formik changes
                  onChange(e.target.checked ? 1 : 0); // Send 1 for true, 0 for false
                }}
                onBlur={handleBlur}
                color="primary"
              />
            </Form>
          )}
        </Formik>
      );
      break;
    case 'companyRate':
      element = (
        <Formik
          initialValues={{
            companyRate: value // Convert 1 to true and 0 to false
          }}
          enableReinitialize
          onSubmit={() => {}}
        >
          {() => {
            return <Typography variant="body1">{value?.companyRate}</Typography>;
          }}
        </Formik>
      );
      break;

    case 'text':
      element = (
        <>
          <Formik
            initialValues={{
              userInfo: value
            }}
            enableReinitialize
            validationSchema={userInfoSchema}
            onSubmit={() => {}}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <TextField
                  fullWidth
                  value={values.userInfo}
                  id={`${index}-${id}`}
                  name="userInfo"
                  onChange={(e) => {
                    handleChange(e);
                    onChange(e);
                  }}
                  onBlur={handleBlur}
                  error={touched.userInfo && Boolean(errors.userInfo)}
                  helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                  sx={{
                    '& .MuiOutlinedInput-input': { py: 0.75, px: 1, minWidth: { xs: 100 } },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                />
              </Form>
            )}
          </Formik>
        </>
      );
      break;
    case 'select':
      element = (
        <>
          <Select
            labelId="editable-select-status-label"
            // sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 }, svg: { display: 'none' } }}
            id="editable-select-status"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            <MenuItem value="Complicated">
              <Chip color="error" label="Complicated" size="small" variant="light" />
            </MenuItem>
            <MenuItem value="Relationship">
              <Chip color="success" label="Relationship" size="small" variant="light" />
            </MenuItem>
            <MenuItem value="Single">
              <Chip color="info" label="Single" size="small" variant="light" />
            </MenuItem>
          </Select>
        </>
      );
      break;
    case 'progress':
      element = (
        <>
          {!showSelect ? (
            <Box onClick={() => setShowSelect(true)}>
              <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
            </Box>
          ) : (
            <>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, minWidth: 120 }}>
                <Slider
                  value={value}
                  min={0}
                  max={100}
                  step={1}
                  onBlur={onBlur}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="non-linear-slider"
                />
                <Tooltip title={'Submit'}>
                  <IconButton color="success" onClick={() => setShowSelect(false)}>
                    <Send variant="Outline" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </>
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

CellEditable.propTypes = { getValue: PropTypes.func, row: PropTypes.object, column: PropTypes.object, table: PropTypes.object };
