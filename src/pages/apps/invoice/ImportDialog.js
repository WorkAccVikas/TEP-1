import { Button, Divider, CardContent, Modal, Stack, Typography, Box } from '@mui/material';
import { DateCalendar, LocalizationProvider, MonthCalendar, YearCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// project-imports
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';

const TripImportDialog = ({ open, handleClose, recieversDetails, setTripData }) => {
  const minDate = new Date('2023-01-01T00:00:00.000');
  const maxDate = new Date('2034-01-01T00:00:00.000');

  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const formatDateToStartAndEndDates = (inputDate) => {
    // Convert the input to a Date object
    const date = new Date(inputDate);

    if (isNaN(date)) {
      console.log({ date });
      return { startDate: '2024-01-01', endDate: '2025-12-01' };
    }

    // Extract year and month
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth is zero-based

    // Format startDate and endDate
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    return { startDate, endDate };
  };
  useEffect(() => {
    const { startDate, endDate } = formatDateToStartAndEndDates(date);
    setDateRange({ startDate: startDate, endDate: endDate });
  }, [date]);

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

      const response = await axiosServices.get(
        `/assignTrip/all/trips/cabProvider?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&companyID=${recieversDetails._id}`
      );

      // Log response for debugging

      // Update state with fetched data
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
          <Typography id="modal-modal-description">
            Generate Monthly Trip Invoice, Select Month for which Invoice Needs to be Generated.
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
