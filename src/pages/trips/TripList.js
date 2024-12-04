import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef, useCallback, forwardRef } from 'react';
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
  Menu,
  MenuItem,
  Fade,
  Button,
  CircularProgress,
  Dialog,
  Tooltip,
  Slide
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project-imports
import Loader from 'components/Loader';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import TripCard from 'components/cards/trips/TripCard';
import { HeaderSort, IndeterminateCheckbox, TablePagination } from 'components/third-party/ReactTable';
import AlertColumnDelete from 'sections/apps/kanban/Board/AlertColumnDelete';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete } from 'store/reducers/invoice';
import { renderFilterTypes, DateColumnFilter } from 'utils/react-table';

// assets
import { Add, ArrowCircleDown2, Edit, Eye, Money4, More, NotificationBing, Routing2, Trash } from 'iconsax-react';
import AlertDialog from 'components/alertDialog/AlertDialog';
import axiosServices from 'utils/axios';
import FormDialog from 'components/alertDialog/FormDialog';
import { formatDateUsingMoment, formattedDate } from 'utils/helper';
import { Link } from 'react-router-dom';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import CustomAlertDelete from 'sections/cabprovidor/advances/CustomAlertDelete';
import AddNewTrip from './AddNewTrip';
import CompanyFilter from './filter/CompanyFilter';
import VendorFilter from './filter/VendorFilter';
import DriverFilter from './filter/DriverFilter';
import VehicleFilter from './filter/VehicleFilter';
import DateRangeSelect from './filter/DateFilter';
import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import CustomAlert from './alerts/TripStatusChange';
import Avatar from 'components/@extended/Avatar';
import GenerateInvoiceAlert from './alerts/GenerateInvoiceAlert';
import { ThemeMode } from 'config';
import { USERTYPE } from 'constant';
import TransitionsModal from './TripView';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

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
      {visible && selected && selected.length > 0 && (
        <>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={loading ? <CircularProgress size="20" /> : <Trash />}
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
const ChangeStatusButton = ({ selected = [], visible, handleRefetch }) => {
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState('');

  const handleStatusCancel = async () => {
    setLoading(true);
    try {
      // Map over selected items to create an array of promises
      const promises = selected.map((item) => changeStatusFromAPI(item, 3, remarks));

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Trigger an alert once all API calls are completed
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
      handleRefetch();
    } catch (error) {
      // Handle any errors during the process
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
    } finally {
      setLoading(false);
    }
  };
  const handleStatusPending = async () => {
    setLoading(true);
    try {
      // Map over selected items to create an array of promises
      const promises = selected.map((item) => changeStatusFromAPI(item, 1, remarks));

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Trigger an alert once all API calls are completed
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
      handleRefetch();
    } catch (error) {
      // Handle any errors during the process
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
    } finally {
      setLoading(false);
    }
  };
  const handleStatusCompleted = async () => {
    setLoading(true);
    try {
      // Map over selected items to create an array of promises
      const promises = selected.map((item) => changeStatusFromAPI(item, 2, remarks));

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Trigger an alert once all API calls are completed
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
      handleRefetch();
    } catch (error) {
      // Handle any errors during the process
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
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForRemove = useCallback(() => {
    setRemove(false);
  }, []);
  return (
    <>
      {visible && selected && selected.length > 0 && (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={loading ? <CircularProgress size="20" /> : <Routing2 />}
            endIcon={<ArrowCircleDown2 />}
            onClick={() => setRemove(true)}
            disabled={loading}
          >
            Change Trip Status ({selected.length})
          </Button>

          {remove && (
            <CustomAlert
              title={'Change Trip Status?'}
              subtitle={'Select the Status from below'}
              open={remove}
              handleClose={handleCloseForRemove}
              handleCancel={handleStatusCancel}
              handleStatusPending={handleStatusPending}
              handleStatusCompleted={handleStatusCompleted}
              setRemarks={setRemarks}
              icon={
                <Avatar color="warning" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                  <NotificationBing variant="Bold" />
                </Avatar>
              }
              loading={loading}
            />
          )}
        </>
      )}
    </>
  );
};

const GenerateInvoiceButton = ({ selected = [], visible, deleteURL, handleRefetch }) => {
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceTripData, setInvoiceTripData] = useState([]);
  const navigate = useNavigate();
  console.log({ selected });

  useEffect(() => {
    if (selected && selected.length > 0) {
      const filteredData = selected.filter((item) => item.invoiceId === null);
      setInvoiceTripData(filteredData);
    }
  }, [selected]);

  console.log({ invoiceTripData });
  const handleTripGeneration = () => {
    console.log({ selected });
    navigate('/apps/invoices/test', { state: { tripData: invoiceTripData } });
  };

  const handleCloseForRemove = useCallback(() => {
    setRemove(false);
  }, []);

  return (
    <>
      {visible && invoiceTripData && invoiceTripData.length > 0 && (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={loading ? <CircularProgress size="20" /> : <Money4 />}
            onClick={() => setRemove(true)}
            disabled={loading}
          >
            Generate Invoice ({invoiceTripData.length})
          </Button>

          {remove && (
            <GenerateInvoiceAlert
              title={'This action is irreversible. Please check before deleting.'}
              open={remove}
              handleClose={handleCloseForRemove}
              handleTripGeneration={handleTripGeneration}
              tripData={selected}
            />
          )}
        </>
      )}
    </>
  );
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({
  columns,
  data,
  deleteButton = false,
  deleteURL,
  handleRefetch,
  handleOpen,
  handleTripSelectedData,
  tripSelectedData,
  otherSelectedData,
  handleOtherSelectedData,
  selectedData,
  handleSelectedData
}) {
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
    state: { pageIndex, pageSize },
    setFilter,
    selectedFlatRows
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

  useEffect(() => {
    const selectedTripRowsData = [];
    const selectedOtherRowsData = [];
    const selectedAllRowsData = [];

    if (selectedFlatRows.length > 0) {
      selectedFlatRows.forEach((row) => {
        if (row.original.assignedStatus === 2) {
          selectedTripRowsData.push(row.original); // Add to trip data
        } else {
          selectedOtherRowsData.push(row.original._id); // Add to other data
        }
        if (!row.original.invoiceId) selectedAllRowsData.push(row.original._id);
      });
    }

    handleSelectedData(selectedAllRowsData);
    handleTripSelectedData(selectedTripRowsData); // Pass filtered trip rows data
    handleOtherSelectedData(selectedOtherRowsData); // Pass filtered other rows data
  }, [selectedFlatRows, handleTripSelectedData, handleOtherSelectedData]);

  const componentRef = useRef(null);

  // ================ Tab ================

  const groups = ['All', TRIP_STATUS.COMPLETED, TRIP_STATUS.PENDING, TRIP_STATUS.CANCELLED];
  // const groups = ['All', 'Pending', 'Completed', 'Cancelled'];

  const countGroup = data.map((item) => item.assignedStatus);
  const counts = {
    Pending: countGroup.filter((status) => status === TRIP_STATUS.PENDING).length,
    Completed: countGroup.filter((status) => status === TRIP_STATUS.COMPLETED).length,
    Cancelled: countGroup.filter((status) => status === TRIP_STATUS.CANCELLED).length,
    Unattended: countGroup.filter((status) => status === TRIP_STATUS.UNATTENDED).length
  };

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab === TRIP_STATUS.PENDING ? 1 : activeTab === TRIP_STATUS.COMPLETED ? 2 : 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <GenerateInvoiceButton selected={tripSelectedData} visible={deleteButton} deleteURL={deleteURL} handleRefetch={handleRefetch} />
            <ChangeStatusButton selected={selectedData} visible={deleteButton} deleteURL={deleteURL} handleRefetch={handleRefetch} />
            <DeleteButton selected={otherSelectedData} visible={deleteButton} deleteURL={deleteURL} handleRefetch={handleRefetch} />
            <Button variant="contained" size="small" color="secondary" startIcon={<Add />} onClick={handleOpen}>
              Add Trip
            </Button>
          </Stack>
        </Stack>
      </Box>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
      <Box ref={componentRef}>
        <Box sx={{ p: 1 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
        </Box>
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

        <Box sx={{ p: 1 }}>
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
  const theme = useTheme();
  const mode = theme.palette.mode;
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tripSelectedData, setTripSelectedData] = useState(null);
  const [otherSelectedData, setOtherSelectedData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [popup, setPopup] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState(-1);
  const { alertPopup } = useSelector((state) => state.invoice);
  const [cancelText, setCancelText] = useState('');
  const [data, setData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const handleCompanyClick = (tripId) => {
    setSelectedTripId(tripId);
    setModalOpen(true);
  };
  const [filterOptions, setFilterOptions] = useState({
    selectedCompany: {},
    selectedVendor: {},
    selectedDriver: {},
    selectedVehicle: {}
  });

  const [tripStats, setTripStats] = useState({
    completedTripsCount: 0,
    completedTripsAmount: 0,
    assignedTripsCount: 0,
    assignedTripsAmount: 0,
    canceledTripsCount: 0,
    canceledTripsAmount: 0,
    completedTripsPercentage: 0,
    assignedTripsPercentage: 0,
    canceledTripsPercentage: 0,
    outgoingRate: 0
  });

  console.log({ tripStats });
  useEffect(() => {
    const calculateTripStats = (data) => {
      const stats = {
        completedTripsCount: 0,
        completedTripsAmount: 0,
        assignedTripsCount: 0,
        assignedTripsAmount: 0,
        canceledTripsCount: 0,
        canceledTripsAmount: 0,
        completedTripsPercentage: 0,
        assignedTripsPercentage: 0,
        canceledTripsPercentage: 0,
        outgoingRate: 0
      };

      if (data && data.length > 0) {
        const totalTrips = data.length;

        data.forEach((trip) => {
          const {
            assignedStatus,
            companyGuardPrice,
            companyRate,
            companyPenalty,
            tollCharge,
            mcdCharge,
            addOnRate,
            vendorRate,
            driverRate,
            vendorGuardPrice,
            vendorPenalty,
            driverGuardPrice,
            driverPenalty
          } = trip;

          const tripAmount = companyGuardPrice + companyRate - companyPenalty;
          const vendorRate1 = vendorRate + vendorGuardPrice - vendorPenalty;
          const driverRate1 = driverRate + driverGuardPrice - driverPenalty;

          console.log({ tripAmount, vendorRate1, driverRate1 });
          const outGoingRateForTrip = vendorRate1 !== 0 ? vendorRate1 : driverRate1;
          console.log({ outGoingRateForTrip });

          stats.outgoingRate += outGoingRateForTrip;
          const rateData = {
            companyGuardPrice,
            companyRate,
            companyPenalty,
            tollCharge,
            mcdCharge,
            addOnRate,
            total: tripAmount
          };

          // Completed trips
          if (assignedStatus === 2) {
            stats.completedTripsCount += 1;
            stats.completedTripsAmount += tripAmount;
          }

          // Assigned trips
          if (assignedStatus === 1) {
            stats.assignedTripsCount += 1;
            stats.assignedTripsAmount += tripAmount;
          }

          // Canceled trips
          if (assignedStatus === 3) {
            stats.canceledTripsCount += 1;
            stats.canceledTripsAmount += tripAmount;
          }
        });

        // Calculate percentages
        stats.completedTripsPercentage = ((stats.completedTripsCount / totalTrips) * 100).toFixed(2);
        stats.assignedTripsPercentage = ((stats.assignedTripsCount / totalTrips) * 100).toFixed(2);
        stats.canceledTripsPercentage = ((stats.canceledTripsCount / totalTrips) * 100).toFixed(2);
      }

      return stats;
    };

    const updatedStats = calculateTripStats(data);
    setTripStats(updatedStats);
  }, [data]);

  const widgetsData = [
    {
      title: 'Completed',
      count: `₹${(tripStats?.completedTripsAmount || 0).toFixed(2)}`,
      percentage: tripStats?.completedTripsPercentage,
      isLoss: false,
      trips: `${tripStats?.completedTripsCount || 0}`,
      color: theme.palette.success
    },
    {
      title: 'Pending',
      count: `₹${(tripStats?.assignedTripsAmount || 0).toFixed(2)}`,
      percentage: tripStats?.assignedTripsPercentage,
      isLoss: true,
      trips: `${tripStats?.assignedTripsCount || 0}`,
      color: theme.palette.warning
    },
    {
      title: 'Cancelled',
      count: `₹${(tripStats?.canceledTripsAmount || 0).toFixed(2)}`,
      percentage: tripStats?.canceledTripsPercentage,
      isLoss: true,
      trips: `${tripStats?.canceledTripsCount || 0}`,
      color: theme.palette.error
    }
  ];

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.THIS_MONTH);

  const userType = useSelector((state) => state.auth.userType);
  console.log(userType);

  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setSelectedRow(null);
    setPopup('');
    setUpdatedStatus(-1);
    setAlertOpen(false);
  };

  const handleConfirmAlert = () => {
    setAlertOpen(false);
    // setPopup('');
  };

  const handleTextChange = (event) => {
    setCancelText(event.target.value);
  };

  const handleRefetch = useCallback(() => {
    setRefetch((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosServices.get('/assignTrip/all/trips/cabProvider', {
          params: {
            startDate: formatDateUsingMoment(startDate),
            endDate: formatDateUsingMoment(endDate),
            companyID: filterOptions.selectedCompany._id,
            vehicleId: filterOptions.selectedVehicle._id,
            driverId: filterOptions.selectedDriver._id,
            vendorId: filterOptions.selectedVendor._id
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.log('Error at fetching trips = ', error);
        if (error.response.status === 500) {
          setData([]);
        } else {
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refetch, startDate, endDate, filterOptions]);

  useEffect(() => {
    if (selectedRow && !alertOpen && updatedStatus !== -1) {
      // TODO : Change Api status
      const changeStatus = async () => {
        try {
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
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
              {row.original.assignedStatus !== TRIP_STATUS.COMPLETED && (
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title="Edit"
                >
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(true); // Open the dialog for editing
                      setId(row.original._id);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="View Trip"
              >
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row expansion
                    handleCompanyClick(row.original);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
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
        Cell: ({ row, value }) => {
          switch (value) {
            case TRIP_STATUS.PENDING: {
              return <Chip label="Pending" color="warning" variant="light" />;
            }
            case TRIP_STATUS.COMPLETED: {
              return row.original.invoiceId && row.original.invoiceId !== null ? (
                <Chip
                  label="Invoice ✓"
                  color="info"
                  variant="light"
                  onClick={() => {
                    navigate(`/apps/invoices/details/${row.original.invoiceId}`);
                  }}
                  sx={{
                    ':hover': {
                      backgroundColor: 'rgba(0, 211, 211, 0.8)',
                      cursor: 'pointer'
                    }
                  }}
                />
              ) : (
                <Chip label="Completed" color="success" variant="light" />
              );
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
          return (
            <Typography>
              {/* <Link
                to={`/apps/trips/trip-view/${row.original.tripId}?id=${row.original._id}`}
                onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none', color: 'rgb(70,128,255)' }}
              >
                {row.original.companyID.company_name}
              </Link> */}
              <Link
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row expansion
                  handleCompanyClick(row.original);
                }}
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
          return formattedDate(value, 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Trip Time',
        accessor: 'tripTime'
      },
      {
        Header: 'Trip Id',
        accessor: 'rosterTripId'
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
      // {
      //   Header: 'Vehicle Guard Price',
      //   accessor: 'guardPrice', // This can be any key; we won't directly use it.
      //   Cell: ({ row }) => {
      //     const { driverGuardPrice, vendorGuardPrice } = row.original;
      //     return driverGuardPrice || vendorGuardPrice || 'Null';
      //   }
      // },
      {
        Header: 'Company Guard Price',
        accessor: 'companyGuardPrice',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Vendor Guard Price',
        accessor: 'vendorGuardPrice',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Driver Guard Price',
        accessor: 'driverGuardPrice',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Vehicle Rates',
        accessor: (row) => row.vendorRate ?? row.driverRate,
        Cell: ({ row }) => {
          const { vendorRate, driverRate } = row.original;
          return vendorRate ?? driverRate ?? 'Null';
        }
      },
      {
        Header: 'Company Rates',
        accessor: 'companyRate'
      },
      {
        Header: 'Additional Rate',
        accessor: 'addOnRate'
      },
      {
        Header: 'Company Penalty',
        accessor: 'companyPenalty',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Vendor Penalty',
        accessor: 'vendorPenalty',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Driver Penalty',
        accessor: 'driverPenalty',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Location',
        accessor: 'location',
        Cell: ({ value }) => value || 'None'
      },
      {
        Header: 'Trip Type',
        accessor: 'tripType',
        Cell: ({ value }) => {
          switch (value) {
            case 1: // For Pick Up
              return <Chip label="Pick Up" color="warning" variant="light" />;
            case 2: // For Pick Drop
              return <Chip label="Drop" color="success" variant="light" />;
          }
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({ value }) => value || 'None'
      }
    ],
    []
  );

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setId('');
  }, []);

  const handleModalOpen = useCallback(() => setIsOpen(true), []);

  // if (loading) return <Loader />;

  const handleTripSelectedData = useCallback((selectedRows) => {
    setTripSelectedData(selectedRows);
  }, []);
  const handleOtherSelectedData = useCallback((selectedRows) => {
    setOtherSelectedData(selectedRows);
  }, []);
  const handleSelectedData = useCallback((selectedRows) => {
    setSelectedData(selectedRows);
  }, []);

  return (
    <>
      {/* stats */}
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 1 }}>
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
                    trips={widget.trips}
                    color={widget.color.main}
                  ></TripCard>
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
                    Incoming
                  </Typography>
                  <Typography variant="body1" color="white">
                    ₹{' '}
                    {(
                      (tripStats?.assignedTripsAmount || 0) +
                      (tripStats?.completedTripsAmount || 0) -
                      (tripStats?.canceledTripsAmount || 0)
                    ).toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" color="white">
                  Outgoing
                </Typography>
                <Typography variant="body1" color="white">
                  ₹ {(tripStats?.outgoingRate || 0).toFixed(2)}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ pt: 1, zIndex: 1 }}>
              <Typography variant="body2" color="white">
                Profit/Loss
              </Typography>

              <Typography variant="body1" color="white">
                ₹{' '}
                {(
                  (tripStats?.assignedTripsAmount || 0) +
                  (tripStats?.completedTripsAmount || 0) -
                  (tripStats?.canceledTripsAmount || 0) -
                  (tripStats?.outgoingRate || 0)
                ).toFixed(2)}
              </Typography>
            </Stack>
            <Box sx={{ maxWidth: '100%' }}>
              <LinearWithLabel
                value={
                  (((tripStats?.assignedTripsAmount || 0) +
                    (tripStats?.completedTripsAmount || 0) -
                    (tripStats?.canceledTripsAmount || 0) -
                    (tripStats?.outgoingRate || 0)) /
                    Math.max(
                      (tripStats?.assignedTripsAmount || 0) +
                        (tripStats?.completedTripsAmount || 0) -
                        (tripStats?.canceledTripsAmount || 0),
                      1
                    )) *
                    100 || 0
                }
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* filter */}
      <Stack direction="row" alignItems="center" justifyContent="space-evenly">
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

        {userType === USERTYPE.iscabProvider && (
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
        )}
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
          value={filterOptions.selectedDriver}
        />
        <VehicleFilter
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
        />

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

      <Stack gap={2}>
        <MainCard content={false}>
          {/* <ScrollX> */}
          {loading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : data?.length > 0 ? (
            <ReactTable
              columns={columns}
              data={data}
              deleteButton
              deleteURL="/assignTrip/delete/trips"
              handleRefetch={handleRefetch}
              handleClose={handleCloseModal}
              handleOpen={handleModalOpen}
              tripSelectedData={tripSelectedData}
              handleTripSelectedData={handleTripSelectedData}
              otherSelectedData={otherSelectedData}
              handleOtherSelectedData={handleOtherSelectedData}
              selectedData={selectedData}
              handleSelectedData={handleSelectedData}
            />
          ) : (
            <EmptyTableDemo />
          )}
          {/* </ScrollX> */}
        </MainCard>
      </Stack>

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
          TransitionComponent={Transition}
        >
          <AddNewTrip handleClose={handleCloseModal} handleRefetch={handleRefetch} id={id} />
        </Dialog>
      )}

      {/* Modal Component */}
      {isModalOpen && <TransitionsModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} selectedTripId={selectedTripId} />}
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
