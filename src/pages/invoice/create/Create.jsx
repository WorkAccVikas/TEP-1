import { useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
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
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';

// project-imports
import MainCard from 'components/MainCard';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import AddressModal from 'sections/apps/invoice/AddressModal';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';

import incrementer from 'utils/incrementer';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { customerPopup, selectCountry, getInvoiceInsert, reviewInvoicePopup, getInvoiceList } from 'store/reducers/invoice';

// assets
import { Add, Edit, Setting } from 'iconsax-react';
import { useEffect, useState } from 'react';
import CustomDialog from './CustomDialog';
import InvoiceSetting from 'pages/setting/invoice';
// import CashierrUpdateDialog from 'CashierUpdateDialog';

const validationSchema = yup.object({
  // date: yup.date().required('Invoice date is required'),
  // due_date: yup
  //   .date()
  //   .when('date', (date, schema) => date && schema.min(date, "Due date can't be before invoice date"))
  //   .nullable()
  //   .required('Due date is required'),
  // customerInfo: yup
  //   .object({
  //     name: yup.string().required('Invoice receiver information is required')
  //   })
  //   .required('Invoice receiver information is required'),
  // status: yup.string().required('Status selection is required'),
  // discount: yup
  //   .number()
  //   .typeError('Discount must specify a numeric value.')
  //   // @ts-ignore
  //   .test('rate', 'Please enter a valid discount value', (number) => /^\d+(\.\d{1,2})?$/.test(number)),
  // tax: yup
  //   .number()
  //   .typeError('Tax must specify a numeric value.')
  //   // @ts-ignore
  //   .test('rate', 'Please enter a valid tax value', (number) => /^\d+(\.\d{1,2})?$/.test(number)),
  // invoice_detail: yup
  //   .array()
  //   .required('Invoice details is required')
  //   .of(
  //     yup.object().shape({
  //       name: yup.string().required('Product name is required')
  //     })
  //   )
  //   .min(1, 'Invoice must have at least 1 items')
});

// ==============================|| INVOICE - CREATE ||============================== //

const Create = () => {
  const theme = useTheme();
  const navigation = useNavigate();

  const { isCustomerOpen, countries, country, lists, isOpen } = useSelector((state) => state.invoice);
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

  const [dialogOpen, setDialogOpen] = useState(true); // Start with the dialog open
  const [showCreatePage, setShowCreatePage] = useState(false); // Track if the create page should be visible

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

  const handlerCreate = (values) => {
    const NewList = {
      id: Number(incrementer(lists.length)),
      invoice_id: invoiceId,
      customer_name: values.cashierInfo?.company_name,
      email: values.cashierInfo?.company_email,
      avatar: Number(Math.round(Math.random() * 10)),
      discount: Number(values.discount),
      tax: Number(values.tax),
      date: format(values.date, 'MM/dd/yyyy'), // Format date for submission
      due_date: format(values.due_date, 'MM/dd/yyyy'), // Format due date for submission
      start_date: format(values.start_date, 'MM/dd/yyyy'), // Format start date
      end_date: format(values.end_date, 'MM/dd/yyyy'), // Format end date
      quantity: Number(
        values.invoice_detail?.reduce((sum, i) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      invoice_detail: values.invoice_detail,
      bank_details: values.bank_details,
      notes: values.notes,
      terms: values.terms
    };

    console.log('new', NewList);

    dispatch(getInvoiceList()).then(() => {
      dispatch(getInvoiceInsert(NewList)).then(() => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Invoice Added successfully',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        navigation('/invoice/list');
      });
    });
  };

  const addNextInvoiceHandler = () => {
    dispatch(
      reviewInvoicePopup({
        isOpen: false
      })
    );
  };

  useEffect(() => {
    console.log('useEffect of invoice create');
    console.log(dialogOpen);
  }, [dialogOpen]);

  useEffect(() => {
    console.log('useEffect of invoice settings');
  }, []);

  return (
    <>
      {/* <CustomDialog open={dialogOpen} onSave={handleDialogSave} /> */}
      {dialogOpen && (
        <>
          <Dialog open={dialogOpen} maxWidth="sm" fullWidth keepMounted scroll="paper">
            <InvoiceSetting redirect="/apps/invoices/create" onClose={handleDialogSave} />
          </Dialog>
        </>
      )}
      {showCreatePage && (
        <MainCard>
          <Formik
            initialValues={{
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
              invoice_detail: [
                {
                  id: UIDV4(),
                  name: '',
                  description: '',
                  qty: 1,
                  price: '1.00',
                  itemTax: 0,
                  code: 'VH45BS35VJ3'
                }
              ],
              bank_details: {
                accountHolderName: 'John Doe',
                accountNumber: '123456789012',
                IFSCCode: 'SBIN0001234',
                bankName: 'State Bank of India'
              },
              discount: 0,
              tax: 0,
              notes: '',
              terms: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handlerCreate(values);
            }}
          >
            {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
              setCashierValues(values?.cashierInfo || {});
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

              const subtotal = values?.invoice_detail.reduce((prev, curr) => {
                if (curr.name.trim().length > 0) return prev + Number(curr.price * Math.floor(curr.qty));
                else return prev;
              }, 0);

              let taxRate = values.invoice_detail.reduce((accumulator, item) => {
                return accumulator + item.itemTax;
              }, 0);

              const discountRate = (values.discount * subtotal) / 100;
              const total = subtotal - discountRate + taxRate;
              return (
                <Form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
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

                      {/* Dialog for pop-up */}
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
                    <Grid item xs={12}>
                      <Typography variant="h5">Detail</Typography>
                    </Grid>
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
                                      <TableCell>Item</TableCell>
                                      <TableCell>Description</TableCell>
                                      <TableCell>Qty</TableCell>
                                      <TableCell>Rate</TableCell>
                                      <TableCell>Tax(%)</TableCell>
                                      <TableCell>Code</TableCell>
                                      <TableCell align="right">Amount</TableCell>
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
                                          name={item.name}
                                          description={item.description}
                                          qty={item.qty}
                                          price={item.price}
                                          tax={item.itemTax}
                                          code={item.code}
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
                                <Grid item xs={12} md={8}>
                                  <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                    <Button
                                      color="primary"
                                      startIcon={<Add />}
                                      onClick={() =>
                                        push({
                                          id: UIDV4(),
                                          name: '',
                                          description: '',
                                          qty: 1,
                                          price: '1.00',
                                          itemTax: 0
                                        })
                                      }
                                      variant="dashed"
                                      sx={{ bgcolor: 'transparent !important' }}
                                    >
                                      Add Item
                                    </Button>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                                    <Grid item xs={6}>
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
                                        {touched.discount && errors.discount && (
                                          <FormHelperText error={true}>{errors.discount}</FormHelperText>
                                        )}
                                      </Stack>
                                    </Grid>
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
                                        <Typography>{country?.prefix + '' + subtotal.toFixed(2)}</Typography>
                                      </Stack>
                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.secondary.main}>Discount:</Typography>
                                        <Typography variant="h6" color={theme.palette.success.main}>
                                          {country?.prefix + '' + discountRate.toFixed(2)}
                                        </Typography>
                                      </Stack>
                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography color={theme.palette.secondary.main}>Tax:</Typography>
                                        <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                      </Stack>
                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle1">Grand Total:</Typography>
                                        <Typography variant="subtitle1">
                                          {' '}
                                          {total % 1 === 0 ? country?.prefix + '' + total : country?.prefix + '' + total.toFixed(2)}
                                        </Typography>
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
                        <Button variant="outlined" color="secondary" sx={{ color: 'secondary.dark' }}>
                          Create
                        </Button>
                        {/* send mail */}
                        <Button color="primary" variant="contained" type="submit">
                          Create & Send
                        </Button>
                        <InvoiceModal
                          isOpen={isOpen}
                          setIsOpen={(value) =>
                            dispatch(
                              reviewInvoicePopup({
                                isOpen: value
                              })
                            )
                          }
                          key={values.invoice_id}
                          invoiceInfo={{
                            ...values,
                            subtotal,
                            taxRate,
                            discountRate,
                            total
                          }}
                          items={values?.invoice_detail}
                          onAddNextInvoice={addNextInvoiceHandler}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </MainCard>
      )}
    </>
  );
};

export default Create;
