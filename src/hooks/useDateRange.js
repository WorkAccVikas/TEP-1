import { useCallback, useState } from 'react';
import moment from 'moment';

/**
 * Custom hook to manage date range state and logic.
 * Provides functionality to handle start date, end date, and range selection.
 *
 * @returns {Object} An object containing:
 * - `startDate`: The selected start date.
 * - `endDate`: The selected end date.
 * - `range`: The selected date range as a string.
 * - `prevRange`: The previous date range as a string.
 * - `setRange`: Function to update the selected range.
 * - `handleRangeChange`: Function to update both start and end dates.
 */

export const TYPE_OPTIONS = Object.freeze({
  ALL_TIME: 'allTime',
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  THIS_MONTH: 'thisMonth',
  LAST_MONTH: 'lastMonth'
});

const TYPE = {
  [TYPE_OPTIONS.ALL_TIME]: {
    startDate: moment(0),
    endDate: moment()
  },
  [TYPE_OPTIONS.TODAY]: {
    startDate: moment().startOf('day').toDate(),
    endDate: moment().toDate()
  },
  [TYPE_OPTIONS.YESTERDAY]: {
    startDate: moment().subtract(1, 'day').startOf('day'),
    endDate: moment().subtract(1, 'day').endOf('day')
  },
  [TYPE_OPTIONS.LAST_7_DAYS]: {
    startDate: moment().subtract(7, 'days').startOf('day'),
    // endDate: moment().endOf('day')
    endDate: moment().toDate()
  },
  [TYPE_OPTIONS.LAST_30_DAYS]: {
    startDate: moment().subtract(30, 'days').startOf('day'),
    // endDate: moment().endOf('day')
    endDate: moment().toDate()
  },
  [TYPE_OPTIONS.THIS_MONTH]: {
    startDate: moment().startOf('month').toDate(),
    endDate: moment().toDate()
  },
  [TYPE_OPTIONS.LAST_MONTH]: {
    startDate: moment().subtract(1, 'month').startOf('month'),
    endDate: moment().subtract(1, 'month').endOf('month')
  }
};

const useDateRange = (type = TYPE_OPTIONS.TODAY) => {
  const [startDate, setStartDate] = useState(TYPE[type].startDate);
  const [endDate, setEndDate] = useState(TYPE[type].endDate);
  const [range, setRange] = useState('');
  const [prevRange, setPrevRange] = useState('');

  /**
   * Updates the selected range value while keeping track of the previous range.
   * Uses `useCallback` to memoize the function and prevent unnecessary re-renders.
   *
   * @param {string} newRange - The new range value.
   */
  const handleSetRange = useCallback(
    (newRange) => {
      setPrevRange(range); // Update the previous range state.
      setRange(newRange); // Update the current range state.
    },
    [range]
  );

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
    console.log('endDate', endDate, typeof endDate); // Debug log for end date.
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  // Return the managed state and handlers for external use.
  return {
    startDate,
    endDate,
    range,
    prevRange,
    setRange: handleSetRange,
    handleRangeChange
  };
};

export default useDateRange;
