import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useField, useFormikContext } from 'formik';

const FormikAutocomplete = ({
  name,
  options,
  getOptionLabel,
  renderOption,
  placeholder,
  fullWidth = true,
  autoHighlight = true,
  value = null,
  saveValue,
  otherValue,
  extraWork,
  disableClearable = false,
  defaultValue = '',
  ...props
}) => {
  const { setFieldValue, values } = useFormikContext();
  // eslint-disable-next-line no-unused-vars
  const [field, meta] = useField(name);

  return (
    <>
      <Autocomplete
        id={name}
        value={value}
        onChange={(event, value) => {
          setFieldValue(name, value?.[saveValue] || defaultValue);
          extraWork?.(value?.[otherValue] || defaultValue);
        }}
        options={options}
        fullWidth={fullWidth}
        autoHighlight={autoHighlight}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option) => {
          const result = option[saveValue] === values[name];
          return result;
        }}
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={Boolean(meta.touched && meta.error)}
            helperText={meta.touched && meta.error}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off' // disable autocomplete and autofill
            }}
          />
        )}
        disableClearable={disableClearable}
        {...props}
      />
      {/* {touched[name] && errors[name] ? (
        <div className="error">{errors[name]}</div>
      ) : null} */}
    </>
  );
};

FormikAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  renderOption: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
  autoHighlight: PropTypes.bool,
  value: PropTypes.object,
  saveValue: PropTypes.string.isRequired,
  otherValue: PropTypes.string,
  extraWork: PropTypes.func,
  disableClearable: PropTypes.bool,
  defaultValue: PropTypes.any
};

export default FormikAutocomplete;
