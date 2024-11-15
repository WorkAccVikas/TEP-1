/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery } from '@mui/material';
import { Fragment, useMemo } from 'react';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';
import { useTheme, alpha } from '@mui/material/styles';

function ReactTable({
  columns,
  data,
  renderRowSubComponent,
  handleAdd,
  csvExport = false,
  search = false,
  buttonTitle,
  extraComponent = null,
  hideHeader = false
  // disableSortBy = false
}) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'id', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    // setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ['_id', 'advanceTypeId._id', 'maxUsersOnEachCabProviders', 'maxUsersOnEachCompany', 'maxUsersOnEachVendors'],
        sortBy: [sortBy]
      }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  return (
    <>
      <Stack spacing={3}>
        {!hideHeader && (
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 3, pb: 0 }}
          >
            {search && (
              <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            )}
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
              {extraComponent}

              {/* {!disableSortBy && (
              <SortingSelect
                // sortBy={sortBy.id}
                setSortBy={setSortBy}
                allColumns={allColumns}
              />
            )} */}

              {location.pathname !== '/advance' && location.pathname !== '/advanceTypeList' && location.pathname !== '/roster-data' && (
                <Button variant="contained" onClick={handleAdd} fullWidth size="small">
                  {buttonTitle}
                </Button>
              )}

              {csvExport && (
                <CSVExport
                  data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : data}
                  filename={'customer-list.csv'}
                />
              )}
            </Stack>
          </Stack>
        )}

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
                      // cursor: 'pointer',
                      bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit'
                    }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
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
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

export default ReactTable;

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

import Typography from '@mui/material/Typography';
import { CSVExport, HeaderSort, TablePagination } from 'components/tables/reactTable2/ReactTable';

export const TableNoDataMessage = ({
  text,
  variant = 'h5',
  component = 'p',
  align = 'center',
  color = 'text.secondary',
  fontStyle = 'italic',
  sx = {},
  ...props
}) => {
  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      sx={{
        mt: 2,
        mb: 2,
        color: (theme) => theme.palette[color],
        fontStyle: fontStyle,
        ...sx
      }}
      {...props}
    >
      {text}
    </Typography>
  );
};

TableNoDataMessage.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.string,
  component: PropTypes.string,
  align: PropTypes.string,
  color: PropTypes.string,
  fontStyle: PropTypes.string,
  sx: PropTypes.object
};
