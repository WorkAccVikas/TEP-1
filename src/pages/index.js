/* eslint-disable no-unused-vars */
// material-ui
import { Grid, Stack } from '@mui/material';

// project-imports
import { useTheme } from '@mui/material/styles';
import ReportCard from 'components/cards/statistics/ReportCard';
import MainCard from 'components/MainCard';
import { AlignBottom, Autonio, Car, Driver, User, UserSquare } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from 'store/slice/cabProvidor/dashboardSlice';
import { fetchAllRoles } from 'store/slice/cabProvidor/roleSlice';

import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';
import ReactTable, { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import { Gps } from 'iconsax-react';
import { useSelector } from 'store';
import { fetchAllVehicleTypes, fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import { GiReceiveMoney } from 'react-icons/gi';
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { GiPayMoney } from 'react-icons/gi';

import { GiTakeMyMoney } from 'react-icons/gi';
import CustomCircularLoader from 'components/CustomCircularLoader';

// ==============================|| SAMPLE PAGE ||============================== //

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const loading = useSelector((state) => state.dashboard.loading);
  const dashboardData = useSelector((state) => state.dashboard.data);
  console.log('dashboardData', dashboardData);

  const companyWiseEarningsData = useSelector((state) => state.dashboard.companyData);
  console.log('companyWiseEarningsData', companyWiseEarningsData);

  useEffect(() => {
    dispatch(fetchAllVehicleTypesForAll());
    dispatch(fetchAllRoles());
    dispatch(fetchAllVehicleTypes());
    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const token = localStorage.getItem('serviceToken') || '';

  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        className: 'cell-center',
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Company Name',
        accessor: 'company_Name'
      },
      {
        Header: 'Total Route',
        accessor: 'totalRoute'
      },
      {
        Header: 'Total Company Revenue',
        accessor: 'totalCompanyRevenue'
      },
      {
        Header: 'Total Vendor Revenue',
        accessor: 'totalVendRevenue'
      },
      {
        Header: 'Total Driver Revenue',
        accessor: 'totalDriverRevenue'
      },
      {
        Header: 'Net Profit',
        accessor: 'netProfit'
      }
    ],
    []
  );

  // return (
  //   <>
  //     <Stack gap={2}>
  //       <MainCard title="Sample Card">
  //         <Typography variant="body1">
  //           Do you Know? Able is used by more than 2.4K+ Customers worldwide. This new v9 version is the major release of Able Pro Dashboard
  //           Template with having brand new modern User Interface.
  //         </Typography>
  //       </MainCard>

  //       <MainCard
  //         title="Token"
  //         content={false}
  //         secondary={
  //           <CopyToClipboard
  //             text={token}
  //             onCopy={() =>
  //               dispatch(
  //                 openSnackbar({
  //                   open: true,
  //                   message: 'Token Copied',
  //                   variant: 'alert',
  //                   alert: {
  //                     color: 'success'
  //                   },
  //                   close: false,
  //                   anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //                   transition: 'SlideLeft'
  //                 })
  //               )
  //             }
  //           >
  //             <Tooltip title="Copy">
  //               <IconButton size="large">
  //                 <Copy />
  //               </IconButton>
  //             </Tooltip>
  //           </CopyToClipboard>
  //         }
  //       ></MainCard>
  //     </Stack>
  //   </>
  // );

  if (loading || !dashboardData) return <CustomCircularLoader />;

  return (
    <>
      <Stack gap={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalCompanies}`}
              secondary="Total Companies"
              color={theme.palette.secondary.main}
              iconPrimary={AlignBottom}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalVendors}`}
              secondary="Total Vendors"
              color={theme.palette.secondary.main}
              iconPrimary={UserSquare}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalVehicles}`}
              secondary="Total Vehicles"
              color={theme.palette.secondary.main}
              iconPrimary={Car}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalDriver}`}
              secondary="Total Drivers"
              color={theme.palette.secondary.main}
              iconPrimary={Driver}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalZone}`}
              secondary="Total Zones"
              color={theme.palette.secondary.main}
              iconPrimary={Autonio}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalUsers}`}
              secondary="Total Users"
              color={theme.palette.secondary.main}
              iconPrimary={User}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ReportCard
              primary={`${dashboardData?.totalRoster}`}
              secondary="Total Roster"
              color={theme.palette.secondary.main}
              iconPrimary={Gps}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <HoverSocialCard
              primary="Total Routes"
              secondary={`${dashboardData?.totalRoute}`}
              color={theme.palette.primary.main}
              iconPrimary={Gps}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HoverSocialCard
              primary="Total Revenue Of Company"
              secondary={`₹ ${dashboardData?.totalRevenueOfCompany}`}
              color={theme.palette.info.main}
              iconPrimary={GiReceiveMoney}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HoverSocialCard
              primary="Total Revenue Of Vendor"
              secondary={`₹ ${dashboardData?.totalRevenueOfVendor}`}
              color={theme.palette.warning.main}
              iconPrimary={GiPayMoney}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HoverSocialCard
              primary="Total Revenue Of Driver"
              secondary={`₹ ${dashboardData?.totalRevenueOfDriver}`}
              color={'#D8125B'}
              iconPrimary={RiMoneyRupeeCircleFill}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HoverSocialCard
              primary="Profit"
              secondary={`₹ ${dashboardData?.profit}`}
              color={theme.palette.secondary.dark}
              iconPrimary={GiTakeMyMoney}
            />
          </Grid>
        </Grid>

        <MainCard title="Company Wise Recent Earnings">
          {companyWiseEarningsData?.length > 0 ? (
            <ReactTable columns={columns} data={companyWiseEarningsData} hideHeader />
          ) : (
            <TableNoDataMessage text="Company Wise Recent Earnings Not Found" />
          )}
        </MainCard>
      </Stack>
    </>
  );
};

export default Dashboard;
