import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect, useCallback } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Chip, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useExpanded, useTable } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import { CSVExport } from 'components/third-party/ReactTable';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import mockData from 'utils/mock-data';
import makeData from 'data/react-table';

// assets
import { ArrowDown2, ArrowRight2 } from 'iconsax-react';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| SUB TABLE ||============================== //

function ReactSubTable({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, idx) => (
          <TableRow key={idx} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, colIdx) => (
              <TableCell key={colIdx} {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {loading
          ? Array.from({ length: 3 }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : rows.map((row, idx) => {
              prepareRow(row);
              return (
                <TableRow key={idx} {...row.getRowProps()}>
                  {row.cells.map((cell, cellIdx) => (
                    <TableCell key={cellIdx} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
}

ReactSubTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

// ==============================|| SUB ROW - ASYNC DATA ||============================== //

function SubRowAsync() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const numRows = mockData(1);

  const columns = useMemo(
    () => [
    //   {
    //     Header: 'Avatar',
    //     accessor: 'avatar',
    //     Cell: ({ value }) => <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${value}.png`)} />
    //   },
      { Header: 'Name', accessor: 'fatherName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Role', accessor: 'role' },
      { Header: 'Contact', accessor: 'contact' },
      { Header: 'Country', accessor: 'country' }
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(makeData(numRows.number.status(1, 5)));
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [numRows]);

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  return (
    <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
      <TableCell colSpan={8} sx={{ p: 2.5 }}>
        {/* Add "secondary={<CSVExport data={data} filename="expanded-sub-table-data.csv" />}" for excel download */}
        {/* <MainCard title="Sub Table"  content={false}> */}
          <ReactSubTable columns={columns} data={data} loading={loading} />
        {/* </MainCard> */}
      </TableCell>
    </TableRow>
  );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useExpanded);

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, idx) => (
          <TableRow key={idx} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, colIdx) => (
              <TableCell key={colIdx} {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          return (
            <Fragment key={idx}>
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell, cellIdx) => (
                  <TableCell key={cellIdx} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
              {row.isExpanded && renderRowSubComponent({ row })}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  renderRowSubComponent: PropTypes.func.isRequired
};

// ==============================|| EXPANDING SUB TABLE ||============================== //

const ExpandingSubTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: '',
        id: 'expander',
        Cell: ({ row }) => (
          <Box {...row.getToggleRowExpandedProps()} sx={{ cursor: 'pointer' }}>
            {row.isExpanded ? <ArrowDown2 size={14} /> : <ArrowRight2 size={14} />}
          </Box>
        )
      },
      { Header: 'First Name', accessor: 'firstName' },
      { Header: 'Last Name', accessor: 'lastName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Age', accessor: 'age' },
      { Header: 'Visits', accessor: 'visits' },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          const chipColors = {
            Complicated: 'error',
            Relationship: 'success',
            Single: 'info'
          };
          return <Chip color={chipColors[value]} label={value} size="small" variant="light" />;
        }
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
        Cell: ({ value }) => <LinearWithLabel value={value} />
      }
    ],
    []
  );

  const renderRowSubComponent = useCallback(() => <SubRowAsync />, []);

  return (
    <MainCard title="Expanding Sub Table" content={false} secondary={<CSVExport data={data} filename="expanding-sub-table.csv" />}>
      <ScrollX>
        <ReactTable columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} />
      </ScrollX>
    </MainCard>
  );
};

ExpandingSubTable.propTypes = {
  data: PropTypes.array.isRequired
};

export default ExpandingSubTable;
