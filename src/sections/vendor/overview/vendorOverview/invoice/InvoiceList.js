import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import axiosServices from 'utils/axios';
import { formatDateUsingMoment, formattedDate } from 'utils/helper';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { HeaderSort, TablePagination } from 'components/third-party/ReactTable';
import { USERTYPE } from 'constant';
import { useSelector } from 'react-redux';

const API_URL = {
    [USERTYPE.iscabProvider]: '/invoice/by/cabProviderId',
    [USERTYPE.isVendor]: '/invoice/all/vendor',
    [USERTYPE.iscabProviderUser]: '/invoice/by/cabProviderId',
    [USERTYPE.isVendorUser]: '/invoice/all/vendor'
  };

const TripDetail = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const userType = useSelector((state) => state.auth.userType);

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosServices.get(API_URL[userType], {
          params: {
            // page: page,
            // limit: limit,
            invoiceStartDate: formatDateUsingMoment(startDate),
            invoiceEndDate: formatDateUsingMoment(endDate)
            // companyId: filterOptions?.selectedCompany?._id
          }
        });

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
  }, [userType, startDate, endDate, refetch]);

  const columns = useMemo(
    () => [
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
        disableFilters: true,
         Cell: ({ value }) => value || 'N/A'
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
                <Typography variant="subtitle1">{values.billedTo.name || 'N/A'}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {values.billedTo.company_email || 'N/A'}
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
          return formattedDate(value || 'N/A', 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',
        Cell: ({ value }) => {
          return formattedDate(value || 'N/A', 'DD/MM/YYYY');
        }
      },
      {
        Header: 'Amount',
        accessor: 'grandTotal',
        Cell: ({ value }) => {
          return <Typography>₹ {(value === null || value === undefined ? 'N/A' : value)}</Typography>;
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
