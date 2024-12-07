import { useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
import { FieldArray, Form, Formik, FormikProvider, getIn, useFormik } from 'formik';

// project-imports
import MainCard from 'components/MainCard';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import AddressModal from 'sections/apps/invoice/AddressModal';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';

import incrementer from 'utils/incrementer';
import { dispatch, set, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { customerPopup, selectCountry, getInvoiceInsert, reviewInvoicePopup, getInvoiceList } from 'store/reducers/invoice';

// assets
import { Add, Edit, Setting } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';
import CustomDialog from './CustomDialog';
import InvoiceSetting from 'pages/setting/invoice';
import GenericSelect from 'components/select/GenericSelect';
import { formatDateUsingMoment } from 'utils/helper';
import axios from 'utils/axios';
import { getApiResponse } from 'utils/axiosHelper';

export const TAX_TYPE = {
  INDIVIDUAL: 'Individual',
  GROUP: 'Group'
};

export const DISCOUNT_TYPE = {
  ...TAX_TYPE,
  NO: 'No'
};

const DISCOUNT_BY = {
  PERCENTAGE: 'Percentage',
  AMOUNT: 'Amount'
};

export const STATUS = {
  YES: 1,
  NO: 0
};

const SETTINGS = {
  invoice: {
    preFix: 'INV',
    invoiceNumber: 1
  },

  tax: {
    // apply: TAX_TYPE.INDIVIDUAL
    apply: TAX_TYPE.GROUP
  },
  discount: {
    // apply: DISCOUNT_TYPE.INDIVIDUAL,
    apply: DISCOUNT_TYPE.GROUP,
    // by: DISCOUNT_BY.PERCENTAGE

    by: DISCOUNT_BY.AMOUNT
  },
  additionalCharges: STATUS.YES,
  roundOff: STATUS.YES
};

const getItem = (data) => {
  console.log(`🚀 ~ getItem ~ data:`, data);
  return {
    id: UIDV4(),
    itemName: '',
    rate: 0,
    quantity: 0,
    amount: 0,
    ...(data?.tax?.apply === TAX_TYPE.INDIVIDUAL
      ? { tax: data?.tax?.by || DISCOUNT_BY.PERCENTAGE, itemTax: 0, code: 'VH45BS35VJ3', taxAmount: 0 }
      : {}),
    ...(data?.discount?.apply === DISCOUNT_TYPE.INDIVIDUAL ? { discount: data?.discount?.by, itemDiscount: 0, discountAmount: 0 } : {})
  };
};

const getInitialValues = (data) => {
  console.log('data', data);

  const result = {
    id: 120,
    invoice_id: Date.now(),
    status: '',
    date: new Date(), // For Invoice Date
    due_date: null, // For Invoice Due Date
    start_date: null, // For Start Date
    end_date: null, // For End Date
    cashierInfo: {
      address: '3488 Arbutus Drive',
      city: 'Miami',
      state: 'FL',
      postal_code: '33012',
      GSTIN: '32JKLMN9101P2Q6',
      company_name: 'Ritika Yohannan',
      PAN: 'JKLMN9101P',
      company_email: 'rtyhn65@gmail.com'
    },
    customerInfo: {
      address: '',
      city: '',
      state: '',
      postal_code: '',
      GSTIN: '',
      company_name: '',
      PAN: '',
      company_email: ''
    },
    invoice_detail: [getItem(data)],
    bank_details: {
      accountHolderName: 'John Doe',
      accountNumber: '123456789012',
      IFSCCode: 'SBIN0001234',
      bankName: 'State Bank of India'
    },
    tax: data?.tax?.by || DISCOUNT_BY.PERCENTAGE,
    discount: data?.discount?.by,
    groupTaxAmount: 0,
    groupDiscountAmount: 0,
    ...(data?.tax?.apply === TAX_TYPE.GROUP ? { groupTax: 0 } : {}),

    ...(data?.discount?.apply === DISCOUNT_TYPE.GROUP ? { groupDiscount: 0 } : {}),
    notes: '',
    terms: '',
    subTotal: 0,
    total: 0,
    CGST: 0,
    SGST: 0,
    IGST: 0,
    MCDAmount: 0,
    tollParkingCharges: 0,
    penalty: 0,
    additional: {}
  };

  return result;
};

const getDiscountLabel = (val) => {
  const { by, currency = '₹' } = val;
  return by === DISCOUNT_BY.PERCENTAGE
    ? `Discount (%)` // Use percentage symbol for percentage discounts
    : `Discount (${currency})`; // Use currency symbol for amount discounts
};

const PARTICULAR_TYPE = {
  ZONE: 1,
  ZONE_TYPE: 2,
  VEHICLE_TYPE: 3
};

const optionsForParticularType = [
  { value: PARTICULAR_TYPE.VEHICLE_TYPE, label: 'Vehicle Type' },
  { value: PARTICULAR_TYPE.ZONE, label: 'Zone' },
  { value: PARTICULAR_TYPE.ZONE_TYPE, label: 'Zone Type' }
];

const Create1 = () => {
  console.log('Invoice Create1.jsx');

  const theme = useTheme();
  const navigation = useNavigate();

  const { isCustomerOpen, countries, country, lists, isOpen } = useSelector((state) => state.invoice);
  const [settings, setSettings] = useState({});
  const [isEditable] = useState(false);
  const [cashierValues, setCashierValues] = useState({});
  const [formValues, setFormValues] = useState(cashierValues || {});
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState('auto'); // 'auto' for auto-generate, 'manual' for manual input
  const [prefix, setPrefix] = useState('INV-');
  const [nextNumber, setNextNumber] = useState('000001');
  const [invoiceId, setInvoiceId] = useState(`${prefix}${nextNumber}`);
  const [isBankDetailsEditing, setIsBankDetailsEditing] = useState(false);
  const [formikInitialValues, setFormikInitialValues] = useState(getInitialValues(settings)); // NEW
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(true); // Start with the dialog open
  const [showCreatePage, setShowCreatePage] = useState(false); // Track if the create page should be visible
  const [loadingTable, setLoadingTable] = useState(true); // New state for table loading
  const [particularType, setParticularType] = useState(0);

  useEffect(() => {
    console.log('useEffect of invoice create');
    console.log(dialogOpen);

    async function fetchSettings() {
      // TODO : Get settings from API
      try {
        console.log('Api call for get settings (At Invoice Creation)');
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        const cabProviderId = JSON.parse(localStorage.getItem('userInformation'))?.userId || '';
        const url = `/invoice/settings/list`;
        const config = {
          params: {
            cabProviderId
          }
        };

        const response = await getApiResponse(url, config);
        console.log(`🚀 ~ response:`, response);

        if (response.success) {
          const { invoiceSetting } = response.data;
          console.log(invoiceSetting);
          setSettings(invoiceSetting);
          setLoading(false);
          console.log('Api call done .......');
        }

        console.log('Api call done get settings ........');
        // setSettings(SETTINGS);
      } catch (error) {
        console.log('Error fetching settings: (Invoice Creation)', error);
      }
    }

    if (!dialogOpen) {
      fetchSettings();
    }
  }, [dialogOpen]);

  const handleFormikSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log('Formik submit', values);

      const cabProviderId = JSON.parse(localStorage.getItem('userInformation'))?.userId || '';
      const format = 'YYYY-MM-DD';

      const payload = {
        data: {
          companyId: values?.customerInfo?._id || '',
          cabProviderId,
          invoiceNumber: invoiceId,
          invoiceDate: formatDateUsingMoment(values?.date, format),
          dueDate: formatDateUsingMoment(values?.due_date, format),
          servicePeriod:
            formatDateUsingMoment(values?.start_date, 'DD-MM-YYYY') + ' to ' + formatDateUsingMoment(values?.end_date, 'DD-MM-YYYY'),
          invoiceData: values?.invoice_detail || [],
          taxBy: values?.tax,
          subTotal: values?.subTotal,
          discountBy: values.discount,
          totalAmount: values?.total,
          groupTaxAmount: values?.groupTaxAmount,
          groupDiscountAmount: values?.groupDiscountAmount,
          grandTotal: values?.total,
          CGST: values?.CGST,
          SGST: values?.SGST,
          IGST: values?.IGST,
          MCDAmount: values?.MCDAmount,
          tollParkingCharges: values?.tollParkingCharges,
          penalty: values?.penalty,
          terms: values?.terms,
          billedTo: values?.customerInfo,
          billedBy: values?.cashierInfo,
          bankDetails: values?.bank_details
        }
      };

      console.log('payload', payload);
      alert(JSON.stringify(payload, null, 2));
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    // initialValues: getInitialValues(settings),
    initialValues: formikInitialValues,
    enableReinitialize: true,
    onSubmit: handleFormikSubmit
  });

  const { handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched } = formik;

  //   setCashierValues(formik.values?.cashierInfo || {});

  const handleDialogSave = () => {
    setDialogOpen(false); // Close the dialog only after saving
    setShowCreatePage(true); // Show Create page when preferences are saved
  };

  const handleBankDetailsEditToggle = () => {
    setIsBankDetailsEditing(!isBankDetailsEditing);
  };

  const handleSettingClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    // Auto-generate invoice ID when 'auto' is selected
    if (value === 'auto') {
      setInvoiceId(`${prefix}${nextNumber}`); // Update invoiceId based on prefix and next number
    }
  };

  // Handle manual input for the invoice ID
  const handleInvoiceIdChange = (event) => {
    if (selectedOption === 'manual') {
      setInvoiceId(event.target.value); // Allow manual input when 'manual' is selected
    }
  };

  const handleSave = () => {
    if (selectedOption === 'auto') {
      // Combine prefix and nextNumber to create the invoiceId
      const newInvoiceId = `${prefix}${nextNumber}`;
      setInvoiceId(newInvoiceId); // Update the controlled value
    }
    // Close the dialog after saving
    handleCloseDialog();
  };

  useEffect(() => {
    setFormValues(cashierValues);
  }, [cashierValues]);

  const addNextInvoiceHandler = () => {
    dispatch(
      reviewInvoicePopup({
        isOpen: false
      })
    );
  };

  const handleChangeCashierDetails = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSaveCashierDetails = () => {
    setEditMode(false);
    setFieldValue('cashierInfo', formValues);
  };

  const handleEditCashierDetails = () => {
    setEditMode(true);
  };

  useEffect(() => {
    setCashierValues(values?.cashierInfo || {});
  }, []);

  const defaultHeader = useMemo(() => {
    console.log('🚀 ~ defaultHeader ~ settings:', settings);

    let header;
    header = [
      {
        name: 'itemName',
        label: 'Item',
        type: 'text'
      },
      {
        name: 'rate',
        label: 'Rate',
        type: 'number'
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number'
      }
    ];

    if (settings?.tax?.apply === TAX_TYPE.INDIVIDUAL) {
      header.push({ name: 'code', label: 'HSN Code', type: 'string' });
      header.push({ name: 'tax', label: 'Tax (%)', type: 'number' });
    }

    if (settings?.discount?.apply === TAX_TYPE.INDIVIDUAL) {
      header.push({
        name: 'discount',
        label: getDiscountLabel(settings?.discount),
        type: 'text'
      });
    }

    if (settings?.tax?.apply === TAX_TYPE.INDIVIDUAL) {
      header.push({
        name: 'taxAmount',
        label: 'Tax Amount',
        type: 'label'
      });
    }

    if (settings?.discount?.apply === TAX_TYPE.INDIVIDUAL) {
      header.push({
        name: 'discountAmount',
        label: 'Discount Amount',
        type: 'label'
      });
    }

    header.push({
      name: 'amount',
      label: 'Amount',
      type: 'number'
    });

    return header;
  }, [settings]);
  console.log(`🚀 ~ defaultHeader ~ defaultHeader:`, defaultHeader);

  // Update Formik initialValues manually based on settings
  useEffect(() => {
    if (!dialogOpen) {
      setLoadingTable(true); // Set loading to true while waiting for initial values

      setFormikInitialValues(getInitialValues(settings));

      setLoadingTable(false); // Set loading to false when initial values are ready
    }
  }, [settings]);

  console.log('loadingTable = ', loadingTable);

  useEffect(() => {
    const subTotal = values.subTotal;
    const taxType = settings?.tax?.apply;
    const groupTax = values.groupTax;
    const discountAmount = values.groupDiscount || 0;

    const subTotalDiscount = Number(values.invoice_detail.reduce((acc, curr) => acc + Number(curr.discountAmount), 0)) || 0;
    const subTotalTax = Number(values.invoice_detail.reduce((acc, curr) => acc + Number(curr.taxAmount), 0)) || 0;

    console.log({ subTotal, taxType, groupTax, discountAmount, subTotalDiscount, subTotalTax });

    let taxAmount = 0;

    if (taxType === TAX_TYPE.GROUP) {
      taxAmount = (groupTax * subTotal) / 100;
      console.log({ taxAmount });
      setFieldValue('groupTaxAmount', taxAmount);
      const total = subTotal + taxAmount - discountAmount;
      // const total = subTotal + taxAmount - discountAmount - subTotalDiscount;

      console.log({ taxAmount, total });
      // setFieldValue('total', total);
    }
  }, [values.groupTax, setFieldValue, values.subTotal, values.groupDiscountAmount, settings?.tax?.apply]);

  useEffect(() => {
    const subTotal = values.subTotal;
    const discountType = settings?.discount?.apply;
    const discountBy = settings?.discount?.by;
    const discountAmount = values?.groupDiscount || 0;
    const groupTaxAmount = values.groupTaxAmount;

    let discountAmountValue = 0;

    if (discountType === DISCOUNT_TYPE.GROUP) {
      if (discountBy === DISCOUNT_BY.AMOUNT) {
        discountAmountValue = discountAmount;
      } else if (discountBy === DISCOUNT_BY.PERCENTAGE) {
        discountAmountValue = (discountAmount * subTotal) / 100;
      } else {
        discountAmountValue = 0;
      }

      setFieldValue('groupDiscountAmount', discountAmountValue);

      const total = subTotal + groupTaxAmount - discountAmountValue;

      console.log({ subTotal, discountType, discountBy, discountAmountValue, groupTaxAmount, total });

      // setFieldValue('total', total);
    }
  }, [values.groupDiscount, setFieldValue, values.subTotal, values.groupTaxAmount, settings?.discount?.apply, settings?.discount?.by]);

  useEffect(() => {
    console.log('values.invoice_detail = ', values.invoice_detail);
    const subTotal = values.invoice_detail.reduce((acc, curr) => acc + curr.amount, 0);
    const subTotalDiscount = Number(values.invoice_detail.reduce((acc, curr) => acc + Number(curr.discountAmount), 0)) || 0;
    const subTotalTax = Number(values.invoice_detail.reduce((acc, curr) => acc + Number(curr.taxAmount), 0)) || 0;

    const taxType = settings?.tax?.apply;
    const discountType = settings?.discount?.apply;
    const discountBy = settings?.discount?.by;

    let taxAmount = 0;
    let discountAmount = 0;

    if (taxType === TAX_TYPE.INDIVIDUAL) {
      taxAmount = subTotalTax;
      setFieldValue('groupTaxAmount', taxAmount);
    }

    if (discountType === DISCOUNT_TYPE.INDIVIDUAL) {
      discountAmount = subTotalDiscount;
      setFieldValue('groupDiscountAmount', discountAmount);
    } else if (discountType === DISCOUNT_TYPE.GROUP) {
      discountAmount = subTotalDiscount;
    } else {
      discountAmount = 0;
    }

    const total = subTotal + taxAmount - discountAmount;
    console.log({ subTotal, subTotalDiscount, subTotalTax, taxAmount, discountAmount, total });
    setFieldValue('subTotal', subTotal);
    // setFieldValue('total', total);

    console.log({ subTotal, subTotalDiscount, subTotalTax });
  }, [values.invoice_detail, setFieldValue, settings?.tax?.apply, settings?.discount?.apply, settings?.discount?.by]);

  useEffect(() => {
    const tax = values.groupTaxAmount;
    const discount = values.groupDiscountAmount;
    const subTotal = values.subTotal;
    const total = subTotal + tax - discount;

    setFieldValue('total', total);
  }, [values.groupTaxAmount, values.groupDiscountAmount, values.subTotal, setFieldValue]);

  const handleSelectChange = async (event) => {
    try {
      const selectedType = event.target.value;
      console.log('handleSelectChange', selectedType);
      setParticularType(selectedType);

      const startDate = values.start_date;
      const endDate = values.end_date;
      const companyID = values.customerInfo._id;
      console.log({ startDate, endDate, companyID });

      const payload = {
        data: {
          startDate: formatDateUsingMoment(values.start_date, 'YYYY-MM-DD'),
          endDate: formatDateUsingMoment(values.end_date, 'YYYY-MM-DD'),
          companyID,
          invoiceType: selectedType
        }
      };

      console.log('payload = ', payload);

      setLoadingTable(true);

      const response = await axios.post('/invoice/details', payload);
      console.log(`🚀 ~ handleSelectChange ~ response:`, response);

      setLoadingTable(false);
      if (response.status === 200) {
        console.log('Data = ', response.data.data);

        const apiData = response.data.data;

        if (apiData.length > 0) {
          const initialItem = formik.initialValues.invoice_detail[0];

          const newItems = apiData.map((item) => {
            return {
              ...initialItem,
              itemName: item.itemName,
              rate: item.vehicleRate,
              quantity: item.totalTrip,
              amount: item.vehicleRate * item.totalTrip
            };
          });

          console.log(`🚀 ~ newItems ~ newItems:`, newItems);

          formik.setFieldValue('invoice_detail', newItems);
        }
      }
    } catch (error) {
      console.log('Error : api of particular type', error);
    }
  };

  return (
    <>
      {dialogOpen && (
        <>
          <Dialog open={dialogOpen} maxWidth="sm" fullWidth keepMounted scroll="paper">
            <InvoiceSetting redirect="/apps/invoices/create" onClose={handleDialogSave} />
          </Dialog>
        </>
      )}

      {showCreatePage && (
        <MainCard>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit} noValidate>
              <Grid container spacing={2}>
                {/* Invoice Id */}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice Id</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        required
                        name="invoice_id"
                        id="invoice_id"
                        value={invoiceId} // Controlled value
                        onChange={handleInvoiceIdChange}
                        InputProps={{
                          readOnly: selectedOption === 'auto', // Editable only if 'manual' is selected
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleSettingClick} size="small">
                                <Setting color="rgb(91,107,121)" />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          borderColor: isEditable ? 'primary.main' : 'default',
                          '& .MuiOutlinedInput-root': {
                            '& input': {
                              padding: '8px'
                            },
                            '& fieldset': {
                              borderColor: isEditable ? 'primary.main' : 'default'
                            },
                            '&:hover fieldset': {
                              borderColor: isEditable ? 'primary.main' : 'default'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
                      />
                    </FormControl>
                  </Stack>

                  {/* Dialog for pop-up (Invoice Id)*/}
                  <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                      style: {
                        maxHeight: '80vh',
                        minHeight: '40vh',
                        width: '600px',
                        maxWidth: '90%'
                      }
                    }}
                  >
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Configure Invoice Number Preferences</DialogTitle>
                    <DialogContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Are you sure about changing this setting?
                      </Typography>
                      <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                        <FormControlLabel
                          value="auto"
                          control={<Radio />}
                          label="Continue auto-generating invoice numbers"
                          sx={{
                            backgroundColor: selectedOption === 'auto' ? '#e3f2fd' : 'transparent',
                            borderRadius: '8px',
                            padding: '8px',
                            transition: 'background-color 0.3s'
                          }}
                        />
                        {selectedOption === 'auto' && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '16px',
                              marginTop: '8px'
                            }}
                          >
                            <TextField
                              label="Prefix"
                              value={prefix}
                              variant="standard"
                              onChange={(e) => setPrefix(e.target.value)}
                              fullWidth
                              margin="dense"
                            />
                            <TextField
                              label="Next Number"
                              value={nextNumber}
                              variant="standard"
                              onChange={(e) => setNextNumber(e.target.value)}
                              fullWidth
                              margin="dense"
                            />
                          </div>
                        )}
                        <FormControlLabel
                          value="manual"
                          control={<Radio />}
                          label="Enter invoice numbers manually"
                          sx={{
                            backgroundColor: selectedOption === 'manual' ? '#e3f2fd' : 'transparent',
                            borderRadius: '8px',
                            padding: '8px',
                            transition: 'background-color 0.3s'
                          }}
                        />
                      </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" variant="contained" onClick={handleSave}>
                        Save
                      </Button>
                      <Button onClick={handleCloseDialog} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Status</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <Select
                        value={values.status}
                        displayEmpty
                        name="status"
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <Box sx={{ color: 'secondary.400' }}>Select status</Box>;
                          }
                          return selected;
                          // return selected.join(', ');
                        }}
                        onChange={handleChange}
                        error={Boolean(errors.status && touched.status)}
                        sx={{
                          '& .MuiSelect-select': {
                            padding: '8px'
                          }
                        }}
                      >
                        <MenuItem disabled value="">
                          Select status
                        </MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  {touched.status && errors.status && <FormHelperText error={true}>{errors.status}</FormHelperText>}
                </Grid>

                {/* Invoice Date */}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.date && errors.date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.date}
                          onChange={(newValue) => setFieldValue('date', newValue)}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.date && errors.date && <FormHelperText error={true}>{errors.date}</FormHelperText>}
                </Grid>

                {/* Invoice Due Date */}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice Due Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.due_date && errors.due_date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.due_date}
                          onChange={(newValue) => setFieldValue('due_date', newValue)}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.due_date && errors.due_date && <FormHelperText error={true}>{errors.due_date}</FormHelperText>}
                </Grid>

                <Grid item xs={12} sm={6} md={3}></Grid>
                <Grid item xs={12} sm={6} md={3}></Grid>

                {/* Start Date */}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Start Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.start_date && errors.start_date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.start_date}
                          onChange={(newValue) => setFieldValue('start_date', newValue)}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.start_date && errors.start_date && <FormHelperText error={true}>{errors.start_date}</FormHelperText>}
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>End Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.end_date && errors.end_date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={values.end_date}
                          onChange={(newValue) => setFieldValue('end_date', newValue)}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.end_date && errors.end_date && <FormHelperText error={true}>{errors.end_date}</FormHelperText>}
                </Grid>

                {/* Bill by */}
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">Billed By:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            {editMode ? (
                              <>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <TextField
                                      label="Company Name"
                                      value={formValues.company_name}
                                      name="company_name"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      label="Address"
                                      value={formValues.address}
                                      name="address"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <TextField
                                      label="City"
                                      value={formValues.city}
                                      name="city"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      label="State"
                                      value={formValues.state}
                                      name="state"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <TextField
                                      label="Postal Code"
                                      value={formValues.postal_code}
                                      name="postal_code"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      label="GSTIN"
                                      value={formValues.GSTIN}
                                      name="GSTIN"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={6}>
                                    <TextField
                                      label="PAN"
                                      value={formValues.PAN}
                                      name="PAN"
                                      onChange={handleChangeCashierDetails}
                                      fullWidth
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </>
                            ) : (
                              <>
                                <Typography variant="subtitle1">{formValues.company_name}</Typography>
                                <Typography color="secondary">
                                  {`${formValues.address}, ${formValues.city}, ${formValues.state}-${formValues.postal_code}`}
                                </Typography>
                                <Typography color="secondary">
                                  <strong>GSTIN:</strong> {formValues.GSTIN}
                                </Typography>
                                <Typography color="secondary">
                                  <strong>PAN:</strong> {formValues.PAN}
                                </Typography>
                              </>
                            )}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }} color="secondary.200">
                          {editMode ? (
                            <Button variant="outlined" color="secondary" onClick={handleSaveCashierDetails} size="small">
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              startIcon={<Edit />}
                              color="secondary"
                              onClick={handleEditCashierDetails}
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

                {/* Bill To */}
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">Billed To:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{values?.customerInfo?.company_name || ''}</Typography>
                            {values?.customerInfo?.address && (
                              <Typography color="secondary">
                                {values?.customerInfo?.address}
                                {values?.customerInfo?.city && `, ${values?.customerInfo?.city}`}
                                {values?.customerInfo?.state &&
                                  values?.customerInfo?.postal_code &&
                                  `, ${values?.customerInfo?.state}-${values?.customerInfo?.postal_code}`}
                              </Typography>
                            )}
                            {values?.customerInfo?.GSTIN && (
                              <Typography color="secondary">
                                <strong>GSTIN:</strong> {values?.customerInfo?.GSTIN}
                              </Typography>
                            )}
                            {values?.customerInfo?.PAN && (
                              <Typography color="secondary">
                                <strong>PAN:</strong> {values?.customerInfo?.PAN}
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign="right" color="secondary.200">
                          <Button
                            size="small"
                            startIcon={<Add />}
                            color="secondary"
                            variant="outlined"
                            onClick={() =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: true
                                })
                              )
                            }
                          >
                            Add
                          </Button>
                          <AddressModal
                            open={isCustomerOpen}
                            setOpen={(value) =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: value
                                })
                              )
                            }
                            handlerAddress={(value) => setFieldValue('customerInfo', value)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                  {touched.customerInfo && errors.customerInfo && (
                    <FormHelperText error={true}>{errors?.customerInfo?.name}</FormHelperText>
                  )}
                </Grid>

                {/* Details */}
                <Grid item xs={12}>
                  <Typography variant="h5">Detail</Typography>
                </Grid>

                {/* Particular Table (Invoice) */}
                {loadingTable ? (
                  <Grid item xs={12} sx={{ textAlign: 'center', height: '100px' }} alignContent={'center'}>
                    <CircularProgress size={30} />
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <FieldArray
                      name="invoice_detail"
                      render={({ remove, push }) => {
                        return (
                          <>
                            <TableContainer>
                              <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>#</TableCell>
                                    {/* <TableCell>Item</TableCell>
                                  <TableCell>Qty</TableCell>
                                  <TableCell>Rate</TableCell>
                                  <TableCell>Code</TableCell>
                                  <TableCell>Tax(%)</TableCell>
                                  <TableCell align="right">Tax Amount</TableCell>
                                  <TableCell align="right">Amount</TableCell> */}

                                    {defaultHeader.map((field, index) => (
                                      <TableCell key={index}>{field.label}</TableCell>
                                    ))}
                                    <TableCell align="right">Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {values.invoice_detail?.map((item, index) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{values.invoice_detail.indexOf(item) + 1}</TableCell>
                                      <InvoiceItem
                                        key={item.id}
                                        id={item.id}
                                        index={index}
                                        itemName={item.itemName}
                                        quantity={item.quantity}
                                        rate={item.rate}
                                        code={item.code}
                                        itemTax={item.itemTax}
                                        taxIndividual={settings?.tax?.apply === TAX_TYPE.INDIVIDUAL}
                                        discountIndividual={settings?.discount?.apply === DISCOUNT_TYPE.INDIVIDUAL}
                                        discountBy={settings?.discount?.by}
                                        itemDiscount={item.itemDiscount}
                                        settings={settings}
                                        onDeleteItem={(index) => remove(index)}
                                        onEditItem={handleChange}
                                        Blur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                      />
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <Divider />
                            {touched.invoice_detail && errors.invoice_detail && !Array.isArray(errors?.invoice_detail) && (
                              <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                                <FormHelperText error={true}>{errors.invoice_detail}</FormHelperText>
                              </Stack>
                            )}
                            <Grid container justifyContent="space-between">
                              {/* Left Side */}
                              <Grid item xs={12} md={8}>
                                <Stack direction="row" gap={2} sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                  <Button
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => push(getItem(settings))}
                                    variant="dashed"
                                    sx={{ bgcolor: 'transparent !important' }}
                                  >
                                    Add Item
                                  </Button>
                                  <Tooltip
                                    title={validateFields({
                                      start_date: values.start_date,
                                      end_date: values.end_date,
                                      company_name: values.customerInfo.company_name
                                    })}
                                  >
                                    <span>
                                      {/* <Button
                                        color="primary"
                                        startIcon={<Add />}
                                        onClick={() => push(getItem())}
                                        variant="dashed"
                                        sx={{ bgcolor: 'transparent !important' }}
                                        disabled={!(values.start_date && values.end_date && values.customerInfo.company_name)}
                                      >
                                        Add Item 2
                                      </Button> */}

                                      <GenericSelect
                                        label="Particular Type"
                                        name="particularType"
                                        options={optionsForParticularType}
                                        value={particularType}
                                        onChange={handleSelectChange}
                                        fullWidth
                                        disabled={
                                          !(
                                            validateFields({
                                              start_date: values.start_date,
                                              end_date: values.end_date,
                                              company_name: values.customerInfo.company_name
                                            }) === 'All fields are filled.'
                                          )
                                        }
                                      />
                                    </span>
                                  </Tooltip>
                                </Stack>
                              </Grid>

                              {/* Right Side */}
                              <Grid item xs={12} md={4}>
                                <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                                  {/* <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Discount(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      style={{ width: '100%' }}
                                      name="discount"
                                      id="discount"
                                      placeholder="0.0"
                                      value={values.discount}
                                      onChange={handleChange}
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          padding: '8px'
                                        }
                                      }}
                                    />
                                    {touched.discount && errors.discount && <FormHelperText error={true}>{errors.discount}</FormHelperText>}
                                  </Stack>
                                </Grid> */}

                                  {/* Tax Group */}
                                  {settings?.tax?.apply === TAX_TYPE.GROUP && (
                                    <Grid item xs={6}>
                                      <Stack spacing={1}>
                                        <InputLabel>Tax (%)</InputLabel>
                                        <TextField
                                          type="number"
                                          style={{ width: '100%' }}
                                          name="groupTax"
                                          id="groupTax"
                                          placeholder="0.0"
                                          value={values.groupTax}
                                          onChange={handleChange}
                                          onBlur={formik.handleBlur}
                                          error={formik.touched?.groupTax && !!formik.errors.groupTax}
                                          helperText={formik.touched?.groupTax && formik.errors?.groupTax}
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              padding: '8px'
                                            }
                                          }}
                                        />
                                        {/* {touched.discount && errors.discount && (
                                        <FormHelperText error={true}>{errors.discount}</FormHelperText>
                                      )} */}
                                      </Stack>
                                    </Grid>
                                  )}

                                  {/* Discount Group */}
                                  {settings?.discount?.apply === DISCOUNT_TYPE.GROUP && (
                                    <Grid item xs={6}>
                                      <Stack spacing={1}>
                                        {/* <InputLabel>Discount (%)</InputLabel> */}
                                        <InputLabel>{getDiscountLabel(settings?.discount)}</InputLabel>
                                        <TextField
                                          type="number"
                                          style={{ width: '100%' }}
                                          name="groupDiscount"
                                          id="groupDiscount"
                                          placeholder="0.0"
                                          value={values.groupDiscount}
                                          onChange={handleChange}
                                          onBlur={formik.handleBlur}
                                          error={formik.touched?.groupDiscount && !!formik.errors?.groupDiscount}
                                          helperText={formik.touched?.groupDiscount && formik.errors?.groupDiscount}
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              padding: '8px'
                                            }
                                          }}
                                        />
                                        {/* {touched.discount && errors.discount && (
                                        <FormHelperText error={true}>{errors.discount}</FormHelperText>
                                      )} */}
                                      </Stack>
                                    </Grid>
                                  )}
                                  {/* <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Tax(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      style={{ width: '100%' }}
                                      name="tax"
                                      id="tax"
                                      placeholder="0.0"
                                      value={values.tax}
                                      onChange={handleChange}
                                    />
                                    {touched.tax && errors.tax && <FormHelperText error={true}>{errors.tax}</FormHelperText>}
                                  </Stack>
                                </Grid> */}
                                </Grid>
                                <Grid item xs={12}>
                                  <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography color={theme.palette.secondary.main}>Sub Total:</Typography>
                                      {/* <Typography>{country?.prefix + '' + formik.values.subTotal?.toFixed(2)}</Typography> */}

                                      <GenericPriceDisplay
                                        total={formik.values?.subTotal}
                                        roundOff={settings.roundOff}
                                        prefix={country?.prefix}
                                      />
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography color={theme.palette.secondary.main}>Tax:</Typography>
                                      {/* <Typography>{country?.prefix + '' + formik.values?.groupTaxAmount?.toFixed(2) || 0}</Typography> */}
                                      <GenericPriceDisplay
                                        total={formik.values?.groupTaxAmount}
                                        roundOff={settings.roundOff}
                                        prefix={country?.prefix}
                                      />
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography color={theme.palette.secondary.main}>Discount:</Typography>
                                      {/* <Typography>{country?.prefix + '' + formik.values?.groupDiscountAmount?.toFixed(2) || 0}</Typography> */}
                                      <GenericPriceDisplay
                                        total={formik.values?.groupDiscountAmount}
                                        roundOff={settings.roundOff}
                                        prefix={country?.prefix}
                                      />
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="subtitle1">Grand Total:</Typography>
                                      {/* <Typography variant="subtitle1">
                                        {settings.roundOff === STATUS.NO
                                          ? country?.prefix + '' + formik.values?.total?.toFixed(2) || 0
                                          : country?.prefix + '' + Math.ceil(formik.values.total) || 0}
                                      </Typography> */}
                                      <GenericPriceDisplay
                                        total={formik.values?.total}
                                        roundOff={settings.roundOff}
                                        prefix={country?.prefix}
                                        variant="subtitle1" // Optional
                                      />
                                    </Stack>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        );
                      }}
                    />
                  </Grid>
                )}

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {/* Bank Details Section */}
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Stack spacing={2}>
                            {/* Header with Alignment */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="h5">Bank Details:</Typography>
                              <Button variant="outlined" startIcon={<Edit />} color="secondary" onClick={handleBankDetailsEditToggle}>
                                {isBankDetailsEditing ? 'Save' : 'Change'}
                              </Button>
                            </Stack>

                            {/* Bank Details Fields */}
                            {isBankDetailsEditing ? (
                              <Grid container spacing={2}>
                                {/* Account Holder Name */}
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    label="Account Holder Name"
                                    variant="outlined"
                                    fullWidth
                                    value={values.bank_details?.accountHolderName || ''}
                                    onChange={(e) => setFieldValue('bank_details.accountHolderName', e.target.value)}
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        padding: '8px',
                                        height: '2.5em',
                                        boxSizing: 'border-box'
                                      },
                                      '& .MuiInputLabel-root': {
                                        top: '-1px',
                                        transform: 'translate(14px, 12px) scale(1)'
                                      },
                                      '& .MuiInputLabel-shrink': {
                                        transform: 'translate(14px, -6px) scale(0.75)'
                                      }
                                    }}
                                    placeholder="Enter account holder name"
                                  />
                                </Grid>

                                {/* Account Number */}
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    label="Account Number"
                                    variant="outlined"
                                    fullWidth
                                    value={values.bank_details?.accountNumber || ''}
                                    onChange={(e) => setFieldValue('bank_details.accountNumber', e.target.value)}
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        padding: '8px',
                                        height: '2.5em',
                                        boxSizing: 'border-box'
                                      },
                                      '& .MuiInputLabel-root': {
                                        top: '-1px',
                                        transform: 'translate(14px, 12px) scale(1)'
                                      },
                                      '& .MuiInputLabel-shrink': {
                                        transform: 'translate(14px, -6px) scale(0.75)'
                                      }
                                    }}
                                    placeholder="Enter account number"
                                  />
                                </Grid>

                                {/* IFSC Code */}
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    label="IFSC Code"
                                    variant="outlined"
                                    fullWidth
                                    value={values.bank_details?.IFSCCode || ''}
                                    onChange={(e) => setFieldValue('bank_details.IFSCCode', e.target.value)}
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        padding: '8px',
                                        height: '2.5em',
                                        boxSizing: 'border-box'
                                      },
                                      '& .MuiInputLabel-root': {
                                        top: '-1px',
                                        transform: 'translate(14px, 12px) scale(1)'
                                      },
                                      '& .MuiInputLabel-shrink': {
                                        transform: 'translate(14px, -6px) scale(0.75)'
                                      }
                                    }}
                                    placeholder="Enter IFSC code"
                                  />
                                </Grid>

                                {/* Bank Name */}
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    label="Bank Name"
                                    variant="outlined"
                                    fullWidth
                                    value={values.bank_details?.bankName || ''}
                                    onChange={(e) => setFieldValue('bank_details.bankName', e.target.value)}
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        padding: '8px',
                                        height: '2.5em',
                                        boxSizing: 'border-box'
                                      },
                                      '& .MuiInputLabel-root': {
                                        top: '-1px',
                                        transform: 'translate(14px, 12px) scale(1)'
                                      },
                                      '& .MuiInputLabel-shrink': {
                                        transform: 'translate(14px, -6px) scale(0.75)'
                                      }
                                    }}
                                    placeholder="Enter bank name"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Stack spacing={2}>
                                {/* Display Account Holder Name */}
                                <Typography variant="body1">
                                  <strong>Account Holder Name:</strong> {values.bank_details?.accountHolderName || 'N/A'}
                                </Typography>

                                {/* Display Account Number */}
                                <Typography variant="body1">
                                  <strong>Account Number:</strong> {values.bank_details?.accountNumber || 'N/A'}
                                </Typography>

                                {/* Display IFSC Code */}
                                <Typography variant="body1">
                                  <strong>IFSC Code:</strong> {values.bank_details?.IFSCCode || 'N/A'}
                                </Typography>

                                {/* Display Bank Name */}
                                <Typography variant="body1">
                                  <strong>Bank Name:</strong> {values.bank_details?.bankName || 'N/A'}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>

                  {/* Notes and Terms Section */}
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Stack spacing={2}>
                        {/* Notes Section */}
                        <Typography variant="h5">Notes:</Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          value={values?.notes || ''}
                          onChange={(e) => setFieldValue('notes', e.target.value)}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px'
                            }
                          }}
                          placeholder="Enter your notes here..."
                        />
                        {/* Terms and Conditions Section */}
                        <Typography variant="h5">Terms and Conditions:</Typography>
                        <TextField
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          value={values?.terms || ''}
                          onChange={(e) => setFieldValue('terms', e.target.value)}
                          sx={{
                            '& .MuiInputBase-input': {
                              padding: '8px'
                            }
                          }}
                          placeholder="Enter terms and conditions here..."
                        />
                      </Stack>
                    </MainCard>
                  </Grid>
                </Grid>

                {/* Set Currency */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>Set Currency*</InputLabel>
                    <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                      <Autocomplete
                        id="country-select-demo"
                        fullWidth
                        options={countries}
                        defaultValue={countries[2]}
                        value={countries.find((option) => option.code === country?.code)}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '8px'
                          }
                        }}
                        onChange={(event, value) => {
                          dispatch(
                            selectCountry({
                              country: value
                            })
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.code && (
                              <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                alt=""
                              />
                            )}
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => {
                          const selected = countries.find((option) => option.code === country?.code);
                          return (
                            <TextField
                              {...params}
                              name="phoneCode"
                              placeholder="Select"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    {selected && selected.code !== '' && (
                                      <img
                                        style={{ marginRight: 6 }}
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png 2x`}
                                        alt=""
                                      />
                                    )}
                                  </>
                                )
                              }}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={values.status === '' || !isValid}
                      sx={{ color: 'secondary.dark' }}
                      onClick={() =>
                        dispatch(
                          reviewInvoicePopup({
                            isOpen: true
                          })
                        )
                      }
                    >
                      Preview
                    </Button>
                    {/* save data to database */}
                    {/* <Button variant="outlined" color="secondary" sx={{ color: 'secondary.dark' }}>
                      Create
                    </Button> */}
                    {/* send mail */}
                    <Button color="primary" variant="contained" type="submit">
                      Create & Send
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </MainCard>
      )}
    </>
  );
};

export default Create1;

const GenericPriceDisplay = ({ total, roundOff, prefix, variant }) => {
  return (
    <Typography {...(variant && { variant })}>
      {roundOff === STATUS.NO ? prefix + total?.toFixed(2) || 0 : prefix + Math.ceil(total) || 0}
    </Typography>
  );
};

function validateFields(fields) {
  const missingFields = [];

  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      missingFields.push(key);
    }
  }

  if (missingFields.length === 0) {
    return 'All fields are filled.';
  }

  const lastField = missingFields.pop();
  const formattedMessage =
    missingFields.length > 0 ? `Please fill ${missingFields.join(', ')} and ${lastField} fields.` : `Please fill ${lastField} field.`;

  return formattedMessage;
}
