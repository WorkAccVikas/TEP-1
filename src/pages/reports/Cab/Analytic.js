import PropTypes from 'prop-types';
import { Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'store';
import { ApexPieChart } from 'pages/reports/components/ApexPieChart';
import Badge from 'pages/reports/components/Badge';
import Card from 'pages/reports/components/Card';

const labels = [
  'Company Rate',
  'Company Guard Price',
  'Company Penalty',
  'Vendor Rate',
  'Vendor Guard Price',
  'Vendor Penalty',
  'Driver Rate',
  'Driver Guard Price',
  'Driver Penalty',
  'Add On Rate',
  'Toll Charge',
  'MCD Charge'
];

const labelsMapping = {
  'Company Rate': 'companyRate',
  'Company Guard Price': 'companyGuardPrice',
  'Company Penalty': 'companyPenalty',
  'Driver Rate': 'driverRate',
  'Driver Guard Price': 'driverGuardPrice',
  'Driver Penalty': 'driverPenalty',
  'Vendor Rate': 'vendorRate',
  'Vendor Guard Price': 'vendorGuardPrice',
  'Vendor Penalty': 'vendorPenalty',
  'Add On Rate': 'addOnRate',
  'Toll Charge': 'tollCharge',
  'MCD Charge': 'mcdCharge'
};

const Analytic = () => {
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
  const [data, setData] = useState([]);
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

      setOverAllData(totals);

      const chartDataTotals = cabReportData.reduce(
        (acc, item) => {
          Object.keys(labelsMapping).forEach((label) => {
            const key = labelsMapping[label];
            acc[key] = acc[key] + (item?.[key] || 0);
          });
          return acc;
        },
        {
          companyRate: 0,
          companyGuardPrice: 0,
          companyPenalty: 0,
          driverRate: 0,
          driverGuardPrice: 0,
          driverPenalty: 0,
          vendorRate: 0,
          vendorGuardPrice: 0,
          vendorPenalty: 0,
          addOnRate: 0,
          tollCharge: 0,
          mcdCharge: 0
        }
      );

      setChartData(chartDataTotals);

      const chartValues = labels.map((label) => chartDataTotals[labelsMapping[label]]);
      setData(chartValues);
    }
  }, [cabReportData]);

  return (
    <>
      <Stack gap={2}>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {[
            { title: 'Total Trips', count: overAllData.tripCount },
            { title: 'Income', count: overAllData.companyIncomingAmount, currency: true },
            { title: 'Driver Expenses', count: overAllData.driverOutgoingAmount, currency: true },
            { title: 'Vendor Expenses', count: overAllData.vendorOutgoingAmount, currency: true },
            {
              title: 'Total Revenue',
              count: overAllData.companyIncomingAmount - overAllData.driverOutgoingAmount - overAllData.vendorOutgoingAmount,
              currency: true
            }
          ].map((cardData, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card title={cardData.title} count={cardData.count} currency={cardData.currency} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} sm={6}>
            <ApexPieChart labels={labels} series={data} />
          </Grid>

          {/* Badges */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={3}>
              {labels.map((item, i) => (
                <Grid item key={i} xs={12} sm={6} md={4}>
                  <Badge title={item} count={chartData[labelsMapping[item]]} currency />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default Analytic;
