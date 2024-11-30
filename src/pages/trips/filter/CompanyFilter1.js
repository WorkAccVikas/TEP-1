import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { fetchCompanies } from 'store/slice/cabProvidor/companySlice';
import { Autocomplete, CircularProgress, Grid, TextField } from '@mui/material';
import { SearchNormal1 } from 'iconsax-react';

const CompanyFilter1 = () => {
  const dispatch = useDispatch();

  // State for filter query
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Set your default limit
  const [open, setOpen] = useState(false); // Controls the Autocomplete dropdown
  const [value, setValue] = useState(null); // Stores the selected value

  // Get companies from the Redux store
  const { companies, loading, error } = useSelector((state) => state.companies);

  // Debounced function to dispatch fetchCompanies
  const debouncedFetch = useCallback(
    _.debounce((query) => {
      dispatch(fetchCompanies({ page, limit, query }));
    }, 1000),
    [dispatch, page, limit]
  );

  // Handle input change
  const handleInputChange = (event, newInputValue) => {
    setQuery(newInputValue);
    debouncedFetch(newInputValue);
  };

  // Fetch companies on initial render or when page/limit/query changes
  useEffect(() => {
    dispatch(fetchCompanies({ page, limit, query }));
  }, [dispatch, page, limit, query]);

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
        options={companies || []} // Ensure options is an array
        loading={loading}
        onInputChange={handleInputChange}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{
          color: '#fff',
          '& .MuiSelect-select': {
            padding: '0.5rem',
            pr: '2rem'
          },
          '& .MuiSelect-icon': {
            color: '#fff' // Set the down arrow color to white
          },
          width: '200px',
          pb: 1
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
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </Grid>
  );
};

export default CompanyFilter1;
