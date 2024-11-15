/* eslint-disable no-unused-vars */
import { Box, Button, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ReactTable, { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import { formattedDate } from 'utils/helper';
import { ACTION, FUEL_TYPE, MODULE, PERMISSIONS } from 'constant';
import AlertDelete from 'components/alertDialog/AlertDelete';
import { openSnackbar } from 'store/reducers/snackbar';
import {
  fetchAllVehicleTypes,
  fetchVehicleTypeDetails,
  addVehicleType,
  updateVehicleType,
  deleteVehicleType,
  handleClose,
  handleOpen,
  setDeletedName,
  setSelectedID
} from 'store/slice/cabProvidor/vehicleTypeSlice';
import CabTypeForm from 'sections/cabprovidor/master/cabType/CabTypeForm';
import Error500 from 'pages/maintenance/error/500';
import CabTypeTable from 'sections/cabprovidor/master/cabType/CabTypeTable';
import Header from 'components/tables/genericTable/Header';
import { useNavigate } from 'react-router';
import WrapperButton from 'components/common/guards/WrapperButton';

const getInitialValues = (data) => {

  if (data) {
    return {
      _id: data?._id || '',
      vehicleTypeName: data?.vehicleTypeName || '',
      vehicleDescription: data?.vehicleDescription || '',
      capacity: data?.capacity || 0,
      fuelType: data?.fuelType?.toString() || -1
    };
  } else {
    return {
      vehicleTypeName: '',
      vehicleDescription: '',
      capacity: 0,
      fuelType: -1
    };
  }
};

const sliceName = 'vehicleType';

const CabType = () => {
  const dispatch = useDispatch();
  const { vehicleTypes, loading, error, open, remove, deletedName, selectedID, metaData } = useSelector((state) => state.vehicleTypes);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  const theme = useTheme();
  const mode = theme.palette.mode;

  useEffect(() => {
    dispatch(fetchAllVehicleTypes());
  }, []);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  const handleAdd = useCallback(() => {
    dispatch(handleOpen(ACTION.CREATE));
  }, []);

  const handleCloseDialog = useCallback(async (e, flag = false) => {
    // console.log(`🚀 ~ handleCloseDialog ~ flag:`, flag);

    if (typeof flag === 'boolean' && flag) {
      const response = await dispatch(deleteVehicleType()).unwrap();

      if (response.status === 200) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Cab Type deleted successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        dispatch(handleClose());

        dispatch(fetchAllVehicleTypes());
      }
    } else {
      dispatch(handleClose());
      return;
    }
  }, []);

  const formikHandleSubmit = async (values, isCreating) => {
    try {
      if (isCreating) {
        const payload = {
          data: {
            vehicleTypeName: values.vehicleTypeName,
            vehicleDescription: values.vehicleDescription,
            capacity: values.capacity,
            fuelType: values.fuelType
          }
        };

        const response = await dispatch(addVehicleType(payload)).unwrap();
      } else {
        // console.log({ selectedID });
        const payload = {
          data: {
            _id: values._id,
            vehicleTypeName: values.vehicleTypeName,
            vehicleDescription: values.vehicleDescription,
            capacity: values.capacity,
            fuelType: values.fuelType
          }
        };

        const response = await dispatch(updateVehicleType(payload)).unwrap();
      }
    } catch (error) {
      console.log('Error :: formikHandleSubmit =', error);
      throw error;
    }
  };

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  // if (vehicleTypes.length === 0) return <EmptyTableDemo />;

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header OtherComp={({loading}) => <ButtonComponent handleAdd={handleAdd} loading={loading}/>} />

        <CabTypeTable
          data={vehicleTypes}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={handleLimitChange}
          lastPageNo={lastPageIndex}
          loading={loading}
        />
      </Stack>

      {open && (
        <CabTypeForm
          open={open}
          handleClose={handleCloseDialog}
          sliceName="vehicleTypes"
          title={{ ADD: 'Add Vehicle Type', EDIT: 'Edit Vehicle Type' }}
          initialValuesFun={getInitialValues}
          onSubmit={formikHandleSubmit}
          fetchAllData={() => dispatch(fetchAllVehicleTypes())}
          fetchSingleDetails={() => dispatch(fetchVehicleTypeDetails())}
        />
      )}

      {remove && <AlertDelete title={deletedName} open={remove} handleClose={handleCloseDialog} />}
    </>
  );
};

export default CabType;

const ButtonComponent = ({ handleAdd,loading }) => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <WrapperButton moduleName={MODULE.CAB_TYPE} permission={PERMISSIONS.CREATE}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />} // Show loading spinner if loading
              onClick={handleAdd}
              size="small"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Loading...' : ' Add Cab Type'}
            </Button>
          </WrapperButton>
      </Stack>
    </>
  );
};
