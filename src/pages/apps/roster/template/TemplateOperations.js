import { Button, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import CustomCircularLoader from 'components/CustomCircularLoader';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'store';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { createTemplate, getTemplateDetails, updateTemplate } from 'store/slice/cabProvidor/templateSlice';
import axiosServices from 'utils/axios';
import * as XLSX from 'xlsx';

const fakeResponse = {
  mappedData: {
    tripDate: 'Date',
    tripTime: 'Shift',
    tripType: 'Trip Type',
    zoneName: 'Billing Zone',
    vehicleType: 'Trip Contract',
    rosterTripId: 'Trip Id'
  },
  excelHeaders: [
    'Trip Id',
    'Date',
    'Trip Type',
    'Shift',
    'Trip Office',
    'Vendor Id',
    'Cab Id',
    'Cab Registration No.',
    'Trip Contract',
    'Contract Price',
    'Billing Zone',
    'Landmark',
    'Slab Name',
    'NUMBER'
  ],
  templateName: 'KT2',
  dateFormat: 'DD:MM;YYYY',
  timeFormat: 'HH:mm',
  pickupType: 'LOGIN',
  dropType: 'LOGOUT',
  _id: '677665ac3adba36c5a8c04c0'
};

const MandatoryFields = [
  { name: 'zoneName', headerName: 'Zone Name', required: true },
  { name: 'zoneType', headerName: 'Zone Type', required: false },
  { name: 'vehicleType', headerName: 'Vehicle Type', required: true },
  { name: 'tripType', headerName: 'Trip Type', required: true },
  { name: 'location', headerName: 'Location', required: false, defaultValue: '' },
  { name: 'tripDate', headerName: 'Trip Date', required: true, defaultValue: 'DD/MM/YYYY' },
  { name: 'tripTime', headerName: 'Trip Time', required: true },
  { name: 'guardPrice', headerName: 'Guard Price', required: false, defaultValue: 0 },
  { name: 'vehicleNumber', headerName: 'Vehicle Number', required: false, defaultValue: '' },
  { name: 'vehicleRate', headerName: 'Vehicle Rate', required: false, defaultValue: 0 },
  { name: 'addOnRate', headerName: 'Add On Rate', required: false, defaultValue: 0 },
  { name: 'penalty', headerName: 'Penalty', required: false, defaultValue: 0 },
  { name: 'remarks', headerName: 'Remarks', required: false, defaultValue: '' },
  { name: 'rosterTripId', headerName: 'Trip Id', required: true, defaultValue: '#ID' }
];

const TemplateOperations = () => {
  console.log('TemplateOperations rendered');
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(`🚀 ~ TemplateOperations ~ id:`, id);
  // State for form data
  const [formData, setFormData] = useState({
    templateName: '',
    dateFormat: 'DD:MM;YYYY',
    timeFormat: 'HH:mm',
    pickupType: '',
    dropType: ''
  });

  const [excelHeaders, setExcelHeaders] = useState([]); // Store Excel headers
  const [mappedHeaders, setMappedHeaders] = useState({}); // Track mapped headers
  const [loading, setLoading] = useState(false);
  const [mutateLoading, setMutateLoading] = useState(false);

  const { rosterTemplateId } = useSelector((state) => state.template);

  useEffect(() => {
    // TODO : API call FOR GETTING DETAILS OF TEMPLATE
    const fetchTemplateDetails = async () => {
      try {
        setLoading(true);
        console.log('Api call for get template details (At Template Updating)');
        console.log({ id });
        const response = await dispatch(getTemplateDetails(id)).unwrap();
        console.log(`🚀 ~ fetchTemplateDetails ~ response:`, response);
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setMappedHeaders(response.data.mappedData);
        setExcelHeaders(fakeResponse.excelHeaders);
        setFormData((prev) => {
          return {
            ...prev,
            templateName: response.data.templateName,
            dateFormat: response.data.dateFormat,
            timeFormat: response.data.timeFormat,
            pickupType: response.data.pickupType,
            dropType: response.data.dropType
          };
        });
      } catch (error) {
        console.log('Error :: fetchTemplateDetails =', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error fetching template details',
            variant: 'alert',
            alert: { color: 'error' },
            close: true
          })
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

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
  const addTemplate = async () => {
    try {
      let CabproviderId;
      const templateData = {
        ...formData, // Include form data
        mappedData: mappedHeaders // Include mapped headers
      };

      const userInformation = JSON.parse(localStorage.getItem('userInformation'));

      if (userInformation) {
        CabproviderId = userInformation.userId;
      }
      setMutateLoading(true);
      // const response = await axiosServices.post('tripData/add/roster/setting', {
      //   data: {
      //     CabproviderId: CabproviderId,
      //     RosterTemplates: [templateData],
      //     excelHeaders
      //   }
      // });

      const payload = {
        data: {
          CabproviderId: CabproviderId,
          RosterTemplates: [templateData],
          excelHeaders
        }
      };

      const response = await dispatch(createTemplate(payload)).unwrap();
      console.log(`🚀 ~ createTemplate ~ response:`, response);

      console.log(response.data);
      // Save to local storage or handle as needed
      localStorage.setItem('template', JSON.stringify(templateData));

      console.log('Template saved:', templateData);

      if (response.data.statusCode) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Template created successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: true
          })
        );
        navigate('/settings/roster/template', { replace: true });
      }
    } catch (error) {
      console.log('Error :: createTemplate = ', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error creating template',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setMutateLoading(false);
    }
  };

  const editTemplate = async () => {
    try {
      let CabproviderId;
      const userInformation = JSON.parse(localStorage.getItem('userInformation'));

      if (userInformation) {
        CabproviderId = userInformation.userId;
      }

      const payload = {
        data: {
          mappedData: mappedHeaders,
          ...formData,
          rosterTemplateId: id
        }
      };
      console.log(`🚀 ~ editTemplate ~ payload:`, payload);

      setMutateLoading(true);
      const response = await dispatch(updateTemplate(payload)).unwrap();
      console.log(`🚀 ~ editTemplate ~ response:`, response);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Template updated successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
      navigate('/settings/roster/template', { replace: true });
    } catch (error) {
      console.log('Error :: editTemplate = ', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error editing template',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setMutateLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <CustomCircularLoader />
      ) : (
        <Stack spacing={2}>
          <MainCard title="Basic Template Details">
            <Grid container spacing={2}>
              {/* Template Name */}
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

              {/* Pickup Type */}
              <Grid item xs={12} md={3}>
                <TextField
                  label="Pickup Type(Login)"
                  variant="outlined"
                  value={formData.pickupType}
                  onChange={(e) => handleInputChange(e, 'pickupType')}
                  fullWidth
                />
              </Grid>

              {/* Drop Type */}
              <Grid item xs={12} md={3}>
                <TextField
                  label="Drop Type(Logout)"
                  variant="outlined"
                  value={formData.dropType}
                  onChange={(e) => handleInputChange(e, 'dropType')}
                  fullWidth
                />
              </Grid>

              {/* Upload Button */}
              {excelHeaders.length === 0 && (
                <Grid item xs={12} md={3} sx={{ alignSelf: 'center' }}>
                  <Button variant="outlined" component="label" fullWidth title="Upload File">
                    Upload File
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} hidden />
                  </Button>
                </Grid>
              )}
            </Grid>
          </MainCard>

          {excelHeaders.length > 0 && (
            <MainCard title="Mapped Headers">
              <Stack gap={2}>
                <Grid container spacing={2}>
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

                {/* Save Button */}
                {id ? (
                  <Button
                    variant="contained"
                    onClick={editTemplate}
                    disabled={!isFormValid() || mutateLoading}
                    sx={{ alignSelf: 'center' }}
                    title="Update Template"
                  >
                    Update Template
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={addTemplate}
                    disabled={!isFormValid() || mutateLoading}
                    sx={{ alignSelf: 'center' }}
                    title="Create Template"
                  >
                    Create Template
                  </Button>
                )}
              </Stack>
            </MainCard>
          )}
        </Stack>
      )}
    </>
  );
};

export default TemplateOperations;
