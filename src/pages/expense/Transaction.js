import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Grid,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project-imports
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import { HeaderSort, IndeterminateCheckbox, TablePagination } from 'components/third-party/ReactTable';

import { useSelector } from 'store';
import { renderFilterTypes, DateColumnFilter } from 'utils/react-table';

// assets
import { formatDateUsingMoment } from 'utils/helper';
import axiosServices from 'utils/axios';
import { USERTYPE } from 'constant';
import CompanyFilter from 'pages/trips/filter/CompanyFilter';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import VendorFilter from 'pages/trips/filter/VendorFilter';
import DriverFilter from 'pages/trips/filter/DriverFilter';

const API_URL = {
  [USERTYPE.iscabProvider]: '/invoice/by/cabProviderId',
  [USERTYPE.isVendor]: '/invoice/all/vendor'
};

const INVOICE_STATUS = {
  UNPAID: 0,
  PAID: 1,
  CANCELLED: 2
};

const getTabName = (status) => {
  switch (status) {
    case INVOICE_STATUS.PAID:
      return 'Income';
    case INVOICE_STATUS.UNPAID:
      return 'Expense';
    default:
      return 'All';
  }
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['avatar', 'email'],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef = useRef(null);
  const navigate = useNavigate();

  // ================ Tab ================

  // Map status codes to labels and colors

  // Create groups and counts
  const groups = ['All', INVOICE_STATUS.PAID, INVOICE_STATUS.UNPAID];

  const countGroup = data.map((item) => item.status);
  console.log('rows', rows);

  const counts = {
    Income: countGroup.filter((status) => status === INVOICE_STATUS.PAID).length,
    Expense: countGroup.filter((status) => status === INVOICE_STATUS.UNPAID).length
    // Cancelled: countGroup.filter((status) => status === INVOICE_STATUS.CANCELLED).length
  };

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    console.log('x = ', activeTab);

    setFilter('status', activeTab === 'All' ? '' : activeTab);
  }, [activeTab, setFilter]);

  // useEffect(() => {
  //   console.log('x = ', activeTab);
  //   setFilter('status', activeTab === 'All' ? '' : activeTab === INVOICE_STATUS.UNPAID ? 1 : activeTab === INVOICE_STATUS.PAID ? 2 : 3);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeTab]);

  const filterData = rows.filter((row) => {
    if (activeTab === 'All') {
      return true;
    } else {
      return row.original.status === activeTab;
    }
  });

  console.log('filterData', filterData);

  return (
    <>
      <Box sx={{ p: 1, pb: 0, width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {groups.map((status, index) => (
              <Tab
                key={index}
                label={getTabName(status)}
                value={status}
                icon={
                  <Chip
                    label={
                      status === 'All'
                        ? data.length
                        : status === INVOICE_STATUS.PAID
                        ? counts.Paid
                        : status === INVOICE_STATUS.UNPAID
                        ? counts.Unpaid
                        : counts.Cancelled
                    }
                    color={
                      status === 'All'
                        ? 'primary'
                        : status === INVOICE_STATUS.PAID
                        ? 'success'
                        : status === INVOICE_STATUS.UNPAID
                        ? 'warning'
                        : 'error'
                    }
                    variant="light"
                    size="small"
                  />
                }
                iconPosition="end"
              />
            ))}
          </Tabs>
        </Stack>
      </Box>

      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {filterData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize).map((row, i) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination
                  gotoPage={gotoPage}
                  rows={filterData}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================||Transaction - LIST ||============================== //

const Transaction = () => {
  const [loading, setLoading] = useState(true);
  const userType = useSelector((state) => state.auth.userType);
  console.log(`🚀 ~ List ~ userType:`, userType);

  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const handleRefetch = useCallback(() => {
    setRefetch((prev) => !prev);
  }, []);

  console.log({ metadata });

  const [filterOptions, setFilterOptions] = useState({
    selectedCompany: {}
  });

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosServices.get(API_URL[userType], {
          params: {
            // page: page,
            // limit: limit,
            invoiceStartDate: formatDateUsingMoment(startDate),
            invoiceEndDate: formatDateUsingMoment(endDate),
            companyId: filterOptions?.selectedCompany?._id
          }
        });
        console.log('response', response);

        setData(response.data.data);
        setMetadata(response.data?.metaData || {});
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [userType, filterOptions, startDate, endDate, refetch]);

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />,
        accessor: 'selection',
        Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: '#',
        accessor: '',
        disableFilters: true,
        Cell: ({ row }) => {
          const serialNo = row.index + 1;
          return <Typography>{serialNo}</Typography>;
        }
      },
      {
        Header: 'Transaction ID',
        accessor: 'transactionsId',
        disableFilters: true
      },
      {
        Header: 'Transaction Type',
        accessor: 'transactionsType',
        Cell: ({ value }) => <Chip label={value} color={value === 'INCOME' ? 'success' : 'error'} size="small" variant="light" />
      },
      {
        Header: 'Received Amount',
        accessor: 'receivedAmount',
        Cell: ({ value }) => <Typography>₹ {value}</Typography>
      },
      {
        Header: 'TDS Rate',
        accessor: 'TDSRate',
        Cell: ({ value }) => <Typography>{value}%</Typography>
      },
      {
        Header: 'TDS Amount',
        accessor: 'TDSAmount',
        Cell: ({ value }) => <Typography>₹ {value}</Typography>
      },
      {
        Header: 'Total GST',
        accessor: 'totalGST',
        Cell: ({ value }) => <Typography>₹ {value}</Typography>
      },
      {
        Header: 'IGST',
        accessor: 'IGST',
        Cell: ({ value }) => <Typography>₹ {value}</Typography>
      },
      {
        Header: 'CGST',
        accessor: 'CGST',
        Cell: ({ value }) => <Typography>₹ {value}</Typography>
      },
      {
        Header: 'Payment To',
        accessor: 'paymentTo',
        Cell: ({ value }) => <Typography>{value}</Typography>
      },
      {
        Header: 'Payment By',
        accessor: 'paymentBy',
        Cell: ({ value }) => <Typography>{value}</Typography>
      },
      {
        Header: 'Invoice',
        accessor: 'invoice',
        Cell: ({ value }) => <Typography>{value}</Typography>
      },
      {
        Header: 'Advance',
        accessor: 'advance',
        Cell: ({ value }) => <Typography>₹ {value}</Typography>
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        Cell: ({ value }) => {
          if (value === 2) {
            return <Chip color="error" label="Cancelled" size="small" variant="light" />;
          } else if (value === 1) {
            return <Chip color="success" label="Paid" size="small" variant="light" />;
          } else if (value === 0) {
            return <Chip color="info" label="Unpaid" size="small" variant="light" />;
          }
        }
      }
    ],
    []
  );

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const widgetsData = [
    {
      title: 'Income',
      count: metadata?.paid?.paidCount ?? 0,
      amount: metadata?.paid?.paidAmount ?? 0,
      percentage: (
        ((metadata?.paid?.paidCount ?? 0) /
          ((metadata?.paid?.paidCount ?? 0) + (metadata?.unpaid?.unpaidCount ?? 0) + (metadata?.overDue?.overDueCount ?? 0) || 1)) *
        100
      ).toFixed(2),
      isLoss: false,
      invoice: metadata?.paid?.paidCount ?? 0,
      color: { main: '#4caf50' },
      chartData: [] // Add your chart metadata if necessary
    },
    {
      title: 'Expense',
      count: metadata?.unpaid?.unpaidCount ?? 0,
      amount: metadata?.unpaid?.unpaidAmount ?? 0,
      percentage: (
        ((metadata?.unpaid?.unpaidCount ?? 0) /
          ((metadata?.paid?.paidCount ?? 0) + (metadata?.unpaid?.unpaidCount ?? 0) + (metadata?.overDue?.overDueCount ?? 0) || 1)) *
        100
      ).toFixed(2),
      isLoss: true,
      invoice: metadata?.unpaid?.unpaidCount ?? 0,
      color: { main: '#f44336' },
      chartData: [] // Add your chart metadata if necessary
    },
    {
      title: 'Taxes',
      count: metadata?.overDue?.overDueCount ?? 0,
      amount: metadata?.overDue?.overDueAmount ?? 0,
      percentage: (
        ((metadata?.overDue?.overDueCount ?? 0) /
          ((metadata?.paid?.paidCount ?? 0) + (metadata?.unpaid?.unpaidCount ?? 0) + (metadata?.overDue?.overDueCount ?? 0) || 1)) *
        100
      ).toFixed(2),
      isLoss: true,
      invoice: metadata?.overDue?.overDueCount ?? 0,
      color: { main: '#ff9800' },
      chartData: [] // Add your chart metadata if necessary
    }
  ];

  return (
    <>
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item md={8}>
          <Grid container direction="row" spacing={2}>
            {widgetsData.map((widget, index) => (
              <Grid item sm={4} xs={12} key={index}>
                <MainCard>
                  <InvoiceCard
                    title={widget.title}
                    count={widget.count}
                    amount={widget.amount} // Pass amount if needed
                    percentage={widget.percentage}
                    isLoss={widget.isLoss}
                    invoice={widget.invoice}
                    color={widget.color.main}
                  ></InvoiceCard>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Box
            sx={{
              background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              borderRadius: 1,
              p: 1.75
            }}
          >
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" color="white">
                    Total
                  </Typography>
                  <Typography variant="body1" color="white">
                    ₹{' '}
                    {parseFloat(
                      (
                        (metadata?.paid?.paidAmount ?? 0) +
                        (metadata?.unpaid?.unpaidAmount ?? 0) +
                        (metadata?.overDue?.overDueAmount ?? 0)
                      ).toFixed(2)
                    )}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" color="white">
                  Pending
                </Typography>
                <Typography variant="body1" color="white">
                  ₹ {parseFloat(((metadata?.unpaid?.unpaidAmount ?? 0) + (metadata?.overDue?.overDueAmount ?? 0)).toFixed(2))}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ pt: 1, zIndex: 1 }}>
              <Typography variant="body2" color="white">
                Recieved
              </Typography>
              <Typography variant="body1" color="white">
                ₹ {parseFloat((metadata?.paid?.paidAmount ?? 0).toFixed(2))}
              </Typography>
            </Stack>

            <Box sx={{ maxWidth: '100%' }}>
              <LinearWithLabel
                value={
                  (
                    ((metadata?.paid?.paidAmount ?? 0) /
                      ((metadata?.paid?.paidAmount ?? 0) +
                        (metadata?.unpaid?.unpaidAmount ?? 0) +
                        (metadata?.overDue?.overDueAmount ?? 0) || 1)) *
                    100
                  ).toFixed(2) || 0
                }
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* filter */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={1}>
          <CompanyFilter
            setFilterOptions={setFilterOptions}
            sx={{
              color: '#fff',
              '& .MuiSelect-select': {
                padding: '0.5rem',
                pr: '2rem'
              },
              '& .MuiSelect-icon': {
                color: '#fff' // Set the down arrow color to white
              },
              width: '200px',
              pb: 1
            }}
            value={filterOptions.selectedCompany}
          />
          <VendorFilter
            setFilterOptions={setFilterOptions}
            sx={{
              color: '#fff',
              '& .MuiSelect-select': {
                padding: '0.5rem',
                pr: '2rem'
              },
              '& .MuiSelect-icon': {
                color: '#fff' // Set the down arrow color to white
              },
              width: '200px',
              pb: 1
            }}
            value={filterOptions.selectedVendor}
          />
          <DriverFilter
            setFilterOptions={setFilterOptions}
            sx={{
              color: '#fff',
              '& .MuiSelect-select': {
                padding: '0.5rem',
                pr: '2rem'
              },
              '& .MuiSelect-icon': {
                color: '#fff' // Set the down arrow color to white
              },
              width: '200px',
              pb: 1
            }}
            value={filterOptions.selectedDiver}
          />
          {/* <VehicleFilter
          setFilterOptions={setFilterOptions}
          sx={{
            color: '#fff',
            '& .MuiSelect-select': {
              padding: '0.5rem',
              pr: '2rem'
            },
            '& .MuiSelect-icon': {
              color: '#fff' // Set the down arrow color to white
            },
            width: '220px',
            pb: 1
          }}
          value={filterOptions.selectedVehicle}
        /> */}

          <DateRangeSelect
            startDate={startDate}
            endDate={endDate}
            selectedRange={range}
            prevRange={prevRange}
            setSelectedRange={setRange}
            onRangeChange={handleRangeChange}
            showSelectedRangeLabel
          />
        </Stack>
      </Stack>
      <MainCard content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : data?.length > 0 ? (
            <ReactTable columns={columns} data={data} />
          ) : (
            <EmptyTableDemo />
          )}
        </ScrollX>
      </MainCard>
      {/* <AlertColumnDelete title={`${getInvoiceId}`} open={alertPopup} handleClose={handleClose} /> */}
    </>
  );
};

Transaction.propTypes = {
  row: PropTypes.object,
  values: PropTypes.object,
  email: PropTypes.string,
  avatar: PropTypes.node,
  customer_name: PropTypes.string,
  invoice_id: PropTypes.string,
  id: PropTypes.number,
  value: PropTypes.object,
  toggleRowExpanded: PropTypes.func,
  isExpanded: PropTypes.bool,
  getToggleAllPageRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func
};

function LinearWithLabel({ value, ...others }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="warning" variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="white">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number,
  others: PropTypes.any
};

export default Transaction;
