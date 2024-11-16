import { useCallback, useState } from 'react';
import moment from 'moment';
import { DATE_RANGE_OPTIONS } from 'components/DateRange/DateRangeSelect';

/**
 * Custom hook to manage date range state and logic.
 * Provides functionality to handle start date, end date, and range selection.
 *
 * @returns {Object} An object containing:
 * - `startDate`: The selected start date.
 * - `endDate`: The selected end date.
 * - `range`: The selected date range as a string.
 * - `setRange`: Function to update the selected range.
 * - `handleRangeChange`: Function to update both start and end dates.
 */

const TYPE = {
  [DATE_RANGE_OPTIONS.TODAY]: {
    startDate: moment().startOf('day').toDate(),
    endDate: moment().toDate()
  },
  [DATE_RANGE_OPTIONS.THIS_MONTH]: {
    startDate: moment().startOf('month').toDate(),
    endDate: moment().endOf('month').toDate()
  },
  [DATE_RANGE_OPTIONS.CURRENT_MONTH]: {
    startDate: moment().startOf('month').toDate(),
    endDate: moment().toDate()
  }
};

const useDateRange = (type = DATE_RANGE_OPTIONS.TODAY) => {
  // State for the selected start date, defaulting to the start of the current day.
  // const [startDate, setStartDate] = useState(moment().startOf('day').toDate());

  // // State for the selected end date, defaulting to the start of the current day.
  // const [endDate, setEndDate] = useState(moment().startOf('day').toDate());

  // State for the selected end date, defaulting to the current date and time.
  // const [endDate, setEndDate] = useState(moment().toDate());

  const [startDate, setStartDate] = useState(TYPE[type].startDate);
  const [endDate, setEndDate] = useState(TYPE[type].endDate);

  // State for the selected date range as a string.
  const [range, setRange] = useState('');

  /**
   * Updates the selected range value.
   * Uses `useCallback` to memoize the function and prevent unnecessary re-renders.
   *
   * @param {string} val - The new range value.
   */
  const handleSetRange = useCallback((val) => {
    setRange(val);
  }, []);

  /**
   * Updates both the start and end dates.
   * Uses `useCallback` to memoize the function and prevent unnecessary re-renders.
   *
   * @param {Object} dates - An object containing the new `startDate` and `endDate`.
   * @param {Date} dates.startDate - The new start date.
   * @param {Date} dates.endDate - The new end date.
   */
  const handleRangeChange = useCallback(({ startDate, endDate }) => {
    console.log('startDate', startDate, typeof startDate); // Debug log for start date.
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  // Return the managed state and handlers for external use.
  return {
    startDate,
    endDate,
    range,
    setRange: handleSetRange,
    handleRangeChange
  };
};

export default useDateRange;
