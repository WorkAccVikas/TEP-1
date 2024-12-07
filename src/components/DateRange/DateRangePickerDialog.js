import PropTypes from 'prop-types'; // Importing prop-types for validation
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

const DateRangePickerDialog = ({ isOpen, onClose, onDateRangeChange, initialStartDate, initialEndDate }) => {
  // Local state for the selected date range
  const [dateRange, setDateRange] = useState([initialStartDate, initialEndDate]);

  const handleSave = () => {
    onDateRangeChange({
      startDate: dateRange[0] ? dateRange[0].toDate() : null, // Convert to native Date
      endDate: dateRange[1] ? dateRange[1].toDate() : null // Convert to native Date
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Date Range</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <StaticDateRangePicker
            displayStaticWrapperAs="desktop"
            value={[dateRange[0] ? moment(dateRange[0]) : null, dateRange[1] ? moment(dateRange[1]) : null]}
            onChange={(newRange) => setDateRange(newRange)} // Update local state
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Adding prop validation
DateRangePickerDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Required boolean indicating whether the dialog is open
  onClose: PropTypes.func.isRequired, // Required function to close the dialog
  onDateRangeChange: PropTypes.func.isRequired, // Required function to handle date range change
  initialStartDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.instanceOf(moment)]), // Start date, can be a Date or moment instance
  initialEndDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.instanceOf(moment)]) // End date, can be a Date or moment instance
};

// Default props for optional values
DateRangePickerDialog.defaultProps = {
  initialStartDate: null, // Default to null if not provided
  initialEndDate: null // Default to null if not provided
};

export default DateRangePickerDialog;
