import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';

const FormikTextField = ({
  id,
  label,
  placeholder,
  type = 'text',
  variant = 'outlined',
  fullWidth = false,
  inputProps = {},
  inputRef,
  autoFocus = false,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <TextField
        {...field}
        {...props}
        id={id}
        label={label}
        placeholder={placeholder}
        type={type}
        variant={variant}
        fullWidth={fullWidth}
        error={Boolean(meta.touched && meta.error)}
        helperText={meta.touched && meta.error}
        inputProps={inputProps}
        inputRef={inputRef}
        autoFocus={autoFocus}
      />

      {/* {meta.touched && meta.error && (
        <FormHelperText error id="personal-last-name-helper">
          {meta.error}
        </FormHelperText>
      )} */}
    </>
  );
};

FormikTextField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  fullWidth: PropTypes.bool,
  inputProps: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  autoFocus: PropTypes.bool
};

export default FormikTextField;
