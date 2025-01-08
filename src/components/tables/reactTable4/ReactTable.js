/* eslint-disable no-unused-vars */
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
// import { HeaderSort, TablePagination } from 'components/tables/reactTable2/ReactTable';
import { CSVExport, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo } from 'react';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import EcommerceRadial from 'sections/widget/chart/EcommerceRadial';
import { renderFilterTypes } from 'utils/react-table';

function ReactTable({ columns, data, pagesize, setSelectedDrivers }) {
  const theme = useTheme();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  // const sortBy = { id: 'id', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { selectedRowIds, pageIndex, pageSize },
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      // initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        {
          id: 'row-selection-chk',
          accessor: 'Selection',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        },
        ...columns
      ]);
    }
  );

  useEffect(() => {
    if (selectedFlatRows.length === 0) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(selectedFlatRows.map((d) => d.original));
    }
  }, [selectedFlatRows]);
  return (
    <>
      {/* <MainCard
        title="Row Selection (Pagination)"
        content={false}
        secondary={<CSVExport data={selectedFlatRows.map((d) => d.original)} filename={'row-selection-table.csv'} />}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <EcommerceRadial color={theme.palette.primary.main} title={'Total Drivers'} />
          <EcommerceRadial color={theme.palette.error.dark} title={'Total Cabs'} />
        </Stack> */}
        <ScrollX>
          {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
          <Stack spacing={3}>
            <Table {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column) => (
                      <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
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
                    <TableRow
                      key={row}
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
                  );
                })}
                {/* <TableRow>
                  <TableCell sx={{ p: 2, pb: 0 }} colSpan={8}>
                    <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
                  </TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </Stack>
        </ScrollX>
      {/* </MainCard> */}
    </>
  );
}

export default ReactTable;

ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  getHeaderProps: PropTypes.func
};
