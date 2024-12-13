import { useTheme } from '@mui/material/styles';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import { getApiResponse } from 'utils/axiosHelper';
import { useLocation, useNavigate } from 'react-router';
import { Add, Edit } from 'iconsax-react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { addMonths, isValid } from 'date-fns';
import AddressModal from './components/CompanySelectModel';
import GenericSelect from 'components/select/GenericSelect';
import DefaultItemTable from './itemTables';
import TripItemTable from './itemTables/TripTable';
import axiosServices from 'utils/axios';
import { v4 as UIDV4 } from 'uuid';
import TripImportDialog from './ImportDialog';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const customTextFieldStyle = {
  '& .MuiInputBase-input': {
    padding: '8px'
  }
};
const Create = () => {
  const theme = useTheme();
  const navigation = useNavigate();
  const { user, userSpecificData } = useAuth();
  const location = useLocation();
  const { state } = location || {}; // Safeguard against undefined location
  const data = state?.tripData || [];
  const [tripData, setTripData] = useState(data);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    invoice: {
      prefix: 'INV-',
      invoiceNumber: 1
    }
  });

  const [tempSettings, setTempSettings] = useState({
    invoice: { ...settings.invoice }
  });
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceIdDialog, setInvoiceIdDialog] = useState(false);

  const handleInvoiceIdDialog = () => {
    setTempSettings({
      invoice: { ...settings.invoice }
    });
    setInvoiceIdDialog((prev) => !prev);
  };

  // populate Invoice Setting
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const cabProviderId = user._id;
        const url = `/invoice/settings/list`;
        const config = {
          params: {
            cabProviderId
          }
        };

        const response = await getApiResponse(url, config);

        if (response.success) {
          if (!response.data) {
            alert('Invoice Settings Not Found');
            navigation('/settings/invoice', {
              replace: true
            });
            return;
          }
          const { invoiceSetting } = response.data;

          setSettings(invoiceSetting);
          setLoading(false);
        }
      } catch (error) {
        console.log('Error fetching settings: (Invoice Creation)', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Update invoiceId dynamically based on settings
  useEffect(() => {
    const { prefix = 'INV-', invoiceNumber = 1 } = settings.invoice || {};
    const formattedNumber = String(invoiceNumber); // Format as 000001
    setInvoiceId(`${prefix}${formattedNumber}`);
  }, [settings]);

  const [invoiceStatus, setInvoiceStatus] = useState('Unpaid');

  const [dates, setDates] = useState({
    invoiceDate: new Date(), // Default to today's date
    invoiceDueDate: addMonths(new Date(), 1) // Default to 1 month after today's date
  });

  // Handler for updating dates
  const handleDateChange = (field, newValue) => {
    setDates((prev) => {
      const updatedDates = { ...prev };

      if (isValid(newValue)) {
        updatedDates[field] = newValue; // Update the changed field
        // Automatically update due date if invoiceDate is changed
        if (field === 'invoiceDate') {
          updatedDates.invoiceDueDate = addMonths(newValue, 1);
        }
      }
      return updatedDates;
    });
  };

  const [sendersDetails, setSendersDetails] = useState({
    _id: user._id || null,
    name: userSpecificData.cabProviderLegalName || '',
    email: user.userEmail || '',
    mobile: user.contactNumber || '',
    PAN: userSpecificData.PAN || '',
    GSTIN: userSpecificData.GSTIN || '',
    postal_code: user.pinCode || '',
    address: user.address || '',
    state: user.state || ''
  });

  const [senderEditMode, setSenderEditMode] = useState(false);

  const handleSaveSenderDetails = useCallback(() => {
    setSenderEditMode(false);
  }, []);

  const handleChangeSenderDetails = useCallback((e) => {
    const { name, value } = e.target;
    setSendersDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const [recieversDetails, setRecieversDetails] = useState({
    _id: null,
    name: null,
    email: null,
    mobile: null,
    PAN: null,
    GSTIN: null,
    postal_code: null,
    address: null,
    state: null
  });

  const [recieversModalOpen, setRecieversModalOpen] = useState(false);

  const [groupByOption, setGroupByOption] = useState('Company Rate');

  const [sendersBankDetails, setSenderBankDetails] = useState({
    accountHolderName: userSpecificData.accountHolderName,
    bankName: userSpecificData.bankName,
    ifscCode: userSpecificData.IFSC_code,
    acountNumber: userSpecificData.accountNumber
  });

  const handleChangesendersBankDetails = useCallback((e) => {
    const { name, value } = e.target;
    setSenderBankDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);
  const [isBankDetailsEditing, setIsBankDetailsEditing] = useState(false);

  const handleBankDetailsEditToggle = () => {
    setIsBankDetailsEditing(!isBankDetailsEditing);
  };
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [invoiceTermsAndCondition, setInvoiceTermsAndCondition] = useState('');

  useEffect(() => {
    const fetchRecieversDetails = async (companyId) => {
      setLoading(true);
      const response = await axiosServices.get(`/company/by?companyId=${companyId}`);
      if (response.status === 200) {
        const {
          company_name = 'N/A',
          mobile = 'Not Available',
          company_email = 'Not Available',
          address = 'Not Provided',
          city = 'Not Provided',
          state = 'Not Provided',
          postal_code = 'Not Provided',
          PAN = 'Not Available',
          GSTIN = 'Not Available',
          _id = null
        } = response.data.data || {};

        setRecieversDetails({
          _id: _id,
          name: company_name,
          email: company_email,
          mobile: mobile,
          PAN: PAN,
          GSTIN: GSTIN,
          postal_code: '',
          address: address,
          state: state
        });
        setLoading(false);
      }
    };
    if (tripData.length > 0 && tripData[0].companyID) {
      fetchRecieversDetails(tripData[0].companyID._id);
    }
    console.log({ tripData });
  }, [tripData]);

  const [itemData, setItemData] = useState([
    {
      id: UIDV4(),
      name: '',
      description: '',
      qty: 1,
      price: '1.00',
      tax: 0,
      discount: 0
    }
  ]);

  const [amountSummary, setAmountSummary] = useState({
    total: 0,
    subTotal: 0,
    mcdCharges: 0,
    tollCharges: 0,
    additionalCharges: 0,
    totalTax: 0,
    totalDiscount: 0,
    grandTotal: 0
  });

  const [importTripDialogOpen, setImportTripDialogOpen] = useState(false);
  const handleOpenDialog = () => {
    setImportTripDialogOpen((prev) => !prev);
  };

  const handleCreateInvoice = async () => {
    setLoading(true);
    // console.log({ settings });
    // console.log({ invoiceId });
    console.log({ dates });
    // console.log({ sendersDetails });
    // console.log({ recieversDetails });
    // console.log({ groupByOption });
    // console.log({ itemData });
    // console.log({ invoiceTermsAndCondition });
    // console.log({ invoiceNotes });
    // console.log({ amountSummary });
    // console.log({ sendersBankDetails });

    const structuredItemData = itemData.map((item) => ({
      itemName: item.name,
      description: item.description,
      rate: item.price,
      quantity: item.qty,
      HSN_SAC_code: null,
      itemTax: item.tax,
      itemDiscount: item.discount,
      Tax_amount: (item.price * item.qty * item.tax) / 100,
      amount: item.price * item.qty,
      discount: null
    }));
    const linkedTripIds = itemData.flatMap((item) => (item.ids ? item.ids : []));

    const linkedTripIds1 = itemData.map((item) => ({
      ids: item.ids,
      taxRate: item.tax
    }));

    function formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    function checkGSTtype(str1, str2) {
      // Check if strings are null, undefined, or not of length 2
      if (!str1 || !str2 || str1.length < 2 || str2.length < 2) {
        return false;
      }

      // Compare the first two characters, ignoring case
      const firstTwoStr1 = str1.substring(0, 2).toLowerCase();
      const firstTwoStr2 = str2.substring(0, 2).toLowerCase();

      return firstTwoStr1 === firstTwoStr2;
    }
    const isSameState = checkGSTtype(sendersDetails.GSTIN, recieversDetails.GSTIN);
    const invoicePayload = {
      data: {
        companyId: recieversDetails._id,
        cabProviderId: sendersDetails._id,
        invoiceNumber: invoiceId,
        invoiceDate: formatDate(dates.invoiceDate),
        dueDate: formatDate(dates.invoiceDate),
        servicePeriod: '14-11-2024 to 02-12-2024',
        linkedTripIds1: linkedTripIds1,
        linkedTripIds: linkedTripIds,
        linkedTripIdsVendor: [],
        linkedTripIdsDriver: [],
        invoiceData: structuredItemData,
        subTotal: amountSummary.subTotal,
        totalAmount: amountSummary.total,
        grandTotal: amountSummary.grandTotal,
        totalDiscount: amountSummary.totalDiscount,
        totalTax: amountSummary.totalTax,
        CGST: isSameState ? amountSummary.totalTax / 2 : 0,
        SGST: isSameState ? amountSummary.totalTax / 2 : 0,
        IGST: isSameState ? 0 : amountSummary.totalTax,
        MCDAmount: amountSummary.mcdCharges,
        tollParkingCharges: amountSummary.tollCharges,
        terms: invoiceTermsAndCondition,
        billedTo: recieversDetails,
        billedBy: sendersDetails,
        bankDetails: sendersBankDetails,
        settings: {
          discount: settings.discount,
          tax: settings.tax
        }
      }
    };
    console.log({ invoicePayload });

    try {
      const response = await axiosServices.post('/invoice/create', invoicePayload);

      if (response.status === 201) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Invoice Generated Successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        navigation('/apps/invoices/list', {
          replace: true
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);

      dispatch(
        openSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to generate invoice.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    } finally {
      setLoading(false);
    }
  };
  const handlePreview = () => {
    setLoading(true);

    const structuredItemData = itemData.map((item) => ({
      itemName: item.name,
      description: item.description,
      rate: item.price,
      quantity: item.qty,
      HSN_SAC_code: null,
      itemTax: item.tax,
      itemDiscount: item.discount,
      Tax_amount: (item.price * item.qty * item.tax) / 100,
      amount: item.price * item.qty,
      discount: null
    }));
    const linkedTripIds = itemData.flatMap((item) => (item.ids ? item.ids : []));

    const linkedTripIds1 = itemData.map((item) => ({
      ids: item.ids,
      taxRate: item.tax
    }));

    function checkGSTtype(str1, str2) {
      // Check if strings are null, undefined, or not of length 2
      if (!str1 || !str2 || str1.length < 2 || str2.length < 2) {
        return false;
      }

      // Compare the first two characters, ignoring case
      const firstTwoStr1 = str1.substring(0, 2).toLowerCase();
      const firstTwoStr2 = str2.substring(0, 2).toLowerCase();

      return firstTwoStr1 === firstTwoStr2;
    }
    const isSameState = checkGSTtype(sendersDetails.GSTIN, recieversDetails.GSTIN);
    const invoicePayload = {
      companyId: recieversDetails._id,
      cabProviderId: sendersDetails._id,
      invoiceNumber: invoiceId,
      invoiceDate: dates.invoiceDate,
      dueDate: dates.invoiceDate,
      servicePeriod: '14-11-2024 to 02-12-2024',
      linkedTripIds1: linkedTripIds1,
      linkedTripIds: linkedTripIds,
      linkedTripIdsVendor: [],
      linkedTripIdsDriver: [],
      invoiceData: structuredItemData,
      subTotal: amountSummary.subTotal,
      totalAmount: amountSummary.total,
      grandTotal: amountSummary.grandTotal,
      totalDiscount: amountSummary.totalDiscount,
      totalTax: amountSummary.totalTax,
      CGST: isSameState ? amountSummary.totalTax / 2 : 0,
      SGST: isSameState ? amountSummary.totalTax / 2 : 0,
      IGST: isSameState ? 0 : amountSummary.totalTax,
      MCDAmount: amountSummary.mcdCharges,
      tollParkingCharges: amountSummary.tollCharges,
      terms: invoiceTermsAndCondition,
      billedTo: recieversDetails,
      billedBy: sendersDetails,
      bankDetails: sendersBankDetails,
      settings: {
        discount: settings.discount,
        tax: settings.tax
      }
    };
    navigation('/apps/invoices/details/', {
      state: { pageData: invoicePayload }
    });
  };

  return (
    <>
      <MainCard>
        <Grid container spacing={2}>
          {/*Invoice No*/}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <InputLabel>Invoice Id</InputLabel>
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  required
                  name="invoice_id"
                  id="invoice_id"
                  value={`${settings.invoice?.prefix}-${settings.invoice?.invoiceNumber}`} // Controlled value
                  InputProps={{
                    readOnly: true, // Editable only if 'manual' is selected
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleInvoiceIdDialog} size="small">
                          <Edit color="rgb(91,107,121)" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
            </Stack>
          </Grid>
          {/* Status*/}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <InputLabel>Status</InputLabel>
              <FormControl sx={{ width: '100%' }}>
                <Select value={invoiceStatus} displayEmpty name="status" onChange={(e) => setInvoiceStatus(e.target.value)}>
                  <MenuItem disabled value="">
                    Select status
                  </MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Unpaid">Unpaid</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          {/* Invoice Date*/}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <InputLabel>Date</InputLabel>
              <FormControl sx={{ width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    value={dates.invoiceDate}
                    onChange={(newValue) => handleDateChange('invoiceDate', newValue)}
                  />
                </LocalizationProvider>
              </FormControl>
            </Stack>
          </Grid>
          {/* Invoice Due Date*/}
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={1}>
              <InputLabel>Due Date</InputLabel>
              <FormControl sx={{ width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    value={dates.invoiceDueDate}
                    onChange={(newValue) => handleDateChange('invoiceDueDate', newValue)}
                  />
                </LocalizationProvider>
              </FormControl>
            </Stack>
          </Grid>
          {/* Senders Details*/}
          <Grid item xs={12} sm={6}>
            <MainCard sx={{ minHeight: 180 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Stack spacing={2}>
                    <Typography variant="h5">From:</Typography>
                    <Stack sx={{ width: '100%' }}>
                      {senderEditMode ? (
                        <Grid container spacing={2}>
                          {[
                            { label: 'Name', name: 'name', value: sendersDetails.name },
                            { label: 'Address', name: 'address', value: sendersDetails.address },
                            { label: 'Contact', name: 'contact', value: sendersDetails.mobile },
                            { label: 'State', name: 'state', value: sendersDetails.state },
                            { label: 'Postal Code', name: 'postal_code', value: sendersDetails.postal_code },
                            { label: 'GSTIN', name: 'GSTIN', value: sendersDetails.GSTIN },
                            { label: 'PAN', name: 'PAN', value: sendersDetails.PAN }
                          ].map((field, index) => (
                            <Grid item xs={6} key={index}>
                              <TextField
                                label={field.label}
                                value={field.value || ''} // Ensures it shows an empty string if the value is undefined
                                name={field.name}
                                onChange={handleChangeSenderDetails}
                                fullWidth
                                sx={customTextFieldStyle}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <>
                          <Typography variant="subtitle1">{sendersDetails.name}</Typography>
                          <Typography color="secondary">
                            {`${sendersDetails.address}, ${sendersDetails.state || ''} - ${sendersDetails.postal_code || ''}`}
                          </Typography>
                          <Typography color="secondary">
                            <strong>Mobile:</strong> {sendersDetails.mobile || ''}
                          </Typography>
                          <Typography color="secondary">
                            <strong>GSTIN:</strong> {sendersDetails.GSTIN}
                          </Typography>
                          <Typography color="secondary">
                            <strong>PAN:</strong> {sendersDetails.PAN}
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign={{ xs: 'left', sm: 'right' }} color="secondary.200">
                    {senderEditMode ? (
                      <Button variant="outlined" color="secondary" onClick={handleSaveSenderDetails} size="small">
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        color="secondary"
                        onClick={() => setSenderEditMode(true)}
                        size="small"
                      >
                        Change
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          {/* Recievers Details*/}
          <Grid item xs={12} sm={6}>
            <MainCard sx={{ minHeight: 180 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  {recieversDetails._id && (
                    <Stack spacing={2}>
                      <Typography variant="h5">To:</Typography>
                      <Stack sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">{recieversDetails.name}</Typography>
                        <Typography color="secondary">
                          {' '}
                          {`${recieversDetails.address},  ${recieversDetails.state || ''} - ${recieversDetails.postal_code || ''}`}
                        </Typography>
                        <Typography color="secondary">
                          <strong>Mobile:</strong> {recieversDetails.mobile}
                        </Typography>
                        <Typography color="secondary">
                          <strong>GSTIN:</strong> {recieversDetails.GSTIN}
                        </Typography>
                        <Typography color="secondary">
                          {' '}
                          <strong>PAN:</strong> {recieversDetails.PAN}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="right" color="secondary.200">
                    <Button
                      size="small"
                      startIcon={<Add />}
                      color="secondary"
                      variant="outlined"
                      onClick={() => setRecieversModalOpen(true)}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          {/* Details */}
          {tripData.length > 0 && (
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h5">Details</Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'text.secondary' }}>
                  Generating Invoice for{' '}
                  <Typography component="span" sx={{ fontWeight: 'bold', fontStyle: 'normal', color: 'primary.main' }}>
                    {tripData.length} trips
                  </Typography>
                  .
                </Typography>

                <Box sx={{ width: '20%' }}>
                  <GenericSelect
                    label="Group By"
                    name="particularType"
                    options={[
                      { value: 'Company Rate', label: 'Company Rate' },
                      { value: 'Zone', label: 'Zone' },
                      { value: 'Zone Type', label: 'Zone Type' },
                      { value: 'Vehicle Type', label: 'Vehicle Type' }
                    ]}
                    value={groupByOption}
                    onChange={(e) => setGroupByOption(e.target.value)}
                    fullWidth
                  />
                </Box>
              </Stack>
            </Grid>
          )}
          {/* Particular Table (Invoice) */}
          {tripData.length > 0 ? (
            <TripItemTable
              itemData={itemData}
              setItemData={setItemData}
              tripData={tripData}
              groupByOption={groupByOption}
              amountSummary={amountSummary}
              setAmountSummary={setAmountSummary}
              invoiceSetting={settings}
            />
          ) : (
            <DefaultItemTable
              recieversDetails={recieversDetails}
              invoiceSetting={settings}
              setTripData={setTripData}
              amountSummary={amountSummary}
              setAmountSummary={setAmountSummary}
              handleOpenDialog={handleOpenDialog}
            />
          )}

          {/* Particular Table (Invoice) */}
        </Grid>
        {/* Footer Bank and Notes Section */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <MainCard sx={{ minHeight: 180 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  {isBankDetailsEditing ? (
                    <Grid container spacing={2}>
                      {[
                        {
                          label: 'Account Holder Name',
                          name: 'accountHolderName',
                          value: sendersBankDetails.accountHolderName,
                          placeholder: 'Enter account holder name'
                        },
                        {
                          label: 'Account Number',
                          name: 'acountNumber',
                          value: sendersBankDetails.acountNumber,
                          placeholder: 'Enter account number'
                        },
                        { label: 'IFSC Code', name: 'ifscCode', value: sendersBankDetails.ifscCode, placeholder: 'Enter IFSC code' },
                        { label: 'Bank Name', name: 'bankName', value: sendersBankDetails.bankName, placeholder: 'Enter bank name' }
                      ].map((field, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            label={field.label}
                            name={field.name}
                            variant="outlined"
                            fullWidth
                            value={field.value || ''} // Fallback to empty string
                            onChange={handleChangesendersBankDetails}
                            placeholder={field.placeholder}
                            sx={customTextFieldStyle} // Apply your custom style if needed
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Stack spacing={2}>
                      {/* Header with Alignment */}
                      <Typography variant="h5">Bank Details:</Typography>
                      {/* Bank Details Fields */}
                      <Stack sx={{ width: '100%' }}>
                        {/* Display Account Holder Name */}
                        <Typography color="secondary">
                          <strong>Account Holder Name:</strong> {sendersBankDetails.accountHolderName}
                        </Typography>

                        {/* Display Account Number */}
                        <Typography color="secondary">
                          <strong>Account Number:</strong> {sendersBankDetails.acountNumber}
                        </Typography>

                        {/* Display IFSC Code */}
                        <Typography color="secondary">
                          <strong>IFSC Code:</strong> {sendersBankDetails.ifscCode}
                        </Typography>

                        {/* Display Bank Name */}
                        <Typography color="secondary">
                          <strong>Bank Name:</strong> {sendersBankDetails.bankName}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign={{ xs: 'left', sm: 'right' }} color="secondary.200">
                    {isBankDetailsEditing ? (
                      <Button variant="outlined" color="secondary" onClick={handleBankDetailsEditToggle} size="small">
                        Save
                      </Button>
                    ) : (
                      <Button variant="outlined" startIcon={<Edit />} color="secondary" onClick={handleBankDetailsEditToggle} size="small">
                        Change
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          {/* Notes */}
          <Grid item xs={12} sm={6}>
            <MainCard sx={{ minHeight: 180 }}>
              <Stack spacing={2}>
                {/* Notes Section */}
                <Typography variant="h5">Notes:</Typography>
                <Stack sx={{ width: '100%' }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '8px'
                      }
                    }}
                    placeholder="Enter your notes here..."
                  />
                </Stack>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>

        {/*Terms and Conditions */}
        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
          <MainCard sx={{ minHeight: 180 }}>
            <Grid item xs={12} sm={8}>
              <Stack spacing={2}>
                {/* Header with Alignment */}
                <Typography variant="h5">Terms and Conditions:</Typography>
                {/* Terms & ocondition */}
                <Stack sx={{ width: '100%' }}>
                  {/* Display Account Holder Name */}
                  <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={invoiceTermsAndCondition}
                    onChange={(e) => setInvoiceTermsAndCondition(e.target.value)}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '8px'
                      }
                    }}
                    placeholder="Enter terms and conditions here..."
                  />
                </Stack>
              </Stack>
            </Grid>
          </MainCard>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
            <Button variant="outlined" color="secondary" sx={{ color: 'secondary.dark' }} onClick={handlePreview}>
              Preview
            </Button>
            <Button color="primary" variant="contained" onClick={handleCreateInvoice} disabled={loading || amountSummary.grandTotal <= 1 || !sendersDetails._id || !recieversDetails._id}>
              Create & Send
            </Button>
          </Stack>
        </Grid>
      </MainCard>
      {/* Dialog for pop-up (Invoice Id)*/}
      <Dialog
        open={invoiceIdDialog}
        onClose={handleInvoiceIdDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            maxHeight: '80vh',
            width: '600px',
            maxWidth: '90%'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Enter invoice no. manually</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            {"Invoice won't save if entered Invoice no already exists!"}
          </Typography>

          <Stack
            direction="row"
            spacing={2} // Adjust the gap between items
            sx={{ marginTop: '8px' }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <TextField
              label="Prefix"
              value={tempSettings.invoice?.prefix}
              variant="standard"
              onChange={(e) =>
                setTempSettings((prevTemp) => ({
                  ...prevTemp,
                  invoice: {
                    ...prevTemp.invoice,
                    prefix: e.target.value // Update prefix only in tempSettings
                  }
                }))
              }
              fullWidth
              margin="dense"
            />
            <TextField
              label="Next Number"
              value={tempSettings.invoice?.invoiceNumber}
              variant="standard"
              onChange={(e) =>
                setTempSettings((prevTemp) => ({
                  ...prevTemp,
                  invoice: {
                    ...prevTemp.invoice,
                    invoiceNumber: e.target.value // Update invoiceNumber only in tempSettings
                  }
                }))
              }
              fullWidth
              margin="dense"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              // Save changes to settings
              setSettings((prevSettings) => ({
                ...prevSettings,
                invoice: { ...tempSettings.invoice }
              }));
              setInvoiceIdDialog(false); // Close the dialog
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              // Close the dialog without saving changes
              setInvoiceIdDialog(false);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AddressModal
        value={recieversDetails}
        setFilterOptions={setRecieversDetails}
        open={recieversModalOpen}
        setOpen={setRecieversModalOpen}
        setRecieversDetails={setRecieversDetails}
      />

      <TripImportDialog
        open={importTripDialogOpen}
        handleClose={handleOpenDialog}
        recieversDetails={recieversDetails}
        setTripData={setTripData}
      />
    </>
  );
};

export default Create;
