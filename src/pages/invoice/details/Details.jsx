import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  IconButton,
  Chip,
  FormControl,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
// import ExportPDFView from 'sections/apps/invoice/export-pdf';

import { dispatch, useSelector } from 'store';

// assets
import { DocumentDownload, Edit, Printer, Share } from 'iconsax-react';
import { getInvoiceDetails } from 'store/slice/cabProvidor/invoiceSlice';
import { openSnackbar } from 'store/reducers/snackbar';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { formatDateUsingMoment } from 'utils/helper';
import ExportPDFView from './export-pdf';
// import LogoSection from './LogoSection';

export const INVOICE_STATUS_ENUM = {
  UNPAID: 1,
  PAID: 2,
  CANCELLED: 3
};

export const INVOICE_STATUS = {
  [INVOICE_STATUS_ENUM.UNPAID]: 'Unpaid',
  [INVOICE_STATUS_ENUM.PAID]: 'Paid',
  [INVOICE_STATUS_ENUM.CANCELLED]: 'Cancelled'
};

const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS_ENUM.UNPAID]: <Chip label="Unpaid" variant="light" color="warning" size="small" />,
  [INVOICE_STATUS_ENUM.PAID]: <Chip label="Paid" variant="light" color="success" size="small" />,
  [INVOICE_STATUS_ENUM.CANCELLED]: <Chip label="Cancelled" variant="light" color="error" size="small" />
};

const InvoiceDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const componentRef = useRef(null);
  const navigation = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await dispatch(getInvoiceDetails(id)).unwrap();
        console.log(res);
        setDetails(res);
      } catch (error) {
        console.log('error at fetch invoice details', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error at fetch invoice details',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const renderInvoiceStatusLabel = useMemo(() => {
    if (!details?.status) return null;
    return INVOICE_STATUS_LABELS[details.status] || <Chip label="Unknown" variant="outlined" color="default" size="small" />;
  }, [details?.status]);

  const subTotal = useMemo(() => {
    return details?.invoiceData.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [details?.invoiceData]);

  const tax = useMemo(() => {
    return details?.invoiceData.reduce((acc, curr) => acc + Number(curr.Tax_amount), 0);
  }, [details?.invoiceData]);

  const discount = useMemo(() => {
    return details?.invoiceData.reduce((acc, curr) => acc + Number(curr.discount), 0);
  }, [details?.invoiceData]);

  const grandTotalAmount = useMemo(() => {
    return subTotal - discount + tax;
  }, [subTotal, discount, tax]);

  const renderTableRow = (item, index) => (
    <TableRow key={index}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{item.itemName}</TableCell>
      <TableCell>{item.rate}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.Tax_amount}</TableCell>
      <TableCell>{item.discount}</TableCell>
      <TableCell>{item.amount}</TableCell>
    </TableRow>
  );

  const SummaryCard = ({ subTotal, discount, tax, grandTotal }) => (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Sub Total:</Typography>
        <Typography>{`₹ ${subTotal?.toFixed(2)}`}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Discount:</Typography>
        <Typography variant="h6" color={theme.palette.success.main}>{`₹ ${discount?.toFixed(2)}`}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography>Tax:</Typography>
        <Typography>{`₹ ${tax?.toFixed(2)}`}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1">Grand Total:</Typography>
        <Typography variant="subtitle1">{`₹ ${grandTotalAmount?.toFixed(2) || grandTotal?.toFixed(2)}`}</Typography>
      </Stack>
    </Stack>
  );

  if (loading) return <CustomCircularLoader />;

  return (
    <>
      <MainCard content={false}>
        <Stack spacing={2.5}>
          {/* 1st row */}
          <Box sx={{ p: 2.5, pb: 0 }}>
            <MainCard content={false} border={false} sx={{ p: 1.25, bgcolor: 'secondary.lighter' }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <IconButton onClick={() => navigation(`/apps/invoices/edit/${details?._id}`)}>
                  <Edit color={theme.palette.text.secondary} />
                </IconButton>

                {/* <PDFDownloadLink
                  document={<ExportPDFView list={details} />}
                  fileName={`${details?._id}-${details?.billedTo?.company_name}.pdf`}
                >
                  <IconButton>
                    <DocumentDownload color={theme.palette.text.secondary} />
                  </IconButton>
                </PDFDownloadLink> */}

                {/* <ReactToPrint
                  trigger={() => (
                    <IconButton>
                      <Printer color={theme.palette.text.secondary} />
                    </IconButton>
                  )}
                  content={() => componentRef.current}
                /> */}

                {/* <IconButton>
                <Share color={theme.palette.text.secondary} />
              </IconButton> */}
              </Stack>
            </MainCard>
          </Box>

          {/* Body */}
          <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                  {/* Invoice Batch and Invoice Number */}
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={2}>
                      <LogoSection />
                      {/* <Chip label="Paid" variant="light" color="success" size="small" /> */}
                      {renderInvoiceStatusLabel}
                    </Stack>
                    <Typography color="secondary">#{details?.invoiceNumber}</Typography>
                  </Stack>

                  {/* Invoice Date and Due Date */}
                  <Box>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography variant="subtitle1">Date</Typography>
                      <Typography color="secondary">{formatDateUsingMoment(details?.invoiceDate, 'DD-MM-YYYY')}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography sx={{ overflow: 'hidden' }} variant="subtitle1">
                        Due Date
                      </Typography>
                      <Typography color="secondary">{formatDateUsingMoment(details?.dueDate, 'DD-MM-YYYY')}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* From */}
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">From:</Typography>
                    <FormControl sx={{ width: '100%' }}>
                      <Typography color="secondary">{details?.billedBy.cabProviderLegalName || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.contactPersonName || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.workEmail || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.workMobileNumber || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.officeAddress || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.officePinCode || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.officeState || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.PAN || 'N/A'}</Typography>
                      <Typography color="secondary">{details?.billedBy.GSTIN || 'N/A'}</Typography>
                    </FormControl>
                  </Stack>
                </MainCard>
              </Grid>

              {/* To */}
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">To:</Typography>
                    <FormControl sx={{ width: '100%' }}>
                      <Typography color="secondary">{details?.billedTo.company_name}</Typography>
                      <Typography color="secondary">{details?.billedTo.contact_person}</Typography>
                      <Typography color="secondary">{details?.billedTo.company_email}</Typography>
                      <Typography color="secondary">+91 {details?.billedTo.mobile}</Typography>
                      <Typography color="secondary">{details?.billedTo.PAN}</Typography>
                      <Typography color="secondary">{details?.billedTo.GSTIN}</Typography>
                      <Typography color="secondary">{details?.billedTo.postal_code}</Typography>
                      <Typography color="secondary">{details?.billedTo.address}</Typography>
                      <Typography color="secondary">{details?.billedTo.state}</Typography>
                    </FormControl>
                  </Stack>
                </MainCard>
              </Grid>

              {/* Table */}
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Tax Amount</TableCell>
                        <TableCell>Discount Amount</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>{details?.invoiceData?.map((item, index) => renderTableRow(item, index))}</TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ borderWidth: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6} md={8}></Grid>

              {/* Summary Total */}
              <Grid item xs={12} sm={6} md={4}>
                <SummaryCard subTotal={subTotal} discount={discount} tax={tax} grandTotal={details?.grandTotal} />
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
            {/* <PDFDownloadLink document={<ExportPDFView list={details} />} fileName={`${details?.invoice_id}-${details?.customer_name}.pdf`}> */}
            <Button variant="contained" color="primary">
              Download
            </Button>
            {/* </PDFDownloadLink> */}
          </Stack>
        </Stack>
      </MainCard>
    </>
  );
};

export default InvoiceDetails;
