import PropTypes from 'prop-types';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Field } from 'formik';
import { useMemo } from 'react';

const FormikSelectField1 = ({
  label,
  name,
  helperText,
  options,
  fullWidth = true, // full width
  placeHolderText = 'Select', // (optional) : When you want to use display 1st MenuItem when Select is filled
  outlined = false, // (optional) : outlined style for Select is disabled by default
  onChange, // (optional) : Pass the onChange handler if you want to pass onChange as you want to do more work other than saving value in state
  ...props
}) => {
  const OPTION_OBJECT = useMemo(() => {
    return options.reduce((acc, option) => {
      if (option.value !== '') {
        acc[option.value] = option.label;
      }
      return acc;
    }, {});
  }, [options]);

  const handleChange = (event, form) => {
    if (typeof onChange === 'function') {
      // DESC : If you pass onChange then it will work like save value in state and other things based on your requirement
      onChange(event);
    }
    // DESC : If you don't pass onChange then it will work like save value in state
    form.setFieldValue(name, event.target.value);
  };

  const labelId = outlined ? `${name}-label` : undefined;

  return (
    <FormControl fullWidth={fullWidth}>
      {outlined && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
      <Field name={name}>
        {({ field, form }) => (
          <Select
            {...field}
            labelId={labelId}
            displayEmpty={!outlined}
            renderValue={
              !outlined &&
              ((selected) => {
                if (selected === '') {
                  return <em>{placeHolderText}</em>;
                }
                return OPTION_OBJECT[selected];
              })
            }
            onChange={(event) => handleChange(event, form)}
            {...props}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      </Field>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

FormikSelectField1.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  options: PropTypes.array.isRequired,
  fullWidth: PropTypes.bool,
  placeHolderText: PropTypes.string,
  outlined: PropTypes.bool,
  onChange: PropTypes.func
};

export default FormikSelectField1;

/** DESC :
 *  - CASE 1 :
 *    - by default Select is filled
 */
