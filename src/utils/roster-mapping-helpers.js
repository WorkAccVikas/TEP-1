import moment from 'moment';
import { convertTimeToUnixTimestamp, formatDateUsingMoment } from './helper';

export const isExcelDate = (value) => {
  return (
    typeof value === 'number' && value > 25569 // Excel date serial starts from Jan 1, 1900
  );
};

export const excelDateToJSDate = (excelDate) => {
  // Excel dates are stored as the number of days since 1/1/1900, so we need to convert that
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
  return formatDateUsingMoment(jsDate, 'YYYY-MM-DDT00:00:00.000');
};

// Function to convert Excel time to JS time format (HH:mm:ss AM/PM)
export const excelTimeToJSFormattedTime = (excelTime) => {
  // Convert Excel time fraction to seconds
  const secondsInADay = 86400; // Total seconds in a day
  const totalSeconds = Math.round(excelTime * secondsInADay); // Total seconds represented by the time fraction

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Create a JS date object with the time parts
  const jsDate = new Date();
  jsDate.setHours(hours, minutes, seconds);

  // Use moment.js to format the time as HH:mm:ss AM/PM
  // return moment(jsDate).format("hh:mm:ss A");
  return convertTimeToUnixTimestamp(moment(jsDate).format('hh:mm:ss A'));
};
