import React, { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import axiosServices from 'utils/axios';

const VendorSelection = ({ sx, value, setSelectedOptions }) => {
  const [options, setOptions] = useState([]); // Stores fetched options
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [open, setOpen] = useState(false); // Tracks dropdown open state
  const [query, setQuery] = useState(''); // Tracks input query
  const [cache, setCache] = useState({}); // Cache for query results

  // Fetch default options when dropdown is opened
  useEffect(() => {
    const fetchDefaultOptions = async () => {
      if (cache.default) {
        setOptions(cache.default);
        return;
      }

      setLoading(true);
      try {
        const response = await axiosServices.get('/vendor/list?page=1&limit=10');
        const vendors = response.data.data.results;

        setOptions(vendors);
        setCache((prevCache) => ({ ...prevCache, default: vendors })); // Cache default results
      } catch (error) {
        console.error('Error fetching default options:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDefaultOptions();
    }
  }, [open, cache.default]);

  // Fetch options based on query with caching
  useEffect(() => {
    if (!query) return;

    if (cache[query]) {
      setOptions(cache[query]); // Use cached results if available
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await axiosServices.get(`/vendor/getVendorByName?filter=${query}&page=1&limit=10`);
        const vendors = response.data.data.result;

        setOptions(vendors);
        setCache((prevCache) => ({ ...prevCache, [query]: vendors })); // Cache query results
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchOptions, 300); // Debounce API call
    return () => clearTimeout(debounceFetch); // Cleanup debounce timer
  }, [query, cache]);

  return (
    <Grid item xs={12}>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={options}
        disableCloseOnSelect
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => option.vendorCompanyName}
        onInputChange={(event, newInputValue) => setQuery(newInputValue)}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue || []); // Set the selected options
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option.vendorCompanyName}
          </li>
        )}
        renderInput={(params) => <TextField {...params} placeholder="Select Vendor/Vendors" />}
        sx={{
          '& .MuiOutlinedInput-root': { p: 1 },
          '& .MuiAutocomplete-tag': {
            bgcolor: 'primary.lighter',
            border: '1px solid',
            borderColor: 'primary.light',
            '& .MuiSvgIcon-root': {
              color: 'primary.main',
              '&:hover': { color: 'primary.dark' }
            }
          },
          ...sx // Allow custom styles via props
        }}
      />
    </Grid>
  );
};

export default VendorSelection;
