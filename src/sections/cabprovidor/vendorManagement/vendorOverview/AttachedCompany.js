import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';

// third-party
import { useTable } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';

import makeData from 'data/react-table';
import mockData from 'utils/mock-data';

// assets
import { Eye } from 'iconsax-react';
import { ThemeMode } from 'config';
import ReactTable, { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import { CSVExport } from 'components/tables/reactTable2/ReactTable';
import VendorRate from 'sections/cabprovidor/vendorManagement/vendorOverview/vendorRate/VendorRate';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| SUB TABLE ||============================== //

function ReactSubTable({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  if (loading) {
    return (
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell key={column} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {[0, 1, 2].map((item) => (
            <TableRow key={item}>
              {[0, 1, 2, 3, 4, 5].map((col) => (
                <TableCell key={col}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

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
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow key={row} {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
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
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool
};

// ==============================|| SUB ROW - ASYNC DATA ||============================== //

function SubRowAsync() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const numRows = mockData(1);

  const columns = useMemo(
    () => [
      {
        Header: 'Avatar',
        accessor: 'avatar',
        className: 'cell-center',
        Cell: ({ value }) => <Avatar alt="Avatar 1" size="sm" src={avatarImage(`./avatar-${value}.png`)} />
      },
      {
        Header: 'Name',
        accessor: 'fatherName'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Role',
        accessor: 'role'
      },
      {
        Header: 'Contact',
        accessor: 'contact',
        className: 'cell-right'
      },
      {
        Header: 'Country',
        accessor: 'country'
      }
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(makeData(numRows.number.status(1, 5)));
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, []);

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  return (
    <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
      <TableCell colSpan={8} sx={{ p: 2.5 }}>
        <MainCard
          title="Sub Table"
          secondary={<CSVExport data={data} filename={'expanded-sub-table-data.csv'} />}
          content={false}
          sx={{ ml: { xs: 2.5, sm: 5, md: 6, lg: 10, xl: 12 } }}
        >
          <ReactSubTable columns={columns} data={data} loading={loading} />
        </MainCard>
      </TableCell>
    </TableRow>
  );
}

SubRowAsync.propTypes = {
  value: PropTypes.string
};

// ==============================|| REACT TABLE - EXPANDING SUB TABLE ||============================== //

const AttachedCompany = ({ data, loading }) => {
  const [open, setOpen] = useState(false); // State to manage popup
  const [companyName, setCompanyName] = useState('');

  const handleOpen = () => {
    setOpen(true); // Open the popup
  };

  const handleClose = () => {
    setOpen(false); // Close the popup
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Company Name',
        accessor: 'company_name'
      },
      {
        Header: 'Company Email',
        accessor: 'company_email'
      },

      {
        Header: 'Mobile Number',
        accessor: 'mobile'
      },
      {
        Header: 'Address',
        accessor: 'address'
      },
      {
        Header: 'View Rate',
        className: 'cell-left',
        disableSortBy: true,
        Cell: ({ row }) => {
          const theme = useTheme();
          const mode = theme.palette.mode;
          return (
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="View"
              >
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                    setCompanyName(row.original.company_name);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  // const renderRowSubComponent = useCallback(() => <SubRowAsync />, []);

  return (
    <MainCard title="Attached Companies List" content={false}>
      <ScrollX>
        {loading ? (
          <Box
            sx={{
              height: '100vh',
              width: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <ReactTable columns={columns} data={data} />
        ) : (
          <TableNoDataMessage text="No Company Found" />
        )}

        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md" aria-labelledby="draggable-dialog-title">
          <VendorRate onClose={handleClose} companyName={companyName} />
        </Dialog>
      </ScrollX>
    </MainCard>
  );
};

AttachedCompany.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default AttachedCompany;
