import { Button, Stack, Box, IconButton, Tooltip, useTheme } from '@mui/material';
import TableSkeleton from 'components/tables/TableSkeleton';
import { EmptyTable } from 'components/third-party/ReactTable';
import { Edit, Trash } from 'iconsax-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';
import { ThemeMode } from 'config';
import ReactTable from 'components/tables/reactTable1/ReactTable';
import CustomAlertDelete from './CustomAlertDelete';
import { fetchAllTemplates } from 'store/slice/cabProvidor/templateSlice';
import { useSelector } from 'store';

const TemplateList = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  // const [loading, setLoading] = useState(false);
  // const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { loading, data } = useSelector((state) => state.template);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        // const response = await axiosServices.get('/tripData/list/roster/settings');
        // console.log(`🚀 ~ fetchData ~ response:`, response);
        // setData(response.data.data.RosterTemplates);
        // setData([]);
        dispatch(fetchAllTemplates());
      } catch (error) {
        console.error('Error fetching data:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error fetching data',
            variant: 'alert',
            alert: { color: 'error' },
            close: true
          })
        );
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [refetch]);

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
        Header: 'Template Name',
        accessor: 'templateName'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Edit"
              >
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/settings/roster/template/edit/${row.values._id}`);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Delete"
              >
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(row.values._id);
                    setAlertOpen(true);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  const handleClose = () => {
    setAlertOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      // TODO : API CALL FOR DELETING TEMPLATE
      alert(`handleDelete ${deleteId}`);
      setDeleteLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // const response = await axiosServices.delete(`/tripData/delete/roster/settings/${deleteId}`);

      const response = {
        status: 200
      };

      if (response.status === 200) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Template deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: true
          })
        );
        setRefetch((prev) => !prev);
        setAlertOpen(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.log('Error :: handleDelete = ', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error deleting template',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <TableSkeleton rows={10} columns={5} />
      ) : (
        <Stack spacing={2}>
          {/* Button */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => {
                navigate('/settings/roster/template/create');
              }}
              size="small"
            >
              Create Template
            </Button>
          </Stack>

          {/* Table */}
          {data && data.length > 0 ? (
            <ReactTable columns={columns} data={data} hideHeader />
          ) : (
            <Box sx={{ alignSelf: 'center' }}>
              <EmptyTable />
            </Box>
          )}
        </Stack>
      )}

      {alertOpen && (
        <CustomAlertDelete
          title={'This action is irreversible. Please check before deleting.'}
          open={alertOpen}
          handleClose={handleClose}
          handleDelete={handleDelete}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default TemplateList;
