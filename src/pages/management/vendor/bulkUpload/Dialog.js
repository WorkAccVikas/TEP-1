import PropTypes from 'prop-types';
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
import * as XLSX from 'xlsx';
import axiosServices from 'utils/axios';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useSelector } from 'store';
import { USERTYPE } from 'constant';
import { registerUser } from 'store/slice/cabProvidor/userSlice';
import { addSpecialDetails } from 'store/slice/cabProvidor/vendorSlice';

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

export const BulkUploadDialog = ({ open, handleClose }) => {
  const [files, setFiles] = useState(null);
  const [basicData, setBasicData] = useState(null);
  const [specificData, setSpecificData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { closeSnackbar } = useSnackbar();
  const [count, setCount] = useState({
    successCount: 0,
    failureCount: 0,
    failureData: []
  });

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const handleExcelDataExtraction = (files) => {
    const file = files[0]; // Get the first selected file
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result; // Get the file data

      // Set loading to true before processing
      setLoading(true);

      // Parse the file with XLSX
      const workbook = XLSX.read(data, { type: 'binary' });

      // Get the first sheet (assuming it's "Driver Data")
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log('jsonData', jsonData);

      // Map the data to the desired format
      const mappedDataForBasic = jsonData.slice(1).map((row) => {
        const [userName, email, password, vendorLegalName, officeChargeAmount] = row;
        return {
          userName,
          userEmail: email,
          userPassword: password,
          vendorLegalName,
          officeChargeAmount
        };
      });

      console.log(mappedDataForBasic); // Log the mapped data
      setBasicData(mappedDataForBasic); // Set the mapped data to state

      const mappedDataForSpecific = jsonData.slice(1).map((row) => {
        const [, , , vendorLegalName, officeChargeAmount] = row;
        return {
          vendorLegalName,
          officeChargeAmount
        };
      });

      console.log(mappedDataForSpecific); // Log the mapped data
      setSpecificData(mappedDataForSpecific); // Set the mapped data to state

      // Set loading to false after processing is done
      setLoading(false);
    };

    reader.readAsBinaryString(file); // Read the file as binary string
  };

  useEffect(() => {
    if (files) {
      handleExcelDataExtraction(files); // Only run when files change
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    // Headers for "Vendor Data" sheet
    const vendorHeaders = ['Username*', 'Email*', 'Password*', 'Vendor Legal Name*', 'Office Charge Amount*'];
    // Create the first sheet (headers only)
    const vendorSheet = XLSX.utils.aoa_to_sheet([vendorHeaders]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Vendor Data');
    XLSX.writeFile(workbook, 'BulkVendorUploadSheet.xlsx');
  }, []);

  const handleViewClick = useCallback((data) => {
    // Headers for "vendor Data" sheet
    console.log(data);

    const vendorHeaders = ['Username*', 'Email*', 'Password*', 'Vendor Legal Name*', 'Office Charge Amount*'];

    let vendorData = [];

    // Check if the data is not empty, then populate "ID Reference" data
    if (data && data.length > 0) {
      vendorData = data.map((item) => [item.userName, item.userEmail, item.userPassword, item.vendorLegalName, item.officeChargeAmount]);
    }

    // Create the second sheet (headers + data if available)
    const vendorSheet = XLSX.utils.aoa_to_sheet([
      vendorHeaders,
      ...vendorData // Will be empty if no data
    ]);
    // Create a workbook and append the sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Failed Vendor Data');

    // Export the Excel file
    XLSX.writeFile(workbook, 'failedVendorData.xlsx');
  }, []);

  const actionTask = useCallback(
    (snackbarId, data) => (
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
    ),
    [closeSnackbar, handleViewClick]
  );

  const handleSave = useCallback(async () => {
    try {
      console.log('handleSave called');
      console.log('basicData', basicData);
      console.log('specificData', specificData);
      if (!basicData || basicData.length === 0) {
        alert('Empty Excel Sheet');
        return;
      }
      setLoading(true);
      let successCount = 0;
      let failureCount = 0;
      let failureData = [];

      // Loop through the driverData array and send the requests

      for (const item of basicData) {
        try {
          const formData = new FormData();
          formData.append('userName', item.userName);
          formData.append('userEmail', item.userEmail);
          formData.append('userPassword', item.userPassword);
          formData.append('userType', USERTYPE.isVendor);
          formData.append('contactNumber', '');
          formData.append('alternateContactNumber', '');

          const response = await dispatch(registerUser(formData)).unwrap();
          if (response?.status === 201) {
            const specificPayload = {
              data: {
                vendorId: response.data._id,
                vendorCompanyName: item.vendorLegalName,
                officeChargeAmount: item.officeChargeAmount,
                contactPersonName: '',
                PAN: '',
                GSTIN: '',
                workEmail: '',
                workMobileNumber: '',
                workLandLineNumber: '',
                officePinCode: '',
                officeCity: '',
                officeState: '',
                officeAddress: '',
                bankName: '',
                branchName: '',
                IFSC_code: '',
                accountNumber: '',
                accountHolderName: '',
                bankAddress: '',
                ESI_Number: '',
                PF_Number: ''
              }
            };

            const specificAPIResponse = await dispatch(addSpecialDetails(specificPayload)).unwrap();
            if (specificAPIResponse?.status === 201) {
              successCount++;
            }
          }
        } catch (error) {
          console.error('Error registering vendor:', error);

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
            message: `${successCount} Vendors Saved Successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      }

      if (failureCount > 0) {
        enqueueSnackbar(`${failureCount} Vendors Failed to Save`, {
          action: (key) => actionTask(key, failureData),
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      }

      // Reset states and close dialog
      setFiles(null);
      setBasicData(null);
      setSpecificData(null);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.log('error', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error.message || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setLoading(false);
    }
  }, [basicData, specificData, handleClose, actionTask]);

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <MainCard
          title={
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="h5">Upload Vendor Data</Typography>
              <Button onClick={handleDownload} size="small" color="secondary" endIcon={<DocumentDownload />} variant="contained">
                Download Template
              </Button>
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
              Upload Excel sheet with required headers to upload Vendors in bulk.Download Excel Template to streamline the process.
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
            <Button color="error" size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button color="success" size="small" variant="contained" onClick={handleSave} disabled={!files || loading}>
              Save
            </Button>
          </Stack>
        </MainCard>
      </Modal>
    </>
  );
};

BulkUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
