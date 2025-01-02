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
import {
  isAnythingRequired,
  isMobileNumber,
  isMobileNumberOptional,
  isNumber,
  isPinCodeOptional,
  isPositiveNumberRequired,
  isRequiredString,
  isString,
  isValidEmail,
  isValidEmailOptional,
  separateValidAndInvalidItems,
  separateValidAndInvalidItemsWithGenericDependencies
} from 'pages/management/driver/helper';

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

const MANDATORY_HEADERS = ['Username*', 'Email', 'Phone', 'Password*', 'Vendor Legal Name*', 'Office Charge Amount*'];

const OPTIONAL_HEADERS = [
  'Contact Person Name',
  'PAN',
  'GSTIN',
  'Office Address',
  'Office City',
  'Office State',
  'Office Pincode',
  'Work Email',
  'Work Mobile Number',
  'Work Landline Number',
  'Bank Name',
  'Account Number',
  'Account Holder Name',
  'Branch Name',
  'IFSC Code',
  'Bank Address',
  'ESI Number',
  'PF Number'
];

// Validation rules for specific indices
// const validationRules = {
//   0: isRequiredString,
//   // 1: isRequiredString,
//   1: (value) => isRequiredString(value) && isValidEmail(value), // userEmail,
//   2: isRequiredString,
//   3: isRequiredString,
//   4: isPositiveNumber,
//   5: isString,
//   6: isString,
//   7: isString,
//   8: isString,
//   9: isString,
//   10: isString,
//   11: isPinCode,
//   12: isValidEmail,
//   15: isString,
//   16: isNumber,
//   17: isString,
//   18: isString,
//   19: isString,
//   20: isString,
//   21: isNumber,
//   22: isString
// };

const fieldMapping = {
  0: { name: 'Username', validation: isRequiredString },
  1: { name: 'Email', validation: isValidEmailOptional },
  2: { name: 'Phone', validation: isMobileNumberOptional },
  3: { name: 'Password', validation: isAnythingRequired },
  4: { name: 'Vendor Legal Name', validation: isAnythingRequired },
  5: { name: 'Office Charge Amount', validation: isPositiveNumberRequired },

  6: { name: 'Contact Person Name', validation: isString },
  7: { name: 'PAN', validation: isString },
  8: { name: 'GSTIN', validation: isString },
  9: { name: 'Office Address', validation: isString },
  10: { name: 'Office City', validation: isString },
  11: { name: 'Office State', validation: isString },
  12: { name: 'Office Pincode', validation: isPinCodeOptional },
  13: { name: 'Work Email', validation: isValidEmailOptional },
  14: { name: 'Work Mobile Number', validation: isMobileNumberOptional },
  15: { name: 'Work Landline Number', validation: isMobileNumberOptional },
  16: { name: 'Bank Name', validation: isString },
  17: { name: 'Account Number', validation: isNumber },
  18: { name: 'Account Holder Name', validation: isString },
  19: { name: 'Branch Name', validation: isString },
  // 20: { name: 'IFSC Code', validation: isAnythingRequired },
  // 21: { name: 'Bank Address', validation: isAnythingRequired },
  22: { name: 'ESI Number', validation: isNumber },
  23: { name: 'PF Number', validation: isString },

  dependencies: [
    {
      fields: [1, 2],
      validation: ([email, phone]) => {
        if (!email && !phone) {
          throw new Error('Either Email or Phone is required');
        }
        // if (emailValid || phoneValid) {
        else if (!email || !phone) {
          return true; // At least one of Email or Phone is valid
        }
      },
      errorField: 'Email/Phone'
    }
  ]
};

export const BulkUploadDialog = ({ open, handleClose }) => {
  const [files, setFiles] = useState(null);
  const [basicData, setBasicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invalidData, setInvalidData] = useState([]);
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

      // // Map the data to the desired format
      // const mappedDataForBasic = jsonData.slice(1).map((row) => {
      //   const [userName, email, password, vendorLegalName, officeChargeAmount] = row;
      //   return {
      //     userName,
      //     userEmail: email,
      //     userPassword: password,
      //     vendorLegalName,
      //     officeChargeAmount
      //   };
      // });

      // console.log(mappedDataForBasic); // Log the mapped data
      // setBasicData(mappedDataForBasic); // Set the mapped data to state

      // Execute and log the results

      const { validItems, invalidItems } = separateValidAndInvalidItemsWithGenericDependencies(jsonData.slice(1), fieldMapping);

      console.log(`🚀 ~ handleExcelDataExtraction ~ invalidItems:`, invalidItems);
      console.log(`🚀 ~ handleExcelDataExtraction ~ validItems:`, validItems);

      if (invalidItems.length > 0) {
        const items = invalidItems.map((entry) => {
          const reasons = Object.entries(entry.errors)
            .map(([field, message], index) => `${index + 1}. ${field} : ${message}`)
            .join('\n');

          return [...entry.item, `Reasons :\n${reasons}`];
        });
        console.log('Invalid Items with Reasons:', items);

        setInvalidData(items);
      }

      const mappedDataForBasic = validItems.map((row) => {
        return {
          userName: row[0],
          userEmail: row[1] || `sampleEmail-${row[2]}@tripBiller.com`,
          contactNumber: row[2] || null,
          userPassword: row[3]?.toString(),
          vendorLegalName: row[4]?.toString(),
          officeChargeAmount: row[5],

          contactPersonName: row[6] || '',
          PAN: row[7] || '',
          GSTIN: row[8] || '',
          officeAddress: row[9] || '',
          officeCity: row[10] || '',
          officeState: row[11] || '',
          officePinCode: row[12] || '',
          workEmail: row[13] || '',
          workMobileNumber: row[14] || '',
          workLandLineNumber: row[15] || '',
          bankName: row[16] || '',
          accountNumber: row[17] || '',
          accountHolderName: row[18] || '',
          branchName: row[19] || '',
          IFSC_code: row[20]?.toString() || '',
          bankAddress: row[21]?.toString() || '',
          ESI_Number: row[22] || '',
          PF_Number: row[23] || ''
        };
      });

      console.log(mappedDataForBasic); // Log the mapped data
      setBasicData(mappedDataForBasic); // Set the mapped data to state

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
    // const vendorHeaders = ['Username*', 'Email*', 'Password*', 'Vendor Legal Name*', 'Office Charge Amount*'];
    const vendorHeaders = [...MANDATORY_HEADERS, ...OPTIONAL_HEADERS];
    // Create the first sheet (headers only)
    const vendorSheet = XLSX.utils.aoa_to_sheet([vendorHeaders]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Vendor Data');
    XLSX.writeFile(workbook, 'BulkVendorUploadSheet.xlsx');
  }, []);

  const handleViewClick = useCallback((data) => {
    // Headers for "vendor Data" sheet
    console.log(data);

    // const vendorHeaders = ['Username*', 'Email*', 'Password*', 'Vendor Legal Name*', 'Office Charge Amount*'];
    const vendorHeaders = [...MANDATORY_HEADERS, ...OPTIONAL_HEADERS];

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

  const handleViewClickForInvalid = useCallback((data) => {
    try {
      // alert(`handleViewClickForInvalid ${data.length}`);
      console.log('DATA = ', data);

      // const vendorHeaders = ['Username*', 'Email*', 'Password*', 'Vendor Legal Name*', 'Office Charge Amount*'];
      const vendorHeaders = [...MANDATORY_HEADERS, ...OPTIONAL_HEADERS, 'Reasons'];

      const HeaderLength = vendorHeaders.length;

      const output = data.map((row) => {
        // Add `null` to the end of the row until its length matches the required length
        while (row.length < HeaderLength) {
          row.splice(-1, 0, null); // Add nulls before the last item
        }
        return row;
      });

      console.log('output = ', output);

      // Create the second sheet (headers + data if available)
      const vendorSheet = XLSX.utils.aoa_to_sheet([
        vendorHeaders,
        // ...data // Will be empty if no data
        ...output // Will be empty if no data
      ]);
      // Create a workbook and append the sheets
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Invalid Vendor Data');

      // Export the Excel file
      XLSX.writeFile(workbook, 'InvalidVendorData.xlsx');
    } catch (error) {
      console.log('🚀 ~ handleViewClickForInvalid ~ error:', error);
    }
  }, []);

  const actionTaskForInvalidData = useCallback(
    (snackbarId, data) => (
      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={() => {
            console.log('Rakhi = ', data);
            handleViewClickForInvalid(data);
          }}
        >
          View Invalid Data
        </Button>
        <Button size="small" color="secondary" variant="contained" onClick={() => closeSnackbar(snackbarId)}>
          Dismiss
        </Button>
      </Stack>
    ),
    [closeSnackbar, handleViewClickForInvalid]
  );

  const handleSave = useCallback(async () => {
    try {
      console.log('handleSave called');
      console.log('basicData', basicData);
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
          formData.append('contactNumber', item.contactNumber || '');
          formData.append('alternateContactNumber', '');

          const response = await dispatch(registerUser(formData)).unwrap();
          if (response?.status === 201) {
            const specificPayload = {
              data: {
                vendorId: response.data._id,
                vendorCompanyName: item.vendorLegalName,
                officeChargeAmount: item.officeChargeAmount,
                contactPersonName: item.contactPersonName || '',
                PAN: item.PAN || '',
                GSTIN: item.GSTIN || '',
                workEmail: item.workEmail || '',
                workMobileNumber: item.workMobileNumber || '',
                workLandLineNumber: item.workLandLineNumber || '',
                officePinCode: item.officePinCode || '',
                officeCity: item.officeCity || '',
                officeState: item.officeState || '',
                officeAddress: item.officeAddress || '',
                bankName: item.bankName || '',
                branchName: item.branchName || '',
                IFSC_code: item.IFSC_code || '',
                accountNumber: item.accountNumber || '',
                accountHolderName: item.accountHolderName || '',
                bankAddress: item.bankAddress || '',
                ESI_Number: item.ESI_Number || '',
                PF_Number: item.PF_Number || ''
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
      if (invalidData.length > 0) {
        enqueueSnackbar(`${invalidData.length} Vendors Invalid Data`, {
          action: (key) => actionTaskForInvalidData(key, invalidData),
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      }
    }
  }, [basicData, handleClose, actionTask, actionTaskForInvalidData, invalidData]);

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
