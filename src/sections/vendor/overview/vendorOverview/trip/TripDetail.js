import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Chip,
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
import { HeaderSort, IndeterminateCheckbox, TablePagination } from 'components/third-party/ReactTable';
import { Edit, Eye } from 'iconsax-react';
import AccessControlWrapper from 'components/common/guards/AccessControlWrapper';
import { USERTYPE } from 'constant';
import { useSelector } from 'react-redux';
import { ThemeMode } from 'config';

const TripDetail = ({ page, setPage, limit, setLimit, lastPageNo }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userType = useSelector((state) => state.auth.userType);

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
        const response = await axiosServices.get('/assignTrip/all/trips/vendor', {
          params: {
            startDate: formatDateUsingMoment(startDate),
            endDate: formatDateUsingMoment(endDate)
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
  }, [startDate, endDate]);

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
              // Determine which ID to check based on userType
              const { invoiceId, vendorInvoiceId } = row.original;

              // const showInvoiceChip =
              //   ([USERTYPE.iscabProvider, USERTYPE.iscabProviderUser].includes(userType) && invoiceId && invoiceId !== null) ||
              //   ([USERTYPE.isVendor, USERTYPE.isVendorUser].includes(userType) && vendorInvoiceId && vendorInvoiceId !== null);

              let showInvoiceChip = false;

              if ([USERTYPE.iscabProvider, USERTYPE.iscabProviderUser].includes(userType)) {
                console.log('invoiceId ............');
                showInvoiceChip = invoiceId && invoiceId !== null;
              } else if ([USERTYPE.isVendor, USERTYPE.isVendorUser].includes(userType)) {
                console.log('vendorInvoiceId ............');
                showInvoiceChip = vendorInvoiceId && vendorInvoiceId !== null;
              }

              return showInvoiceChip ? (
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
        Cell: ({ row }) => {
          return (
            <Typography>
              <Link
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row expansion
                  handleCompanyClick(row.original);
                }}
                style={{ textDecoration: 'none', color: 'rgb(70,128,255)' }}
              >
                {row.original.companyID.company_name || 'N/A'}
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
          return formattedDate(value || 'N/A', 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Trip Time',
        accessor: 'tripTime',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Trip Id',
        accessor: 'rosterTripId',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Zone Name',
        accessor: 'zoneNameID.zoneName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneTypeID.zoneTypeName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Cab',
        accessor: 'vehicleNumber.vehicleNumber',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Cab Type',
        accessor: 'vehicleTypeID.vehicleTypeName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Driver',
        accessor: 'driverId.userName',
        Cell: ({ value }) => value || 'N/A'
      },
      ...(userType === USERTYPE.iscabProvider
        ? [
            {
              Header: 'Company Rates',
              accessor: 'companyRate'
            },
            {
              Header: 'Company Guard Price',
              accessor: 'companyGuardPrice',
              Cell: ({ value }) => value || 0
            },
            {
              Header: 'Company Penalty',
              accessor: 'companyPenalty',
              Cell: ({ value }) => value || 0
            }
          ]
        : []),
      {
        Header: 'Vehicle Rates',
        accessor: (row) => row.vendorRate ?? row.driverRate,
        Cell: ({ row }) => {
          const { vendorRate, driverRate } = row.original;
          return vendorRate ?? driverRate ?? 'N/A';
        }
      },
      {
        Header: 'Vendor Guard Price',
        accessor: 'vendorGuardPrice',
        Cell: ({ value }) => value || 0
      },
      {
        Header: 'Vendor Penalty',
        accessor: 'vendorPenalty',
        Cell: ({ value }) => value || 0
      },
      ...(userType === USERTYPE.iscabProvider
        ? [
            {
              Header: 'Driver Penalty',
              accessor: 'driverPenalty',
              Cell: ({ value }) => value || 0
            },
            {
              Header: 'Driver Guard Price',
              accessor: 'driverGuardPrice',
              Cell: ({ value }) => value || 0
            }
          ]
        : []),

      {
        Header: 'Additional Rate',
        accessor: 'addOnRate',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
      },

      {
        Header: 'Location',
        accessor: 'location',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Trip Type',
        accessor: 'tripType',
        Cell: ({ value }) => {
          switch (value) {
            case 1: // For Pick Up
              return <Chip label="Pick Up" color="warning" variant="light" />;
            case 2: // For Drop
              return <Chip label="Drop" color="success" variant="light" />;
            default: // Default case for other values or undefined
              return <Chip label="N/A" color="info" variant="light" />;
          }
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({ value }) => value || 'N/A'
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
              <ReactTable columns={columns} data={data} loading={loading} />
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
  lastPageNo: PropTypes.number.isRequired
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
