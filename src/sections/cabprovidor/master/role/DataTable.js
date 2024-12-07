import PropTypes from 'prop-types';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTable } from 'react-table';

const DataTable = ({ columns, data, hiddenColumns = [] }) => {
  // Use React Table's useTable hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: ['_id', ...hiddenColumns]
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps()}
                  key={column.id}
                  style={{
                    minWidth: column.minWidth || 0, // Use 0 if not provided
                    maxWidth: column.maxWidth || 'none', // Use 'none' if not provided
                    width: column.minWidth ? undefined : '1%', // Allow it to share width
                    whiteSpace: 'nowrap' // Prevent text wrapping
                  }}
                >
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <TableCell
                    {...cell.getCellProps()}
                    key={cell.id}
                    style={{
                      minWidth: cell.column.minWidth || 0, // Use 0 if not provided
                      maxWidth: cell.column.maxWidth || 'none', // Use 'none' if not provided
                      width: cell.column.minWidth ? undefined : '1%', // Allow it to share width
                      whiteSpace: 'nowrap' // Prevent text wrapping
                    }}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  hiddenColumns: PropTypes.array
};

export default DataTable;
