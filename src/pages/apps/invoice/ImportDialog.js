import { Button, Divider, CardContent, Modal, Stack, Typography, Box, TextField } from '@mui/material';
import { DateCalendar, DesktopDatePicker, LocalizationProvider, MobileDatePicker, MonthCalendar, YearCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';
import { addMonths, format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { formatDateUsingMoment } from 'utils/helper';
import { useSelector } from 'store';
import { USERTYPE } from 'constant';

const TripImportDialog = ({ open, handleClose, recieversDetails, setTripData }) => {
  const [dateRange, setDateRange] = useState({
    startDate: addMonths(new Date(), -1), // Default to today's date
    endDate: new Date() // Default to 1 month after today's date
  });
  const userType = useSelector((state) => state.auth.userType);

  console.log(formatDateUsingMoment(dateRange.endDate));

  const fetchTripData = async () => {
    try {
      // Validate dateRange and recieversDetails._id
      if (!dateRange?.startDate || !dateRange?.endDate || !recieversDetails?._id) {
        console.error('Missing required parameters: startDate, endDate, or companyID.');
        dispatch(
          openSnackbar({
            open: true,
            message: `Invalid Request`,
            variant: 'alert',
            alert: { color: 'warning' },
            close: true,
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
          })
        );
        return;
      }

      // const response = await axiosServices.get(
      //   `/assignTrip/all/trips/cabProvider?startDate=${formatDateUsingMoment(dateRange.startDate)}&endDate=${formatDateUsingMoment(
      //     dateRange.endDate
      //   )}&companyID=${recieversDetails._id}`
      // );

      const baseURL = `/assignTrip/all/trips/cabProvider`;
      const queryParams = new URLSearchParams({
        startDate: formatDateUsingMoment(dateRange.startDate),
        endDate: formatDateUsingMoment(dateRange.endDate)
      });

      // Conditionally add `companyID` only if `userType` is 1 or 7
      if (userType === USERTYPE.iscabProvider || userType === USERTYPE.iscabProviderUser) {
        queryParams.append('companyID', recieversDetails._id);
      }

      const response = await axiosServices.get(`${baseURL}?${queryParams.toString()}`);
      // Log response for debugging

      // Update state with fetched data
      console.log('response.data.data = ', response.data.data);
      setTripData(response.data.data);
      dispatch(
        openSnackbar({
          open: true,
          message: `Data import successful! ${response.data.data.length} Trips fetched`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true,
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
        })
      );
      handleClose();
    } catch (error) {
      console.error('Error fetching trip data:', error?.response?.data || error.message);
      dispatch(
        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: { color: 'error' },
          close: true,
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        })
      );
    }
  };

  const handleStartChange = (newValue) => {
    setDateRange((prev) => ({ ...prev, startDate: newValue }));
  };
  const handleEndChange = (newValue) => {
    setDateRange((prev) => ({ ...prev, endDate: newValue }));
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
      <MainCard
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Typography variant="h5">Import Data</Typography>
          </Box>
        }
        modal
        darkTitle
        content={false}
        sx={{
          padding: 0 // Optional: Padding inside the card
        }}
      >
        <CardContent>
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3} direction={'row'} justifyContent="center" alignItems="center">
              <Box sx={{ maxWidth: 320 }}>
                <YearCalendar
                  value={date}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(newDate) => {
                    console.log({ newDate });
                    setDate(newDate);
                  }}
                />
              </Box>
              <Box sx={{ maxWidth: 320 }}>
                <MonthCalendar
                  value={date}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(newDate) => setDate(newDate)}
                  sx={{ m: 'auto' }}
                />
              </Box>
            </Stack>
          </LocalizationProvider> */}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
            <Stack spacing={3} direction={'row'}>
              <DesktopDatePicker
                format="dd/MM/yyyy"
                value={dateRange.startDate}
                onChange={handleStartChange}
                slotProps={{ textField: { placeholder: 'Select Start Date', helperText: 'Select Start Date' } }}
              />
              <DesktopDatePicker
                format="dd/MM/yyyy"
                value={dateRange.endDate}
                onChange={handleEndChange}
                slotProps={{ textField: { placeholder: 'Select End Date', helperText: 'Select End Date' } }}
              />
            </Stack>
          </LocalizationProvider>
        </CardContent>
        <Divider />
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
          <Button color="error" size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="success" size="small" variant="contained" onClick={fetchTripData}>
            import
          </Button>
        </Stack>
      </MainCard>
    </Modal>
  );
};

export default TripImportDialog;
