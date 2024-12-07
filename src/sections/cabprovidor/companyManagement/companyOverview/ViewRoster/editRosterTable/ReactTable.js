import { useMemo } from "react";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { DefaultColumnFilter } from "utils/react-table";
import { useFilters, useTable } from "react-table";
import CellEdit from "./CellEdit";

function ReactTable({ columns, data, updateData, skipPageReset }) {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Cell: CellEdit,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        autoResetPage: !skipPageReset,
        updateData,
      },
      useFilters
    );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell key={column} {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow key={row} {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <TableCell key={cell} {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ReactTable;
