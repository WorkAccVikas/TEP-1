import PropTypes from 'prop-types';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// material-ui
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Bill, Book, Buliding, Routing2, TableDocument } from 'iconsax-react';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { USERTYPE } from 'constant';
import { useSelector } from 'store';
import Overview from './overview';
import TripDetail from './trip/TripDetail';
import InvoiceList from './invoice/InvoiceList';

const tabConfig = [
  { label: 'Overview', icon: <Book />, access: [USERTYPE.isVendor] },
  { label: 'Trips', icon: <Routing2 />, access: [USERTYPE.isVendor] },
  { label: 'Invoice', icon: <Bill />, access: [USERTYPE.isVendor] },
];

const VendorOverview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const data = location.state?.data || {};

  const name = data?.cabProviderLegalName;

  const { userType } = useSelector((state) => state.auth);

  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Vendor', to: '/management/vendor/view' }, { title: `${name}` }];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter the tabs based on userType
  const filteredTabs = tabConfig.filter((tab) => !tab.access || tab.access.includes(userType));

  console.log('filteredTabs', filteredTabs);

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
              filteredTabs={filteredTabs}
              data={data}
              // vendorDetail={vendorDetail}
              // vendorId={vendorId}
              // vendorSpecificDetail={vendorSpecificDetail}
              name={name}
              // data={data}
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

export default VendorOverview;

const TabContent = ({ activeTab, name, data, filteredTabs }) => {
  // Dynamic components array based on filteredTabs
  const components = {
    Overview: <Overview data={data} name={name} />,
    Trips: <TripDetail />,
    Invoice: <InvoiceList/>
  };

  // Get the active tab label
  const activeTabLabel = filteredTabs[activeTab]?.label;

  // Render the corresponding component
  return <Box sx={{ p: 3 }}>{components[activeTabLabel]}</Box>;
};

TabContent.propTypes = {
  activeTab: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  filteredTabs: PropTypes.array.isRequired
};
