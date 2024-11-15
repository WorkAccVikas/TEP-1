import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const DebouncedSearch = ({ search, onSearchChange, handleSearch }) => {
  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => {
          handleSearch(e.target.value);
          onSearchChange(e.target.value);
        }} // Call the parent's handler
      />
    </div>
  );
};

DebouncedSearch.propTypes = {
  search: PropTypes.string.isRequired, // search value must be a string
  onSearchChange: PropTypes.func.isRequired, // function for parent search change handler
  handleSearch: PropTypes.func.isRequired // function for debounce handling
};

export default DebouncedSearch;

/** SUMMARY :
 *  - TextField with debounce
 */
