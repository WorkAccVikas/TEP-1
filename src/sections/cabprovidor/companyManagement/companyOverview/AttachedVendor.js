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
import VendorRateTable from 'pages/management/vendor/vendorRate/VendorRateTable';
import { useSelector } from 'react-redux';
import { fetchCompaniesAssignedVendors } from 'store/slice/cabProvidor/companySlice';
import axiosServices from 'utils/axios';
import { dispatch } from 'store';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AttachedVendor = ({ companyId }) => {
  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorCompanyName, setVendorCompanyName] = useState(null);
  const [open, setOpen] = useState(false); // State to manage popup
  const [vendorList, setVendorList] = useState([]);
  const [updateKey, setUpdateKey] = useState(0);

  const { companiesVendor } = useSelector((state) => state.companies || {});

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
      await dispatch(fetchCompaniesAssignedVendors(companyId));
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [companyId]); // Only fetch data when id changes

  //  useEffect: Fetch rates between vendor and company through companyId and vendorId

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosServices.get(`/cabRateMaster/unwind/rate/vendorId?vendorId=${vendorId}&companyID=${companyId}`);
        setVendorList(response.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    if (!companyId || !vendorId) return;

    fetchdata();
  }, [vendorId, companyId, updateKey]);

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
        Header: 'Vendor Company Name',
        accessor: 'vendorCompanyName'
      },
      {
        Header: 'Work Email',
        accessor: 'workEmail'
      },
      {
        Header: 'Mobile Number',
        accessor: 'workMobileNumber'
      },
      {
        Header: 'Address',
        accessor: 'officeAddress'
      },
      {
        Header: 'View Rate',
        className: 'cell-left',
        disableSortBy: true,
        Cell: ({ row }) => {
          const theme = useTheme();
          const mode = theme.palette.mode;
          console.log('row', row.original);

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
                    setVendorId(row.original._id);
                    setVendorCompanyName(row.original.vendorCompanyName);
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
      <MainCard title="Attached Vendors List" content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : companiesVendor.length > 0 ? (
            <ReactTable columns={columns} data={companiesVendor} hideHeader />
          ) : (
            <EmptyTableDemo />
          )}
        </ScrollX>
      </MainCard>
      {vendorId && open && (
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
                <Typography variant="h6">Rates with {vendorCompanyName}</Typography>
                <IconButton onClick={handleClose} color="inherit" aria-label="close">
                  <Add style={{ transform: 'rotate(45deg)' }} />
                </IconButton>
              </Stack>
            </DialogTitle>
          </AppBar>

          <VendorRateTable data={vendorList} updateKey={updateKey} setUpdateKey={setUpdateKey} loading={loading} />
        </Dialog>
      )}
    </>
  );
};

AttachedVendor.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default AttachedVendor;
