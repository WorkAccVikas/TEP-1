/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Add } from 'iconsax-react';
import PermissionTable from 'sections/cabprovidor/master/role/PermissionTable';
import { useCallback, useEffect, useState } from 'react';
import axios from 'utils/axios';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { fetchUserPermissions } from 'store/slice/cabProvidor/userSlice';

const x = {
  Loan: ['Create', 'Read', 'Update']
};
const ManagePermissionModal = ({ handleClose, userId }) => {
  const [existedPermissions, setExistedPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const parentFunction = useCallback((data) => {
    setExistedPermissions(data);
  }, []);

  const handleButtonClick = useCallback(async () => {
    try {
      console.log(existedPermissions);
      if (!userId) return;

      const payload = {
        data: {
          permissions: existedPermissions,
          uid: userId
        }
      };

      console.log('payload', payload);

      setIsLoading(true);

      // TODO : UPDATE API
      await axios.put(`/user/update/specific/permission`, payload);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Permission updated successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    } catch (error) {
      console.log('Error at role api = ', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error?.message || 'Something went wrong',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    } finally {
      setIsLoading(false);
      handleClose();
    }
  }, [handleClose, userId, existedPermissions]);

  useEffect(() => {
    console.log('userId', userId);
    if (userId) {
      (async () => {
        try {
          setIsLoading(true); // Start loading
          // Simulate an API call delay
          // await new Promise((resolve) => setTimeout(resolve, 7000));
          // setExistedPermissions(x);

          const data = await dispatch(fetchUserPermissions(userId)).unwrap();
          console.log(`🚀 ~ data:`, data);
          setExistedPermissions(data?.permissions || {});
        } catch (error) {
          console.log('Error at All Permissions of A User API = ', error);

          dispatch(
            openSnackbar({
              open: true,
              message: error?.message || 'Something went wrong',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        } finally {
          setIsLoading(false); // Stop loading
        }
      })();
    }

    return () => {
      console.log('Clean up for ManagePermissionModal');
    };
  }, [userId]);

  return (
    <>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          <DialogTitle>Manage User Permission</DialogTitle>
        </Grid>
        <Grid item sx={{ mr: 1.5 }}>
          <IconButton color="secondary" onClick={handleClose}>
            <Add style={{ transform: 'rotate(45deg)' }} />
          </IconButton>
        </Grid>
      </Grid>

      <DialogContent dividers>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <PermissionTable existedPermissions={existedPermissions} parentFunction={parentFunction} />
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            mr: 1,
            cursor: isLoading ? 'not-allowed' : 'pointer', // Show visual feedback
            pointerEvents: isLoading ? 'none' : 'auto' // Prevent pointer events when loading
          }}
          // disabled={isLoading} // Disable button when loading
        >
          {isLoading ? 'Loading...' : userId ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

ManagePermissionModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  userId: PropTypes.string
};

export default ManagePermissionModal;
