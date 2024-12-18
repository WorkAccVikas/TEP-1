// material-ui
import styled from '@emotion/styled';
import {
  Button,
  Divider,
  CardContent,
  Modal,
  Stack,
  Typography,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
// project-imports
import MainCard from 'components/MainCard';
import { DocumentDownload, Warning2 } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
// import VendorSelection from './VendorSelection';
import * as XLSX from 'xlsx';
import axiosServices from 'utils/axios';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import VendorSelection from 'SearchComponents/VendorSelectionAutoComplete';
import { useSelector } from 'store';
import { USERTYPE } from 'constant';
import ZoneSelection from 'SearchComponents/ZoneSelectionAutocomplete';
import VehicleTypeSelection from 'SearchComponents/VehicleTypeSelectionAutoComplete';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

function removeDuplicates(arr) {
  // Create a map to track the unique combinations
  const uniqueItems = new Map();
  let duplicateCount = 0;

  // Iterate over the array
  const result = arr.filter((item) => {
    const key = `${item.ZONENAME}-${item.ZONETYPE}-${item.VEHICLETYPE}`;

    // If the key already exists, it's a duplicate
    if (uniqueItems.has(key)) {
      duplicateCount++;
      return false; // Skip the duplicate item
    } else {
      uniqueItems.set(key, true);
      return true; // Keep the unique item
    }
  });

  // If there were duplicates, return an error message with the count
  if (duplicateCount > 0) {
    return {
      error: `Found ${duplicateCount} duplicate(s)`,
      data: result
    };
  }

  // If no duplicates were found, return the filtered array
  return {
    message: 'No duplicates found',
    data: result
  };
}

const TemplateSelectDialog = ({ id, open, handleClose }) => {
  const [files, setFiles] = useState(null);
  const [driverData, setDriverData] = useState(null);

  const [loading, setLoading] = useState(false);
  const { closeSnackbar } = useSnackbar();

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const handleExcelDataExtraction = (files) => {
    const file = files[0]; // Get the first selected file
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result; // Get the file data
      setLoading(true); // Set loading to true before processing

      // Parse the file with XLSX
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet is "Driver Data"
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Filter out empty rows and map to desired format
      const mappedData = jsonData.slice(1).reduce((acc, row) => {
        const [SNO, ZONENAME, ZONETYPE, VEHICLETYPE, COMPANYRATE, DUALTRIPRATE, COMPANYGUARDRATE] = row;

        // Validate that necessary fields are not empty
        if (
          ZONENAME &&
          ZONETYPE &&
          VEHICLETYPE &&
          COMPANYRATE !== undefined &&
          DUALTRIPRATE !== undefined &&
          COMPANYGUARDRATE !== undefined
        ) {
          acc.push({
            ZONENAME: ZONENAME,
            ZONETYPE: ZONETYPE,
            VEHICLETYPE: VEHICLETYPE,
            COMPANYRATE: COMPANYRATE,
            DUALTRIPRATE: DUALTRIPRATE,
            COMPANYGUARDRATE: COMPANYGUARDRATE
          });
        }

        return acc;
      }, []);

      // Remove duplicates if any
      const { error, data: filteredData, message } = removeDuplicates(mappedData);

      // Handle the result
      if (error) {
        alert(error);
      } else {
        console.log({ filteredData });
      }

      // Set the state with the filtered data
      setDriverData(filteredData); // Use filteredData instead of mappedData

      setLoading(false); // Set loading to false after processing is done
    };

    reader.readAsBinaryString(file); // Read the file as binary string
  };

  useEffect(() => {
    if (files) {
      handleExcelDataExtraction(files); // Only run when files change
    }
  }, [files]); // Dependency array contains `files`, not `driverData`

  // console.log({ driverData });

  const [count, setCount] = useState({
    successCount: 0,
    failureCount: 0,
    failureData: []
  });

  const actionTask = (snackbarId, data) => (
    <Stack direction="row" spacing={0.5}>
      <Button
        size="small"
        color="error"
        variant="contained"
        onClick={() => {
          handleViewClick(data);
        }}
      >
        View Data
      </Button>
      <Button size="small" color="secondary" variant="contained" onClick={() => closeSnackbar(snackbarId)}>
        Dismiss
      </Button>
    </Stack>
  );

  const handleViewClick = (data) => {
    // Headers for "vehicle Data" sheet
    console.log(data);

    const driverHeaders = ['ID', 'Name*', 'Email*', 'Phone*'];

    let driverData = [];

    // Check if the data is not empty, then populate "ID Reference" data
    if (data && data.length > 0) {
      driverData = data.map((item) => [item.data.vendorId, item.data.userName, item.data.userEmail, item.data.contactNumber]);
    }

    // Create the second sheet (headers + data if available)
    const driverSheet = XLSX.utils.aoa_to_sheet([
      driverHeaders,
      ...driverData // Will be empty if no data
    ]);
    // Create a workbook and append the sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, driverSheet, 'Failed Driver Data');

    // Export the Excel file
    XLSX.writeFile(workbook, 'failedDriverData.xlsx');
  };

  const handleSave = async () => {
    if (!driverData || driverData.length === 0) {
      alert('Empty Excel Sheet');
      return;
    }
    setLoading(true);

    let successCount = 0;
    let failureCount = 0;
    let failureData = [];

    // Loop through the driverData array and send the requests
    for (const item of driverData) {
      try {
        const response = await axiosServices.post('/driver/register', item);
        console.log(response.data);

        // If the response indicates success, increment successCount
        if (response.status === 201) {
          successCount++;
        }
      } catch (error) {
        console.error('Error registering driver:', error);

        // On failure, increment failureCount and add failure data
        failureCount++;
        failureData.push(item); // Store failed item
      }
    }

    setCount({
      successCount,
      failureCount,
      failureData
    });

    // Show success or failure messages based on results
    if (successCount > 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: `${successCount} Drivers Saved Successfully`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      );
    }

    if (failureCount > 0) {
      enqueueSnackbar(`${failureCount} Drivers Failed to Save`, {
        action: (key) => actionTask(key, failureData),
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      });
    }

    // Reset states and close dialog
    setFiles(null);
    setDriverData(null);
    setLoading(false);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
      <MainCard
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Typography variant="h5">Upload Company Rate</Typography>
            <ChildModal id={id} />
          </Box>
        }
        modal
        darkTitle
        content={false}
        sx={{
          padding: 0 // Optional: Padding inside the card
        }}
      >
        <CardContent>
          <Typography id="modal-modal-description">
            Upload Excel sheet with required headers to upload Company Rate.Download Excel Template to streamline the process.
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" sx={{ px: 2.5, py: 1 }}>
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<FaCloudUploadAlt />}>
              Upload files
              <VisuallyHiddenInput type="file" onChange={(event) => handleFileChange(event)} />
            </Button>
            {files && (
              <Typography variant="caption" sx={{ pl: 0.5, pt: 1 }}>
                {files[0].name}
              </Typography>
            )}
          </Stack>
        </CardContent>
        <Divider />
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
          <Button
            color="error"
            size="small"
            onClick={() => {
              setFiles(null);
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button color="success" size="small" variant="contained" onClick={handleSave} disabled={!files || loading}>
            Save
          </Button>
        </Stack>
      </MainCard>
    </Modal>
  );
};

function ChildModal({ id }) {
  const [open, setOpen] = useState(false);
  const userType = useSelector((state) => state.auth.userType);
  // console.log('userType', userType);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [existingCompanyRates, setExistingCompanyRates] = useState([]);

  console.log({ selectedZones });
  console.log({ selectedVehicleTypes });

  useEffect(() => {
    const fetchExistingCompanyRates = async () => {
      if (!id) return; // Avoid fetching if id is undefined/null

      try {
        const response = await axiosServices.get(`/company/unwind/rates?companyId=${id}`);
        const unwindedRates = response.data.data.map(
          ({
            zoneNameID: { zoneName },
            zoneTypeID: { zoneTypeName },
            VehicleTypeName: { vehicleTypeName },
            cabAmount: { amount: companyRate },
            dualTripAmount: { amount: dualTripRate },
            guardPrice: companyGuardRate
          }) => ({
            ZONENAME: zoneName,
            ZONETYPE: zoneTypeName,
            VEHICLETYPE: vehicleTypeName,
            COMPANYRATE: companyRate,
            DUALTRIPRATE: dualTripRate,
            COMPANYGUARDRATE: companyGuardRate
          })
        );
        setExistingCompanyRates(unwindedRates);
      } catch (error) {
        console.error('Error fetching company rates:', error);
      }
    };

    fetchExistingCompanyRates();
  }, [id]);

  const handleDownload = useCallback(() => {
    // **Sheet 1: Company Rates Data**
    const companyHeaders = ['SNO', 'ZONENAME*', 'ZONETYPE', 'VEHICLETYPE*', 'COMPANYRATE', 'DUALTRIPRATE', 'COMPANYGUARDRATE'];
    const companyData = existingCompanyRates.map((rate, index) => [
      index + 1,
      rate.ZONENAME || '',
      rate.ZONETYPE || '',
      rate.VEHICLETYPE || '',
      rate.COMPANYRATE || '',
      rate.DUALTRIPRATE || '',
      rate.COMPANYGUARDRATE || ''
    ]);
    const companySheetData = [companyHeaders, ...companyData];
    const companySheet = XLSX.utils.aoa_to_sheet(companySheetData);

    // **Sheet 2: Zone Data**
    const zoneHeaders = ['SNO', 'ZONENAME', 'ZONETYPE'];
    const zoneData = selectedZones
      .map((zone, i) => {
        // Flatten the zoneType array for each zoneName
        return zone.zoneType.map((zoneType, index) => [
          index === 0 ? i + 1 : '',
          index === 0 ? zone.zoneName : '', // Show ZONENAME only for the first zoneType
          zoneType.zoneTypeName
        ]);
      })
      .flat();

    const zoneSheetData = [zoneHeaders, ...zoneData];
    const zoneSheet = XLSX.utils.aoa_to_sheet(zoneSheetData);

    // **Sheet 3: VehicleType Data**
    const VehicleTypeHeaders = ['SNO', 'VEHICLETYPE'];
    const vehicleTypeData = selectedVehicleTypes.map((type, index) => [index + 1, type.vehicleTypeName]);

    const vehicleTypeSheetData = [VehicleTypeHeaders, ...vehicleTypeData];
    const vehicleTypeSheet = XLSX.utils.aoa_to_sheet(vehicleTypeSheetData);
    // **Create Workbook and Append Sheets**
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, companySheet, 'Company Rate Data');
    XLSX.utils.book_append_sheet(workbook, zoneSheet, 'Zone Data');
    XLSX.utils.book_append_sheet(workbook, vehicleTypeSheet, 'Vehicle Type Data');

    // **Export the Workbook**
    XLSX.writeFile(workbook, 'CompanyRateUpload.xlsx');
  }, [existingCompanyRates, selectedZones]);

  const handleClick = useCallback(() => {
    if (userType === USERTYPE.iscabProvider) {
      handleOpen();
    } else {
      handleDownload();
    }
  }, [handleOpen, handleDownload, userType]);
  return (
    <>
      <Button onClick={handleClick} size="small" color="secondary" endIcon={<DocumentDownload />} variant="contained">
        Download Template
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <MainCard title="Download Template" modal darkTitle content={false}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems={'center'} justifyContent="space-around" sx={{ py: 1, mb: 1 }}>
              <Typography id="modal-modal-description">Select Zones </Typography>

              <ZoneSelection sx={{ minWidth: 250 }} value={selectedZones} setSelectedOptions={setSelectedZones} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems={'center'} justifyContent="space-around" sx={{ py: 1, mb: 1 }}>
              <Typography id="modal-modal-description">Select Vehicle Type </Typography>

              <VehicleTypeSelection sx={{ minWidth: 250 }} value={selectedVehicleTypes} setSelectedOptions={setSelectedVehicleTypes} />
            </Stack>
            <Accordion>
              <AccordionSummary>
                <Typography variant="h6">Instructions for Bulk Driver Upload</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  <ol>
                    <li>
                      <strong>Self-Registration of Drivers:</strong>
                      If you wish to register a driver under your own name, <strong>do not fill in the Vendor ID column</strong> in the
                      &ldquo;Driver Data&rdquo; sheet. Leave the ID column empty for these drivers.
                    </li>
                    <li>
                      <strong>Registering Drivers Under a Vendor:</strong>
                      <ul>
                        <li>Select a vendor from the options above to associate the driver with a vendor.</li>
                        <li>
                          Navigate to the <strong>&ldquo;ID Reference&rdquo;</strong> sheet to find the corresponding{' '}
                          <strong>Vendor ID</strong> for the selected vendor.
                        </li>
                        <li>Copy the Vendor ID from the &ldquo;ID Reference&rdquo; sheet.</li>
                        <li>
                          Paste the Vendor ID into the <strong>ID column</strong> of the &ldquo;Driver Data&rdquo; sheet where the
                          driver&rsquo;s information is listed.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>File Upload:</strong> Once you&rsquo;ve filled in the necessary details, you can upload the completed sheet to
                      register your drivers in bulk.
                    </li>
                  </ol>
                  <br />
                  <strong>Note:</strong> Ensure that you have selected a vendor before entering the Vendor ID. If no vendor is selected,
                  leave the ID column empty.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
            <Button
              color="error"
              size="small"
              onClick={() => {
                setSelectedVehicleTypes([]);
                setSelectedZones([]);
                handleClose();
              }}
            >
              Cancel
            </Button>
            {/* <Button
              variant="contained"
              size="small"
              onClick={() => {
                console.log({ selectedOptions });
                console.log({ selectedVehicleTypes });
                console.log({ selectedZones });
              }}
            > */}
            <Button variant="contained" size="small" onClick={handleDownload}>
              Download
            </Button>
          </Stack>
        </MainCard>
      </Modal>
    </>
  );
}

export default TemplateSelectDialog;
