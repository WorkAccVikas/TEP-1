import { forwardRef, useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Slide,
  IconButton,
  Input,
  InputAdornment
} from '@mui/material';
import axiosServices from 'utils/axios';
import { Add } from 'iconsax-react';
import { formatIndianDate } from './ViewRoster';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AssignTripsDialog({ data, open, handleClose, handleAssignTrips }) {
  const [zoneInfo, setZoneInfo] = useState([]);
  const [vehicleTypeInfo, setVehicleTypeInfo] = useState([]);
  const [selectedZones, setSelectedZones] = useState({});
  const [selectedZoneTypes, setSelectedZoneTypes] = useState({});
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState({});
  const [companyRates, setCompanyRates] = useState({});
  const [prevSelections, setPrevSelections] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [driverRates, setDriverRates] = useState({});

  console.log(driverRates)
  useEffect(() => {
    const fetchAllZoneInfo = async () => {
      const response = await axiosServices.get('/zoneType/grouped/by/zone');
      setZoneInfo(response.data.data);
    };

    const fetchAllVehicleTypeInfo = async () => {
      const response = await axiosServices.get('/vehicleType');
      setVehicleTypeInfo(response.data.data);
    };

    const fetchDrivers = async () => {
      const response = await axiosServices.get('/driver/all?drivertype=1');
      setDrivers(response.data.data.result);
    };

    fetchAllZoneInfo();
    fetchAllVehicleTypeInfo();
    fetchDrivers();
  }, []);

  const handleZoneChange = (id, event) => {
    const selectedZone = event.target.value;
    setSelectedZones((prev) => ({
      ...prev,
      [id]: selectedZone
    }));
    setSelectedZoneTypes((prev) => ({
      ...prev,
      [id]: null
    }));
    setCompanyRates((prev) => ({
      ...prev,
      [id]: ''
    }));
  };

  const handleZoneTypeChange = (id, event) => {
    const selectedZoneType = event.target.value;
    setSelectedZoneTypes((prev) => ({
      ...prev,
      [id]: selectedZoneType
    }));
  };

  const handleVehicleTypeChange = (id, event) => {
    const selectedVehicleType = event.target.value;
    setSelectedVehicleTypes((prev) => ({
      ...prev,
      [id]: selectedVehicleType
    }));
  };

  const fetchCompanyRate = async (zoneId, zoneTypeId, vehicleTypeId, rowId) => {
    try {
      const response = await axiosServices.post(`/tripData/cab/amount`, {
        data: {
          companyID: data[0].companyID._id,
          vehicleTypeID: vehicleTypeId,
          zoneNameID: zoneId,
          zoneTypeID: zoneTypeId
        }
      });
      const rate = response.data.data;
      setCompanyRates((prev) => ({
        ...prev,
        [rowId]: rate
      }));
    } catch (error) {
      console.error('Failed to fetch company rate', error);
    }
  };

  const handleDriverChange = (id, event) => {
    const selectedDriver = event.target.value;
    setSelectedDrivers((prev) => ({
      ...prev,
      [id]: selectedDriver
    }));
    fetchDriverRate(selectedDriver, id);
  };

  const fetchDriverRate = async (driver, rowId) => {
    try {
      const zoneId = selectedZones[rowId]?._id;
      const zoneTypeId = selectedZoneTypes[rowId]?._id;
      const vehicleTypeId = selectedVehicleTypes[rowId]?._id;

      if (!zoneId || !zoneTypeId || !vehicleTypeId) {
        console.error('Zone, zone type, or vehicle type not selected');
        return;
      }

      const response = await axiosServices.post(`/tripData/amount/by/driver/id`, {
        data: {
          companyID: data[0].companyID._id,
          vehicleTypeID: vehicleTypeId,
          zoneNameID: zoneId,
          zoneTypeID: zoneTypeId,
          driverId: driver._id
        }
      });

      const rate = response.data.data;
      setDriverRates((prev) => ({
        ...prev,
        [rowId]: rate
      }));
    } catch (error) {
      console.error('Failed to fetch driver rate', error);
    }
  };

  useEffect(() => {
    data.forEach((row) => {
      const selectedZone = selectedZones[row._id];
      const selectedZoneType = selectedZoneTypes[row._id];
      const selectedVehicleType = selectedVehicleTypes[row._id];

      const currentSelections = {
        zone: selectedZone?._id,
        zoneType: selectedZoneType?._id,
        vehicleType: selectedVehicleType?._id
      };

      const hasChanged = JSON.stringify(prevSelections[row._id]) !== JSON.stringify(currentSelections);

      if (selectedZone && selectedZoneType && selectedVehicleType && hasChanged) {
        fetchCompanyRate(selectedZone._id, selectedZoneType._id, selectedVehicleType._id, row._id);
      }

      setPrevSelections((prev) => ({
        ...prev,
        [row._id]: currentSelections
      }));
    });
  }, [selectedZones, selectedZoneTypes, selectedVehicleTypes, data]);

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Add style={{ transform: 'rotate(45deg)' }} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Assign New Trips
          </Typography>
          <Button color="primary" variant="contained" onClick={handleAssignTrips}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Trip Date</TableCell>
              <TableCell>Trip Time</TableCell>
              <TableCell>Zone Name</TableCell>
              <TableCell>Zone Type</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Company Rate</TableCell>
              <TableCell>Guard Price</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{formatIndianDate(row?.tripDate)}</TableCell>
                <TableCell>{row?.tripTime}</TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`zone-select-label-${row._id}`}>Select Zone</InputLabel>
                    <Select
                      labelId={`zone-select-label-${row._id}`}
                      value={selectedZones[row._id] || ''}
                      onChange={(event) => handleZoneChange(row._id, event)}
                      label="Select"
                    >
                      {zoneInfo.map((zone) => (
                        <MenuItem key={zone._id} value={zone}>
                          {zone.zoneName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`zone-type-select-label-${row._id}`}>Select Zone Type</InputLabel>
                    <Select
                      labelId={`zone-type-select-label-${row._id}`}
                      value={selectedZoneTypes[row._id] || ''}
                      onChange={(event) => handleZoneTypeChange(row._id, event)}
                      label="Select"
                      disabled={!selectedZones[row._id]}
                    >
                      {selectedZones[row._id]?.zoneType.map((zoneType) => (
                        <MenuItem key={zoneType._id} value={zoneType}>
                          {zoneType.zoneTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`vehicle-type-select-label-${row._id}`}>Select Vehicle Type</InputLabel>
                    <Select
                      labelId={`vehicle-type-select-label-${row._id}`}
                      value={selectedVehicleTypes[row._id] || ''}
                      onChange={(event) => handleVehicleTypeChange(row._id, event)}
                      label="Select"
                    >
                      {vehicleTypeInfo.map((vehicle) => (
                        <MenuItem key={vehicle._id} value={vehicle}>
                          {vehicle.vehicleTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{companyRates[row._id]?.amount || 'N/A'}</TableCell>
                <TableCell>
                {companyRates[row._id]?.guardPrice || 'N/A'}
                </TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`driver-select-label-${row._id}`}>Select Driver</InputLabel>
                    <Select
                      labelId={`driver-select-label-${row._id}`}
                      value={selectedDrivers[row._id] || ''}
                      onChange={(event) => handleDriverChange(row._id, event)}
                      label="Select"
                    >
                      {drivers.map((driver) => (
                        <MenuItem key={driver._id} value={driver}>
                          {driver.userName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{driverRates[row._id] || 'N/A'}</TableCell>
                <TableCell>{row?.tripStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}
