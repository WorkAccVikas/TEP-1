import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
// material-ui
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Book, Buliding, Card, DocumentText, EmptyWallet, MoneyRecive, Routing2, WalletAdd, WalletMoney } from 'iconsax-react';
import Overview from 'sections/cabprovidor/driverManagement/driverOverview/Overview';
import Statement from 'sections/cabprovidor/driverManagement/driverOverview/Statement';
import TripDetail from 'sections/cabprovidor/driverManagement/driverOverview/TripDetail';
import axiosServices from 'utils/axios';
import AttachedCompany from 'sections/cabprovidor/driverManagement/driverOverview/AttachedCompany';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import AdvanceDriver from 'sections/cabprovidor/driverManagement/driverOverview/Advance';
import { USERTYPE } from 'constant';
import { useSelector } from 'store';
import { Base64 } from 'js-base64';
import Expense from 'sections/cabprovidor/driverManagement/driverOverview/expense/Expense';
import DriverRate from 'sections/cabprovidor/driverManagement/driverOverview/rate/DriverRate';

const tabConfig = [
  { label: 'Overview', icon: <Book />, access: [USERTYPE.iscabProvider, USERTYPE.isVendor] },
  { label: 'Trips', icon: <Routing2 />, access: [USERTYPE.iscabProvider, USERTYPE.isVendor] },
  { label: 'Advance', icon: <WalletAdd />, access: [USERTYPE.iscabProvider] },
  { label: 'Attached Companies', icon: <Buliding />, access: [USERTYPE.iscabProvider] },
  { label: 'Expense', icon: <WalletMoney />, access: [USERTYPE.iscabProvider] },
  { label: 'Rates', icon: <Card />, access: [USERTYPE.iscabProvider] }
];
const DriverOverview = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const CabProvider = searchParams.get('cabProvider') === 'true';

  console.log('CabProvider', CabProvider);

  const driverId = id;

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [driverDetail, setDriverDetail] = useState(null);
  const [driverSpecificDetail, setDriverSpecificDetail] = useState(null);
  const userType = useSelector((state) => state.auth.userType);

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Driver', to: '/management/driver/view' },
    { title: `${driverDetail?.userName}` }
  ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (driverId) {
      const fetchDriverData = async () => {
        try {
          const response = await axiosServices.get(`/driver/by?driverId=${driverId}`);

          if (response.status === 200) {
            setDriverDetail(response.data.data.userData);
            setDriverSpecificDetail(response.data.data.userSpecificData);
            setLoading(false);
          }

          // Handle the response as needed
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      };

      fetchDriverData();
    }
  }, [driverId]);

  // const filteredTabs = tabConfig.filter((tab) => !tab.access || tab.access.includes(userType));

  const filteredTabs = useMemo(() => {
    if (userType === USERTYPE.isVendor) {
      return tabConfig.filter((tab) => tab.access.includes(USERTYPE.isVendor));
    }

    if (userType === USERTYPE.iscabProvider) {
      return CabProvider
        ? tabConfig // Show all tabs if `CabProvider` is true
        : tabConfig.filter((tab) => tab.access.includes(USERTYPE.isVendor));
    }

    // Show 'Rates' tab only if CabProvider is true
    if (!CabProvider) {
      return tabConfig.filter((tab) => tab.label !== 'Rates');
    }

    return []; // Return an empty array if no conditions match
  }, [userType, CabProvider]);

  return (
    <>
      <Breadcrumbs custom links={breadcrumbLinks} />
      {loading ? (
        <Box
          sx={{
            height: '100vh',
            width: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <MainCard border={false}>
          <Box>
            <Tabs value={activeTab} onChange={handleChange} aria-label="Profile Tabs">
              {filteredTabs.map((tab, index) => (
                <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
              ))}
            </Tabs>

            <TabContent
              activeTab={activeTab}
              driverDetail={driverDetail}
              driverId={driverId}
              driverSpecificDetail={driverSpecificDetail}
              filteredTabs={filteredTabs}
            />
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Outlet />
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default DriverOverview;

const TabContent = ({ activeTab, driverDetail, driverId, driverSpecificDetail, filteredTabs }) => {
  const components = {
    Overview: <Overview data={driverDetail} data1={driverSpecificDetail} />,
    Trips: <TripDetail driverId={driverId} />,
    Advance: <AdvanceDriver driverId={driverId} />,
    'Attached Companies': <AttachedCompany driverId={driverId} />,
    Expense: <Expense driverId={driverId} />,
    Rates: <DriverRate driverId={driverId} />
  };
  // Get the active tab label
  const activeTabLabel = filteredTabs[activeTab]?.label;

  // Render the corresponding component
  return <Box sx={{ p: 3 }}>{components[activeTabLabel]}</Box>;
};

TabContent.propTypes = {
  activeTab: PropTypes.number.isRequired,
  driverDetail: PropTypes.object.isRequired,
  driverId: PropTypes.string.isRequired,
  driverSpecificDetail: PropTypes.object.isRequired,
  filteredTabs: PropTypes.array.isRequired
};
