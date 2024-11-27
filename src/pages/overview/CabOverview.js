import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
// material-ui
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Book, DocumentText, EmptyWallet, MoneyRecive, WalletAdd, WalletMoney } from 'iconsax-react';
import Overview from 'sections/cabprovidor/cabManagement/cabOverview/Overview';
import TripDetail from 'sections/cabprovidor/cabManagement/cabOverview/TripDetails';
import axiosServices from 'utils/axios';
import { dispatch, useSelector } from 'store';
import { fetchCabDetails } from 'store/slice/cabProvidor/cabSlice';
import CustomCircularLoader from 'components/CustomCircularLoader';

const CabOverview = () => {
  const { id } = useParams(); // used to extract companyId to fetch company Data

  const [activeTab, setActiveTab] = useState(0);
  const [driverDetail, setDriverDetail] = useState(null);
  const [driverSpecificDetail, setDriverSpecificDetail] = useState(null);

  const { loading, getSingleDetails: cabDetails } = useSelector((state) => state.cabs);
  console.log(`🚀 ~ CabOverview ~ loading:`, loading);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    dispatch(fetchCabDetails(id));
  }, [id]);

  return (
    <>
      {loading ? (
        <CustomCircularLoader />
      ) : (
        <>
          <MainCard border={false}>
            <Box>
              <Tabs value={activeTab} onChange={handleChange} aria-label="Profile Tabs">
                <Tab label="Overview" icon={<Book />} iconPosition="start" />
                <Tab label="Trip Details" icon={<WalletMoney />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {activeTab === 0 && <Overview />}
                {activeTab === 1 && <TripDetail />}
              </Box>

              <Box sx={{ mt: 2.5 }}>
                <Outlet />
              </Box>
            </Box>
          </MainCard>
        </>
      )}
    </>
  );
};

export default CabOverview;
