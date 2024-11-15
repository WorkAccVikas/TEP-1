// material-ui
import { Box, Button, FormControl, Grid } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
// import AnimateButton from 'components/@extended/AnimateButton';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import ConfigurableAutocomplete from 'components/autocomplete/ConfigurableAutocomplete';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

const validationSchema = yup.object({});

// ==============================|| FORM VALIDATION - SELECT  ||============================== //

const Roster = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const formik = useFormik({
    initialValues: {},
    validationSchema,
    onSubmit: () => {
      if (selectedOption) {
        const companyID = selectedOption?._id || '';
        const companyName = selectedOption?.company_name || '';
        navigate(`/roster/file-management?companyID=${companyID}&companyName=${encodeURIComponent(companyName)}`); // Pass companyID in query parameter
      }
    }
  });

  const handleSelectionChange = useCallback(
    (value) => {
      setSelectedOption(value);
      formik.setFieldValue('parentCompanyID', value?._id || '');
    },
    [formik]
  );

  return (
    <MainCard title="Select Company">
      <form onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8} lg={6} container justifyContent="center">
            {/* Wrap both search and button in a single block */}
            <Box display="flex" flexDirection="row" alignItems="center" width="100%">
              {/* Search Input Field */}
              <FormControl fullWidth>
                <ConfigurableAutocomplete
                  apiUrl="/company/getCompanyByName" // Replace with your actual API URL
                  onChange={handleSelectionChange} // Handle selected item
                  label="Search Company" // Input field label
                  maxItems={10} // Limit the results to 3 items
                  optionLabelKey="company_name" // Key to display from API response
                  searchParam="filter"
                  noOptionsText="No Company Found"
                  placeHolderText="Type to search for company" // Pass placeholder text
                  autoHighlight // Enable auto highlight
                />
              </FormControl>

              {/* Submit Button */}
              <Button variant="contained" type="submit" size="large" sx={{ marginLeft: 2 }}>
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

export default Roster;
