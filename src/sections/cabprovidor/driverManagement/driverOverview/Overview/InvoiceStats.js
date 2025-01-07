import {
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
  } from '@mui/material';
  import MainCard from 'components/MainCard';
  import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
  import { ApexPieChart } from 'pages/reports/components/ApexPieChart';
  import DateRangeSelect from 'pages/trips/filter/DateFilter';
  import { useEffect, useState } from 'react';
  import { useParams } from 'react-router';
  import { dispatch } from 'store';
  import { openSnackbar } from 'store/reducers/snackbar';
  import axiosServices from 'utils/axios';
  import { formatDateUsingMoment } from 'utils/helper';
  
  const categories = [
    { label: 'Summary', key: 'summary' },
    { label: 'Paid', key: 'paid' },
    { label: 'Unpaid', key: 'unpaid' },
    { label: 'Cancelled', key: 'cancelled' },
  ];
  
  function getInvoiceStatusArrays(data) {
    const statuses = Object.keys(data).filter((key) => key !== 'summary');
    const totals = statuses.map((status) => data[status][`sum${status.charAt(0).toUpperCase() + status.slice(1)}GrandTotal`]);
    return [statuses.map((status) => status.charAt(0).toUpperCase() + status.slice(1)), totals];
  }
  
  const InvoiceStats = () => {
    const { id } = useParams();
  
    const [invoiceStats, setInvoiceStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [labels, setLabels] = useState([]);
    const [series, setSeries] = useState([]);
  
    const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const queryParams = {
            driverId: id,
            startDate: formatDateUsingMoment(startDate),
            endDate: formatDateUsingMoment(endDate),
          };
  
          setLoading(true);
          const response = await axiosServices.get('/invoice/driver/metadata', { params: queryParams });
          const data = response.data.data;
  
          const modifiedData = {
            ...data,
            summary: {
              totalSummaryInvoiceCount: data.summary.totalInvoiceCount,
              sumSummaryGrandTotal: data.summary.sumGrandTotal,
            },
          };
  
          setInvoiceStats(modifiedData);
  
          const [label, series] = getInvoiceStatusArrays(data);
          setLabels(label);
          setSeries(series);
        } catch (error) {
          dispatch(
            openSnackbar({
              open: true,
              message: error.message,
              variant: 'alert',
              alert: { color: 'error' },
              close: true,
            })
          );
        } finally {
          setLoading(false);
        }
      };
  
      if (id && startDate && endDate) {
        fetchData();
      }
    }, [id, startDate, endDate]);
  
    return (
      <>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <MainCard
            title="Invoice Stats"
            secondary={
              <DateRangeSelect
                startDate={startDate}
                endDate={endDate}
                selectedRange={range}
                prevRange={prevRange}
                setSelectedRange={setRange}
                onRangeChange={handleRangeChange}
                showSelectedRangeLabel
              />
            }
          >
            <Stack gap={2}>
              <ApexPieChart labels={labels} series={series} />
              <Box>
                <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
                  {invoiceStats &&
                    categories.map((category) => {
                      const { label, key } = category;
                      const categoryData = invoiceStats[key];
  
                      return (
                        <ListItem key={key} divider>
                          <ListItemText
                            primary={<Typography color="text.secondary">{label}</Typography>}
                            secondary={
                              <Stack spacing={0.25}>
                                <Typography variant="subtitle1">Grand Total: ₹ {categoryData[`sum${label}GrandTotal`] || 0}</Typography>
                              </Stack>
                            }
                          />
                          <Stack spacing={0.25} alignItems="flex-end" direction="row" gap={1}>
                            <Typography variant="subtitle1">Total Invoices: </Typography>
                            <Typography>{categoryData[`total${label}InvoiceCount`] || 0}</Typography>
                          </Stack>
                        </ListItem>
                      );
                    })}
                </List>
              </Box>
            </Stack>
          </MainCard>
        )}
      </>
    );
  };
  
  export default InvoiceStats;
  