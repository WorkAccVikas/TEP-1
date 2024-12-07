import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Table, TableHead, TableBody } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const TableSkeleton = ({ rows, columns }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {[...Array(columns)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="rectangular" width={120} height={20} animation="wave" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="rectangular" width={120} height={20} animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TableSkeleton;

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number
};
