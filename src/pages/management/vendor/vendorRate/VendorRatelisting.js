import { useEffect, useState } from 'react';
// assets
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';
import Header from 'components/tables/genericTable/Header';
import WrapperButton from 'components/common/guards/WrapperButton';
import { Add } from 'iconsax-react';
import SearchComponent from 'pages/apps/test/CompanySearch';
import axiosServices from 'utils/axios';
import VendorRateTable from './VendorRateTable';
import { useNavigate } from 'react-router';
import { fetchAllVendors } from 'store/slice/cabProvidor/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const token = localStorage.getItem('serviceToken');

const AddVendorRateDialog = ({ open, onClose, setSelectedCompany, setSelectedVendorID }) => {
  const [selectedCompany, setSelectedCompanyLocal] = useState(null);
  const [vendorID, setVendorID] = useState('');
  const dispatch = useDispatch();

  const allVendors = useSelector((state) => state.vendors.allVendors);

  useEffect(() => {
    dispatch(fetchAllVendors());
  }, [dispatch]);

  const handleSave = () => {
    if (!selectedCompany || !vendorID) {
      return;
    }
    setSelectedCompany(selectedCompany);
    setSelectedVendorID(vendorID); // Pass the selected vendor ID back to the parent
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      keepMounted
      scroll="paper"
      sx={{ '& .MuiDialog-paper': { width: '500px', maxWidth: '500px' } }}
    >
      <DialogTitle>Select Company and Vendor</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} sx={{ padding: '8px' }}>
          <Grid item xs={6}>
            <InputLabel sx={{ marginBottom: '4px' }}>Company Name</InputLabel>
            <SearchComponent setSelectedCompany={setSelectedCompanyLocal} />
          </Grid>
          <Grid item xs={6}>
            <InputLabel sx={{ marginBottom: '4px' }}>Vendor</InputLabel>
            <Autocomplete
              value={allVendors.find((vendor) => vendor.vendorId === vendorID) || null}
              onChange={(event, newValue) => setVendorID(newValue ? newValue.vendorId : '')}
              options={allVendors}
              getOptionLabel={(option) => option.vendorCompanyName}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.vendorCompanyName}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Choose a vendor"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete
                  }}
                />
              )}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: '8px' }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!selectedCompany || !vendorID}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VendorRatelisting = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [companyRate, setCompanyRate] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updateKey, setUpdateKey] = useState(0);
  const [loading, setLoading] = useState('true');
  const [showCompanyList, setShowCompanyList] = useState(false); // State to manage which component to show
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedVendorID, setSelectedVendorID] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(true); // Dialog state

//   console.log('selectedCompany', selectedCompany);
  console.log('selectedVendorID', selectedVendorID);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosServices.get(
          `/cabRateMaster/unwind/rate/vendorId?vendorId=${selectedVendorID}&companyID=${selectedCompany._id}`
        );
        setVendorList(response.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    // console.log('selectedCompany', selectedCompany);
    // console.log('selectedVendorID', selectedVendorID);

    if (!selectedCompany || !selectedVendorID) return;

    fetchdata();
  }, [selectedCompany, selectedVendorID, token]);

//   console.log('vendorList', vendorList);

  const handleAddRate = () => {
    navigate('/management/vendor/add-vendor-rate');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {}, [companyRate]);

  return (
    <>
      {/* Company selection dialog */}
      <AddVendorRateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        setSelectedCompany={setSelectedCompany}
        setSelectedVendorID={setSelectedVendorID}
      />

      {/* Render CompanyRateListing once a company is selected */}
      {!dialogOpen && selectedCompany && selectedVendorID && !showCompanyList ? (
        <Stack gap={1} spacing={1}>
          <Header OtherComp={({ loading }) => <ButtonComponent loading={loading} onAddRate={handleAddRate} />} />

          <VendorRateTable
            data={vendorList}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            updateKey={updateKey}
            setUpdateKey={setUpdateKey}
            loading={loading}
          />
        </Stack>
      ) : null}
    </>
  );
};

export default VendorRatelisting;

const ButtonComponent = ({ loading, onAddRate }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <WrapperButton>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
          onClick={onAddRate} // Call the onAddRate function when button is clicked
          size="small"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : ' Add Rate'}
        </Button>
      </WrapperButton>
    </Stack>
  );
};
