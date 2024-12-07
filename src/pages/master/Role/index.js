/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Button, CircularProgress, Dialog, Stack } from '@mui/material';
import Header from 'components/tables/genericTable/Header';
import { Add } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import RoleTable from 'sections/cabprovidor/master/role/RoleTable';
import RoleModal from 'sections/cabprovidor/master/role/RoleModal';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import AlertDelete1 from 'components/alertDialog/AlertDelete1';
import { deleteRole, fetchAllRoles } from 'store/slice/cabProvidor/roleSlice';

const dummyData = [
  {
    _id: 1,
    role_name: 'HR',
    permissions: {
      Dashboard: ['Create', 'Read', 'Update', 'Delete'],
      Roster: ['Create', 'Read', 'Update', 'Delete'],
      Cabs: ['Create', 'Read', 'Update', 'Delete']
    }
  },
  {
    _id: 2,
    role_name: 'MIS',
    permissions: {
      Dashboard: ['Create', 'Read', 'Update', 'Delete'],
      Invoice: ['Create', 'Read', 'Update', 'Delete'],
      Cabs: ['Create', 'Read', 'Update', 'Delete'],
      // Loan: ['Create', 'Read']
      Loan: []
    }
  }
];

const Role = () => {
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [refetch, setRefetch] = useState(false);

  const handleRefetch = useCallback(() => {
    setRefetch((prev) => !prev);
  }, []);

  const handleModalOpen = useCallback(() => {
    setOpen(true);
    setRoleId(null);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleChangeRoleId = useCallback((id) => {
    setOpen(true);
    setRoleId(id);
  }, []);

  const handleModalOpenRemove = useCallback((id) => {
    console.log('id', id);
    setRemove(true);
    setRoleId(id);
  }, []);

  const handleModalCloseRemove = useCallback(() => {
    setRemove(false);
    setRoleId(null);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await dispatch(deleteRole(roleId)).unwrap();
      console.log(`🚀 ~ handleDelete ~ response:`, response);

      dispatch(
        openSnackbar({
          open: true,
          message: `Role deleted successfully`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      handleModalCloseRemove();
      handleRefetch();
    } catch (error) {
      console.log('Error at role delete api = ', error);
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
      handleModalCloseRemove();
    } finally {
      setIsLoading(false);
    }
  }, [roleId, handleModalCloseRemove, handleRefetch]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const response = await dispatch(fetchAllRoles()).unwrap();
        console.log('a', response);

        setData(response);
      } catch (error) {
        console.log('Error fetching role all  data:', error);
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
    })();
  }, [refetch]);

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header OtherComp={() => <ButtonComponent handleModalOpen={handleModalOpen} />} />

        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <CircularProgress />
          </Stack>
        ) : data?.length > 0 ? (
          <RoleTable
            data={data}
            handleModalOpen={handleModalOpen}
            handleChangeRoleId={handleChangeRoleId}
            handleModalOpenRemove={handleModalOpenRemove}
          />
        ) : (
          <TableNoDataMessage text="No Role Found" />
        )}
      </Stack>

      {open && (
        <Dialog
          open={open}
          onClose={handleModalClose}
          scroll="body"
          maxWidth="md"
          fullWidth
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <RoleModal handleClose={handleModalClose} roleId={roleId} handleRefetch={handleRefetch} />
        </Dialog>
      )}

      {remove && (
        <Dialog
          open={remove}
          onClose={handleModalCloseRemove}
          scroll="body"
          maxWidth="md"
          fullWidth
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <AlertDelete1 handleClose={handleModalCloseRemove} title="Delete Role" handleConfirm={handleDelete} open={remove} />
        </Dialog>
      )}
    </>
  );
};

export default Role;

const ButtonComponent = ({ handleModalOpen }) => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <WrapperButton moduleName={MODULE.ROLE} permission={PERMISSIONS.CREATE}>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            onClick={() => {
              // alert('Add Role');
              handleModalOpen();
            }}
          >
            Add Role
          </Button>
        </WrapperButton>
      </Stack>
    </>
  );
};

ButtonComponent.propTypes = {
  handleModalOpen: PropTypes.func.isRequired
};
