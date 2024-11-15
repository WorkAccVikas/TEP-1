import { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
// material-ui
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Book, Car, Card, DocumentText, Profile2User, TableDocument, WalletMoney } from 'iconsax-react';
import {
  fetchCompanies,
  fetchCompaniesAssignedDrivers,
  fetchCompaniesAssignedVendors,
  fetchCompaniesDetails
} from 'store/slice/cabProvidor/companySlice';
import { dispatch } from 'store';
import Overview from 'sections/cabprovidor/companyManagement/companyOverview/Overview';
import { useSelector } from 'react-redux';
import Mails from 'sections/cabprovidor/companyManagement/companyOverview/Mails';
import AttachedVendor from 'sections/cabprovidor/companyManagement/companyOverview/AttachedVendor';
import AttachedDriver from 'sections/cabprovidor/companyManagement/companyOverview/AttachedDriver';
import Statement from 'sections/cabprovidor/companyManagement/companyOverview/Statement';
import Transaction from 'sections/cabprovidor/companyManagement/companyOverview/Transaction';
import ViewRoster from 'sections/cabprovidor/companyManagement/companyOverview/ViewRoster';
import CompanyRateListing from 'sections/cabprovidor/companyManagement/companyOverview/CompanyRate1/CompanyRateListing';

const CompanyOverview = () => {
  const { id } = useParams();
  const companyId = id;
  const location = useLocation(); // Access location to get query parameters
  const searchParams = new URLSearchParams(location.search); // Parse the query string
  const companyName = searchParams.get('companyName'); // Get the companyName from the query string

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const { companyDetails } = useSelector((state) => state.companies || {});
  const { companiesVendor } = useSelector((state) => state.companies || {});
  const { companiesDriver } = useSelector((state) => state.companies || {});

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Utility function to generate random date
  const getRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString(); // Format the date as needed
  };

  // Utility function to generate random invoice number
  const getRandomInvoiceNumber = () => {
    return `INV-${Math.floor(Math.random() * 1000000)}`;
  };

  // Utility function to generate random amount
  const getRandomAmount = () => {
    return (Math.random() * 1000).toFixed(2); // Random amount between 0 and 1000
  };

  // Utility function to generate random balance due
  const getRandomBalanceDue = () => {
    return (Math.random() * 500).toFixed(2); // Random balance due between 0 and 500
  };

  // Function to generate random data for the table
  const generateRandomTransactions = (num) => {
    return Array.from({ length: num }, (_, index) => ({
      id: index + 1,
      startDate: getRandomDate(),
      invoiceNumber: getRandomInvoiceNumber(),
      amount: getRandomAmount(),
      balanceDue: getRandomBalanceDue(),
      status: Math.random() > 0.5 ? 'Active' : 'Inactive' // Randomly assign status
    }));
  };

  // Usage in your Transaction component
  const data = generateRandomTransactions(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when data fetching starts
      await dispatch(fetchCompanies());
      await dispatch(fetchCompaniesDetails(id));
      await dispatch(fetchCompaniesAssignedVendors(id));
      await dispatch(fetchCompaniesAssignedDrivers(id));
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [id]); // Only fetch data when id changes

  return (
    <>
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
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label="Profile Tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Overview" icon={<Book />} iconPosition="start" />
              <Tab label="Transaction" icon={<WalletMoney />} iconPosition="start" />
              <Tab label="Mails" icon={<TableDocument />} iconPosition="start" />
              <Tab label="Statement" icon={<DocumentText />} iconPosition="start" />
              <Tab label="Attached Vendors" icon={<Profile2User />} iconPosition="start" />
              <Tab label="Attached Drivers" icon={<Car />} iconPosition="start" />
              <Tab label="View Roster" icon={<Card />} iconPosition="start" />
              <Tab label="Company Rate" icon={<Card />} iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && <Overview data={companyDetails} />}
              {activeTab === 1 && <Transaction data={data} />}
              {activeTab === 2 && <Mails />}
              {activeTab === 3 && <Statement />}
              {activeTab === 4 && <AttachedVendor data={companiesVendor} loading={loading} />}
              {activeTab === 5 && <AttachedDriver data={companiesDriver} loading={loading} />}
              {activeTab === 6 && <ViewRoster id={companyId} />}
              {activeTab === 7 && <CompanyRateListing id={companyId} companyName={companyName} />}
            </Box>
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Outlet />
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default CompanyOverview;
