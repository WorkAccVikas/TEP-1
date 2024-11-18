import React from 'react';
import * as XLSX from 'xlsx';

const ExcelTemplatePage = () => {
  // Example data for dropdown options
  const zones = [
    { id: '1', name: "Delhi" },
    { id: '2', name: "Mumbai" }
  ];

  const zoneTypes = [
    { id: '1', name: "Urban" },
    { id: '2', name: "Rural" }
  ];

  const vehicleTypes = [
    { id: '1', name: "SEDAN" },
    { id: '2', name: "SUV" }
  ];

  const drivers = [
    { id: '1', name: "John Doe" },
    { id: '2', name: "Jane Smith" }
  ];

  // Generate Excel Template with dropdown options
  const generateExcelTemplate = () => {
    // Define headers for the Excel template
    const ws_data = [
      ['tripDate', 'tripTime', 'tripType', 'zoneName', 'zoneType', 'vehicleType', 'vehicleNumber', 'driver'],
      ['2024-01-01', '10:00 AM', 1, '', '', '', '', '']  // Sample row for user to fill
    ];

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Create data validation dropdown lists
    const zonesDropdown = zones.map(zone => zone.name).join(',');
    const zoneTypeDropdown = zoneTypes.map(zoneType => zoneType.name).join(',');
    const vehicleTypeDropdown = vehicleTypes.map(vehicleType => vehicleType.name).join(',');
    const driverDropdown = drivers.map(driver => driver.name).join(',');

    // Apply data validation for dropdown columns (zoneName, zoneType, vehicleType, driver)
    ws['!dataValidations'] = [
      { sqref: 'D2:D1048576', type: 'list', formula1: `"${zonesDropdown}"` }, // zoneName
      { sqref: 'E2:E1048576', type: 'list', formula1: `"${zoneTypeDropdown}"` }, // zoneType
      { sqref: 'F2:F1048576', type: 'list', formula1: `"${vehicleTypeDropdown}"` }, // vehicleType
      { sqref: 'H2:H1048576', type: 'list', formula1: `"${driverDropdown}"` } // driver
    ];

    // Add the template identifier to metadata (hidden from user)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trips');

    // Add metadata properties (hidden from user)
    wb.Props = {
      Title: 'Trip Template',
      Subject: 'Trip Data Template',
      Author: 'Your Company',
      Keywords: 'Excel, template, trips',
      Comments: 'This is a template for importing trip data',
    };
    wb.Custom = {
      'templateIdentifier': 'myUniqueTemplateID', // Unique identifier for your template
    };

    // Write the file to download
    XLSX.writeFile(wb, 'TripTemplate.xlsx');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Generate Excel Template</h1>

      <button onClick={generateExcelTemplate} style={{ margin: 10 }}>
        Generate Excel Template
      </button>
    </div>
  );
};

export default ExcelTemplatePage;
