import PropTypes from 'prop-types';
import React, { useState, useEffect, memo, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, TextField } from '@mui/material';
import moment from 'moment';
import { Calendar } from 'iconsax-react';
import DateRangePickerDialog from 'components/DateRange/DateRangePickerDialog';
import CustomDateRangePickerDialog from 'components/DateRange/CustomDateRangePickerDialog';

// Enum to define different date range options
export const DATE_RANGE_OPTIONS = Object.freeze({
  ALL_TIME: 'allTime',
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  THIS_MONTH: 'thisMonth',
  LAST_MONTH: 'lastMonth',
  CUSTOM: 'custom'
});

const FORMAT_DATE = 'MM/DD/YY';

const DateRangeSelect = memo(
  ({
    startDate,
    endDate,
    onRangeChange,
    showLabel = false,
    showSelectedRangeLabel = false, // Configurable prop to show/hide selected range label
    selectedRange,
    setSelectedRange,
    prevRange,
    availableRanges,
    sx
  }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const predefinedDateRanges = {
      [DATE_RANGE_OPTIONS.ALL_TIME]: {
        label: 'All Time',
        start: moment('2024-01-01').startOf('day'), // Set start date to Jan 1, 2024
        end: moment() // Current date and time
      },
      [DATE_RANGE_OPTIONS.TODAY]: {
        label: 'Today',
        start: moment().startOf('day'),
        end: moment()
      },
      [DATE_RANGE_OPTIONS.YESTERDAY]: {
        label: 'Yesterday',
        start: moment().subtract(1, 'day').startOf('day'),
        end: moment().subtract(1, 'day').endOf('day')
      },
      [DATE_RANGE_OPTIONS.LAST_7_DAYS]: {
        label: 'Last 7 Days',
        start: moment().subtract(7, 'days').startOf('day'),
        end: moment()
      },
      [DATE_RANGE_OPTIONS.LAST_30_DAYS]: {
        label: 'Last 30 Days',
        start: moment().subtract(30, 'days').startOf('day'),
        end: moment()
      },
      [DATE_RANGE_OPTIONS.LAST_MONTH]: {
        label: 'Last Month',
        start: moment().subtract(1, 'month').startOf('month'),
        end: moment().subtract(1, 'month').endOf('month')
      },
      [DATE_RANGE_OPTIONS.THIS_MONTH]: {
        label: 'Current Month',
        start: moment().startOf('month'),
        end: moment()
      },

      [DATE_RANGE_OPTIONS.CUSTOM]: { label: 'Select Dates' }
    };

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
      // console.table({ startDate, endDate, selectedRange });
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
      // console.log({ range });
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

    const handleDialogClose = (e, flag = false) => {
      setDialogOpen(false);
      if (flag === 'backdropClick') {
        setSelectedRange(prevRange);
        return;
      }
      setSelectedRange(!flag ? prevRange : DATE_RANGE_OPTIONS.CUSTOM);
    };

    const selectedRangeLabel =
      predefinedDateRanges[selectedRange]?.label === 'Select Dates'
        ? `${moment(startDate).format(FORMAT_DATE)} - ${moment(endDate).format(FORMAT_DATE)}`
        : predefinedDateRanges[selectedRange]?.label
        ? predefinedDateRanges[selectedRange]?.label
        : `${moment(startDate).format(FORMAT_DATE)} - ${moment(endDate).format(FORMAT_DATE)}`;
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
                color: '#fff'
              },
              // mb: sx?.mb || 1,
              width: sx?.width || '220px', 
              height: sx?.height 
            }}
            renderValue={() => (
              <Box display="flex" alignItems="center">
                <Calendar size={14} style={{ marginRight: 8 }} color="#fff" />
                {selectedRangeLabel}
              </Box>
            )}
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

        {isDialogOpen && (
          <CustomDateRangePickerDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onDateRangeChange={(newRange, flag) => {
              onRangeChange(newRange);
              handleDialogClose(null, flag);
            }}
            prevRange={prevRange}
            selectedRange={selectedRange}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        )}
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
  prevRange: PropTypes.string, // The previously selected date range key
  setSelectedRange: PropTypes.func.isRequired, // Function to update the selected range state
  availableRanges: PropTypes.arrayOf(PropTypes.string) // Array of available date range keys to be displayed
};

export default DateRangeSelect;
