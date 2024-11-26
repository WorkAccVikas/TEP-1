import React, { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import axiosServices from 'utils/axios';

const VehicleTypeSelection = ({ sx, value, setSelectedOptions }) => {
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
        const response = await axiosServices.get('/vehicleType');
        const vendors = response.data.data;
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

  // Log selected options for debugging
  useEffect(() => {
    console.log('Selected Options:', value);
  }, [value]);
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
        getOptionLabel={(option) => option.vehicleTypeName}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue || []); // Set the selected options
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option.vehicleTypeName}
          </li>
        )}
        renderInput={(params) => <TextField {...params} placeholder="Select VehicleType" />}
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

export default VehicleTypeSelection;
