import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
// material-ui
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Book, DocumentText, EmptyWallet, MoneyRecive, WalletAdd, WalletMoney } from 'iconsax-react';
import Overview from 'sections/cabprovidor/driverManagement/driverOverview/Overview';
import Statement from 'sections/cabprovidor/driverManagement/driverOverview/Statement';
import TripDetail from 'sections/cabprovidor/driverManagement/driverOverview/TripDetail';
import SalaryDetail from 'sections/cabprovidor/driverManagement/driverOverview/SalaryDetail';
import Advance from 'sections/cabprovidor/driverManagement/driverOverview/Advance';
import Loan from 'sections/cabprovidor/driverManagement/driverOverview/Loan';
import axios from 'axios';
import axiosServices from 'utils/axios';

const DriverOverview = () => {
  const { id } = useParams(); // used to extract companyId to fetch company Data
  const driverId = id;

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [driverDetail, setDriverDetail] = useState(null);
  const [driverSpecificDetail, setDriverSpecificDetail] = useState(null);

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

  // Function to generate a random vehicle
  const getRandomVehicle = () => {
    const vehicles = ['Car', 'Truck', 'Bike', 'Bus', 'Van'];
    return vehicles[Math.floor(Math.random() * vehicles.length)];
  };

  // Function to generate random advance rate
  const getRandomAdvanceRate = () => {
    return `${Math.floor(Math.random() * 20) + 1}%`; // Random advance rate between 1% and 20%
  };

  // Function to generate random description
  const getRandomDescription = () => {
    return `Installment ${Math.floor(Math.random() * 52) + 1}`; // Random installment between 1 and 52
  };

  // Function to generate random company names
  const getRandomCompanyName = () => {
    const companies = [
      'ABC Corp',
      'Global Tech',
      'Innovative Solutions',
      'Bright Future',
      'Tech Wizards',
      'NextGen Industries',
      'BlueSky Ventures',
      'Dynamic Group'
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  };

  // Function to generate random data for the table
  const generateRandomTransactions = (num) => {
    return Array.from({ length: num }, (_, index) => ({
      id: index + 1,
      startDate: getRandomDate(),
      invoiceNumber: getRandomInvoiceNumber(),
      amount: getRandomAmount(),
      balanceDue: getRandomBalanceDue(),
      status: Math.random() > 0.5 ? 'Active' : 'Inactive',
      vehicle: getRandomVehicle(),
      advanceRate: getRandomAdvanceRate(),
      advanceType: 'Full', 
      description: getRandomDescription(),
      company_name: getRandomCompanyName(),
      totalLoanAmount: `₹${(Math.random() * 10000).toFixed(2)}`, 
      totalPaid: `₹${(Math.random() * 5000).toFixed(2)}`,
      totalBalance: `₹${(Math.random() * 5000).toFixed(2)}`,
      loanTerm: `${Math.floor(Math.random() * 10) + 1} years`, 
      totalWeek: Math.floor(Math.random() * 52), 
      termPaid: Math.floor(Math.random() * 52), 
      endDate: '2025-12-31'
    }));
  };

  // Usage in your Transaction component
  const data = generateRandomTransactions(10);

  useEffect(() => {
    if (driverId) {
        
      const fetchDriverData = async () => {
        const token = localStorage.getItem('serviceToken');
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
            <Tabs value={activeTab} onChange={handleChange} aria-label="Profile Tabs">
              <Tab label="Overview" icon={<Book />} iconPosition="start" />
              <Tab label="Trip Details" icon={<WalletMoney />} iconPosition="start" />
              <Tab label="Statement" icon={<DocumentText />} iconPosition="start" />
              <Tab label="Advance" icon={<WalletAdd />} iconPosition="start" />
              <Tab label="Loan" icon={<EmptyWallet />} iconPosition="start" />
              <Tab label="Salary Detail" icon={<MoneyRecive />} iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && <Overview data={driverDetail} data1={driverSpecificDetail} />}
              {activeTab === 1 && <TripDetail data={data} />}
              {activeTab === 2 && <Statement />}
              {activeTab === 3 && <Advance data={data} />}
              {activeTab === 4 && <Loan data={data}/>}
              {activeTab === 5 && <SalaryDetail data={data} />}
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

export default DriverOverview;
