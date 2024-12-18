import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, TextField, Checkbox, List, ListItem, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import debounce from 'lodash.debounce';
import axiosServices from 'utils/axios';

const ZoneSelection = ({ sx, value = [], setSelectedOptions }) => {
  const [options, setOptions] = useState([]); // All fetched options
  const [filteredOptions, setFilteredOptions] = useState([]); // Filtered options
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [open, setOpen] = useState(false); // Tracks dropdown open state
  const [query, setQuery] = useState(''); // Tracks input query
  const [cache, setCache] = useState({}); // Cache for query results
  const [selectAllChecked, setSelectAllChecked] = useState(false); // Tracks Select All state

  // Fetch options
  const fetchOptions = useCallback(
    async (currentQuery) => {
      if (cache[currentQuery]) {
        setOptions(cache[currentQuery]);
        setFilteredOptions(cache[currentQuery]); // Set initial filtered options
        return;
      }

      setLoading(true);
      try {
        const response = await axiosServices.get('/zoneType/grouped/by/zone', {
          params: { query: currentQuery }
        });
        const zone = response.data.data || [];
        setOptions(zone);
        setFilteredOptions(zone); // Initially set filtered options
        setCache((prevCache) => ({ ...prevCache, [currentQuery]: zone }));
      } catch (error) {
        console.error('Error fetching options:', error);
        setOptions([]);
        setFilteredOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [cache]
  );

  // Debounced fetch
  const debouncedFetch = useMemo(() => debounce(fetchOptions, 500), [fetchOptions]);

  useEffect(() => {
    if (open) debouncedFetch(query);
  }, [open, query, debouncedFetch]);

  // "Select All" Logic
  const handleSelectAllToggle = () => {
    if (selectAllChecked) {
      setSelectedOptions([]); // Clear all selections
    } else {
      setSelectedOptions(options); // Select all options
    }
    setSelectAllChecked(!selectAllChecked);
  };

  // Update "Select All" checkbox dynamically
  useEffect(() => {
    setSelectAllChecked(value.length === options.length && options.length > 0);
  }, [value, options]);

  // Filter options based on query
  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const filtered = options.filter((option) => option.zoneName.toLowerCase().includes(lowerQuery));
    setFilteredOptions(filtered);
  }, [query, options]);

  return (
    <Grid item xs={12}>
      <Autocomplete
        multiple
        id="zone-selection"
        options={filteredOptions} // Use filtered options
        disableCloseOnSelect
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => option.zoneName || ''}
        loading={loading}
        value={value}
        onChange={(event, newValue) => setSelectedOptions(newValue || [])}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox checked={selected} style={{ marginRight: 8 }} />
            {option.zoneName}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search or Select Zones"
            onChange={(e) => setQuery(e.target.value)} // Update query
          />
        )}
        ListboxComponent={(listboxProps) => {
          const { children, ...rest } = listboxProps;
          return (
            <List {...rest}>
              {/* "Select All" Option */}
              <ListItem button onClick={handleSelectAllToggle} style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={selectAllChecked}
                  indeterminate={value.length > 0 && value.length < options.length}
                  style={{ marginRight: 8 }}
                />
                <Typography>Select All</Typography>
              </ListItem>
              {/* Render Filtered Options */}
              {children}
            </List>
          );
        }}
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
          ...sx // Allow custom styles
        }}
      />
    </Grid>
  );
};

export default ZoneSelection;
