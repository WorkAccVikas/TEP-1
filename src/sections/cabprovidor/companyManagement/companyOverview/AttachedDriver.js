import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Dialog, DialogTitle, IconButton, Slide, Stack, Tooltip, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import { Add, Eye } from 'iconsax-react';
import { ThemeMode } from 'config';
import ReactTable from 'components/tables/reactTable1/ReactTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import VendorRateTable from 'pages/management/vendor/vendorRate/VendorRateTable';
import { useSelector } from 'react-redux';
import { fetchCompaniesAssignedDrivers } from 'store/slice/cabProvidor/companySlice';
import { dispatch } from 'store';
import axiosServices from 'utils/axios';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AttachedDriver = ({ companyId }) => {
  const [open, setOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [driverList, setDriverList] = useState([]);
  const [updateKey, setUpdateKey] = useState(0);
  const [driverId, setDriverId] = useState(null);
  const [driverName, setDriverName] = useState(null);

  const { companiesDriver } = useSelector((state) => state.companies || {});

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

   //  useEffect: get attached vendor to the company by company Id

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      await dispatch(fetchCompaniesAssignedDrivers(companyId));
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [companyId]); // Only fetch data when id changes

  //  useEffect: Fetch rate between driver and company through companyId and driverId

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosServices.get(`/driver/unwind/driver/rate?companyId=${companyId}&driverId=${driverId}`);
        setDriverList(response.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    if (!companyId || !driverId) return;

    fetchdata();
  }, [driverId, companyId, updateKey]);

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
        accessor: 'userName'
      },
      {
        Header: 'Email',
        accessor: 'userEmail'
      },
      {
        Header: 'Mobile Number',
        accessor: 'contactNumber'
      },
      {
        Header: 'View Rate',
        className: 'cell-left',
        disableSortBy: true,
        Cell: ({ row }) => {
          const theme = useTheme();
          const mode = theme.palette.mode;
          console.log("row",row.original);
          
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
                    setDriverId(row.original._id);
                    setDriverName(row.original.userName);
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

  return (
    <>
      <MainCard title="Attached Drivers List" content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : companiesDriver.length > 0 ? (
            <ReactTable columns={columns} data={companiesDriver} hideHeader />
          ) : (
            <EmptyTableDemo />
          )}
        </ScrollX>
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

          <VendorRateTable data={driverList} updateKey={updateKey} setUpdateKey={setUpdateKey} loading={loading} />
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
