import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
// material-ui
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Bill, Book, Buliding, Routing2, TableDocument} from 'iconsax-react';
import axiosServices from 'utils/axios';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { USERTYPE } from 'constant';
import { useSelector } from 'store';
import Overview from './overview';

const tabConfig = [
  { label: 'Overview', icon: <Book />, access: [USERTYPE.iscabProvider] },
//   { label: 'Trips', icon: <Routing2 />, access: [USERTYPE.iscabProvider] },
//   { label: 'Advance', icon: <TableDocument />, access: [USERTYPE.iscabProvider] },
//   { label: 'Invoice', icon: <Bill />, access: [USERTYPE.iscabProvider] },
//   { label: 'Attached Companies', icon: <Buliding />, access: [USERTYPE.iscabProvider] }
];

const VendorOverview = () => {
  const { id } = useParams(); // used to extract companyId to fetch company Data
  const vendorId = id;

  const [activeTab, setActiveTab] = useState(0);
  const [vendorDetail, setVendorDetail] = useState(null);
  const [vendorSpecificDetail, setVendorSpecificDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const vendorCompanyName = vendorSpecificDetail?.vendorCompanyName;

  const { userType } = useSelector((state) => state.auth);

  console.log("vendorDetail",vendorDetail);
  console.log("vendorSpecificDetail",vendorSpecificDetail);
  

  //  useEffect: Get vendor's details by vendorId

  useEffect(() => {
    if (vendorId) {
      const fetchVendorData = async () => {
        try {
          const response = await axiosServices.get(`/vendor/details/by?vendorId=${vendorId}`);

          if (response.status === 200) {
            setVendorDetail(response.data.userData);
            setVendorSpecificDetail(response.data.userSpecificData);
            setLoading(false);
          }

          // Handle the response as needed
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      };

      fetchVendorData();
    }
  }, [vendorId]);

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Vendor', to: '/management/vendor/view' },
    { title: `${vendorCompanyName}` }
  ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter the tabs based on userType
  const filteredTabs = tabConfig.filter((tab) => !tab.access || tab.access.includes(userType));

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
              vendorDetail={vendorDetail}
              vendorId={vendorId}
              vendorSpecificDetail={vendorSpecificDetail}
              vendorCompanyName={vendorCompanyName}
              data={data}
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

const TabContent = ({ activeTab, vendorDetail, vendorId, vendorSpecificDetail, vendorCompanyName, data, filteredTabs }) => {
  // Dynamic components array based on filteredTabs
  const components = {
    Overview: <Overview data={vendorDetail} data1={vendorSpecificDetail} vendorCompanyName={vendorCompanyName} />,
    // Trips: <TripDetail vendorId={vendorId} />,
    // Advance: <AdvanceVendor vendorId={vendorId} />,
    // Invoice: <Transaction data={data} />,
    // 'Attached Companies': <AttachedCompany vendorId={vendorId} />
  };

  // Get the active tab label
  const activeTabLabel = filteredTabs[activeTab]?.label;

  // Render the corresponding component
  return <Box sx={{ p: 3 }}>{components[activeTabLabel]}</Box>;
};

TabContent.propTypes = {
  activeTab: PropTypes.number.isRequired,
  vendorDetail: PropTypes.object.isRequired,
  vendorId: PropTypes.string.isRequired,
  vendorSpecificDetail: PropTypes.object.isRequired,
  vendorCompanyName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  filteredTabs: PropTypes.array.isRequired
};
