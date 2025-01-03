import React, { useEffect, useState } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import axiosServices from 'utils/axios';
import { SearchNormal1 } from 'iconsax-react';

const CompanyFilter2 = ({ setFilterOptions, sx, value, setQuery: propagateQuery }) => {
  const [options, setOptions] = useState([]); // Stores fetched options
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [open, setOpen] = useState(false); // Tracks dropdown open state
  const [query, setQuery] = useState(''); // Tracks input query
  const [cache, setCache] = useState({}); // Cache for query results

  // Fetch options based on query or load default options when opened
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);

      try {
        const response = await axiosServices.get(
          query
            ? `/company/getCompanyByName?filter=${query}&page=1&limit=10`
            : `/company?page=1&limit=10`
        );
        const companies = response.data.data.result;

        setOptions(companies);
        setCache((prevCache) => ({ ...prevCache, [query || 'default']: companies })); // Cache results
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      // Use cached results if available
      const cachedResult = cache[query || 'default'];
      if (cachedResult) {
        setOptions(cachedResult);
      } else {
        fetchOptions();
      }
    }
  }, [open, query, cache]);

  return (
    <Grid item xs={12}>
      <Autocomplete
        id="asynchronous-demo"
        open={open}
        value={value}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.company_name === value.company_name}
        getOptionLabel={(option) => option.company_name || ''}
        options={options}
        loading={loading}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue); // Update local query state
          if (propagateQuery) propagateQuery(newInputValue); // Propagate query to parent if needed
        }}
        sx={sx}
        onChange={(event, newValue) => {
          setFilterOptions((prevState) => ({
            ...prevState,
            selectedCompany: newValue || {} // Reset to an empty object if no selection
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Filter Company"
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchNormal1 size={14} />,
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
    </Grid>
  );
};

export default CompanyFilter2;
