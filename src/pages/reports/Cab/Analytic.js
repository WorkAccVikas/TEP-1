import PropTypes from 'prop-types';
import { Grid, Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useSelector } from 'store';
import { ApexPieChart } from '../components/ApexPieChart';
import Dot from 'components/@extended/Dot';
import Badge from '../components/Badge';
import Card from '../components/Card';

const labels = [
  'Company Rate',
  'Driver Rate',
  'Vendor Rate',
  'Company Guard Price',
  'Driver Guard Price',
  'Vendor Guard Price',
  'Company Penalty',
  'Driver Penalty',
  'Vendor Penalty',
  'Add On Rate',
  'Toll Charge',
  'MCD Charge'
];

const labelsMapping = {
  'Company Guard Price': 'companyGuardPrice',
  'Driver Guard Price': 'driverGuardPrice',
  'Vendor Guard Price': 'vendorGuardPrice',
  'Company Penalty': 'companyPenalty',
  'Driver Penalty': 'driverPenalty',
  'Vendor Penalty': 'vendorPenalty',
  'Company Rate': 'companyRate',
  'Driver Rate': 'driverRate',
  'Vendor Rate': 'vendorRate',
  'Add On Rate': 'addOnRate',
  'Toll Charge': 'tollCharge',
  'MCD Charge': 'mcdCharge'
};

const Analytic = () => {
  console.log('Analytic Re-rendered');

  const [overAllData, setOverAllData] = useState({
    tripCount: 0,
    companyIncomingAmount: 0,
    driverOutgoingAmount: 0,
    vendorOutgoingAmount: 0
  });

  const [chartData, setChartData] = useState({
    companyGuardPrice: 0,
    driverGuardPrice: 0,
    vendorGuardPrice: 0,
    companyPenalty: 0,
    driverPenalty: 0,
    vendorPenalty: 0,
    companyRate: 0,
    driverRate: 0,
    vendorRate: 0,
    addOnRate: 0,
    tollCharge: 0,
    mcdCharge: 0
  });

  const [data, setData] = useState(Array.from({ length: labels.length }, () => 0));

  const { cabReportData } = useSelector((state) => state.report);

  useEffect(() => {
    if (cabReportData) {
      const totals = cabReportData.reduce(
        (acc, item) => ({
          tripCount: acc.tripCount + (item?.tripCount || 0),
          companyIncomingAmount:
            acc.companyIncomingAmount + (item?.companyRate + (item?.companyGuardPrice || 0) - (item?.companyPenalty || 0)),
          driverOutgoingAmount: acc.driverOutgoingAmount + (item?.driverRate + (item?.driverGuardPrice || 0) - (item?.driverPenalty || 0)),
          vendorOutgoingAmount: acc.vendorOutgoingAmount + (item?.vendorRate + (item?.vendorGuardPrice || 0) - (item?.vendorPenalty || 0))
        }),
        {
          tripCount: 0,
          companyIncomingAmount: 0,
          driverOutgoingAmount: 0,
          vendorOutgoingAmount: 0
        }
      );
      console.log('Calculated Totals = ', totals);
      setOverAllData(totals);

      const chartData = cabReportData.reduce(
        (acc, item) => ({
          companyGuardPrice: acc.companyGuardPrice + (item?.companyGuardPrice || 0),
          driverGuardPrice: acc.driverGuardPrice + (item?.driverGuardPrice || 0),
          vendorGuardPrice: acc.vendorGuardPrice + (item?.vendorGuardPrice || 0),
          companyPenalty: acc.companyPenalty + (item?.companyPenalty || 0),
          driverPenalty: acc.driverPenalty + (item?.driverPenalty || 0),
          vendorPenalty: acc.vendorPenalty + (item?.vendorPenalty || 0),
          companyRate: acc.companyRate + (item?.companyRate || 0),
          driverRate: acc.driverRate + (item?.driverRate || 0),
          vendorRate: acc.vendorRate + (item?.vendorRate || 0),
          addOnRate: acc.addOnRate + (item?.addOnRate || 0),
          tollCharge: acc.tollCharge + (item?.tollCharge || 0),
          mcdCharge: acc.mcdCharge + (item?.mcdCharge || 0)
        }),
        {
          totalTripCount: 0,
          companyGuardPrice: 0,
          driverGuardPrice: 0,
          vendorGuardPrice: 0,
          companyPenalty: 0,
          driverPenalty: 0,
          vendorPenalty: 0,
          companyRate: 0,
          driverRate: 0,
          vendorRate: 0,
          addOnRate: 0,
          tollCharge: 0,
          mcdCharge: 0
        }
      );
      console.log('Calculated Chart Data = ', chartData);

      const val = Object.values(chartData);
      console.log('val', val);
      setData(val);
      setChartData(chartData);
    }
  }, [cabReportData]);

  return (
    <>
      <Stack gap={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card title="Total Trips" count={overAllData.tripCount} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card title="Total Income From Company" count={overAllData.companyIncomingAmount} currency />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card title="Total Expenses To Drivers" count={overAllData.driverOutgoingAmount} currency />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card title="Total Expenses To Vendors" count={overAllData.vendorOutgoingAmount} currency />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              title="Profit/Loss"
              count={overAllData.companyIncomingAmount - overAllData.driverOutgoingAmount - overAllData.vendorOutgoingAmount}
              currency
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} sm={6}>
            {/* <ApexPieChart labels={['Components', 'Widgets', 'Pages', 'Charts', 'Apps', 'Layouts']} data={[10, 50, 40, 20, 50, 30]} /> */}
            <ApexPieChart labels={labels} series={data} />
          </Grid>

          {/* Badges */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={3}>
              {/* <Grid item xs={12} sm={6} md={4}>
                <Badge title="Company Guard Price" count={chartData.companyGuardPrice} currency />
              </Grid> */}
              {labels.map((item, i) => {
                return (
                  <Grid item key={i} xs={12} sm={6} md={4}>
                    <Badge title={item} count={chartData[labelsMapping[item]]} currency />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default Analytic;
