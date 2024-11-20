import PropTypes from 'prop-types';
import { useCallback, useMemo, Fragment, useState } from 'react';

// material-ui
import { Box, Button, Chip, CircularProgress, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, useTheme } from '@mui/material';

// third-party
import { useExpanded, useTable } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import { Add, ArrowDown2, ArrowRight2 } from 'iconsax-react';
import ExpandingUserDetail from './ExpandingUserDetail';
import CSVExport from 'components/third-party/CSVExport';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';
import { ThemeMode } from 'config';
import { useNavigate } from 'react-router';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data, renderRowSubComponent }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
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

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any
};

// ==============================|| REACT TABLE - EXPANDING DETAILS ||============================== //

const ExpandingDetails = ({ data }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false);
  const handleAdvanceType = () => {
    navigate('/apps/invoices/advance-type');
  };

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        className: 'cell-center',
        Cell: ({ row }) => {
          const collapseIcon = row.isExpanded ? <ArrowDown2 size={14} /> : <ArrowRight2 size={14} />;
          return (
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }} {...row.getToggleRowExpandedProps()}>
              {collapseIcon}
            </Box>
          );
        },
        SubCell: () => null
      },
      {
        Header: 'UserType',
        accessor: 'firstName'
      },
      {
        Header: 'Requested By',
        accessor: 'lastName'
      },
      {
        Header: 'Requested Amount',
        accessor: 'age'
      },
      {
        Header: 'Advance Type',
        accessor: 'orderStatus'
      },
      {
        Header: 'Interest Rate',
        accessor: 'progress'
      },
      {
        Header: 'Remarks',
        accessor: 'about'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          switch (value) {
            case 'Complicated':
              return <Chip color="error" label="Complicated" size="small" variant="light" />;
            case 'Relationship':
              return <Chip color="success" label="Relationship" size="small" variant="light" />;
            case 'Single':
            default:
              return <Chip color="info" label="Single" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Approved Amount',
        accessor: 'avatar'
      },

      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="left" spacing={0}>
              <WrapperButton moduleName={MODULE.ADVANCE} permission={PERMISSIONS.UPDATE}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title={'Approve'}
                >
                  <Switch
                  // checked={row.original.isApproved === 1 || row.original.isApproved === 2}
                  // onChange={handleToggle}
                  // color={getSwitchColor()}
                  />
                </Tooltip>
              </WrapperButton>
            </Stack>
          );
        }
      }
    ],
    []
  );

  const renderRowSubComponent = useCallback(({ row: { id } }) => <ExpandingUserDetail data={data[Number(id)]} />, [data]);

  return (
    <>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
        <WrapperButton moduleName={MODULE.ADVANCE_TYPE} permission={PERMISSIONS.READ}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />} // Show loading spinner if loading
              onClick={handleAdvanceType}
              size="small"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Loading...' : ' View Advance Type'}
            </Button>
          </WrapperButton>
        </Stack>
      </Stack>
      <MainCard
        // title="Expanding User Details"
        content={false}
        // secondary={
        //   <>
        //     <CSVExport data={data} filename={'expanding-details-table.csv'} />
        //   </>
        // }
      >
        <ScrollX>
          <ReactTable columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} />
        </ScrollX>
      </MainCard>
    </>
  );
};

ExpandingDetails.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default ExpandingDetails;
