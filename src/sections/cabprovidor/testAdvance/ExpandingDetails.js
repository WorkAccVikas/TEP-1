import PropTypes from 'prop-types';
import { useCallback, useMemo, Fragment, useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  useTheme
} from '@mui/material';

// third-party
import { useExpanded, useSortBy, useTable } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import { Add, ArrowDown2, ArrowRight2, Eye, ShieldCross, TickCircle } from 'iconsax-react';
import ExpandingUserDetail from './ExpandingUserDetail';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';
import { ThemeMode } from 'config';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { dispatch } from 'store';
import { fetchAdvances } from 'store/slice/cabProvidor/advanceSlice';
import { PopupTransition } from 'components/@extended/Transitions';
import AdvanceForm from '../advances/AdvanceForm';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import PaginationBox from 'components/tables/Pagination';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { height, width } from '@mui/system';
import { formatDateUsingMoment } from 'utils/helper';
import { HeaderSort } from 'components/third-party/ReactTable';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';
import NewAdvance from '../advances/NewAdvance';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data, renderRowSubComponent, page, setPage, limit, setLimit, lastPageNo }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns
    // gotoPage,
    // setPageSize,
    // state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ['requestedById._id']
      }
    },
    useSortBy,
    useExpanded
  );

  return (
    <Table {...getTableProps()}>
      {/* <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead> */}
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
        {rows.map((row, i) => {
          prepareRow(row);
          const rowProps = row.getRowProps();

          return (
            <Fragment key={i}>
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
              {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
            </Fragment>
          );
        })}
        <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
          <TableCell sx={{ p: 2, py: 3 }} colSpan={12}>
            <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any
};

// ==============================|| REACT TABLE - EXPANDING DETAILS ||============================== //

const ExpandingDetails = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const navigate = useNavigate();
  const { advances, metaData, loading, error } = useSelector((state) => state.advances);
  const [advanceData, setAdvanceData] = useState(null);
  const [add, setAdd] = useState(false);
  const [key, setKey] = useState(0);
  const [updateKey, setUpdateKey] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  const handleAdvanceType = () => {
    navigate('/apps/invoices/advance-type');
  };

  const handleAdvance = (actionType) => {
    if (actionType === 'add') {
      setAdvanceData(null); // Reset for add
    }
    setAdd(!add); // Toggle dialog
  };

  const handleAdd = () => {
    setAdd(!add);
    if (advanceData && !add) setAdvanceData(null);
  };

  useEffect(() => {
    dispatch(
      fetchAdvances({
        page: page,
        limit: limit,
        startDate: formatDateUsingMoment(startDate),
        endDate: formatDateUsingMoment(endDate)
      })
    );
  }, [dispatch, page, limit, startDate, endDate, key]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          const collapseIcon = row.isExpanded ? <ArrowDown2 size={14} /> : <ArrowRight2 size={14} />;
          return (
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }} {...row.getToggleRowExpandedProps()}>
              {collapseIcon}
            </Box>
          );
        },
        SubCell: () => null
      },
      {
        Header: 'UserType',
        accessor: 'isDriver',
        Cell: ({ row }) => {
          const isDriver = row.original.isDriver;
          const isVendor = row.original.isVendor;

          if (isDriver) {
            return <Chip color="success" label="Driver" size="small" variant="light" />;
          } else if (isVendor) {
            return <Chip color="primary" label="Vendor" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Requested By',
        accessor: 'requestedById.userName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Requested Amount',
        accessor: 'requestedAmount',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
      },
      {
        Header: 'Advance Type',
        accessor: 'advanceTypeId.advanceTypeName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Interest Rate',
        accessor: 'advanceTypeId.interestRate',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({ value }) => (value && value.trim() !== '' ? value : 'N/A')
      },
      {
        Header: 'Status',
        accessor: 'isApproved',
        Cell: ({ row }) => {
          const isApproved = row.original.isApproved;

          if (isApproved == 1) {
            return <Chip color="success" label="Transferred" size="small" variant="light" />;
          } else if (isApproved == 2) {
            return <Chip color="error" label="Rejected" size="small" variant="light" />;
          } else {
            return <Chip color="warning" label="Pending" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Approved Amount',
        accessor: 'approvedAmount',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
      },
      // {
      //   Header: 'Actions',
      //   disableSortBy: true,
      //   Cell: ({ row }) => {
      //     const handleToggle = () => {
      //       // Open the dialog only for pending or rejected statuses
      //       if (row.original.isApproved === 0 || row.original.isApproved === 2) {
      //         setAdvanceData(row.original);
      //         handleAdd();
      //       }
      //     };

      //     const getSwitchColor = () => {
      //       if (row.original.isApproved === 1) return 'success'; // Green when approved
      //       if (row.original.isApproved === 2) return 'error'; // Red when rejected
      //       return 'default'; // Default color for pending
      //     };

      //     const getTooltipTitle = () => {
      //       if (row.original.isApproved === 1) return 'Approved'; // Approved status
      //       if (row.original.isApproved === 2) return 'Rejected'; // Rejected status
      //       return 'Approve'; // Default for pending state
      //     };

      //     return (
      //       <Stack direction="row" alignItems="center" justifyContent="left" spacing={0}>
      //         <WrapperButton moduleName={MODULE.ADVANCE} permission={PERMISSIONS.UPDATE}>
      //           <Tooltip
      //             componentsProps={{
      //               tooltip: {
      //                 sx: {
      //                   backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                   opacity: 0.9
      //                 }
      //               }
      //             }}
      //             title={getTooltipTitle()} // Conditional tooltip title
      //           >
      //             <Switch
      //               checked={row.original.isApproved === 1 || row.original.isApproved === 2}
      //               onChange={handleToggle}
      //               color={getSwitchColor()}
      //               disabled={row.original.isApproved === 1} // Disable switch for approved
      //             />
      //           </Tooltip>
      //         </WrapperButton>
      //       </Stack>
      //     );
      //   }
      // }
      {
        Header: 'Actions',
        disableSortBy: true,
        Cell: ({ row }) => {
          const handleChange = async (event) => {
            const selectedValue = event.target.value;

            if (selectedValue === 'Approve') {
              setAdvanceData(row.original);
              handleAdd(selectedValue);
            } else if (selectedValue === 'Reject') {
              setAdvanceData(row.original);
              await handleReject();
            }
          };

          const handleReject = async () => {
            try {
              const response = await axiosServices.put(`/advance/status/update`, {
                data: {
                  _id: row.original._id, // Assuming `_id` is part of row data
                  isApproved: 2
                }
              });

              if (response.status === 200) {
                const snackbarColor = 'error'; // Red for rejection
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Advance Status Rejected Successfully.',
                    variant: 'alert',
                    alert: {
                      color: snackbarColor
                    },
                    close: false,
                    sx: {
                      backgroundColor: theme.palette.error.main
                    }
                  })
                );
                setKey(key + 1); // Refresh key to trigger re-render
              }
            } catch (error) {
              console.error('Error updating status:', error);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Failed to update status.',
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  },
                  close: false,
                  sx: {
                    backgroundColor: theme.palette.error.main
                  }
                })
              );
            }
          };

          const handleChipClick = () => {
            setAdvanceData(row.original);
            handleAdd('Approve');
          };

          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="left"
              spacing={1} // Adjust spacing between elements
            >
              <WrapperButton moduleName={MODULE.ADVANCE} permission={PERMISSIONS.UPDATE}>
                {row.original.isApproved === 1 ? (
                  <Chip
                    icon={<TickCircle variant="Bold" />}
                    label="Approved"
                    color="success"
                    size="small"
                    variant="light"
                    sx={{
                      fontSize: '12px',
                      padding: '2px 6px'
                    }}
                  />
                ) : row.original.isApproved === 2 ? (
                  <Tooltip title="Click to Approve">
                    <Chip
                      icon={<ShieldCross variant="Bold" />}
                      label="Rejected"
                      color="error"
                      size="small"
                      variant="light"
                      onClick={handleChipClick}
                      sx={{
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '2px 6px',
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.contrastText
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                          opacity: 0.9
                        }
                      }
                    }}
                  >
                    <Select
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        minWidth: 100,
                        fontSize: '12px',
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[800] : theme.palette.grey[50],
                        color: mode === ThemeMode.DARK ? theme.palette.common.white : theme.palette.common.black,
                        borderRadius: '10px',
                        '.MuiSelect-select': {
                          padding: '8px'
                        }
                      }}
                      defaultValue=""
                    >
                      <MenuItem disabled value="">
                        Approve/Reject
                      </MenuItem>
                      <MenuItem value="Approve">Approve</MenuItem>
                      <MenuItem value="Reject">Reject</MenuItem>
                    </Select>
                  </Tooltip>
                )}
              </WrapperButton>
            </Stack>
          );
        }
      }
    ],
    []
  );

  // const renderRowSubComponent = useCallback(
  //   ({ row: { requestedById } }) => <ExpandingUserDetail data={advances[Number(requestedById)]} />,
  //   [advances]
  // );

  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <ExpandingUserDetail requestedById={row.original.requestedById} isDriver={row.original.isDriver} isVendor={row.original.isVendor} />
    ),
    []
  );

  return (
    <>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 2 }}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
          <WrapperButton moduleName={MODULE.ADVANCE_TYPE} permission={PERMISSIONS.READ}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
              onClick={() => handleAdvance('add')}
              size="small"
              disabled={loading}
              sx={{ height: '36px' }}
            >
              {loading ? 'Loading...' : 'Add Advance'}
            </Button>
          </WrapperButton>

          <WrapperButton moduleName={MODULE.ADVANCE_TYPE} permission={PERMISSIONS.READ}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Eye />}
              onClick={handleAdvanceType}
              size="small"
              disabled={loading}
              sx={{ height: '36px' }}
            >
              {loading ? 'Loading...' : 'View Advance Type'}
            </Button>
          </WrapperButton>

          <DateRangeSelect
            startDate={startDate}
            endDate={endDate}
            selectedRange={range}
            prevRange={prevRange}
            setSelectedRange={setRange}
            onRangeChange={handleRangeChange}
            showSelectedRangeLabel
            sx={{ height: '36px', width: '180px', mb: '0px' }}
          />
        </Stack>
      </Stack>

      <MainCard content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={8} />
          ) : advances?.length === 0 ? (
            <EmptyTableDemo />
          ) : (
            <ReactTable
              columns={columns}
              data={advances}
              renderRowSubComponent={renderRowSubComponent}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={handleLimitChange}
              lastPageNo={lastPageIndex}
            />
          )}
        </ScrollX>
      </MainCard>
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AdvanceForm advanceData={advanceData} onCancel={handleAdd} key={key} setKey={setKey} />
      </Dialog>
      {/* Dialog for adding Advance Type */}
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <NewAdvance advanceData={advanceData} onCancel={handleAdd} updateKey={updateKey} setUpdateKey={setUpdateKey} />
      </Dialog>
    </>
  );
};

ExpandingDetails.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default ExpandingDetails;
