// material-ui
import { Autocomplete, Button, Grid, Stack, TextField, DialogActions } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import axiosServices from 'utils/axios';

// ==============================|| FORM VALIDATION - AUTOCOMPLETE  ||============================== //

const ReassignVehicle = ({ handleClose, driverId, setUpdateKey, updateKey, assignedVehicle }) => {
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInformation'));
  const CabproviderId = userInfo.userId;
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  console.log('selectedVehicles', selectedVehicles);
  console.log('driverId', driverId);
  console.log('assignedVehicle', assignedVehicle);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axiosServices.get(`/vehicle/all?id=${CabproviderId}&page=1&limit=5000`);
      if (response.status === 200) {
        setLoading(false);
        console.log('response', response);
        setVehicleList(response.data.data.result);
      } else {
        setError(true);
        console.log('response', response);
      }
    };

    fetchdata();
  }, [CabproviderId]);

  const handleAssign = async () => {
    try {
      const response = await axiosServices.put(`/vehicleAssignment/reAssign/vehicle`, {
        data: {
          oldVehicleId: assignedVehicle.vehicleId._id,
          driverId: driverId._id,
          newVehicleId: selectedVehicles[0]._id
        }
      });

      if (response.status === 200) {
        setUpdateKey(updateKey + 1);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Vehicle Reassigned Successfully.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: error.response?.data?.message || 'Something went wrong',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    } finally {
      handleClose();
    }
  };

//   const formik = useFormik({
//     initialValues: {
//       role: '',
//       skills: []
//     },
//     // validationSchema,
//     onSubmit: () => {
//       dispatch(
//         openSnackbar({
//           open: true,
//           message: 'Autocomplete - Submit Success',
//           variant: 'alert',
//           alert: {
//             color: 'success'
//           },
//           close: false
//         })
//       );
//     }
//   });

  const handleChange = (event, value) => {
    // Logic to ensure only one vehicle can be selected
    if (value.length <= 1) {
      setSelectedVehicles(value);
    } else {
      // Keep only the most recent selection
      setSelectedVehicles([value[value.length - 1]]);
    }
  };

  return (
    <MainCard title="Reassign Vehicle">
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={vehicleList} // Replace driverList with the appropriate array
              getOptionLabel={(option) => option.vehicleNumber}
              value={selectedVehicles} // Set value to the selected vehicles
              onChange={handleChange} // Handle change to update selected vehicles
              loading={loading} // Showing loading state
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Vehicle"
                  placeholder="Select..."
                  fullWidth
                  error={!!error} // Handle the error state
                  helperText={error && 'Error loading Vehicles'} // Display error message
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  p: 0.8
                },
                '& .MuiAutocomplete-tag': {
                  bgcolor: 'primary.lighter',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  '& .MuiSvgIcon-root': {
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.dark'
                    }
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="outlined" onClick={() => navigate('/management/cab/add-cab')}>
                  Add Vehicle
                </Button>
                <Button variant="contained" onClick={handleAssign} disabled={selectedVehicles.length === 0}>
                  Reassign
                </Button>
              </Stack>
            </DialogActions>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
};

export default ReassignVehicle;
