import { useEffect, useRef, useState } from 'react';
// assets
import { Chip, Stack } from '@mui/material';
import axiosServices from 'utils/axios';
import { useLocation, useNavigate } from 'react-router';
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import VendorRateTable from 'pages/management/vendor/vendorRate/VendorRateTable';

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const VendorRate = ({ vendorId }) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [selectedVendorName, setSelectedVendorName] = useState('');
  const [isSelectingCompany, setIsSelectingCompany] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosServices.get(
          `/cabRateMaster/unwind/rate/vendorId?vendorId=${vendorId}&companyID=${selectedCompany._id}`
        );
        setVendorList(response.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    if (!selectedCompany || !selectedVendorID) return;

    fetchdata();
  }, [selectedCompany, selectedVendorID, updateKey]);

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {}, [companyRate]);

  // Close SearchComponent when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is inside the search component or its dropdown
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !document.querySelector('.MuiAutocomplete-popper')?.contains(event.target)
      ) {
        setIsSelectingCompany(false);
      }
    };

    if (isSelectingCompany) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectingCompany]);

  return (
    <>
      {/* Render CompanyRateListing once a company is selected */}

      <>
        <Stack gap={1} spacing={1}>
          <MainCard
            title={
              <Stack direction="row" alignItems="center" gap={1}>
                Vendor Rates between <Chip label={selectedCompanyName} color="primary" />
                and <Chip label={selectedVendorName} color="secondary" />
              </Stack>
            }
          >
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
          </MainCard>
        </Stack>
      </>
    </>
  );
};

export default VendorRate;
