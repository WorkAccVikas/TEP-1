import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Dialog, DialogTitle, IconButton, Slide, Stack, Tooltip, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import { Add, Eye } from 'iconsax-react';
import { ThemeMode } from 'config';
import ReactTable from 'components/tables/reactTable/ReactTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import VendorRateTable from 'pages/management/vendor/vendorRate/VendorRateTable';
import { useSelector } from 'react-redux';
import { fetchCompaniesAssignedDrivers } from 'store/slice/cabProvidor/companySlice';
import { dispatch } from 'store';
import axiosServices from 'utils/axios';
import { FaLock } from 'react-icons/fa';
import { USERTYPE } from 'constant';
import { fetchDrivers } from 'store/slice/cabProvidor/driverSlice';
import PaginationBox from 'components/tables/Pagination';
import { formattedDate } from 'utils/helper';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AttachedDriver = ({ vendorId }) => {
  const { drivers, metaData, error } = useSelector((state) => state.drivers);
  const userType = useSelector((state) => state.auth.userType);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driverList, setDriverList] = useState([]);
  const [updateKey, setUpdateKey] = useState(0);
  const [driverId, setDriverId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [driverName, setDriverName] = useState(null);
  const lastPageNo = metaData.lastPageNo;

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  //  useEffect: get attached vendor to the vendor by vendor Id

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchDrivers({ page, limit, driverType: 3, vendorID: vendorId }));
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [page, limit,vendorId]); // Only fetch data when id changes

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        className: 'cell-center',
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Driver Name',
        accessor: 'userName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Mobile Number',
        accessor: 'contactNumber',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Email',
        accessor: 'userEmail',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        // disableSortBy: true,
        Cell: ({ row }) => {
          const { values } = row;
          const time = values['createdAt'];
          return (
            <Typography
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '60px', // Ensures enough space for minimum display
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' // Prevents text from wrapping
              }}
            >
              {' '}
              {time ? formattedDate(time, 'DD/MM/YYYY') : 'N/A'}
            </Typography>
          );
        }
      },
    ],
    [userType]
  );

  return (
    <>
      <MainCard title="Attached Drivers List" content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={5} />
          ) : drivers.length > 0 ? (
            <ReactTable columns={columns} data={drivers} hideHeader />
          ) : (
            <EmptyTableDemo />
          )}
        </ScrollX>
        <Box>
          {drivers.length > 0 && (
            <div style={{ padding: '10px' }}>
              <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={handleLimitChange} lastPageIndex={lastPageNo} />
            </div>
          )}
        </Box>
      </MainCard>
      {driverId && open && (
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
            <DialogTitle id="alert-dialog-title">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Driver Rates with {driverName}</Typography>
                <IconButton onClick={handleClose} color="inherit" aria-label="close">
                  <Add style={{ transform: 'rotate(45deg)' }} />
                </IconButton>
              </Stack>
            </DialogTitle>
          </AppBar>
        </Dialog>
      )}
    </>
  );
};

AttachedDriver.propTypes = {
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default AttachedDriver;
