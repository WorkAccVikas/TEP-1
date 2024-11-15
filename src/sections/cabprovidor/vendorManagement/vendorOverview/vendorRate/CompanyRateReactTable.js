import React, { Fragment, useMemo } from 'react';
import { useTable, useFilters, useResizeColumns, useExpanded } from 'react-table';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CellEdit from 'sections/cabprovidor/companyManagement/companyOverview/ViewRoster/editRosterTable/CellEdit';

function CompanyRateReactTable({ columns, data, updateData, skipPageReset, renderRowSubComponent }) {
  const defaultColumn = useMemo(
    () => ({
      Filter: () => null, // You can replace this with a default filter if needed
      Cell: CellEdit,
      minWidth: 120,
      width: 155,
      maxWidth: 400
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, visibleColumns } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateData
    },
    useFilters,
    useResizeColumns,
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
      </TableBody>
    </Table>
  );
}

CompanyRateReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired,
  skipPageReset: PropTypes.bool
};

export default CompanyRateReactTable;
