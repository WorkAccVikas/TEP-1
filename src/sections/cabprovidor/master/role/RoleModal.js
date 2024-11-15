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
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'utils/axios';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { addRole, fetchRoleDetails, updateRole } from 'store/slice/cabProvidor/roleSlice';

const x = {
  Loan: ['Create', 'Read', 'Update'],
  Invoice: ['Create', 'Read']
};

const RoleModal = ({ handleClose, roleId, handleRefetch }) => {
  // const [existedPermissions, setExistedPermissions] = useState(x);
  const [existedPermissions, setExistedPermissions] = useState({});
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const [errors, setErrors] = useState({
    roleName: '',
    // roleDescription: ''
  });

  const roleNameRef = useRef('');
  const roleDescriptionRef = useRef('');
  const existedPermissionsRef = useRef({});

  const parentFunction = useCallback((data) => {
    setExistedPermissions(data);
  }, []);

  const validateForm = () => {
    let isValid = true;
    const validationErrors = {
      roleName: '',
      // roleDescription: ''
    };

    if (!roleName || roleName.length < 3) {
      validationErrors.roleName = 'Role name must be at least 3 characters long';
      isValid = false;
    }

    // if (!roleDescription || roleDescription.length < 5) {
    //   validationErrors.roleDescription = 'Description must be at least 5 characters long';
    //   isValid = false;
    // }

    setErrors(validationErrors);
    const allPermissionsEmpty = Object.values(existedPermissions).every((permissions) => permissions.length === 0);
    if (allPermissionsEmpty) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please assign at least one permission to the role.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      isValid = false;
    }

    return isValid;
  };

  const checkFormChanges = () => {
    if (
      roleName !== roleNameRef.current ||
      roleDescription !== roleDescriptionRef.current ||
      JSON.stringify(existedPermissions) !== JSON.stringify(existedPermissionsRef.current)
    ) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  };

  useEffect(() => {
    checkFormChanges();
  }, [roleName, roleDescription, existedPermissions]);

  const handleButtonClick = useCallback(async () => {
    // alert('Button clicked');
    console.log(existedPermissions);
    if (!validateForm()) return;

    // const payload = {
    //   data: {
    //     role_name: roleName,
    //     role_description: roleDescription,
    //     permissions: existedPermissions
    //   }
    // };

    // console.log('payload', payload);

    let response;
    setIsLoading(true);
    try {
      if (!roleId) {
        // TODO : CREATE API
        const payload = {
          data: {
            role_name: roleName,
            role_description: roleDescription,
            permissions: existedPermissions
          }
        };

        console.log('payload', payload);

        response = await dispatch(addRole(payload)).unwrap();
      } else {
        // TODO : UPDATE API
        const payload = {
          data: {
            _id: roleId,
            role_name: roleName,
            role_description: roleDescription,
            permissions: existedPermissions
          }
        };

        console.log('payload', payload);
        response = await dispatch(updateRole(payload)).unwrap();
      }

      dispatch(
        openSnackbar({
          open: true,
          message: `Role ${roleId ? 'updated' : 'added'} successfully`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      handleRefetch();
      handleClose();
    } catch (error) {
      console.log('Error at role api = ', error);

      setRoleName(roleNameRef.current);
      setRoleDescription(roleDescriptionRef.current);
      setExistedPermissions(existedPermissionsRef.current);

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
    }
  }, [existedPermissions, roleName, roleDescription, roleId]);

  useEffect(() => {
    if (roleId) {
      (async () => {
        try {
          setIsLoading(true); // Start loading
          // Simulate an API call delay
          // await new Promise((resolve) => setTimeout(resolve, 2000));
          // setRoleName('Admin');
          // setRoleDescription('Admin Role');
          // setExistedPermissions(x);

          const response = await dispatch(fetchRoleDetails(roleId)).unwrap();
          console.log(`🚀 ~ a:`, response);

          const { role_name: roleName, role_description: roleDescription, permissions } = response;

          console.log({ roleName, roleDescription, permissions });

          setRoleName(roleName);
          setRoleDescription(roleDescription);
          setExistedPermissions(permissions);

          roleNameRef.current = roleName;
          roleDescriptionRef.current = roleDescription;
          existedPermissionsRef.current = permissions;
        } catch (error) {
          console.log('Fetching role details error = ', error);

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
  }, [roleId]);

  return (
    <>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          <DialogTitle>{roleId ? 'Edit' : 'Add'} Role</DialogTitle>
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
            {/* Role Name */}
            <Stack gap={1}>
              <InputLabel htmlFor="role-name">Role Name</InputLabel>
              <TextField
                id="role-name"
                variant="outlined"
                placeholder="Role Name"
                fullWidth
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                error={!!errors.roleName}
                helperText={errors.roleName}
              />
            </Stack>

            {/* Description */}
            <Stack gap={1}>
              <InputLabel htmlFor="role-description">Description</InputLabel>
              <TextField
                id="role-description"
                variant="outlined"
                placeholder="Description"
                fullWidth
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                error={!!errors.roleDescription}
                helperText={errors.roleDescription}
              />
            </Stack>
            {/* Permission */}
            <Stack gap={1}>
              {/* <Typography variant="subtitle1">Assign Permission to Roles</Typography> */}
              <PermissionTable existedPermissions={existedPermissions} parentFunction={parentFunction} />
              {/* <PermissionTable parentFunction={parentFunction} /> */}
            </Stack>
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
          // sx={{
          //   mr: 1,
          //   cursor: isLoading ? 'not-allowed' : 'pointer', // Show visual feedback
          //   pointerEvents: isLoading ? 'none' : 'auto' // Prevent pointer events when loading
          // }}
          disabled={isLoading || !hasChanged} // Disable button when loading
        >
          {isLoading ? 'Loading...' : roleId ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

RoleModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  roleId: PropTypes.string,
  handleRefetch: PropTypes.func.isRequired
};

export default RoleModal;
