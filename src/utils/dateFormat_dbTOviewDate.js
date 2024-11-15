export function formatIndianDate(isoDateString) {
    const date = new Date(isoDateString);
  
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for the month (getMonth() is 0-based)
    const year = date.getFullYear();
  
    // Format as dd/mm/yyyy
    return `${day}/${month}/${year}`;
  }
  