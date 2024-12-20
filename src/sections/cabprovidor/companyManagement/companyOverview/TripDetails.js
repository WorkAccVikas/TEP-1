import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  Link,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  alpha
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
import { useSelector } from 'store';
import { USERTYPE } from 'constant';

const GUARD_PRICE_LABEL = {
  [USERTYPE.iscabProvider]: 'Vehicle Guard Price',
  [USERTYPE.isVendor]: 'Vendor Guard Price'
};

const RATE_LABEL = {
  [USERTYPE.iscabProvider]: 'Vehicle Rate',
  [USERTYPE.isVendor]: 'Vendor Rate'
};

const PENALTY_LABEL = {
  [USERTYPE.iscabProvider]: 'Vehicle Penalty',
  [USERTYPE.isVendor]: 'Vendor Penalty'
};

const TripDetail = ({ page, setPage, limit, setLimit, lastPageNo, companyId }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const userType = useSelector((state) => state.auth.userType);
  console.log(`🚀 ~ TripDetail ~ userType:`, userType);

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  const TRIP_STATUS = {
    PENDING: 1,
    COMPLETED: 2,
    CANCELLED: 3,
    UNATTENDED: 4
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosServices.get('/assignTrip/all/trips/cabProvider', {
          params: {
            startDate: formatDateUsingMoment(startDate),
            endDate: formatDateUsingMoment(endDate),
            companyID: companyId
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
  }, [companyId, startDate, endDate]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: '',
        disableFilters: true,
        Cell: ({ row }) => <Typography>{row.index + 1}</Typography>
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
                <Chip label="Invoice ✓" color="info" variant="light" />
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
        Header: 'Trip Date',
        accessor: 'tripDate',
        Cell: ({ value }) => formattedDate(value, 'DD/MM/YYYY')
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
        Header: RATE_LABEL[userType] || 'Vehicle Rates',
        accessor: (row) => row.vendorRate ?? row.driverRate,
        Cell: ({ row }) => {
          const { vendorRate, driverRate } = row.original;
          return vendorRate ?? driverRate ?? 'Null';
        }
      },
      {
        Header: GUARD_PRICE_LABEL[userType] || 'Vehicle Guard Price',
        accessor: 'guardPrice', // This can be any key; we won't directly use it.
        Cell: ({ row }) => {
          const { driverGuardPrice, vendorGuardPrice } = row.original;
          return driverGuardPrice || vendorGuardPrice || 'Null';
        }
      },

      {
        Header: PENALTY_LABEL[userType] || 'Penalty',
        accessor: 'penalty',
        Cell: ({ value }) => value || 'Null'
      },
      {
        Header: 'Additional Rate',
        accessor: 'addOnRate'
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
              return <Chip label="Pick Drop" color="success" variant="light" />;
          }
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({ value }) => value || 'None'
      }
    ],
    [userType]
  );

  return (
    <>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
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
      <MainCard content={false}>
        <Stack gap={2}>
          <MainCard content={false}>
            {loading ? (
              <TableSkeleton rows={10} columns={8} />
            ) : data?.length > 0 ? (
              <>
                <ReactTable columns={columns} data={data} loading={loading} />
              </>
            ) : (
              <EmptyTableDemo />
            )}
          </MainCard>
        </Stack>
      </MainCard>
    </>
  );
};

TripDetail.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  setLimit: PropTypes.func.isRequired,
  lastPageNo: PropTypes.number.isRequired,
  vendorId: PropTypes.string.isRequired
};

export default TripDetail;

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
    useExpanded, // Retain for row expansion
    usePagination, // Retain for pagination functionality
    useRowSelect // Retain if row selection is needed
  );

  return (
    <>
      <Stack>
        <ScrollX>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                  {headerGroup.headers.map((column) => (
                    <TableCell key={column.id} {...column.getHeaderProps([{ className: column.className }])}>
                      {column.render('Header')}
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
              {/* <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2 }} colSpan={10}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow> */}
            </TableBody>
          </Table>
        </ScrollX>

        <Box sx={{ p: 2 }}>
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
