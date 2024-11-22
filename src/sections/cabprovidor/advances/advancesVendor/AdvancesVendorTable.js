import { Box, Chip, CircularProgress, Dialog, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { PopupTransition } from 'components/@extended/Transitions';
import AdvanceVendorForm from './AdvanceVendorForm';
import CustomAlertDelete from '../CustomAlertDelete';
import ReactTable, { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import axiosServices from 'utils/axios';

const AdvancesVendorTable = () => {
  const [key, setKey] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [alertopen, setAlertOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [fetchAllAdvance, setFetchAllAdvance] = useState(null);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axiosServices.get(`/advance/my/list`);
      if (response.status === 200) {
        setLoading(false);
      }

      setFetchAllAdvance(response.data.data);
    };

    fetchdata();
  }, [key]);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosServices.delete(`/advance?advanceId=${deleteId}`);
      if (response.status === 200) {
        setAlertOpen(false);
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        setKey(key + 2);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
      console.log('Delete response:', response.data);
    } catch (error) {
      console.error('Error deleting advance type:', error);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

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
        Header: 'Cab Provider',
        accessor: 'cabProviderId.userName'
      },
      {
        Header: 'Requested Amount',
        className: 'cell-center',
        accessor: 'requestedAmount',
        Cell: ({ value }) => (
          <Typography
            sx={{
              // width: 'fit-content', 
              minWidth: '20px', // Ensures enough space for minimum display
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' // Prevents text from wrapping
            }}
          >
            {value}
          </Typography>
        )
      },
      {
        Header: 'Advance Type',
        accessor: 'advanceTypeId.advanceTypeName'
      },
      {
        Header: 'Advance Type Id',
        accessor: 'advanceTypeId._id'
      },
      {
        Header: 'Approved Amount',
        className: 'cell-center',
        accessor: 'approvedAmount'
      },
      {
        Header: 'Final Amount',
        className: 'cell-center',
        accessor: 'finalAmount'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
      },
      {
        Header: 'Status',
        accessor: 'isApproved',
        Cell: ({ row }) => {
          const isApproved = row.original.isApproved;

          if (isApproved == 1) {
            return <Chip color="success" label="Approved" size="small" variant="light" />;
          } else if (isApproved == 2) {
            return <Chip color="error" label="Rejected" size="small" variant="light" />;
          } else {
            return <Chip color="warning" label="Pending" size="small" variant="light" />;
          }
        }
      },
      // {
      //   Header: 'Actions',
      //   className: 'cell-center',
      //   disableSortBy: true,
      //   Cell: ({ row }) => {
      //     const isApproved = row.original.isApproved;

      //     if (isApproved == 1) {
      //       return null;
      //     } else {
      //       return (
      //         <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
      //           <Tooltip
      //             componentsProps={{
      //               tooltip: {
      //                 sx: {
      //                   backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                   opacity: 0.9
      //                 }
      //               }
      //             }}
      //             title="Edit"
      //           >
      //             <IconButton
      //               color="primary"
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 console.log('rowr', row.values);

      //                 setCustomer(row.values);
      //                 handleAdd();
      //               }}
      //             >
      //               <Edit />
      //             </IconButton>
      //           </Tooltip>

      //           <Tooltip
      //             componentsProps={{
      //               tooltip: {
      //                 sx: {
      //                   backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                   opacity: 0.9
      //                 }
      //               }
      //             }}
      //             title="Delete"
      //           >
      //             <IconButton
      //               color="error"
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 console.log('row.values', row.values);

      //                 setDeleteId(row.values._id);
      //                 setAlertOpen(true);
      //               }}
      //             >
      //               <Trash />
      //             </IconButton>
      //           </Tooltip>
      //         </Stack>
      //       );
      //     }
      //   }
      // }
    ],
    [theme]
  );

  return (
    <>
      <MainCard content={false}>
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
          ) : fetchAllAdvance ? (
            <ReactTable columns={columns} data={fetchAllAdvance || []} handleAdd={handleAdd} buttonTitle="Request Advance" search />
          ) : (
            <TableNoDataMessage text="No Advance Request Found" />
          )}
        </ScrollX>
      </MainCard>

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AdvanceVendorForm customer={customer} onCancel={handleAdd} key={key} setKey={setKey} />
      </Dialog>

      <CustomAlertDelete
        title={'This action is irreversible. Please check before deleting.'}
        open={alertopen}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default AdvancesVendorTable;
