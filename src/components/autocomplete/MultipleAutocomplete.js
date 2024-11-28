import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const MultipleAutocomplete = ({
  options = [],
  label = 'Select Options',
  placeholder = 'Select...',
  value = [],
  onChange,
  getOptionLabel,
  renderOption,
  isOptionEqualToValue,
  ...props
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        {...props}
        options={options}
        value={value}
        onChange={onChange}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
      />
    </Box>
  );
};

MultipleAutocomplete.propTypes = {
  options: PropTypes.array,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  renderOption: PropTypes.func.isRequired,
  isOptionEqualToValue: PropTypes.func.isRequired
};

export default MultipleAutocomplete;
