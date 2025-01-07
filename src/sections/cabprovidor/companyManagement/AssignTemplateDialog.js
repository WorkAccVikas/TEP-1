import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { PopupTransition } from 'components/@extended/Transitions';
import { Add } from 'iconsax-react';
import { useSelector } from 'store';
import axiosServices from 'utils/axios';
import { getArrayDifferences } from 'utils/helper';

const data = [
  {
    mappedData: {
      rosterTripId: '',
      tripDate: 'Date',
      tripTime: 'Shift Time',
      tripType: 'Shift Type',
      zoneName: 'Planned Locality',
      zoneType: 'Zone',
      location: 'Office Location',
      guard: 'Guard Required',
      guardPrice: 'Taxi ',
      vehicleType: 'Vehicle Type',
      vehicleNumber: 'Vehicle Number',
      vehicleRate: 'S. No.',
      addOnRate: 'cab no',
      penalty: 'Toll',
      remarks: 'Trip ID'
    },
    templateName: 'Amdocs',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:MM',
    pickupType: 'login',
    dropType: 'logout',
    _id: '6716343b5d337daba3ac8a93'
  },
  {
    mappedData: {
      rosterTripId: '',
      tripDate: 'Date',
      tripTime: 'Shift Time',
      tripType: 'Shift Type',
      zoneName: 'Planned Locality',
      zoneType: 'Zone',
      location: 'Office Location',
      guard: 'Guard Required',
      guardPrice: 'Taxi ',
      vehicleType: 'Vehicle Type',
      vehicleNumber: 'Vehicle Number',
      vehicleRate: 'S. No.',
      addOnRate: 'cab no',
      penalty: 'Toll',
      remarks: 'Trip ID'
    },
    templateName: 'Amdocs',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:MM',
    pickupType: 'login',
    dropType: 'logout',
    _id: '671634805d337daba3ac8a9c'
  },
  {
    mappedData: {
      rosterTripId: '',
      tripDate: 'Date',
      tripTime: 'Shift Time',
      tripType: 'Shift Type',
      zoneName: 'Planned Locality',
      zoneType: 'Zone',
      location: 'Office Location',
      vehicleType: 'Vehicle Type',
      vehicleNumber: 'Vehicle Number'
    },
    templateName: 'amdocs1',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:MM',
    pickupType: 'LOGIN',
    dropType: 'LOGOUT',
    _id: '6717d1dd7ff54a38902fcfbe'
  },
  {
    mappedData: {
      rosterTripId: '',
      tripDate: 'Date',
      tripTime: 'Shift Time',
      tripType: 'Shift Type',
      zoneName: 'Planned Locality',
      zoneType: 'Zone',
      location: 'Office Location',
      vehicleType: 'Vehicle Type',
      vehicleNumber: 'Vehicle Number'
    },
    templateName: 'amdocs1',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:MM',
    pickupType: 'LOGIN',
    dropType: 'LOGOUT',
    _id: '6717d1ec7ff54a38902fcfc5'
  },
  {
    mappedData: {
      rosterTripId: '',
      tripDate: 'Date',
      tripTime: 'Shift Time',
      tripType: 'Shift Type',
      zoneName: 'Planned Locality',
      zoneType: 'Zone',
      location: 'Office Location',
      vehicleType: 'Vehicle Type'
    },
    templateName: 'test1',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:MM',
    pickupType: 'login',
    dropType: 'logout',
    _id: '671b7f29a50f2423df7bba77'
  }
];

const AssignTemplateDialog = ({ currentRow, open, handleClose, handleRefetch }) => {
  console.log(`🚀 ~ AssignTemplateDialog ~ currentRow:`, currentRow);

  // const [templateID, setTemplateID] = useState([]);
  // const [templateID, setTemplateID] = useState(['6716343b5d337daba3ac8a93', '671634805d337daba3ac8a9c']); // Initial selected templates
  const [templateID, setTemplateID] = useState(currentRow.templateIds); // Initial selected templates

  const { data } = useSelector((state) => state.template);
  // console.log(`🚀 ~ AssignTemplateDialog ~ data:`, data);

  const [isLoading, setIsLoading] = useState(false);

  const handleAssignTemplate = async () => {
    try {
      if (!templateID.length) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Please select at least one template',
            variant: 'alert',
            alert: { color: 'error' },
            close: true
          })
        );
        return;
      }

      const result = getArrayDifferences(currentRow.templateIds, templateID);

      const payload = {
        data: {
          companyId: currentRow._id,
          removedTemplateIds: result.removeId,
          newTemplateId: result.newId
        }
      };

      console.log('payload', payload);

      setIsLoading(true);
      // TODO : API call for updating company template
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await axiosServices.post('/tripData/roster/setting/assign', payload);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Template re-assigned successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );

      handleRefetch();

      handleClose();
    } catch (error) {
      console.log('Error at handleAssignTemplate: ', error);
      dispatch(openSnackbar({ open: true, message: error.message, variant: 'alert', alert: { color: 'error' }, close: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (templateId) => {
    setTemplateID(
      (prevState) =>
        prevState.includes(templateId)
          ? prevState.filter((id) => id !== templateId) // Remove if already selected
          : [...prevState, templateId] // Add if not already selected
    );
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} keepMounted TransitionComponent={PopupTransition} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Assign Template</Typography>
            <IconButton color="secondary" onClick={handleClose}>
              <Add style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
              gap: 2
            }}
          >
            {data.map((template) => (
              <FormControlLabel
                key={template._id}
                control={<Checkbox checked={templateID.includes(template._id)} onChange={() => handleCheckboxChange(template._id)} />}
                label={
                  <Box>
                    <Typography variant="body1">{template.templateName}</Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignTemplate}
            sx={{
              mr: 1,
              cursor: isLoading ? 'not-allowed' : 'pointer', // Show visual feedback
              pointerEvents: isLoading ? 'none' : 'auto' // Prevent pointer events when loading
            }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Loading...' : 'Assign Template'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignTemplateDialog;
