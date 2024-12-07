import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector, dispatch } from 'store';
import { fetchAllDrivers } from 'store/slice/cabProvidor/driverSlice';

const Two = () => {
  const [driverID, setDriverID] = useState('');

  const allDrivers = useSelector((state) => state.drivers.allDrivers);
  console.log(allDrivers);

  useEffect(() => {
    dispatch(fetchAllDrivers());
  }, []);

  return (
    <>
      <Autocomplete
        id="driverID"
        value={allDrivers.find((item) => item.driverId._id === driverID) || null}
        onChange={(event, value) => {
          setDriverID(value.driverId._id);
        }}
        options={allDrivers}
        fullWidth
        autoHighlight
        getOptionLabel={(option) => option.driverId.userName}
        // isOptionEqualToValue={(option) => {
        //   return option._id === formik.values.zoneId;
        // }}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {option.driverId.userName}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Choose a Driver"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />

      <hr />

      <p>Tina : {driverID}</p>
    </>
  );
};

export default Two;
