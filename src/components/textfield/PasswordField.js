import PropTypes from 'prop-types';
import { useState } from 'react';
import { OutlinedInput, InputAdornment, IconButton, FormControl, FormHelperText } from '@mui/material';
import { Eye, EyeSlash } from 'iconsax-react';
import { useField, useFormikContext } from 'formik';

const PasswordField = ({ name, placeholder, ...others }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { getFieldProps, touched, errors } = useFormikContext();
  const [field, meta] = useField(name);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormControl fullWidth error={Boolean(touched[name] && errors[name])} variant="outlined">
      <OutlinedInput
        {...field}
        {...others}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Enter password .......'}
        {...getFieldProps(name)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" color="secondary">
              {showPassword ? <Eye /> : <EyeSlash />}
            </IconButton>
          </InputAdornment>
        }
      />
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string
};

export default PasswordField;
