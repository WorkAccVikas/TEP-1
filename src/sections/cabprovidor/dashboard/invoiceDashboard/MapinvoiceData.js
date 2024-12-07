import React, { useState } from 'react';
import { Box, Button, Drawer, Grid, Select, MenuItem, Typography, Stack, TextField } from '@mui/material';
import * as XLSX from 'xlsx';
import { useDrawer } from 'contexts/DrawerContext';

const MandatoryFields = [
  { name: 'zoneName', headerName: 'Zone Name', required: true },
  { name: 'zoneType', headerName: 'Zone Type', required: true },
  { name: 'vehicleType', headerName: 'Vehicle Type', required: true },
  { name: 'tripType', headerName: 'Trip Type', required: true },
  { name: 'location', headerName: 'Location', required: false, defaultValue: '' },
  { name: 'tripDate', headerName: 'Trip Date', required: true, defaultValue: '2022-12-12T00:00:00.000' },
  { name: 'tripTime', headerName: 'Trip Time', required: true },
  { name: 'guard', headerName: 'Guard', required: false, defaultValue: 0 },
  { name: 'guardPrice', headerName: 'Guard Price', required: false, defaultValue: 0 },
  { name: 'vehicleNumber', headerName: 'Vehicle Number', required: false, defaultValue: '' },
  { name: 'vehicleRate', headerName: 'Vehicle Rate', required: false, defaultValue: 0 },
  { name: 'addOnRate', headerName: 'Add On Rate', required: false, defaultValue: 0 },
  { name: 'penalty', headerName: 'Penalty', required: false, defaultValue: 0 },
  { name: 'remarks', headerName: 'Remarks', required: false, defaultValue: '' }
];

export default function CreateinvoiceTemplate() {
    const { isOpen, closeDrawer } = useDrawer();

  // State for form data
  const [formData, setFormData] = useState({
    templateName: '',
    dateFormat: '',
    timeFormat: '',
    pickupType: '',
    dropType: ''
  });

  const [excelHeaders, setExcelHeaders] = useState([]); // Store Excel headers
  const [mappedHeaders, setMappedHeaders] = useState({}); // Track mapped headers

  // Handle file upload and extract headers
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]; // Extract first row as headers
      setExcelHeaders(headers); // Store headers in state
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSelectChange = (fieldName, value) => {
    // Check if the selected value is already mapped to another key
    const isValueMapped = Object.values(mappedHeaders).includes(value);
    if (isValueMapped && mappedHeaders[fieldName] !== value) {
      alert(`The header "${value}" is already mapped to another field.`);
      return; // Don't allow mapping if the value is already used
    }

    setMappedHeaders((prevMapped) => ({
      ...prevMapped,
      [fieldName]: value // Update the mapping for the specific field
    }));
  };

  // Handle form input changes
  const handleInputChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value // Update form data state
    });
  };

  // Create final template object
  const createTemplate = () => {
    const templateData = {
      ...formData, // Include form data
      mappedHeader: mappedHeaders // Include mapped headers
    };

    // Save to local storage or handle as needed
    localStorage.setItem('template', JSON.stringify(templateData));
    console.log('Template saved:', templateData);
  };

  // Validate required fields
  const isFormValid = () => {
    // Check if all required fields in formData are filled
    const isFormDataValid = Object.values(formData).every((value) => value.trim() !== '');

    // Check if all mandatory fields are mapped
    const areMappedFieldsValid = MandatoryFields.every((field) => {
      if (field.required) {
        return mappedHeaders[field.name] && mappedHeaders[field.name].trim() !== '';
      }
      return true; // Non-required fields can be empty
    });

    return isFormDataValid && areMappedFieldsValid;
  };

  return (
    <>
      <Drawer anchor={'bottom'} open={isOpen} onClose={closeDrawer}>
        <Box sx={{ width: '100%' }} role="presentation">
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Template Name"
                variant="outlined"
                value={formData.templateName}
                onChange={(e) => handleInputChange(e, 'templateName')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Date Format"
                variant="outlined"
                value={formData.dateFormat}
                onChange={(e) => handleInputChange(e, 'dateFormat')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Time Format"
                variant="outlined"
                value={formData.timeFormat}
                onChange={(e) => handleInputChange(e, 'timeFormat')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3} container spacing={2} alignItems="flex-end">
              <Grid item xs={6}>
                <TextField
                  label="Pickup Type"
                  variant="outlined"
                  value={formData.pickupType}
                  onChange={(e) => handleInputChange(e, 'pickupType')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Drop Type"
                  variant="outlined"
                  value={formData.dropType}
                  onChange={(e) => handleInputChange(e, 'dropType')}
                  fullWidth
                />
              </Grid>
            </Grid>
            {/* Upload Excel File */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload File
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} hidden />
              </Button>
            </Grid>
          </Grid>

          {/* Mapping Mandatory Fields to Excel Headers */}
          {excelHeaders.length > 0 && (
            <Grid container spacing={2} sx={{ p: 2 }}>
              {MandatoryFields.map((field) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={field.name}>
                <Stack>
                  <Typography>
                    {field.headerName} {field.required && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <Select
                    value={mappedHeaders[field.name] || ''} // Bind the value to the mapped header
                    onChange={(e) => handleSelectChange(field.name, e.target.value)} // Update state on change
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Excel Header
                    </MenuItem>
                    {excelHeaders.map((header, index) => (
                      <MenuItem key={index} value={header}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>
            ))}
            </Grid>
          )}

          {/* Create Template Button */}
          <Grid item xs={12} sx={{ p: 2 }}>
            <Button variant="contained" onClick={createTemplate} disabled={!isFormValid()}>
              Create Template
            </Button>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
}
