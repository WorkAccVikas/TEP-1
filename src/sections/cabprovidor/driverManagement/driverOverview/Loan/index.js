import PropTypes from 'prop-types';
import { Chip, Link, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useMemo } from 'react';
import { useExpanded, useTable } from 'react-table';
import PaginationBox from 'components/tables/Pagination';

const Loan = ({ data, page, setPage, limit, setLimit, lastPageNo }) => {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        className: "cell-center",
        Cell: ({ row }) => <span>{row.index + 1}</span>, // Use row.index to display incremental number
      },
      {
        Header: "Vendor Name",
        accessor: (row) => ({
          company_name: row.company_name,
        }),
        Cell: ({ row }) => {
          const { company_name } = row.original; // Access the original row data directly
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={3}>
                <Typography variant="subtitle1">
                <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {company_name}
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        Header: "Total Loan Amount",
        accessor: "totalLoanAmount",
      },
      {
        Header: "Total Paid",
        accessor: "totalPaid", //dummy
      },
      {
        Header: "Total Balance",
        accessor: "totalBalance", //dummy
      },
      {
        Header: "Loan Term",
        accessor: "loanTerm", //dummy
      },
      {
        Header: "Total week",
        accessor: "totalWeek", //dummy
      },
      {
        Header: "Payment Term Paid",
        accessor: "termPaid", //dummy
      },
      {
        Header: "Start Date",
        accessor: "startDate", //dummy
      },
      {
        Header: "End Date",
        accessor: "endDate", //dummy
      },
      {
        Header: "Loan Status",
        accessor: "status",
        Cell: ({ value }) => {
          switch (value) {
            case "Active":
              return (
                <Chip
                  color="success"
                  label="Active"
                  size="small"
                  variant="light"
                />
              );
            case "Inactive":
              return (
                <Chip
                  color="error"
                  label="Inactive"
                  size="small"
                  variant="light"
                />
              );
            default:
              return (
                <Chip
                  color="info"
                  label="Single"
                  size="small"
                  variant="light"
                />
              );
          }
        },
      },
    ],

    [theme]
  );

  return (
    <>
      {/* <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleZone} size="small">
          Add Zone
        </Button>
      </Stack> */}
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={data} />
        </ScrollX>
      </MainCard>
      <div style={{ marginTop: '20px' }}>
        <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
      </div>
    </>
  );
};

Loan.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  limit: PropTypes.number,
  setLimit: PropTypes.func,
  lastPageNo: PropTypes.number,
  setLastPageNo: PropTypes.func
};

export default Loan;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        hiddenColumns: ['_id','zoneDescription']
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

          return (
            <Fragment key={i}>
              <TableRow {...row.getRowProps()}>
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
  );
}
ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any
};
//
