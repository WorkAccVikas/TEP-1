import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import WrapperButton from 'components/common/guards/WrapperButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import { MODULE, PERMISSIONS, USERTYPE } from 'constant';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { Add, Eye, More } from 'iconsax-react';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import { useCallback, useEffect, useMemo, useState, Fragment, useRef } from 'react';
import axios from 'utils/axios';
import { formatDateUsingMoment, formattedDate } from 'utils/helper';
import PaidModal from '../others/PaidModal';
import FormDialog from 'components/alertDialog/FormDialog';
import { CSVExport, HeaderSort, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import { ThemeMode } from 'config';
import { useSelector } from 'store';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { alpha, useTheme } from '@mui/material/styles';
import { DateColumnFilter, renderFilterTypes } from 'utils/react-table';
import { useNavigate } from 'react-router';
import PaginationBox from 'components/tables/Pagination';
import { getTabName, INVOICE_STATUS } from './List';
import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import usePagination1 from 'hooks/usePagination1';
import VendorFilter from 'pages/trips/filter/VendorFilter';

const API_URL = `/invoice/to/cabProviderId`;

const VendorInvoiceList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState({});

  const [filterOptions, setFilterOptions] = useState({
    selectedVendor: {}
  });
  const userType = useSelector((state) => state.auth.userType);

  const { page, limit, lastPageIndex, handlePageChange, handleLimitChange, handleLastPageIndexChange } = usePagination1();

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vendorId = filterOptions?.selectedVendor?._id;
        const response = await axios.get(API_URL, {
          params: {
            page,
            limit,
            invoiceStartDate: formatDateUsingMoment(startDate),
            invoiceEndDate: formatDateUsingMoment(endDate),
            vendorId
          }
        });

        console.log(`🚀 ~ fetchData ~ response:`, response);
        const data = response.data.data;
        const total = response.data.totalCount;
        const limitṣ = Number(response.data.limit);
        console.table({ data, limitṣ });

        const lastPageIndex = Math.ceil(total / limitṣ);
        console.log(`🚀 ~ fetchData ~ lastPageIndex:`, lastPageIndex);
        setMetadata(response.data?.metaData || {});

        handleLastPageIndexChange(lastPageIndex);
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, page, limit, handleLastPageIndexChange, filterOptions?.selectedVendor?._id]);

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
          const serialNo = row.index + 1; // The serial number will be the row index + 1
          return (
            <>
              <Typography>{serialNo}</Typography>
            </>
          );
        }
      },
      {
        Header: 'Invoice Id',
        accessor: 'invoiceNumber',
        disableFilters: true
      },
      {
        Header: 'Billed To',
        accessor: 'billedTo',
        disableFilters: true,
        Cell: ({ row }) => {
          const { values } = row;

          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} /> */}
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.billedTo.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {values.billedTo.company_email}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Invoice Date',
        accessor: 'invoiceDate',
        Cell: ({ value }) => {
          return formattedDate(value, 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',
        Cell: ({ value }) => {
          return formattedDate(value, 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Amount',
        accessor: 'grandTotal',
        Cell: ({ value }) => {
          return <Typography>₹ {value}</Typography>;
        }
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
            return <Chip color="warning" label="Unpaid" size="small" variant="light" />;
          } else if (value === 3) {
            return <Chip color="info" label="Pending" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        disableSortBy: true,
        Cell: ({ row }) => {
          const [anchorEl, setAnchorEl] = useState(null);
          const [dialogOpen, setDialogOpen] = useState(false);
          const [formDialogOpen, setFormDialogOpen] = useState(false);
          const [newStatus, setNewStatus] = useState(null);
          const theme = useTheme();
          const mode = theme.palette.mode;
          const [paidModalOpen, setPaidModalOpen] = useState(false);
          const [paidAmount, setPaidAmount] = useState(0);

          const handleMenuClick = (event) => {
            setAnchorEl(event.currentTarget);
          };

          const handleMenuClose = () => {
            setAnchorEl(null);
          };

          const handleStatusChange = (status) => {
            setNewStatus(status);
            if (status === 2) {
              setFormDialogOpen(true);
            } else {
              setDialogOpen(true); // Open confirmation dialog for other statuses
            }
          };

          const handleDialogClose = () => {
            setDialogOpen(false);
          };

          const handleFormDialogClose = () => {
            setFormDialogOpen(false);
          };

          const handleTextChange = (event) => {
            setRemarks(event.target.value);
          };

          const handleOpenPaidModal = useCallback((val) => {
            setPaidAmount(val);
            setPaidModalOpen(true);
          }, []);

          const handleClosePaidModal = useCallback(() => {
            setPaidModalOpen(false);
            setPaidAmount(0);
          }, []);

          const confirmStatusChange = async (type, data) => {
            try {
              const response = await axiosServices.put(`/invoice/update/paymentStatus`, {
                data: {
                  invoiceId: row.original._id,

                  status: newStatus,
                  remarks: newStatus === 2 ? remarks : undefined, // Include remarks if cancelled
                  ...(type === 'Paid' && { ...data })
                }

                // data: {
                //   invoiceId: row.original._id,
                //   transactionsId: 'VADE0B248932',
                //   transactionsType: 'EXPENSE',
                //   receivedAmount: 5000,
                //   TDSRate: 10,
                //   TDSAmount: 500,
                //   status: 0
                // }
              });

              if (response.status >= 200 && response.status < 300) {
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Invoice Status Changed',
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    },
                    close: true
                  })
                );

                handleRefetch();
              }

              row.original.status = newStatus;
              // fetchInvoice();
            } catch (error) {
              console.error('Failed to update status:', error);
              dispatch(
                openSnackbar({
                  open: true,
                  message: error.response.data?.error || 'Something went wrong',
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  },
                  close: true
                })
              );
            }

            setDialogOpen(false);
            setFormDialogOpen(false);
            handleClosePaidModal();
            handleMenuClose();
          };

          const openMenu = Boolean(anchorEl);

          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <WrapperButton moduleName={MODULE.INVOICE} permission={PERMISSIONS.READ}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title="View"
                >
                  <IconButton
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/apps/invoices/details/${row.original._id}`, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <Eye />
                  </IconButton>
                </Tooltip>
              </WrapperButton>

              {userType === USERTYPE.iscabProvider && (
                <IconButton edge="end" aria-label="more actions" color="secondary" onClick={handleMenuClick}>
                  <More style={{ fontSize: '1.15rem' }} />
                </IconButton>
              )}

              <Menu
                id="fade-menu"
                MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => handleStatusChange(0)}>Unpaid</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleOpenPaidModal(row.original.grandTotal);
                  }}
                >
                  Paid
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange(2)}>Cancelled</MenuItem>
              </Menu>

              {/* Confirmation Dialog */}
              <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <Box sx={{ p: 1, py: 1.5 }}>
                  <DialogTitle id="alert-dialog-title">Confirm Status Change</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to change the status to {newStatus === 0 ? 'Unpaid' : newStatus === 1 ? 'Paid' : 'Cancelled'}?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button color="error" onClick={handleDialogClose}>
                      Disagree
                    </Button>
                    <Button variant="contained" onClick={confirmStatusChange} autoFocus>
                      Agree
                    </Button>
                  </DialogActions>
                </Box>
              </Dialog>

              {/* FormDialog for "Cancelled" Status */}
              <FormDialog
                open={formDialogOpen}
                handleClose={handleFormDialogClose}
                handleConfirm={confirmStatusChange}
                handleTextChange={handleTextChange}
                title="Provide Remarks for Cancellation"
                content="Please provide a reason for cancelling this invoice."
                placeholder="Enter your remarks"
                cancelledButtonTitle="Disagree"
                confirmedButtonTitle="Confirm Cancellation"
                showError
              />

              {paidModalOpen && (
                <Dialog
                  open={paidModalOpen}
                  onClose={handleClosePaidModal}
                  maxWidth="sm"
                  fullWidth
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <PaidModal open={paidModalOpen} amount={paidAmount} onClose={handleClosePaidModal} onConfirm={confirmStatusChange} />
                </Dialog>
              )}
            </Stack>
          );
        }
      }
    ],
    [userType]
  );

  const widgetsData = [
    {
      title: 'Paid',
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
      title: 'Unpaid',
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
      title: 'Overdue',
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
      <Stack gap={2}>
        {/* Widget */}
        <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
          <Grid item xs={12} md={8}>
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
                    />
                  </MainCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
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
            {/* Vendor Filter */}
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
                width: '200px'
              }}
              value={filterOptions.selectedVendor}
            />

            {/* Date Filter */}
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

          <WrapperButton moduleName={MODULE.INVOICE} permission={PERMISSIONS.CREATE}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              startIcon={<Add />}
              onClick={() => navigate('/apps/invoices/create')}
            >
              Create Invoice
            </Button>
          </WrapperButton>
        </Stack>

        {/* Table */}
        <MainCard content={false}>
          <ScrollX>
            {loading ? (
              <TableSkeleton rows={10} columns={6} />
            ) : data?.length === 0 ? (
              <EmptyTableDemo />
            ) : (
              <>
                <ReactTable columns={columns} data={data} />
                {/* <h1>Table</h1> */}
              </>
            )}
          </ScrollX>
        </MainCard>

        {/* Pagination */}
        <Box>
          {data.length > 0 && (
            <PaginationBox
              pageIndex={page}
              gotoPage={handlePageChange}
              pageSize={limit}
              setPageSize={handleLimitChange}
              lastPageIndex={lastPageIndex}
              // options={[1, 3, 5]}
            />
          )}
        </Box>
      </Stack>
    </>
  );
};

export default VendorInvoiceList;

export function ReactTable({ columns, data }) {
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
  const groups = ['All', INVOICE_STATUS.PAID, INVOICE_STATUS.UNPAID, INVOICE_STATUS.CANCELLED, INVOICE_STATUS.PENDING];

  const countGroup = data.map((item) => item.status);

  const counts = {
    Paid: countGroup.filter((status) => status === INVOICE_STATUS.PAID).length,
    Unpaid: countGroup.filter((status) => status === INVOICE_STATUS.UNPAID).length,
    Cancelled: countGroup.filter((status) => status === INVOICE_STATUS.CANCELLED).length,
    Pending: countGroup.filter((status) => status === INVOICE_STATUS.PENDING).length
  };

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab);
  }, [activeTab, setFilter]);

  const filterData = rows.filter((row) => {
    if (activeTab === 'All') {
      return true;
    } else {
      return row.original.status === activeTab;
    }
  });

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
                        : status === INVOICE_STATUS.PENDING
                        ? counts.Pending
                        : counts.Cancelled
                    }
                    color={
                      status === 'All'
                        ? 'primary'
                        : status === INVOICE_STATUS.PAID
                        ? 'success'
                        : status === INVOICE_STATUS.UNPAID
                        ? 'warning'
                        : status === INVOICE_STATUS.PENDING
                        ? 'info'
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
            {filterData.map((row, i) => {
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