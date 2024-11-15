import React, { useEffect, useState } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import axiosServices from 'utils/axios';

const SearchComponent = ({ setSelectedCompany }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Fetch default options when component mounts or when the input is opened
  useEffect(() => {
    const fetchDefaultOptions = async () => {
      setLoading(true);
      try {
        const response = await axiosServices.get('/company?page=1&limit=10');
        setOptions(response.data.data.result); // Assuming your API returns an array of companies
      } catch (error) {
        console.error('Error fetching default options:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDefaultOptions();
    }
  }, [open]);

  // Fetch options based on input query
  useEffect(() => {
    const fetchOptions = async () => {
      if (!query) return; // Skip if query is empty

      setLoading(true);
      try {
        const response = await axiosServices.get(`/company/getCompanyByName?filter=${query}&page=1&limit=10`);
        setOptions(response.data.data.result); // Assuming your API returns an array of companies
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchOptions, 300); // Debounce delay

    return () => clearTimeout(debounceFetch); // Cleanup on unmount or re-render
  }, [query]);

  return (
    <Grid item xs={12}>
      <Autocomplete
        id="asynchronous-demo"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.company_name}
        options={options}
        loading={loading}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue);
        }}
        onChange={(event, newValue) => {
          // Call setSelectedCompany with the selected company
          if (newValue) {
            setSelectedCompany(newValue); // Pass the selected company to the parent component
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search..."
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
    </Grid>
  );
};

export default SearchComponent;
