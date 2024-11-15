import { TextField, Select, MenuItem, Autocomplete } from '@mui/material';

import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker, TimeField } from '@mui/x-date-pickers';

const CellEdit = ({
  value: initialValue,
  row: { index, original },
  column: { id, dataType, properties, editableCondition },
  updateData
}) => {
  // const [value, setValue] = useState(initialValue);
  const [value, setValue] = useState(() =>
    dataType === 'date' ? new Date(initialValue) : dataType === 'time' ? new Date(initialValue * 1000) : initialValue
  );

  const handleInputChange = (e, newValue) => {
    if (dataType === 'autoComplete') {
      // console.log('handleInputChange', newValue);
      setValue(newValue); // for autocomplete
    } else if (dataType === 'date') {
      // console.log('date = ', e);
      setValue(e);
      updateData(index, id, e);
      // handleBlur();
    } else if (dataType === 'time') {
      // console.log('time = ', e);
      setValue(e);
      updateData(index, id, e);
    } else {
      const { value, type } = e.target;
      setValue(type === 'number' ? Number(value) : value);
    }
  };

  const handleBlur = () => {
    // console.log('handleBlur');
    updateData(index, id, value); // Update the table data when editing is complete
  };

  useEffect(() => {
    setValue(dataType === 'date' ? new Date(initialValue) : dataType === 'time' ? new Date(initialValue * 1000) : initialValue); // Reset the value when the row data changes
  }, [initialValue]);

  const renderValue = (selected) => {
    const selectedOption = properties.options.find((option) => option.value === selected);
    return selectedOption ? selectedOption.label : selected; // Ensure the label is returned
  };

  // Check if the field is editable based on the condition
  const isEditable = editableCondition ? editableCondition(original) : true;
  let element;
  let userInfoSchema;
  switch (id) {
    case 'tripType':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().required('Trip Type is required')
      });
      break;
    default:
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }

  switch (dataType) {
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
            {({ values, handleChange, handleBlur: formikHandleBlur, errors, touched }) => (
              <Form>
                <TextField
                  value={values.userInfo}
                  id={`${index}-${id}`}
                  name="userInfo"
                  disabled={!isEditable}
                  noOptionsText="No options available" // Text to show when options are empty
                  onChange={(e) => {
                    handleChange(e); // Formik handle change
                    handleInputChange(e); // Update local state
                  }}
                  onBlur={(e) => {
                    formikHandleBlur(e); // Formik handle blur
                    handleBlur(); // Commit the change to parent
                  }}
                  error={touched.userInfo && Boolean(errors.userInfo)}
                  helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                  sx={{
                    '& .MuiOutlinedInput-input': {
                      py: 0.75,
                      px: 1,
                      width: id === 'email' ? 150 : 80
                    },
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
            sx={{
              boxShadow: 'none',
              '.MuiOutlinedInput-notchedOutline': { border: 0 },
              svg: { display: 'none' }
            }}
            id="editable-select-status"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            renderValue={renderValue}
          >
            {properties.options.length === 0 ? (
              <MenuItem disabled>{properties.noDataText || 'No Data'}</MenuItem>
            ) : (
              properties.options.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))
            )}
          </Select>
        </>
      );
      break;

    case 'number':
      element = (
        <TextField
          type="number"
          id={`${index}-${id}`}
          name="userInfo"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          // disabled
          // disabled={original.guard === 0}
          disabled={!isEditable}
          sx={{
            '& .MuiOutlinedInput-input': {
              py: 0.75,
              px: 1,
              width: id === 'email' ? 150 : 80
            },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }}
        />
      );
      break;

    case 'autoComplete':
      element = (
        <Autocomplete
          value={value}
          options={properties.options}
          // getOptionLabel={(option) => option[properties.displayName] || ""}
          getOptionLabel={(option) => {
            // console.log('Type = ', typeof option, 'Option = ', option);
            // return option[properties.displayName] || "";
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option[properties.displayName] || ''; // Display zoneName in dropdown
          }}
          filterOptions={(options, params) => {
            // console.log('Params', params);
            const filtered = options.filter((option) =>
              option[properties.displayName]?.toLowerCase().includes(params.inputValue?.toLowerCase())
            );

            return filtered;
          }}
          isOptionEqualToValue={(option, value) => {
            // console.log("🚀 ~ isOptionEqualToValue ~ value", value);
            // console.log("opt value", option);
            const result = option[properties.displayName] === value;
            // console.log("result", result);
            return result;
            // return option[properties.displayName] === value;
          }}
          onChange={handleInputChange}
          onBlur={handleBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={properties.placeholder || 'Select Option Placeholder'}
              // sx={{
              //   "& .MuiOutlinedInput-input": {
              //     py: 0.75,
              //     px: 1,
              //   },
              //   "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              // }}

              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0
                },
                svg: { display: 'none' },
                minWidth: 150
              }}
            />
          )}
          disableClearable
          freeSolo
        />
      );
      break;

    case 'date':
      element = (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            format="MM/dd/yyyy"
            value={value}
            onChange={handleInputChange}
            sx={{
              '& .MuiOutlinedInput-input': {
                minWidth: 150
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          />
        </LocalizationProvider>
      );
      break;

    case 'time':
      element = (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* <TimePicker
            value={value}
            onChange={handleInputChange}
            sx={{
              "& .MuiOutlinedInput-input": {
                minWidth: 150,
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          /> */}
          <TimeField
            value={value}
            onChange={handleInputChange}
            sx={{
              '& .MuiOutlinedInput-input': {
                minWidth: 150
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          />
        </LocalizationProvider>
      );
      break;

    default:
      element = <span></span>;
      break;
  }

  return element;
};

export default CellEdit;
