import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'utils/axios';
import debounce from 'lodash/debounce';

// Memoize the component to prevent unnecessary re-renders
const ConfigurableAutocomplete = React.memo(
  ({
    apiUrl, // API endpoint for fetching search results
    searchParam = 'search', // Configurable search query parameter (e.g., 'query', 'term')
    onChange, // Callback to handle selected item
    label = 'Search', // Default label for the input field
    maxItems = 10, // Maximum number of items to display in the dropdown
    optionLabelKey = 'name', // Key for option labels, default to 'name'
    debounceDelay = 500, // Debounce delay in milliseconds
    noOptionsText = 'No Options', // Configurable no options message
    placeHolderText = 'Type to search', // Default placeholder text
    ...props
  }) => {
    // console.log('ConfigurableAutocomplete Render .................');
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

    // Ref to store the timeout ID
    const debounceTimeout = useRef(null);

    // Debounced API call to fetch search results
    const fetchOptions = useCallback(
      debounce(async (searchText) => {
        if (!searchText.trim()) {
          setOptions([]); // Do not clear options until API call is made
          setHasSearched(false); // Reset search state
          setLoading(false);
          return;
        }

        setLoading(true);
        setHasSearched(true); // Mark that a search has been performed

        try {
          const response = await axios.get(apiUrl, {
            params: { [searchParam]: searchText } // Use the configurable search parameter
          });

          // console.log('response.data = ', response.data);

          if (response.status === 200) {
            const results = response.data.data.result.slice(0, maxItems); // Limit displayed options based on maxItems
            setOptions(results.length > 0 ? results : []); // Set options or empty array if no results
          }
        } catch (error) {
          console.error('Error fetching autocomplete options:', error);
          setOptions([]); // Clear options in case of error
        } finally {
          setLoading(false);
        }
      }, debounceDelay),
      [apiUrl, maxItems, searchParam, debounceDelay]
    );

    // Trigger fetching options with debouncing when input changes
    const handleInputChange = (value) => {
      setInputValue(value);

      if (debounceTimeout.current) {
        setLoading(true);
        clearTimeout(debounceTimeout.current); // Clear the previous timeout
      }

      debounceTimeout.current = setTimeout(() => {
        fetchOptions(value);
      }, debounceDelay);
    };

    // Cleanup on component unmount
    useEffect(() => {
      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current); // Clear the timeout when component unmounts
        }
      };
    }, []);

    return (
      <Autocomplete
        open={open}
        onOpen={() => {
          setOpen(true);
          setOptions([]); // Clear options on focus
        }}
        onClose={() => setOpen(false)}
        onChange={(event, value) => onChange(value)} // Pass selected value to parent
        getOptionLabel={(option) => option[optionLabelKey] || ''} // Dynamically fetch label from options
        options={options}
        loading={loading}
        noOptionsText={!loading && hasSearched ? noOptionsText : placeHolderText} // Only show no options text if search was performed
        {...props}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            onChange={(e) => handleInputChange(e.target.value)} // Capture search input with debounce
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    );
  }
);

ConfigurableAutocomplete.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  searchParam: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  maxItems: PropTypes.number,
  optionLabelKey: PropTypes.string,
  debounceDelay: PropTypes.number,
  noOptionsText: PropTypes.string,
  placeHolderText: PropTypes.string
};

export default ConfigurableAutocomplete;

/** SUMMARY :
 *  - Reusable Component of Autocomplete
 *  - see One.jsx
 */
