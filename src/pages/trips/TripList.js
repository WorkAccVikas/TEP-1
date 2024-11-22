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
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Button,
  CircularProgress,
  Dialog
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project-imports
import Loader from 'components/Loader';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import TripCard from 'components/cards/trips/TripCard';
import { CSVExport, HeaderSort, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import AlertColumnDelete from 'sections/apps/kanban/Board/AlertColumnDelete';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete, getInvoiceList } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';

// assets
import { Add, Edit, Eye, InfoCircle, More, ProfileTick, Trash } from 'iconsax-react';
import TripChart from 'components/cards/trips/TripChart';
import AlertDialog from 'components/alertDialog/AlertDialog';
import axiosServices from 'utils/axios';
import FormDialog from 'components/alertDialog/FormDialog';
import { convertToDateUsingMoment, formatDateForApi, formatDateUsingMoment, formattedDate } from 'utils/helper';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import { Link } from 'react-router-dom';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import DateRangeSelect from 'components/DateRange/DateRangeSelect';
import LoadingButton from 'themes/overrides/LoadingButton';
import CustomAlertDelete from 'sections/cabprovidor/advances/CustomAlertDelete';
import AddNewTrip from './AddNewTrip';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import { fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchAllDrivers, fetchDrivers1 } from 'store/slice/cabProvidor/driverSlice';
import { fetchCab1 } from 'store/slice/cabProvidor/cabSlice';

const avatarImage = require.context('assets/images/users', true);

const TRIP_STATUS = {
  PENDING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  UNATTENDED: 4
};

const POPUP_TYPE = {
  ALERT_DIALOG: 'ALERT_DIALOG',
  FORM_DIALOG: 'FORM_DIALOG'
};

const getTabName = (status) => {
  switch (status) {
    case TRIP_STATUS.PENDING:
      return 'Pending';
    case TRIP_STATUS.COMPLETED:
      return 'Completed';
    case TRIP_STATUS.CANCELLED:
      return 'Cancelled';
    case TRIP_STATUS.UNATTENDED:
      return 'Unattended';
    default:
      return 'All';
  }
};

const changeStatusFromAPI = async (tripId, updatedStatus, remarks) => {
  try {
    console.log('Api calling ...........');
    const response = await axiosServices.put('/assignTrip/update/status', {
      data: {
        tripId: tripId,
        assignedStatus: updatedStatus,
        ...(updatedStatus === TRIP_STATUS.CANCELLED && { remarks: remarks })
      }
    });

    return response.data;
  } catch (error) {
    console.log('Out of service for change status', error);
    throw error;
  }
};

const DeleteButton = ({ selected = [], visible, deleteURL, handleRefetch }) => {
  console.log('selected', selected);
  console.log('DataURL', deleteURL);
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      // await new Promise((resolve) => setTimeout(resolve, 5000));
      await axiosServices.delete(deleteURL, {
        data: {
          data: {
            Ids: selected
          }
        }
      });
      dispatch(
        openSnackbar({
          open: true,
          message: 'Deleted successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );

      handleRefetch();
    } catch (error) {
      console.log('Error in delete', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error?.message || 'Something went wrong',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForRemove = useCallback(() => {
    setRemove(false);
  }, []);

  return (
    <>
      {visible && selected.length > 0 && (
        <>
          <Button
            variant="contained"
            color="error"
            size="medium"
            startIcon={loading ? <CircularProgress size="20" /> : <Trash />}
            sx={{
              position: 'absolute',
              right: -1,
              top: -1,
              borderRadius: '0 4px 0 4px'
            }}
            // onClick={handleDelete}
            onClick={() => setRemove(true)}
            disabled={loading}
          >
            Delete ({selected.length})
          </Button>

          {remove && (
            <CustomAlertDelete
              title={'This action is irreversible. Please check before deleting.'}
              open={remove}
              handleClose={handleCloseForRemove}
              handleDelete={handleDelete}
            />
          )}
        </>
      )}
    </>
  );
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, deleteButton = false, deleteURL, handleRefetch, handleOpen, handleClose }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['avatar', 'email', '_id'],
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

  console.log('selectedRowIds = ', selectedRowIds);

  const selectedRowIdsArray = Object.keys(selectedRowIds); // Get keys of selected rows
  const selectedRows = selectedRowIdsArray.map((id) => rows[id]?.original?._id).filter(Boolean);
  // .filter((item) => item.assignedStatus === TRIP_STATUS.COMPLETED); // Map to _id of rows
  console.log('selectedRows = ', selectedRows);

  console.log('rows', rows);

  const componentRef = useRef(null);

  // ================ Tab ================

  const groups = ['All', ...new Set(data.map((item) => item.assignedStatus))];
  // const groups = ['All', 'Pending', 'Completed', 'Cancelled'];

  console.log('Data = ', data);

  const countGroup = data.map((item) => item.assignedStatus);
  const counts = {
    Pending: countGroup.filter((status) => status === TRIP_STATUS.PENDING).length,
    Completed: countGroup.filter((status) => status === TRIP_STATUS.COMPLETED).length,
    Cancelled: countGroup.filter((status) => status === TRIP_STATUS.CANCELLED).length,
    Unattended: countGroup.filter((status) => status === TRIP_STATUS.UNATTENDED).length
  };

  const [activeTab, setActiveTab] = useState(groups[0]);

  console.log({ groups, countGroup, counts, activeTab });

  useEffect(() => {
    console.log('Tab = ', activeTab);
    setFilter('status', activeTab === 'All' ? '' : activeTab === TRIP_STATUS.PENDING ? 1 : activeTab === TRIP_STATUS.COMPLETED ? 2 : 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
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
                        : status === TRIP_STATUS.COMPLETED
                        ? counts.Completed
                        : status === TRIP_STATUS.PENDING
                        ? counts.Pending
                        : counts.Cancelled
                    }
                    color={
                      status === 'All'
                        ? 'primary'
                        : status === TRIP_STATUS.COMPLETED
                        ? 'success'
                        : status === TRIP_STATUS.PENDING
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

          <Button variant="contained" size="small" color="secondary" startIcon={<Add />} onClick={handleOpen}>
            Add Trip
          </Button>
        </Stack>
      </Box>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}

      <DeleteButton selected={selectedRows} visible={deleteButton} deleteURL={deleteURL} handleRefetch={handleRefetch} />

      {/* <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 2}>
          <CSVExport data={data} filename={'invoice-list.csv'} />
        </Stack>
      </Stack> */}
      <Box ref={componentRef} sx={{ mt: 2 }}>
        <ScrollX>
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
              {page.map((row, i) => {
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
        </ScrollX>

        <Box sx={{ p: 2, py: 3 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
        </Box>
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| TRIP - LIST ||============================== //

const TripList = () => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [alertCancelOpen, setAlertCancelOpen] = useState(false);
  const [popup, setPopup] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState(-1);
  const { alertPopup } = useSelector((state) => state.invoice);
  const [cancelText, setCancelText] = useState('');
  const [data, setData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [cabOptions, setCabOptions] = useState([]);

  const [tripStats, setTripStats] = useState({
    completedTripsCount: 0,
    completedTripsAmount: 0,
    assignedTripsCount: 0,
    assignedTripsAmount: 0,
    canceledTripsCount: 0,
    canceledTripsAmount: 0
  });

  useEffect(() => {
    const calculateTripStats = (tripArray) => {
      const stats = {
        completedTripsCount: 0,
        completedTripsAmount: 0,
        assignedTripsCount: 0,
        assignedTripsAmount: 0,
        canceledTripsCount: 0,
        canceledTripsAmount: 0
      };

      data &&
        data.reduce((acc, trip) => {
          const { assignedStatus, companyGuardPrice, companyRate, companyPenalty, tollCharge, mcdCharge, addOnRate } = trip;

          const tripAmount = companyGuardPrice + companyRate - companyPenalty + tollCharge + mcdCharge + addOnRate;

          // Calculate for completed trips (assignedStatus === 2)
          if (assignedStatus === 2) {
            acc.completedTripsCount += 1;
            acc.completedTripsAmount += tripAmount;
          }

          // Calculate for assigned trips (assignedStatus === 1)
          if (assignedStatus === 1) {
            acc.assignedTripsCount += 1;
            acc.assignedTripsAmount += tripAmount;
          }

          // Calculate for canceled trips (assignedStatus === 3)
          if (assignedStatus === 3) {
            acc.canceledTripsCount += 1;
            acc.canceledTripsAmount += tripAmount;
          }

          return acc;
        }, stats);

      return stats;
    };

    // Calculate stats and update state
    const updatedStats = calculateTripStats(data);
    setTripStats(updatedStats);
  }, [data]);

  console.log({ tripStats });

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.ALL_TIME);

  console.log({ data });
  useEffect(() => {
    // dispatch(getInvoiceList()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps

    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
    dispatch(fetchAllVehicleTypesForAll());
    dispatch(fetchDrivers1());
    dispatch(fetchCab1());

    // const fetchDrivers = async () => {
    //   const response = await axiosServices.get('/driver/all?drivertype=1');
    //   setDrivers(response.data.data.result);
    // };

    // const fetchCabs = async () => {
    //   const response = await axiosServices.get('/vehicle/all/linked/drivers');
    //   setCabOptions(response.data.data);
    // };

    // fetchDrivers();
    // fetchCabs();
  }, []);

  const [invoiceId, setInvoiceId] = useState(0);
  const [getInvoiceId, setGetInvoiceId] = useState(0);

  const navigate = useNavigate();

  const handleClose = (status) => {
    if (status) {
      dispatch(getInvoiceDelete(invoiceId));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
    dispatch(
      alertPopupToggle({
        alertToggle: false
      })
    );
  };

  const handleCloseAlert = () => {
    console.log('handleCloseAlert');
    setSelectedRow(null);
    setPopup('');
    setUpdatedStatus(-1);
    setAlertOpen(false);
  };

  const handleConfirmAlert = () => {
    console.log('handleConfirmAlert , ', selectedRow);
    setAlertOpen(false);
    // setPopup('');
  };

  const handleTextChange = (event) => {
    console.log('handleTextChange', event.target.value);
    setCancelText(event.target.value);
  };

  const handleRefetch = useCallback(() => {
    setRefetch((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosServices.get('/assignTrip/all/trips/cabProvider', {
          params: {
            startDate: formatDateUsingMoment(startDate),
            endDate: formatDateUsingMoment(endDate)
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.log('Error at fetching trips = ', error);
        dispatch(
          openSnackbar({
            open: true,
            message: error?.message || 'Something went wrong',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      }
    };

    fetchData();
  }, [refetch, startDate, endDate]);

  useEffect(() => {
    console.log('UseEffect1 running ......... ');
    console.log({
      selectedRow,
      updatedStatus,
      alertOpen
    });

    if (selectedRow && !alertOpen && updatedStatus !== -1) {
      // TODO : Change Api status
      console.log('Row Selected', selectedRow);
      console.log('UseEffect1 running ......... ');

      const changeStatus = async () => {
        try {
          // const response = await axiosServices.put('/assignTrip/update/status', {
          //   data: {
          //     tripId: selectedRow.id,
          //     assignedStatus: updatedStatus
          //   }
          // });

          console.log('Api calling for complete');

          await changeStatusFromAPI(selectedRow._id, updatedStatus, cancelText);

          dispatch(
            openSnackbar({
              open: true,
              message: 'Trips Status changed successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          setRefetch((prev) => !prev);
          setUpdatedStatus(-1);
          setSelectedRow(null);
          setPopup('');
        } catch (error) {
          console.log('Error while changing status = ', error);
          dispatch(
            openSnackbar({
              open: true,
              message: error?.message || 'Something went wrong',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      };

      changeStatus();
    }
  }, [selectedRow, alertOpen, updatedStatus, cancelText]);

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
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          // console.log('row', row);

          const [anchorEl, setAnchorEl] = useState(null);
          const [status, setStatus] = useState(null);

          const handleMenuClick = (event) => {
            setAnchorEl(event.currentTarget);
          };

          const handleMenuClose = () => {
            setAnchorEl(null);
          };

          const handleCompleted = () => {
            // alert('Completed');
            console.log('row', row.original);
            row.original.status = 'Completed'; // Update the row's status
            setSelectedRow(row.original);

            setUpdatedStatus(TRIP_STATUS.COMPLETED);
            setPopup(POPUP_TYPE.ALERT_DIALOG);
            setAlertOpen(true);
            handleMenuClose(); // Close the menu after selecting an option
          };

          const handlePending = () => {
            // alert('Pending');
            console.log('row', row.original);
            row.original.status = 'Pending'; // Update the row's status
            setSelectedRow(row.original);
            // setAlertOpen(true);
            handleMenuClose(); // Close the menu after selecting an option
          };

          const handleCancelled = () => {
            // alert('Cancelled');
            console.log('row', row.original);
            row.original.status = 'Cancelled'; // Update the row's status
            setSelectedRow(row.original);
            setUpdatedStatus(TRIP_STATUS.CANCELLED);
            // setAlertCancelOpen(true);
            setPopup(POPUP_TYPE.FORM_DIALOG);

            setAlertOpen(true);

            handleMenuClose(); // Close the menu after selecting an option
          };

          const openMenu = Boolean(anchorEl);

          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <IconButton edge="end" aria-label="more actions" color="secondary" onClick={handleMenuClick}>
                <More style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  'aria-labelledby': 'fade-button'
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                {row.original.assignedStatus !== TRIP_STATUS.COMPLETED && <MenuItem onClick={handleCompleted}>Completed</MenuItem>}
                {/* {row.original.assignedStatus !== TRIP_STATUS.PENDING && <MenuItem onClick={handlePending}>Pending</MenuItem>} */}
                {row.original.assignedStatus !== TRIP_STATUS.CANCELLED && <MenuItem onClick={handleCancelled}>Cancelled</MenuItem>}
              </Menu>
            </Stack>
          );
        }
      },
      {
        Header: 'Status',
        accessor: 'assignedStatus',
        id: 'status', // Explicitly set id to 'status' for clarity
        disableFilters: true,
        // filter: 'includes',
        Cell: ({ value }) => {
          switch (value) {
            case TRIP_STATUS.PENDING: {
              return <Chip label="Pending" color="warning" variant="light" />;
            }
            case TRIP_STATUS.COMPLETED: {
              return <Chip label="Completed" color="success" variant="light" />;
            }
            case TRIP_STATUS.CANCELLED: {
              return <Chip label="Cancelled" color="error" variant="light" />;
            }
            default: {
              return <Chip label="Not Defined" color="error" variant="light" />;
            }
          }
        }
      },

      {
        title: '_id',
        Header: '_id'
      },
      {
        Header: 'Company Name',
        accessor: 'companyID.company_name',
        disableFilters: true,
        Cell: ({ row, value }) => {
          console.log('row', row.original);
          console.log('row', row.original._id);

          return (
            <Typography>
              <Link
                to={`/apps/trips/trip-view/${row.original.tripId}?id=${row.original._id}`}
                onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none', color: 'rgb(70,128,255)' }}
              >
                {row.original.companyID.company_name}
              </Link>
            </Typography>
          );
        }
      },
      {
        Header: 'Trip Date',
        accessor: 'tripDate',
        disableFilters: true,
        Cell: ({ value }) => {
          // console.log(`🚀 ~ TripList ~ value:`, value);
          return formattedDate(value, 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Trip Time',
        accessor: 'tripTime'
      },
      {
        Header: 'Zone Name',
        accessor: 'zoneNameID.zoneName'
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneTypeID.zoneTypeName'
      },
      {
        Header: 'Cab',
        accessor: 'vehicleNumber.vehicleNumber'
      },
      {
        Header: 'Cab Type',
        accessor: 'vehicleTypeID.vehicleTypeName'
      },
      {
        Header: 'Driver',
        accessor: 'driverId.userName',
        Cell: ({ value }) => value || 'None'
      },
      {
        Header: 'Guard',
        accessor: 'guard'
      },
      {
        Header: 'Guard Price',
        accessor: 'guardPrice'
      },
      {
        Header: 'Company Rate',
        accessor: 'companyRate'
      },
      {
        Header: 'Vendor Rate',
        accessor: 'vendorRate'
      },
      {
        Header: 'Driver Rate',
        accessor: 'driverRate'
      },
      {
        Header: 'Additional Rate',
        accessor: 'addOnRate'
      },
      {
        Header: 'Penalty',
        accessor: 'penalty'
      },
      {
        Header: 'Location',
        accessor: 'location',
        Cell: ({ value }) => value || 'None'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
      }
    ],
    []
  );

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const widgetsData = [
    {
      title: 'Completed',
      count: '₹7,825',
      percentage: 70.5,
      isLoss: false,
      invoice: '9',
      color: theme.palette.success,
      chartData: [200, 600, 100, 400, 300, 400, 50]
    },
    {
      title: 'Pending',
      count: '₹1,880',
      percentage: 27.4,
      isLoss: true,
      invoice: '6',
      color: theme.palette.warning,
      chartData: [100, 550, 300, 350, 200, 100, 300]
    },
    {
      title: 'Overdue',
      count: '₹3,507',
      percentage: 27.4,
      isLoss: true,
      invoice: '4',
      color: theme.palette.error,
      chartData: [100, 550, 200, 300, 100, 200, 300]
    }
  ];

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Roster', to: '/apps/roster/all-roster' },
    { title: 'Trips', to: '/apps/trips/list' }
  ];

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setId('');
  }, []);

  const handleModalOpen = useCallback(() => setIsOpen(true), []);

  // console.log('Data = ', data);

  if (loading) return <Loader />;

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Breadcrumbs custom links={breadcrumbLinks} />

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

      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item md={8}>
          <Grid container direction="row" spacing={2}>
            {widgetsData.map((widget, index) => (
              <Grid item sm={4} xs={12} key={index}>
                <MainCard>
                  <TripCard
                    title={widget.title}
                    count={widget.count}
                    percentage={widget.percentage}
                    isLoss={widget.isLoss}
                    invoice={widget.invoice}
                    color={widget.color.main}
                  >
                    <TripChart color={widget.color} data={widget.chartData} />
                  </TripCard>
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
                <Avatar alt="Natacha" variant="rounded" type="filled">
                  <ProfileTick style={{ fontSize: '20px' }} />
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="white">
                      Total Recievables
                    </Typography>
                    <InfoCircle color={theme.palette.background.paper} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" color="white">
                      Current
                    </Typography>
                    <Typography variant="body1" color="white">
                      109.1k
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" color="white">
                  Overdue
                </Typography>
                <Typography variant="body1" color="white">
                  62k
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h4" color="white" sx={{ pt: 2, pb: 1, zIndex: 1 }}>
              ₹43,078
            </Typography>
            <Box sx={{ maxWidth: '100%' }}>
              <LinearWithLabel value={90} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Stack gap={2}>
        <MainCard content={false}>
          {/* <ScrollX> */}
          {/* <ReactTable columns={columns} data={dummyData} /> */}
          {data?.length > 0 && (
            <ReactTable
              columns={columns}
              data={data}
              deleteButton
              deleteURL="/assignTrip/delete/trips"
              handleRefetch={handleRefetch}
              handleClose={handleCloseModal}
              handleOpen={handleModalOpen}
            />
          )}
          {/* </ScrollX> */}
        </MainCard>
      </Stack>

      <AlertColumnDelete title={`${getInvoiceId}`} open={alertPopup} handleClose={handleClose} />

      {alertOpen && popup === POPUP_TYPE.ALERT_DIALOG && (
        <AlertDialog
          open={alertOpen}
          handleClose={handleCloseAlert}
          handleConfirm={handleConfirmAlert}
          title="Change Trip Status"
          content="Are you sure you want to change this trip status?"
          // cancelledButtonTitle="Disagree"
          // confirmedButtonTitle="Agree"
        />
      )}

      {alertOpen && popup === POPUP_TYPE.FORM_DIALOG && (
        <FormDialog
          open={alertOpen}
          handleClose={handleCloseAlert}
          handleConfirm={handleConfirmAlert}
          handleTextChange={handleTextChange}
          title="Cancel Trip"
          content="Are you sure you want to cancel this trip?"
        />
      )}

      {isOpen && (
        <Dialog
          fullScreen
          open={isOpen}
          onClose={handleCloseModal}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AddNewTrip handleClose={handleCloseModal} handleRefetch={handleRefetch} id={id} />
        </Dialog>
      )}
    </>
  );
};

TripList.propTypes = {
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

export default TripList;
