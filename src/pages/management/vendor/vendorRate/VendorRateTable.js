import PropTypes from 'prop-types';
import { Dialog, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useMemo, useState } from 'react';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import { HeaderSort, TablePagination } from 'components/third-party/ReactTable';
import { renderFilterTypes } from 'utils/react-table';
import { Edit, Trash } from 'iconsax-react';
import { ThemeMode } from 'config';
import { PopupTransition } from 'components/@extended/Transitions';
import VendorEditForm from './VendorEditForm';

const VendorRateTable = ({ data, page, setPage, limit, setLimit, loading ,setUpdateKey,updateKey }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [add, setAdd] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [vendorEdit, setVendorEdit] = useState(null);

  const handleAdd = () => {
    setAdd(!add);
    if (vendorData && !add) setVendorData(null);
  };
  
  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id'
      },
      {
        Header: 'Vehicle Type Id',
        accessor: 'VehicleTypeName._id'
      },
      {
        Header: 'Company Name',
        accessor: 'companyID.company_name'
      },
      {
        Header: 'Zone Name',
        accessor: 'zoneNameID.zoneName'
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneTypeID.zoneTypeName',
        Cell: ({ value }) => value ?? 'None'
      },
      {
        Header: 'Vehicle Type',
        accessor: (row) => row.VehicleTypeName?.vehicleTypeName || 'No vehicle type'
      },
      {
        Header: 'Amount',
        accessor: 'cabAmount.amount'
      },
      {
        Header: 'Dual Trip Amount',
        accessor: 'dualTripAmount.amount',
        dataType: 'text',
        Cell: ({ value }) => value ?? 0
      },
      {
        Header: 'Guard Price',
        accessor: 'guardPrice',
        dataType: 'text',
        Cell: ({ row }) => {
          const guardValue = row.original.guard;
          return guardValue === 0 ? '0' : row.original.guardPrice;
        }
      },
      // {
      //   Header: 'Actions',
      //   className: 'cell-center',
      //   disableSortBy: true,
      //   Cell: ({ row }) => {
      //     // const driverID = row.original._id;
      //     // const isCabProviderDriver = row.original.isCabProviderDriver;
      //     return (
      //       <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
             

      //         <Tooltip
      //           componentsProps={{
      //             tooltip: {
      //               sx: {
      //                 backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                 opacity: 0.9
      //               }
      //             }
      //           }}
      //           title="Edit"
      //         >
      //           <IconButton
      //             color="primary"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               handleAdd('edit'); // Open the dialog for editing
      //               setVendorEdit(row.original);
      //             }}
      //           >
      //             <Edit />
      //           </IconButton>
      //         </Tooltip>

      //         <Tooltip
      //           componentsProps={{
      //             tooltip: {
      //               sx: {
      //                 backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                 opacity: 0.9
      //               }
      //             }
      //           }}
      //           title="Delete"
      //         >
      //           <IconButton
      //             color="error"
      //             onClick={(e) => {
      //               // e.stopPropagation();
      //               // console.log(`🚀 ~ row.values.id:`, row.values);
      //               // dispatch(handleOpen(ACTION.DELETE));
      //               // dispatch(setDeletedName(row.values['userName']));
      //               // dispatch(setSelectedID(row.values._id)); //setDeletedName
      //             }}
      //           >
      //             <Trash />
      //           </IconButton>
      //         </Tooltip>
      //       </Stack>
      //     );
      //   }
      // }
    ],
    []
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <MainCard content={false}>
          <ScrollX>
            {loading ? (
              <TableSkeleton rows={10} columns={5} />
            ) : data?.length === 0 ? (
              <EmptyTableDemo />
            ) : (
              <ReactTable columns={columns} data={data} />
            )}
          </ScrollX>
        </MainCard>
      </Stack>
      <Dialog
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          keepMounted
          fullWidth
          onClose={handleAdd}
          open={add}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <VendorEditForm vendorEdit={vendorEdit} onCancel={handleAdd} updateKey={updateKey} setUpdateKey={setUpdateKey} />
        </Dialog>
    </>
  );
};

VendorRateTable.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  limit: PropTypes.number,
  setLimit: PropTypes.func
};

export default VendorRateTable;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent }) {
  const theme = useTheme();

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'id', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, expanded }
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ['_id', 'VehicleTypeName._id'],
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
