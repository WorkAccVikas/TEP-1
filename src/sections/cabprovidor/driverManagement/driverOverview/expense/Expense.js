import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import PaginationBox from 'components/tables/Pagination';
import axiosServices from 'utils/axios';
import { formatDateUsingMoment, formattedDate } from 'utils/helper';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { HeaderSort, TablePagination } from 'components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';
import { alpha } from '@mui/material/styles';
import { Add, Edit, Trash } from 'iconsax-react';
import { ThemeMode } from 'config';
import Header from 'components/tables/genericTable/Header';
import ExpenseForm from './ExpenseForm';
import { PopupTransition } from 'components/@extended/Transitions';

const Expense = ({ driverId }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [add, setAdd] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [updateKey, setUpdateKey] = useState(0);
  const [selectedData, setSelectedData] = useState(null);

  const handleAdd = () => {
    setAdd((prev) => !prev);
  };

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosServices.get('/expense/list', {
          params: {
            driverId: driverId
          }
        });
        setData(response.data.data || []);
      } catch (error) {
        console.error('Error at fetching trips:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [driverId, updateKey]);

  const handleDelete = async (id) => {
    const response = await axiosServices.delete('/expense/delete', {
      data: {
        expenseId: id
      }
    });
    console.log("response",response);
    
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: '',
        disableFilters: true,
        Cell: ({ row }) => <Typography>{row.index + 1}</Typography>
      },
      {
        Header: 'Expense Name',
        accessor: 'expenseName',
        // disableSortBy: true,
        Cell: ({ row, value }) => <Typography>{value || 'N/A'}</Typography>
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        // disableSortBy: true,
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        // disableSortBy: true,
        Cell: ({ row }) => {
          const { values } = row;
          const time = values['createdAt'];
          return <>{time ? formattedDate(time, 'DD MMMM YYYY, hh:mm A') : 'N/A'}</>;
        }
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
        // disableSortBy: true,
        Cell: ({ row }) => {
          const { values } = row;
          const time = values['updatedAt'];
          return <>{time ? formattedDate(time, 'DD MMMM YYYY, hh:mm A') : 'N/A'}</>;
        }
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
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
                    //   dispatch(handleOpen(ACTION.EDIT));
                    setSelectedData(row.original);
                    handleAdd();
                    //   dispatch(setSelectedID(row.values._id));
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Delete"
              >
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(row.original._id);
                    handleDelete(row.original._id);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header OtherComp={({ loading }) => <ButtonComponent handleAdd={handleAdd} loading={loading} />} />
        <MainCard content={false}>
          <Stack gap={2}>
            <MainCard content={false}>
              {loading ? (
                <TableSkeleton rows={10} columns={6} />
              ) : data?.length > 0 ? (
                <ScrollX>
                  <ReactTable columns={columns} data={data} loading={loading} />
                </ScrollX>
              ) : (
                <EmptyTableDemo />
              )}
            </MainCard>
          </Stack>
        </MainCard>
        {add && (
          <Dialog
            maxWidth="sm"
            TransitionComponent={PopupTransition}
            keepMounted
            fullWidth
            onClose={() => {
              setSelectedData(null);
              handleAdd();
            }}
            open={add}
            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
            aria-describedby="alert-dialog-slide-description"
          >
            <ExpenseForm
              setSelectedData={setSelectedData}
              data={null}
              onCancel={handleAdd}
              updateKey={updateKey}
              setUpdateKey={setUpdateKey}
              driverId={driverId}
            />
          </Dialog>
        )}
        {add && selectedData && (
          <Dialog
            maxWidth="sm"
            TransitionComponent={PopupTransition}
            keepMounted
            fullWidth
            onClose={() => {
              setSelectedData(null);
              handleAdd();
            }}
            open={add}
            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
            aria-describedby="alert-dialog-slide-description"
          >
            <ExpenseForm
              setSelectedData={setSelectedData}
              data={selectedData}
              onCancel={handleAdd}
              updateKey={updateKey}
              setUpdateKey={setUpdateKey}
              driverId={driverId}
            />
          </Dialog>
        )}
      </Stack>
    </>
  );
};

Expense.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  setLimit: PropTypes.func.isRequired,
  lastPageNo: PropTypes.number.isRequired,
  vendorId: PropTypes.string.isRequired
};

export default Expense;

const ButtonComponent = ({ loading, handleAdd }) => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />} // Show loading spinner if loading
          onClick={handleAdd}
          size="small"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : ' Add Expense'}
        </Button>
      </Stack>
    </>
  );
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent }) {
  const theme = useTheme();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, expanded }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ['_id'] // Keep this to hide specific columns if needed
      }
    },
    useGlobalFilter, // Retain if global filtering is required
    useFilters, // Retain if individual column filtering is needed
    useSortBy,
    useExpanded, // Retain for row expansion
    usePagination, // Retain for pagination functionality
    useRowSelect // Retain if row selection is needed
  );

  return (
    <>
      <Stack spacing={3}>
        <ScrollX>
          <Table {...getTableProps()}>
            {/* <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                  {headerGroup.headers.map((column) => (
                    <TableCell key={column.id} {...column.getHeaderProps([{ className: column.className }])}>
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
              {page.map((row, i) => {
                prepareRow(row);
                const rowProps = row.getRowProps();

                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      onClick={() => {
                        row.toggleRowSelected();
                      }}
                      sx={{
                        bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit'
                      }}
                    >
                      {row.cells.map((cell) => (
                        <TableCell key={cell.column.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.isExpanded &&
                      renderRowSubComponent({
                        row,
                        rowProps,
                        visibleColumns,
                        expanded
                      })}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </ScrollX>

        <Box sx={{ p: 2, pt: 0 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
        </Box>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func.isRequired,
  renderRowSubComponent: PropTypes.any,
  search: PropTypes.bool,
  csvExport: PropTypes.bool,
  buttonTitle: PropTypes.string.isRequired
};
