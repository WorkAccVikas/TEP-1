import PropTypes from 'prop-types';

// material-ui
// import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';

// third-party
import { SearchNormal1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import axiosServices from 'utils/axios';

// ==============================|| INVOICE - SELECT ADDRESS ||============================== //

const AddressModal = ({ open, setOpen, handlerAddress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const token = localStorage.getItem('serviceToken');

      try {
        const response = await axios.get(`/company`);
        if (response.status === 200) {
          setResults(response.data.data.result);
        }
      } catch (error) {
        console.error('Error fetching initial company data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Initial data fetch when the modal opens

  useEffect(() => {
    if (!searchQuery) return; // Don't make API calls if the search query is empty

    const fetchFilteredData = async () => {
      const token = localStorage.getItem('serviceToken');
      try {
        const response = await axiosServices.get(`/company/getCompanyByName`, {
          params: { filter: searchQuery },
        });
        if (response.status === 200) {
          setResults(response.data.data.result); // Update results with the filtered data
        }
      } catch (error) {
        console.error('Error fetching filtered company data:', error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredData();
    }, 500); // Delay to debounce search queries

    return () => clearTimeout(delayDebounceFn); // Clean up timeout on each searchQuery change
  }, [searchQuery]); // Re-run effect when the search query changes

  function closeAddressModal() {
    setOpen(false);
  }

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={closeAddressModal}
      sx={{
        '& .MuiDialog-paper': {
          p: 0,
          width: '600px',
          maxWidth: '100%',
          height: '400px',
          overflowY: 'auto'
        },
        '& .MuiBackdrop-root': { opacity: '0.5 !important' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Select Address</Typography>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={18} />
                </InputAdornment>
              )
            }}
            placeholder="Search"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>

        <Stack spacing={2}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <Address handlerAddress={handlerAddress} results={results} setOpen={setOpen} />
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="error" onClick={closeAddressModal}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddressModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  handlerAddress: PropTypes.func
};

const Address = ({ handlerAddress, results, setOpen }) => {
  return (
    <>
      {results.map((address) => (
        <Box
          onClick={() => {
            handlerAddress(address);
            setOpen(false);
          }}
          key={address.company_email}
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'secondary.200',
            borderRadius: 1,
            p: 1.25,
            '&:hover': {
              bgcolor: 'primary.lighter',
              borderColor: 'primary.lighter'
            }
          }}
        >
          <Typography textAlign="left" variant="subtitle1">
            {address.company_name}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Typography textAlign="left" variant="body2" color="secondary">
              {`${address.address}, ${address.city}, ${address.state}-${address.postal_code}`}
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              <strong>GSTIN:</strong> {address.GSTIN},
            </Typography>
            <Typography textAlign="left" variant="body2" color="secondary">
              <strong>PAN:</strong> {address.PAN}
            </Typography>
          </Stack>
        </Box>
      ))}
    </>
  );
};

Address.propTypes = {
  handlerAddress: PropTypes.func,
  results: PropTypes.array.isRequired, // Results should always be passed
  setOpen: PropTypes.func // Pass setOpen to control the modal from Address component
};

export default AddressModal;
