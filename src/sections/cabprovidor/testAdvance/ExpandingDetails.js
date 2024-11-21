import PropTypes from 'prop-types';
import { useCallback, useMemo, Fragment, useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
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
import { useExpanded, useTable } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import { Add, ArrowDown2, ArrowRight2 } from 'iconsax-react';
import ExpandingUserDetail from './ExpandingUserDetail';
import CSVExport from 'components/third-party/CSVExport';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';
import { ThemeMode } from 'config';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { dispatch } from 'store';
import { fetchAdvances } from 'store/slice/cabProvidor/advanceSlice';
import { PopupTransition } from 'components/@extended/Transitions';
import AdvanceForm from '../advances/AdvanceForm';
import { TablePagination } from 'components/third-party/ReactTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data, renderRowSubComponent }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
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
    useExpanded
  );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                {column.render('Header')}
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
            <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
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

  const handleAdvanceType = () => {
    navigate('/apps/invoices/advance-type');
  };

  const handleAdd = () => {
    setAdd(!add);
    if (advanceData && !add) setAdvanceData(null);
  };

  useEffect(() => {
    dispatch(fetchAdvances());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        className: 'cell-center',
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
        accessor: 'requestedById.userName'
      },
      {
        Header: 'Requested Amount',
        accessor: 'requestedAmount'
      },
      {
        Header: 'Advance Type',
        accessor: 'advanceTypeId.advanceTypeName'
      },
      {
        Header: 'Interest Rate',
        accessor: 'advanceTypeId.interestRate'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
      },
      {
        Header: 'Status',
        accessor: 'isApproved',
        Cell: ({ row }) => {
          const isApproved = row.original.isApproved;

          if (isApproved == 1) {
            return <Chip color="success" label="Approved" size="small" variant="light" />;
          } else if (isApproved == 2) {
            return <Chip color="error" label="Rejected" size="small" variant="light" />;
          } else {
            return <Chip color="warning" label="Pending" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Approved Amount',
        accessor: 'approvedAmount'
      },
      // {
      //   Header: 'Actions',
      //   disableSortBy: true,
      //   Cell: ({ row }) => {
      //     const handleToggle = () => {
      //       setAdvanceData(row.original);
      //       handleAdd();
      //     };

      //     const getSwitchColor = () => {
      //       if (row.original.isApproved === 1) return 'success'; // Green when approved
      //       if (row.original.isApproved === 2) return 'error'; // Red when rejected
      //       return 'default'; // Default color for pending
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
      //             title={row.original.isApproved === 1 ? 'Reject' : 'Approve'}
      //           >
      //             <Switch
      //               checked={row.original.isApproved === 1 || row.original.isApproved === 2}
      //               onChange={handleToggle}
      //               color={getSwitchColor()}
      //             />
      //           </Tooltip>
      //         </WrapperButton>
      //       </Stack>
      //     );
      //   }
      // }
      // {
      //   Header: 'Actions',
      //   disableSortBy: true,
      //   Cell: ({ row }) => {
      //     const handleToggle = () => {
      //       // Only open the dialog if the status is not approved or rejected
      //       if (row.original.isApproved !== 1 && row.original.isApproved !== 2) {
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
      //       // Only show "Approve" if it's not already approved or rejected
      //       if (row.original.isApproved === 1) return 'Approved'; // No action for already approved
      //       if (row.original.isApproved === 2) return 'Rejected'; // No action for rejected
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
      //               disabled={row.original.isApproved === 1 || row.original.isApproved === 2} // Disable switch for approved/rejected
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
          const handleToggle = () => {
            // Open the dialog only for pending or rejected statuses
            if (row.original.isApproved === 0 || row.original.isApproved === 2) {
              setAdvanceData(row.original);
              handleAdd();
            }
          };
      
          const getSwitchColor = () => {
            if (row.original.isApproved === 1) return 'success'; // Green when approved
            if (row.original.isApproved === 2) return 'error';   // Red when rejected
            return 'default';                                    // Default color for pending
          };
      
          const getTooltipTitle = () => {
            if (row.original.isApproved === 1) return 'Approved'; // Approved status
            if (row.original.isApproved === 2) return 'Rejected'; // Rejected status
            return 'Approve';                                     // Default for pending state
          };
      
          return (
            <Stack direction="row" alignItems="center" justifyContent="left" spacing={0}>
              <WrapperButton moduleName={MODULE.ADVANCE} permission={PERMISSIONS.UPDATE}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK
                          ? theme.palette.grey[50]
                          : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title={getTooltipTitle()} // Conditional tooltip title
                >
                  <Switch
                    checked={row.original.isApproved === 1 || row.original.isApproved === 2}
                    onChange={handleToggle}
                    color={getSwitchColor()}
                    disabled={row.original.isApproved === 1} // Disable switch for approved
                  />
                </Tooltip>
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
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
          <WrapperButton moduleName={MODULE.ADVANCE_TYPE} permission={PERMISSIONS.READ}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />} // Show loading spinner if loading
              onClick={handleAdvanceType}
              size="small"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Loading...' : ' View Advance Type'}
            </Button>
          </WrapperButton>
        </Stack>
      </Stack>
      <MainCard content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={8} />
          ) : advances?.length === 0 ? (
            <EmptyTableDemo />
          ) : (
            <ReactTable columns={columns} data={advances} renderRowSubComponent={renderRowSubComponent} />
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
