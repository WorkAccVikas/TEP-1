import PropTypes from 'prop-types';
import { Button, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useMemo } from 'react';
import { useExpanded, useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import PaginationBox from 'components/tables/Pagination';
import { ArrowSquare } from 'iconsax-react';

const ViewRosterTable = ({ data, page, setPage, limit, setLimit, lastPageNo, payload }) => {
  // console.log('payload', payload);
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          switch (value) {
            case 0:
              return <Chip color="success" label="Completed" size="small" variant="light" />;
            case 1:
              return <Chip color="info" label="Upcoming" size="small" variant="light" />;
            default:
              return <Chip color="error" label="Not Defined" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Trip Date',
        accessor: (row) => (row.tripDate ? new Date(row.tripDate).toLocaleDateString('en-IN') : '')
      },

      {
        Header: 'Trip Time',
        accessor: 'tripTime'
      },
      {
        Header: 'Zone Name',
        accessor: 'zoneName'
      },

      {
        Header: 'Zone Type',
        accessor: 'zoneType'
      },
      {
        Header: 'Vehicle Type',
        accessor: 'vehicleType'
      },
      {
        Header: 'Vehicle Rate',
        accessor: 'vehicleRate'
      },
      {
        Header: 'Guard Price',
        accessor: (row) => (row.guard === '1' ? row.guardPrice : '0')
      },
      {
        Header: 'Vehicle Number',
        accessor: 'vehicleNumber'
      },
      {
        Header: 'Trip Type',
        accessor: 'tripType',
        Cell: ({ value }) => {
          switch (value) {
            case '1':
              return <Chip color="info" label="Pickup" size="small" variant="light" />;
            case '2':
              return <Chip color="success" label="Drop" size="small" variant="light" />;
            default:
              return <Chip color="error" label="Not Defined" size="small" variant="light" />;
          }
        }
      }
    ],
    []
  );

  return (
    <>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            startIcon={<ArrowSquare />}
            onClick={() => navigate('/roster/assign-trips', { state: { payload: payload } })}
          >
            Assign Trips
          </Button>
        </Stack>
      </Stack>
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={data} />
        </ScrollX>
      </MainCard>
      <div style={{ marginTop: '10px' }}>
      <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
      </div>
    </>
  );
};

ViewRosterTable.propTypes = {
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
  setLastPageNo: PropTypes.func,
  payload: PropTypes.object
};

export default ViewRosterTable;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: userColumns,
      data
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
