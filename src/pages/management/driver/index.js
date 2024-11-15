/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, handleClose, handleOpen, registerDriver } from 'store/slice/cabProvidor/driverSlice';
// import EmptyTableDemo from 'components/tables/EmptyTable';
// import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import DriverTable from 'sections/cabprovidor/driverManagement/DriverTable';
import MainCard from 'components/MainCard';
import { Autocomplete, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import Header from 'components/tables/genericTable/Header';
import { Add } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { ACTION, MODULE, PERMISSIONS, USERTYPE } from 'constant';
import DriverRegister from 'sections/cabprovidor/driverManagement/DriverRegister';
import * as Yup from 'yup';
import WrapperButton from 'components/common/guards/WrapperButton';

const OPTION_SET_1 = {
  ALL: {
    label: 'ALL',
    value: 1
  },
  SELF: {
    label: 'SELF',
    value: 2
  },
  OTHER: {
    label: 'OTHER',
    value: 3,
    disabled: true
  }
};

const getInitialValues = (data) => {
  if (data) {
    return {
      _id: data?._id || '',
      stateName: data?.stateName || '',
      taxRateMonthly: data?.taxRateMonthly || '',
      taxRatePerTrip: data?.taxRatePerTrip || ''
    };
  } else {
    return {
      userName: '',
      userEmail: '',
      contactNumber: '',
      vendorId: ''
    };
  }
};

const Driver = () => {
  const dispatch = useDispatch();
  const { drivers, metaData, loading, error, open } = useSelector((state) => state.drivers);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updateKey, setUpdateKey] = useState(0);
  const [driverType, setDriverType] = useState(1);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchDrivers({ page, limit, driverType }));
  }, [page, limit, dispatch, driverType, updateKey]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  const handleDriverTypeChange = useCallback((val) => {
    setDriverType(val);
    setPage(1);
    setLimit(10);
  }, []);

  const handleCloseDialog = useCallback(async (e, flag = false) => {
    if (typeof flag === 'boolean' && flag) {
      // const response = await dispatch(deleteDriver()).unwrap();
      // if (response.status === 200) {
      //   dispatch(
      //     openSnackbar({
      //       open: true,
      //       message: messages[sliceName].DELETE,
      //       variant: 'alert',
      //       alert: {
      //         color: 'success'
      //       },
      //       close: true
      //     })
      //   );
      //   dispatch(handleClose());
      //   dispatch(fetchAllDrivers());
      // }
    } else {
      dispatch(handleClose());
      return;
    }
  }, []);

  // const yupSchema = Yup.object().shape({
  //   userName: Yup.string().required('User Name is required'),
  //   userEmail: Yup.string().email('Enter a valid email').required('User Email is required'),
  //   contactNumber: Yup.string().required('Contact Number is required'),
  //   vendorId: [USERTYPE.iscabProvider, USERTYPE.iscabProviderUser].includes(userType)
  //     ? Yup.string().required('Vendor is required')
  //     : Yup.string()
  // });

  const formikHandleSubmit = async (values, isCreating) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (isCreating) {
        const payload = {
          data: {
            userName: values.userName,
            userEmail: values.userEmail,
            contactNumber: values.contactNumber,
            // vendorId: values.vendorId
            ...([USERTYPE.iscabProvider, USERTYPE.iscabProviderUser].includes(1) && values.vendorId && { vendorId: values.vendorId })
          }
        };

        const response = await dispatch(registerDriver(payload)).unwrap();
        if (response.status === 201) {
          setLimit(10);
          setPage(1);
          setDriverType(1);
          dispatch(fetchDrivers({ page: 1, limit: 10, driverType: 1 }));
        }
      } else {
        // console.log('Update API call');
        // console.log({ selectedID });
        // const payload = {
        //   data: {
        //     _id: values._id,
        //     stateName: values.stateName,
        //     taxRateMonthly: values.taxRateMonthly,
        //     taxRatePerTrip: values.taxRatePerTrip,
        //   },
        // };
        // const response = await dispatch(updateStateTax(payload)).unwrap();
        // console.log(`🚀 ~ formikHandleSubmit ~ response:`, response);
      }
    } catch (error) {
      throw error;
    }
  };

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  // if (drivers.length === 0) return <EmptyTableDemo />;

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header
          OtherComp={({ loading }) => (
            <ButtonComponent driverType={driverType} handleDriverTypeChange={handleDriverTypeChange} loading={loading} />
          )}
        />
        <DriverTable
          data={drivers}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={handleLimitChange}
          lastPageNo={lastPageIndex}
          loading={loading}
          setUpdateKey={setUpdateKey}
          updateKey={updateKey}
        />
      </Stack>

      {open && (
        <DriverRegister
          open={open}
          handleClose={handleCloseDialog}
          sliceName="drivers"
          title={{ ADD: 'Add Driver', EDIT: 'Edit Driver' }}
          initialValuesFun={getInitialValues}
          onSubmit={formikHandleSubmit}
          // fetchAllData={() => dispatch(fetchDrivers({ page: 1, limit: 10, driverType: 1 }))}
          // fetchAllData={() => dispatch(fetchDrivers())}
          // fetchSingleDetails={() => dispatch(fetchDriverDetails())}
          // yupSchema={yupSchema}
        />
      )}
    </>
  );
};

export default Driver;

const ButtonComponent = ({ driverType, handleDriverTypeChange, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleAdd = useCallback(() => {
    dispatch(handleOpen(ACTION.CREATE));
  }, []);
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* <Autocomplete
          id="autocomplete-based-on-driverType"
          fullWidth
          options={Object.entries(OPTION_SET_1)}
          autoHighlight
          getOptionLabel={(option) => option[0]} 
          value={Object.entries(OPTION_SET_1).find((item) => item[1].value === driverType)}
          isOptionEqualToValue={(option, value) => option[1].value === value}
          onChange={(event, newValue) => {
            console.log('newValue', newValue);
            const { value } = newValue[1];
            handleDriverTypeChange(value);
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option[0]}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder="Select Driver Type"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off'
              }}
            />
          )}
          disableClearable
          getOptionDisabled={(option) => !!option[1].disabled}
        /> */}

        {/* <Button variant="contained" startIcon={<Add />} onClick={() => navigate('add-driver')}> */}

        <WrapperButton moduleName={MODULE.DRIVER} permission={PERMISSIONS.CREATE}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />} // Show loading spinner if loading
            onClick={handleAdd}
            size="small"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Loading...' : 'Add Driver'}
          </Button>
        </WrapperButton>
      </Stack>
    </>
  );
};
