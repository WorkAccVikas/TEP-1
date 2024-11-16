import PropTypes from 'prop-types';
import React, { useState, useEffect, memo } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import moment from 'moment';
import { Calendar } from 'iconsax-react';
import DateRangePickerDialog from 'components/DateRange/DateRangePickerDialog';

// Enum to define different date range options
export const DATE_RANGE_OPTIONS = Object.freeze({
  ALL_TIME: 'allTime',
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  THIS_MONTH: 'thisMonth',
  LAST_MONTH: 'lastMonth',
  CURRENT_MONTH: 'currentMonth',
  CUSTOM: 'custom'
});

// Predefined date range objects based on the above enum
const predefinedDateRanges = {
  [DATE_RANGE_OPTIONS.ALL_TIME]: {
    label: 'All Time',
    start: moment(0),
    end: moment().endOf('day')
  },
  [DATE_RANGE_OPTIONS.TODAY]: {
    label: 'Today',
    start: moment().startOf('day'),
    end: moment().endOf('day')
  },
  [DATE_RANGE_OPTIONS.YESTERDAY]: {
    label: 'Yesterday',
    start: moment().subtract(1, 'day').startOf('day'),
    end: moment().subtract(1, 'day').endOf('day')
  },
  [DATE_RANGE_OPTIONS.LAST_7_DAYS]: {
    label: 'Last 7 Days',
    start: moment().subtract(7, 'days').startOf('day'),
    end: moment().endOf('day')
  },
  [DATE_RANGE_OPTIONS.LAST_30_DAYS]: {
    label: 'Last 30 Days',
    start: moment().subtract(30, 'days').startOf('day'),
    end: moment().endOf('day')
  },
  [DATE_RANGE_OPTIONS.THIS_MONTH]: {
    label: 'This Month',
    start: moment().startOf('month'),
    end: moment().endOf('month')
  },
  [DATE_RANGE_OPTIONS.LAST_MONTH]: {
    label: 'Last Month',
    start: moment().subtract(1, 'month').startOf('month'),
    end: moment().subtract(1, 'month').endOf('month')
  },
  [DATE_RANGE_OPTIONS.CURRENT_MONTH]: {
    label: 'Current Month',
    start: moment().startOf('month'),
    end: moment().endOf('day')
  },
  [DATE_RANGE_OPTIONS.CUSTOM]: { label: 'Custom Range' }
};

const DateRangeSelect = memo(
  ({
    startDate,
    endDate,
    onRangeChange,
    showLabel = false,
    showSelectedRangeLabel = false, // Configurable prop to show/hide selected range label
    selectedRange,
    setSelectedRange,
    availableRanges
  }) => {
    console.log('DateRangeSelect render');
    const [isDialogOpen, setDialogOpen] = useState(false);

    // Helper to determine which range the current start and end dates fall into
    const determineRange = (startDate, endDate) => {
      for (const [key, range] of Object.entries(predefinedDateRanges)) {
        if (range.start && range.end && moment(startDate).isSame(range.start, 'day') && moment(endDate).isSame(range.end, 'day')) {
          return key;
        }
      }
      return DATE_RANGE_OPTIONS.CUSTOM; // Default to "Custom" if no match is found
    };

    useEffect(() => {
      // Automatically set the range based on the initial dates
      if (startDate && endDate && !selectedRange) {
        const initialRange = determineRange(startDate, endDate);
        setSelectedRange(initialRange);
      }
    }, [startDate, endDate, selectedRange, setSelectedRange]);

    const filteredDateRanges = availableRanges
      ? Object.entries(predefinedDateRanges).filter(([key]) => availableRanges.includes(key))
      : Object.entries(predefinedDateRanges);

    const handleRangeSelection = (event) => {
      const range = event.target.value;
      setSelectedRange(range);

      if (range === DATE_RANGE_OPTIONS.CUSTOM) {
        setDialogOpen(true);
      } else {
        const selectedRangeDetails = predefinedDateRanges[range];
        const rangeStart = selectedRangeDetails?.start ? selectedRangeDetails.start.toDate() : null;
        const rangeEnd = selectedRangeDetails?.end ? selectedRangeDetails.end.toDate() : null;

        onRangeChange({
          startDate: rangeStart,
          endDate: rangeEnd
        });
      }
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const selectedRangeLabel =
      selectedRange && startDate && endDate
        ? `${predefinedDateRanges[selectedRange]?.label} (${moment(startDate).format('MMMM DD, YYYY')} - ${moment(endDate).format(
            'MMMM DD, YYYY'
          )})`
        : predefinedDateRanges[selectedRange]?.label || 'Select Date Range';

    return (
      <>
        <FormControl variant="outlined">
          {showLabel && <InputLabel>Date Range</InputLabel>}

          <Select
            value={selectedRange}
            onChange={handleRangeSelection}
            label={showLabel ? 'Date Range' : ''}
            displayEmpty
            sx={{
              backgroundColor: 'primary.main',
              color: '#fff',
              '& .MuiSelect-select': {
                padding: '0.5rem',
                pr: '2rem'
              },
              '& .MuiSelect-icon': {
                color: '#fff' // Set the down arrow color to white
              }
            }}
            // renderValue={() => (
            //   <Box display="flex" alignItems="center">
            //     <Calendar fontSize="small" style={{ marginRight: 8 }} />
            //     {selectedRangeLabel}
            //   </Box>
            // )}
            renderValue={() =>
              showSelectedRangeLabel ? (
                <Box display="flex" alignItems="center">
                  <Calendar fontSize="small" style={{ marginRight: 8 }} color="#fff" />
                  {selectedRangeLabel}
                </Box>
              ) : (
                <Box display="flex" alignItems="center">
                  <Calendar fontSize="small" style={{ marginRight: 8 }} color="#fff" />
                  {predefinedDateRanges[selectedRange]?.label || 'Select Date Range'}
                </Box>
              )
            }
          >
            {filteredDateRanges.map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                <Box display="flex" alignItems="center">
                  {label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DateRangePickerDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onDateRangeChange={(newRange) => {
            onRangeChange(newRange);
            handleDialogClose();
          }}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
      </>
    );
  }
);

// Prop validation using PropTypes
DateRangeSelect.propTypes = {
  startDate: PropTypes.instanceOf(Date), // Ensures startDate is a Date object
  endDate: PropTypes.instanceOf(Date), // Ensures endDate is a Date object
  onRangeChange: PropTypes.func.isRequired, // Callback function to handle range changes
  showLabel: PropTypes.bool, // Determines whether to show the label
  showSelectedRangeLabel: PropTypes.bool, // Prop for controlling selectedRangeLabel visibility
  selectedRange: PropTypes.string, // The currently selected date range key
  setSelectedRange: PropTypes.func.isRequired, // Function to update the selected range state
  availableRanges: PropTypes.arrayOf(PropTypes.string) // Array of available date range keys to be displayed
};

export default DateRangeSelect;
