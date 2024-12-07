import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  IconButton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
import { FieldArray, Form, Formik, useFormik, FormikProvider } from 'formik';
import * as yup from 'yup';

// project-imports
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';
import AddressModal from 'sections/apps/invoice/AddressModal';

import {
  reviewInvoicePopup,
  customerPopup,
  toggleCustomerPopup,
  selectCountry,
  getInvoiceSingleList,
  getInvoiceUpdate
} from 'store/reducers/invoice';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { Add, Edit, Trash } from 'iconsax-react';
import axiosServices from 'utils/axios';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { USERTYPE } from 'constant';
import { DISCOUNT_TYPE, GenericPriceDisplay, getDiscountLabel, item } from '../create/Create2';
import { TAX_TYPE } from 'pages/setting/invoice';
import { DISCOUNT_BY } from 'pages/setting/invoice/constant';
import { formatDateUsingMoment } from 'utils/helper';

const FAKE_RESPONSE = {
  statusCode: 200,
  data: {
    billedTo: {
      _id: '66ea71aad326be54846fdecf',
      company_name: 'Delta X',
      contact_person: 'João Souza Silva',
      company_email: 'test@example.dc',
      mobile: '9953595785',
      PAN: 'ABNDI1234G',
      GSTIN: '22LABEA7825A1Z6',
      postal_code: '940432',
      address: '1600 Fake Street',
      state: 'CA'
    },
    billedBy: {
      cabProviderLegalName: 'Aryan Kumar 25',
      PAN: 'ABCTY1234D',
      GSTIN: '22AAAAA0000A1Z5',
      contactPersonName: 'Suresh Yadav',
      workEmail: 'amit.kanaujiya@techplek.in',
      workMobileNumber: 9988776655,
      officeAddress: 'NSP Pitampura Delhi',
      officePinCode: '110035',
      officeState: 'Delhi'
    },
    bankDetails: {
      bankName: 'Delhi',
      accountHolderName: 'Aryan Kumar 25',
      accountNumber: 9988776655,
      IFSC_code: null
    },
    settings: {
      discount: {
        apply: 'Group',
        by: 'Amount'
      },
      tax: {
        apply: 'Group'
      }
    },
    _id: '674d487e6f740c8c8681a295',
    companyId: '66ea71aad326be54846fdecf',
    cabProviderId: '667944fed9d64e642ebf93c2',
    vendorId: null,
    driverId: null,
    invoiceNumber: 'DC-1',
    invoiceDate: '2024-11-02T00:00:00.000Z',
    servicePeriod: '01-11-2024 to 01-12-2024',
    HSN_SAC_Code: null,
    dueDate: '2024-12-03T00:00:00.000Z',
    invoiceData: [
      {
        itemName: 'IE1',
        rate: '200',
        quantity: '10',
        HSN_SAC_code: 'CO1',
        itemTax: '20',
        Tax_amount: 400,
        itemDiscount: '200',
        discount: 200,
        amount: 2000,
        _id: '674d487e6f740c8c8681a296'
      },
      {
        itemName: 'IE2',
        rate: '500',
        quantity: '20',
        HSN_SAC_code: 'CO2',
        itemTax: '20',
        Tax_amount: 2000,
        itemDiscount: '200',
        discount: 200,
        amount: 10000,
        _id: '674d487e6f740c8c8681a297'
      }
    ],
    MCDAmount: 0,
    tollParkingCharges: 0,
    penalty: 0,
    totalAmount: 14000,
    CGST: 0,
    SGST: 0,
    IGST: 0,
    grandTotal: 14000,
    status: 1,
    totalTax: 0,
    totalDiscount: 0,
    terms: ['S'],
    linkedTripIds: [],
    createdAt: '2024-12-02T05:41:18.941Z',
    updatedAt: '2024-12-02T05:41:18.941Z',
    __v: 0
  },
  message: 'Invoice data',
  success: true
};

const getInitialValues = (data) => {
  console.log('data', data);

  const servicePeriod =
    data &&
    data.servicePeriod
      .split('to')
      .map((date) => date.trim())
      .map((date) => {
        const [day, month, year] = date.split('-'); // Split the date string
        return `${year}-${month}-${day}`; // Rearrange the parts
      });
  console.log('servicePeriod', servicePeriod);

  let start_date = null;
  let end_date = null;
  if (Array.isArray(servicePeriod)) {
    console.log({ i: servicePeriod[0], j: servicePeriod[1] });
    start_date = new Date(servicePeriod[0]);
    console.log(`🚀 ~ getInitialValues ~ start_date:`, start_date);

    end_date = new Date(servicePeriod[1]);
  }
  console.log('start_date, end_date', start_date, end_date);
  return {
    _id: data?._id || null,
    invoiceNumber: data?.invoiceNumber || '',
    invoiceDate: data?.invoiceDate ? new Date(data?.invoiceDate) : null || null,
    dueDate: data?.dueDate ? new Date(data?.dueDate) : null || null,
    start_date: start_date ? new Date(start_date) : null || null,
    end_date: end_date ? new Date(end_date) : null || null,
    MCDAmount: data?.MCDAmount || 0,
    tollParkingCharges: data?.tollParkingCharges || 0,
    penalty: data?.penalty || 0,
    totalAmount: 14000,
    CGST: data?.CGST || 0,
    SGST: data?.SGST || 0,
    IGST: data?.IGST || 0,
    // grandTotal: 14000,
    status: 1,
    totalTax: data?.totalTax || 0,
    totalDiscount: data?.totalDiscount || 0,
    terms: data?.terms || ['S'],
    linkedTripIds: data?.linkedTripIds || [],

    billedBy: {
      cabProviderLegalName: data?.billedBy?.cabProviderLegalName || '',
      PAN: data?.billedBy?.PAN || '',
      GSTIN: data?.billedBy?.GSTIN || '',
      contactPersonName: data?.billedBy?.contactPersonName || '',
      workEmail: data?.billedBy?.workEmail || '',
      workMobileNumber: data?.billedBy?.workMobileNumber || 0,
      officeAddress: data?.billedBy?.officeAddress || '',
      officePinCode: data?.billedBy?.officePinCode || '',
      officeState: data?.billedBy?.officeState || ''
    },

    billedTo: {
      _id: data?.billedTo?._id || null,
      company_name: data?.billedTo?.company_name || '',
      contact_person: data?.billedTo?.contact_person || '',
      company_email: data?.billedTo?.company_email || '',
      mobile: data?.billedTo?.mobile || '',
      PAN: data?.billedTo?.PAN || '',
      GSTIN: data?.billedTo?.GSTIN || '',
      postal_code: data?.billedTo?.postal_code || '',
      address: data?.billedTo?.address || '',
      state: data?.billedTo?.state || ''
    },

    bankDetails: {
      bankName: data?.bankDetails?.bankName || '',
      accountNumber: data?.bankDetails?.accountNumber || '',
      IFSC_code: data?.bankDetails?.IFSC_code || '',
      accountHolderName: data?.bankDetails?.accountHolderName || ''
    },

    settings: {
      discount: {
        apply: data?.settings?.discount?.apply || 'Group',
        by: data?.settings?.discount?.by || 'Amount'
      },
      tax: {
        apply: data?.settings?.tax?.apply || 'Group'
      }
    },

    invoiceData: data?.invoiceData || []
  };
};

const calculateTotals = (invoiceData) => {
  const subTotal = invoiceData.reduce((sum, item) => sum + item.amount, 0);
  const totalTaxAmount = invoiceData.reduce((sum, item) => sum + item.Tax_amount, 0);
  const totalDiscountAmount = invoiceData.reduce((sum, item) => sum + item.discount, 0);
  const grandTotal = subTotal + totalTaxAmount - totalDiscountAmount;

  return { subTotal, totalTaxAmount, totalDiscountAmount, grandTotal };
};

// ==============================|| INVOICE - EDIT ||============================== //

const InvoiceEdit = () => {
  console.log('InvoiceEdit Rendered');

  const theme = useTheme();

  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cashierValues, setCashierValues] = useState({});
  const [formValues, setFormValues] = useState(cashierValues || {});
  const [editMode, setEditMode] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false); // New state for table loading
  const [isBankDetailsEditing, setIsBankDetailsEditing] = useState(false);
  const [settings, setSettings] = useState({});
  const [groupTax, setGroupTax] = useState(0);
  const [groupDiscount, setGroupDiscount] = useState(0);

  const [formikInitialValues, setFormikInitialValues] = useState(getInitialValues(invoiceDetails)); // NEW

  const [groupBy, setGroupBy] = useState('companyRate');

  const userType = useSelector((state) => state.auth.userType);
  const { isCustomerOpen, countries, country, lists, isOpen } = useSelector((state) => state.invoice);

  useEffect(() => {
    console.log(id);

    if (id) {
      (async () => {
        try {
          setLoading(true);

          const response = await axiosServices.get(`/invoice/by?invoiceId=${id}`);
          console.log('response', response);
          setInvoiceDetails(response.data.data);

          setFormikInitialValues(getInitialValues(response.data.data));
          setCashierValues(response.data.data.billedBy);
          setFormValues(response.data.data.billedBy);
          setSettings(response.data.data.settings);

          if (response.data.data.settings.tax.apply === TAX_TYPE.GROUP) {
            const taxVal = response.data.data.invoiceData[0].itemTax;
            setGroupTax(taxVal);
          }

          if (response.data.data.settings.discount.apply === DISCOUNT_TYPE.GROUP) {
            const discountVal = response.data.data.invoiceData[0].itemDiscount;
            setGroupDiscount(discountVal);
          }

          // FAKE RESPONSE
          // await new Promise((resolve) => setTimeout(resolve, 3000));
          // setInvoiceDetails(FAKE_RESPONSE.data);
          // setFormikInitialValues(getInitialValues(FAKE_RESPONSE.data));
          // setCashierValues(FAKE_RESPONSE.data.billedBy);
          // setFormValues(FAKE_RESPONSE.data.billedBy);
          // setSettings(FAKE_RESPONSE.data.settings);

          // if (FAKE_RESPONSE.data.settings.tax.apply === TAX_TYPE.GROUP) {
          //   const taxVal = FAKE_RESPONSE.data.invoiceData[0].itemTax;
          //   setGroupTax(taxVal);
          // }

          // if (FAKE_RESPONSE.data.settings.discount.apply === DISCOUNT_TYPE.GROUP) {
          //   const discountVal = FAKE_RESPONSE.data.invoiceData[0].itemDiscount;
          //   setGroupDiscount(discountVal);
          // }
        } catch (error) {
          console.log('error while fetching invoice details', error);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Error while fetching invoice details',
              variant: 'alert',
              alert: { color: 'error' },
              close: true
            })
          );
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const handleFormikSubmit = async (values, { resetForm }) => {
    try {
      alert('Updating Invoice');

      console.log('Formik submit', values);
      const cabProviderId = JSON.parse(localStorage.getItem('userInformation'))?.userId || '';
      const format = 'YYYY-MM-DD';

      if (!values?.billedTo?._id) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Please select company',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
        return;
      }

      const payload = {
        data: {
          _id: values?._id,
          companyId: values?.billedTo?._id || '',
          cabProviderId,
          invoiceNumber: values?.invoiceNumber || 0,
          invoiceDate: formatDateUsingMoment(values?.invoiceDate, format),
          dueDate: formatDateUsingMoment(values?.dueDate, format),
          servicePeriod:
            formatDateUsingMoment(values?.start_date, 'DD-MM-YYYY') + ' to ' + formatDateUsingMoment(values?.end_date, 'DD-MM-YYYY'),
          linkedTripIds: values?.tripIds || [],
          invoiceData: values?.invoiceData || [],
          // subTotal: values?.subTotal,
          // totalAmount: values?.grandTotal,
          // grandTotal: values?.grandTotal,
          subTotal: subTotal,
          totalAmount: grandTotal,
          grandTotal: grandTotal,
          CGST: values?.CGST,
          SGST: values?.SGST,
          IGST: values?.IGST,
          MCDAmount: values?.MCDAmount,
          tollParkingCharges: values?.tollParkingCharges,
          penalty: values?.penalty,
          terms: values?.terms,
          billedTo: values?.customerInfo,
          billedBy: values?.cashierInfo,
          bankDetails: values?.bank_details,
          settings: values?.settings
        }
      };

      console.log(payload);

      const response = await axiosServices.put(`/invoice/edit`, payload);

      console.log(`🚀 ~ handleFormikSubmit ~ response:`, response);
      if (response.status === 200) {
        dispatch(
          openSnackbar({
            open: true,
            message: `Invoice Updated successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );

        resetForm();
        navigate('/apps/invoices/list', {
          replace: true
        });
      }
    } catch (error) {
      console.log('error while updating invoice = ', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error while updating invoice',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: formikInitialValues,
    enableReinitialize: true,
    onSubmit: handleFormikSubmit
  });

  const { handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched } = formik;

  const handleSaveCashierDetails = () => {
    setEditMode(false);
    setFieldValue('cashierInfo', formValues);
  };

  const handleEditCashierDetails = () => {
    setEditMode(true);
  };

  const handleChangeCashierDetails = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleBankDetailsEditToggle = () => {
    setIsBankDetailsEditing(!isBankDetailsEditing);
  };

  const { subTotal, totalTaxAmount, totalDiscountAmount, grandTotal } = calculateTotals(formik.values.invoiceData);

  return (
    <>
      {loading ? (
        <CustomCircularLoader />
      ) : (
        <MainCard>
          <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Invoice Id */}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Stack spacing={1}>
                          <InputLabel>Invoice Id</InputLabel>
                          <Typography variant="subtitle1">#{values.invoiceNumber}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* Invoice Date */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                          <InputLabel>Invoice Date</InputLabel>
                          <FormControl sx={{ width: '100%' }} error={Boolean(touched.invoiceDate && errors.invoiceDate)}>
                            <DatePicker
                              format="dd/MM/yyyy"
                              value={values.invoiceDate}
                              onChange={(newValue) => setFieldValue('invoiceDate', newValue)}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '8px'
                                }
                              }}
                            />
                          </FormControl>
                        </Stack>
                        {touched.invoiceDate && errors.invoiceDate && <FormHelperText error={true}>{errors.invoiceDate}</FormHelperText>}
                      </Grid>

                      {/* Invoice Due Date */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                          <InputLabel>Invoice Due Date</InputLabel>
                          <FormControl sx={{ width: '100%' }} error={Boolean(touched.dueDate && errors.dueDate)}>
                            <DatePicker
                              format="dd/MM/yyyy"
                              value={values.dueDate}
                              onChange={(newValue) => setFieldValue('dueDate', newValue)}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '8px'
                                }
                              }}
                            />
                          </FormControl>
                        </Stack>
                        {touched.dueDate && errors.dueDate && <FormHelperText error={true}>{errors.dueDate}</FormHelperText>}
                      </Grid>

                      {/* Service Start Date */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                          <InputLabel>Service Start Date</InputLabel>
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

                      {/* Service End Date */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                          <InputLabel>Service End Date</InputLabel>
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
                    </Grid>
                  </Grid>

                  {/* Bill by */}
                  <Grid item xs={12} sm={6}>
                    <MainCard sx={{ minHeight: 168 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <Stack spacing={2}>
                            <Typography variant="h5">Billed By :</Typography>
                            <Stack sx={{ width: '100%' }}>
                              {editMode ? (
                                <>
                                  <Grid container spacing={2}>
                                    {/* Cab Provider Legal Name */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="Company Name"
                                        value={values.billedBy.cabProviderLegalName || 'N/A'}
                                        name="cabProviderLegalName"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.cabProviderLegalName', e.target.value)}
                                        fullWidth
                                        sx={{
                                          '& .MuiInputBase-input': {
                                            padding: '8px'
                                          }
                                        }}
                                      />
                                    </Grid>

                                    {/* Office Address */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="Address"
                                        value={values.billedBy.officeAddress || 'N/A'}
                                        name="officeAddress"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.officeAddress', e.target.value)}
                                        fullWidth
                                        sx={{
                                          '& .MuiInputBase-input': {
                                            padding: '8px'
                                          }
                                        }}
                                      />
                                    </Grid>

                                    {/* City */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="City"
                                        value={values.billedBy.city || 'N/A'}
                                        name="city"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.city', e.target.value)}
                                        fullWidth
                                        sx={{
                                          '& .MuiInputBase-input': {
                                            padding: '8px'
                                          }
                                        }}
                                      />
                                    </Grid>

                                    {/* Office State */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="State"
                                        value={values.billedBy.officeState || 'N/A'}
                                        name="officeState"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.officeState', e.target.value)}
                                        fullWidth
                                        sx={{
                                          '& .MuiInputBase-input': {
                                            padding: '8px'
                                          }
                                        }}
                                      />
                                    </Grid>

                                    {/* Postal Code */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="Postal Code"
                                        value={values.billedBy.officePinCode || 'N/A'}
                                        name="officePinCode"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.officePinCode', e.target.value)}
                                        fullWidth
                                        sx={{
                                          '& .MuiInputBase-input': {
                                            padding: '8px'
                                          }
                                        }}
                                      />
                                    </Grid>

                                    {/* GSTIN */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="GSTIN"
                                        value={values.billedBy.GSTIN || 'N/A'}
                                        name="GSTIN"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.GSTIN', e.target.value)}
                                        fullWidth
                                        sx={{
                                          '& .MuiInputBase-input': {
                                            padding: '8px'
                                          }
                                        }}
                                      />
                                    </Grid>

                                    {/* PAN */}
                                    <Grid item xs={6}>
                                      <TextField
                                        label="PAN"
                                        value={values.billedBy.PAN || 'N/A'}
                                        name="PAN"
                                        // onChange={handleChangeCashierDetails}
                                        onChange={(e) => setFieldValue('billedBy.PAN', e.target.value)}
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
                                  <Typography variant="subtitle1">{values.billedBy.cabProviderLegalName || 'N/A'}</Typography>
                                  <Typography color="secondary">
                                    {`${values.billedBy.officeAddress || 'N/A'}, ${values.billedBy.city || 'N/A'}, ${
                                      values.billedBy.officeState || 'N/A'
                                    }-${values.billedBy.officePinCode || 'N/A'}`}
                                  </Typography>
                                  <Typography color="secondary">
                                    <strong>GSTIN:</strong> {values.billedBy.GSTIN || 'N/A'}
                                  </Typography>
                                  <Typography color="secondary">
                                    <strong>PAN:</strong> {values.billedBy.PAN || 'N/A'}
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
                      {userType === USERTYPE.iscabProvider && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Stack spacing={2}>
                              <Typography variant="h5">Billed To :</Typography>
                              <Stack sx={{ width: '100%' }}>
                                <Typography variant="subtitle1">{values?.billedTo?.company_name || ''}</Typography>
                                {values?.billedTo?.address && (
                                  <Typography color="secondary">
                                    {values?.billedTo?.address}
                                    {values?.billedTo?.city && `, ${values?.billedTo?.city}`}
                                    {values?.billedTo?.state &&
                                      values?.billedTo?.postal_code &&
                                      `, ${values?.billedTo?.state}-${values?.billedTo?.postal_code}`}
                                  </Typography>
                                )}
                                {values?.billedTo?.GSTIN && (
                                  <Typography color="secondary">
                                    <strong>GSTIN:</strong> {values?.billedTo?.GSTIN}
                                  </Typography>
                                )}
                                {values?.billedTo?.PAN && (
                                  <Typography color="secondary">
                                    <strong>PAN:</strong> {values?.billedTo?.PAN}
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
                                handlerAddress={(value) => setFieldValue('billedTo', value)}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      )}
                    </MainCard>
                  </Grid>

                  {/* Details */}
                  <Grid item xs={12}>
                    <Typography variant="h5">Details</Typography>
                  </Grid>

                  {/* Table */}
                  {loadingTable ? (
                    <Grid item xs={12} sx={{ textAlign: 'center', height: '100px' }} alignContent={'center'}>
                      <CircularProgress size={30} />
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <FieldArray
                        name="invoiceData"
                        render={(arrayHelpers) => (
                          <>
                            <TableContainer component={Paper}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>HSN/SAC Code</TableCell>
                                    <TableCell>Tax (%)</TableCell>
                                    {values.settings?.discount?.apply !== DISCOUNT_TYPE.NO && (
                                      <TableCell>{getDiscountLabel(values.settings?.discount)}</TableCell>
                                    )}
                                    {/* Always show discount header */}
                                    <TableCell>Tax</TableCell>
                                    <TableCell>Discount</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Actions</TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {values.invoiceData?.map((item, index) => {
                                    console.log('item = ', item);

                                    return (
                                      <TableRow key={index}>
                                        {/* Item Name */}
                                        <TableCell>
                                          <TextField
                                            label="Item Name"
                                            name={`invoiceData[${index}].itemName`}
                                            value={item.itemName}
                                            onChange={handleChange}
                                            fullWidth
                                          />
                                        </TableCell>

                                        {/* Rate */}
                                        <TableCell>
                                          <TextField
                                            label="Rate"
                                            type="number"
                                            name={`invoiceData[${index}].rate`}
                                            value={item.rate}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                              const rateValue = e.target.value;
                                              console.log('rateValue = ', rateValue);

                                              const qty = formik.getFieldProps(`invoiceData[${index}].quantity`).value;
                                              const itemTax = formik.getFieldProps(`invoiceData[${index}].itemTax`).value;
                                              const itemDiscount = formik.getFieldProps(`invoiceData[${index}].itemDiscount`).value;
                                              const amount = rateValue * qty;

                                              const taxAmount =
                                                settings?.tax?.apply === 'Individual'
                                                  ? (amount * itemTax) / 100
                                                  : (amount * groupTax) / 100; // Apply groupTax for group settings

                                              setFieldValue(`invoiceData[${index}].rate`, Number(rateValue));
                                              setFieldValue(`invoiceData[${index}].Tax_amount`, Number(taxAmount));
                                              setFieldValue(`invoiceData[${index}].amount`, Number(amount));

                                              let itemDiscountAmount = 0;
                                              if (settings?.discount?.apply === 'Individual') {
                                                if (settings?.discount?.by === 'Percentage') {
                                                  itemDiscountAmount = (amount * itemDiscount) / 100;
                                                } else if (settings?.discount?.by === 'Amount') {
                                                  itemDiscountAmount = itemDiscount;
                                                }
                                              } else if (settings?.discount?.apply === 'Group') {
                                                if (settings?.discount?.by === 'Percentage') {
                                                  itemDiscountAmount = (amount * itemDiscount) / 100;
                                                } else if (settings?.discount?.by === 'Amount') {
                                                  itemDiscountAmount = itemDiscount;
                                                }
                                              }

                                              setFieldValue(`invoiceData[${index}].discount`, Number(itemDiscountAmount));
                                            }}
                                            fullWidth
                                          />
                                        </TableCell>

                                        {/* Quantity */}
                                        <TableCell>
                                          <TextField
                                            label="Quantity"
                                            type="number"
                                            name={`invoiceData[${index}].quantity`}
                                            value={item.quantity}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                              const qtyValue = e.target.value;
                                              const rate = formik.getFieldProps(`invoiceData[${index}].rate`).value;
                                              const itemTax = formik.getFieldProps(`invoiceData[${index}].itemTax`).value;
                                              const itemDiscount = formik.getFieldProps(`invoiceData[${index}].itemDiscount`).value;

                                              const amount = rate * qtyValue;
                                              const taxAmount =
                                                settings?.tax?.apply === 'Individual'
                                                  ? (amount * itemTax) / 100
                                                  : (amount * groupTax) / 100; // Apply groupTax for group settings

                                              setFieldValue(`invoiceData[${index}].quantity`, Number(qtyValue));
                                              setFieldValue(`invoiceData[${index}].Tax_amount`, Number(taxAmount));
                                              setFieldValue(`invoiceData[${index}].amount`, Number(amount));

                                              let itemDiscountAmount = 0;
                                              if (settings?.discount?.apply === 'Individual') {
                                                if (settings?.discount?.by === 'Percentage') {
                                                  itemDiscountAmount = (amount * itemDiscount) / 100;
                                                } else if (settings?.discount?.by === 'Amount') {
                                                  itemDiscountAmount = itemDiscount;
                                                }
                                              } else if (settings?.discount?.apply === 'Group') {
                                                if (settings?.discount?.by === 'Percentage') {
                                                  itemDiscountAmount = (amount * itemDiscount) / 100;
                                                } else if (settings?.discount?.by === 'Amount') {
                                                  itemDiscountAmount = itemDiscount;
                                                }
                                              }

                                              setFieldValue(`invoiceData[${index}].discount`, Number(itemDiscountAmount));
                                            }}
                                            fullWidth
                                          />
                                        </TableCell>

                                        {/* Code */}
                                        <TableCell>
                                          <TextField
                                            label="HSN/SAC Code"
                                            name={`invoiceData[${index}].HSN_SAC_code`} // HSN/SAC field
                                            value={item.HSN_SAC_code}
                                            onChange={handleChange}
                                            fullWidth
                                          />
                                        </TableCell>

                                        {/* Item Tax */}
                                        <TableCell>
                                          <TextField
                                            label="Tax (%)"
                                            type="number"
                                            name={`invoiceData[${index}].itemTax`} // Tax for individual items
                                            value={item.itemTax}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                              const taxValue = e.target.value;
                                              console.log('taxValue', taxValue);
                                              const rate = formik.getFieldProps(`invoiceData[${index}].rate`).value;
                                              const qty = formik.getFieldProps(`invoiceData[${index}].quantity`).value;
                                              const amount = rate * qty;
                                              const taxAmount =
                                                settings?.tax?.apply === 'Individual'
                                                  ? (amount * taxValue) / 100
                                                  : (amount * groupTax) / 100; // Apply groupTax for group settings
                                              setFieldValue(`invoiceData[${index}].itemTax`, Number(taxValue));
                                              setFieldValue(`invoiceData[${index}].Tax_amount`, Number(taxAmount));
                                            }}
                                            fullWidth
                                            disabled={settings?.tax?.apply === 'Group'} // Disable if tax applies at group level
                                          />
                                        </TableCell>

                                        {/* Item Discount */}
                                        {settings?.discount?.apply !== DISCOUNT_TYPE.NO && (
                                          <TableCell>
                                            <TextField
                                              // label="Discount (%)"
                                              label={getDiscountLabel(settings?.discount)}
                                              type="number"
                                              name={`invoiceData[${index}].itemDiscount`} // Discount for individual items
                                              value={item.itemDiscount}
                                              // onChange={handleChange}
                                              onChange={(e) => {
                                                const discountValue = e.target.value;
                                                let itemDiscountAmount = 0;

                                                const rate = formik.getFieldProps(`invoiceData[${index}].rate`).value;
                                                const qty = formik.getFieldProps(`invoiceData[${index}].quantity`).value;
                                                const amount = rate * qty;

                                                if (settings?.discount?.apply === 'Individual') {
                                                  if (settings?.discount?.by === 'Percentage') {
                                                    itemDiscountAmount = (amount * discountValue) / 100;
                                                  } else if (settings?.discount?.by === 'Amount') {
                                                    itemDiscountAmount = discountValue;
                                                  }
                                                } else if (settings?.discount?.apply === 'Group') {
                                                  if (settings?.discount?.by === 'Percentage') {
                                                    itemDiscountAmount = (amount * discountValue) / 100;
                                                  } else if (settings?.discount?.by === 'Amount') {
                                                    itemDiscountAmount = discountValue;
                                                  }
                                                }

                                                setFieldValue(`invoiceData[${index}].itemDiscount`, Number(discountValue));
                                                setFieldValue(`invoiceData[${index}].discount`, Number(itemDiscountAmount));
                                              }}
                                              fullWidth
                                              disabled={settings?.discount?.apply === 'Group'} // Disable if discount applies at group level
                                            />
                                          </TableCell>
                                        )}

                                        {/* Tax Amount */}
                                        <TableCell>
                                          <Typography variant="body1">{item.Tax_amount.toFixed(2)}</Typography>{' '}
                                        </TableCell>

                                        {/* Discount Amount */}
                                        <TableCell>
                                          <Typography variant="body1">{item.discount.toFixed(2)}</Typography>
                                        </TableCell>

                                        {/* Amount */}
                                        <TableCell>
                                          <Typography variant="body1">{item.amount.toFixed(2)}</Typography>
                                        </TableCell>

                                        {/* Delete */}
                                        <TableCell>
                                          <IconButton onClick={() => arrayHelpers.remove(index)} color="secondary">
                                            <Trash color="red" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>

                            <Divider />

                            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                              {/* Left Side */}
                              <Grid item xs={12} md={8}>
                                <Grid container gap={2}>
                                  <Grid item xs={12} md={2}>
                                    <Button
                                      color="primary"
                                      startIcon={<Add />}
                                      fullWidth
                                      onClick={() =>
                                        arrayHelpers.push({
                                          ...item,
                                          ...(settings?.tax?.apply === TAX_TYPE.GROUP
                                            ? {
                                                itemTax: groupTax
                                              }
                                            : {}),
                                          ...(settings?.discount?.apply === DISCOUNT_TYPE.GROUP &&
                                          settings?.discount?.by === DISCOUNT_BY.PERCENTAGE
                                            ? {
                                                itemDiscount: groupDiscount
                                              }
                                            : {}),
                                          ...(settings?.discount?.apply === DISCOUNT_TYPE.GROUP &&
                                          settings?.discount?.by === DISCOUNT_BY.AMOUNT
                                            ? {
                                                itemDiscount: groupDiscount,
                                                discount: groupDiscount
                                              }
                                            : {})
                                        })
                                      }
                                      variant="dashed"
                                      sx={{ bgcolor: 'transparent !important' }}
                                    >
                                      Add Item
                                    </Button>
                                  </Grid>
                                  {/* <Grid item xs={12} md={3}>
                                    <Tooltip
                                      title={validateFields({
                                        start_date: values.start_date,
                                        end_date: values.end_date,
                                        company_name: values.customerInfo.company_name
                                      })}
                                    >
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
                                    </Tooltip>
                                  </Grid> */}
                                </Grid>
                              </Grid>

                              {/* Right Side */}
                              <Grid item xs={12} md={4}>
                                <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                                  {/* Tax Group */}
                                  {settings?.tax?.apply === TAX_TYPE.GROUP && (
                                    <Grid item xs={6}>
                                      <Grid item xs={12}>
                                        <TextField
                                          label="Group Tax (%)"
                                          type="number"
                                          value={groupTax}
                                          onChange={(e) => {
                                            const val = Number(e.target.value);
                                            const data = formik.getFieldProps('invoiceData').value;
                                            console.log(`🚀 ~ Create2 ~ data:`, data);
                                            const updatedData = data.map((item) => {
                                              return {
                                                ...item,
                                                amount: item.rate * item.quantity,
                                                itemTax: val,
                                                Tax_amount: (item.rate * item.quantity * val) / 100
                                              };
                                            });
                                            formik.setFieldValue('invoiceData', updatedData);
                                            setGroupTax(val);
                                          }}
                                          fullWidth
                                        />
                                      </Grid>
                                    </Grid>
                                  )}

                                  {/* Discount Group */}
                                  {settings?.discount?.apply === DISCOUNT_TYPE.GROUP && (
                                    <Grid item xs={6}>
                                      <Grid item xs={12}>
                                        <TextField
                                          //   label="Group Discount (%)"
                                          label={getDiscountLabel(settings?.discount)}
                                          type="number"
                                          value={groupDiscount}
                                          // onChange={(e) => setGroupDiscount(Number(e.target.value))}
                                          onChange={(e) => {
                                            const val = Number(e.target.value);

                                            const data = formik.getFieldProps('invoiceData').value;

                                            const updatedData = data.map((item) => {
                                              const rate = item.rate;
                                              const qty = item.quantity;
                                              const amount = rate * qty;
                                              let itemDiscountAmount = 0;

                                              if (settings?.discount?.apply === 'Individual') {
                                                if (settings?.discount?.by === 'Percentage') {
                                                  itemDiscountAmount = (amount * val) / 100;
                                                } else if (settings?.discount?.by === 'Amount') {
                                                  itemDiscountAmount = val;
                                                }
                                              } else if (settings?.discount?.apply === 'Group') {
                                                if (settings?.discount?.by === 'Percentage') {
                                                  itemDiscountAmount = (amount * val) / 100;
                                                } else if (settings?.discount?.by === 'Amount') {
                                                  itemDiscountAmount = val;
                                                }
                                              }
                                              return {
                                                ...item,
                                                // amount: item.rate * item.quantity,
                                                itemDiscount: val,
                                                discount: itemDiscountAmount
                                              };
                                            });
                                            formik.setFieldValue('invoiceData', updatedData);
                                            setGroupDiscount(val);
                                          }}
                                          fullWidth
                                        />
                                      </Grid>
                                    </Grid>
                                  )}

                                  <Grid item xs={12}>
                                    <Stack spacing={2}>
                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.secondary.main}>Sub Total:</Typography>
                                        <GenericPriceDisplay
                                          // total={formik.values?.subTotal}
                                          total={subTotal}
                                          roundOff={settings.roundOff}
                                          prefix={country?.prefix}
                                        />
                                      </Stack>

                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.secondary.main}>Tax:</Typography>
                                        <GenericPriceDisplay
                                          // total={formik.values?.totalTax}
                                          total={totalTaxAmount}
                                          roundOff={settings.roundOff}
                                          prefix={country?.prefix}
                                        />
                                      </Stack>

                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.secondary.main}>Discount:</Typography>
                                        <GenericPriceDisplay
                                          // total={formik.values?.totalDiscount}
                                          total={totalDiscountAmount}
                                          roundOff={settings.roundOff}
                                          prefix={country?.prefix}
                                        />
                                      </Stack>

                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle1">Grand Total:</Typography>
                                        <GenericPriceDisplay
                                          // total={formik.values?.grandTotal}
                                          total={grandTotal}
                                          roundOff={settings.roundOff}
                                          prefix={country?.prefix}
                                          variant="subtitle1" // Optional
                                        />
                                      </Stack>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        )}
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
                                      value={values.bankDetails?.accountHolderName || ''}
                                      onChange={(e) => setFieldValue('bankDetails.accountHolderName', e.target.value)}
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
                                      value={values.bankDetails?.accountNumber || ''}
                                      onChange={(e) => setFieldValue('bankDetails.accountNumber', e.target.value)}
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
                                      value={values.bankDetails?.IFSC_code || ''}
                                      onChange={(e) => setFieldValue('bankDetails.IFSC_code', e.target.value)}
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
                                      value={values.bankDetails?.bankName || ''}
                                      onChange={(e) => setFieldValue('bankDetails.bankName', e.target.value)}
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
                                    <strong>Account Holder Name:</strong> {values.bankDetails?.accountHolderName || 'N/A'}
                                  </Typography>

                                  {/* Display Account Number */}
                                  <Typography variant="body1">
                                    <strong>Account Number:</strong> {values.bankDetails?.accountNumber || 'N/A'}
                                  </Typography>

                                  {/* Display IFSC Code */}
                                  <Typography variant="body1">
                                    <strong>IFSC Code:</strong> {values.bankDetails?.IFSCCode || 'N/A'}
                                  </Typography>

                                  {/* Display Bank Name */}
                                  <Typography variant="body1">
                                    <strong>Bank Name:</strong> {values.bankDetails?.bankName || 'N/A'}
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
                      {/* <Button
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
                      </Button> */}
                      <Button color="primary" variant="contained" type="submit" disabled={!formik.dirty || formik.isSubmitting}>
                        Update
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Form>
            </LocalizationProvider>
          </FormikProvider>
        </MainCard>
      )}
    </>
  );
};

export default InvoiceEdit;
