import { Box, Button, Stack } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, dispatch } from 'store';
import Analytic from './Analytic';
import Table from './Table';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { formatDateUsingMoment } from 'utils/helper';
import { fetchAdvanceReports } from 'store/slice/cabProvidor/reportSlice';
import { DocumentDownload } from 'iconsax-react';
import VehicleSelection from 'SearchComponents/VehicleSelectionAutoComplete';
import TableSkeleton from 'components/tables/TableSkeleton';
// import { downloadAdvanceReport } from '../../utils/DownloadAdvanceReport';
import VendorSelection from 'SearchComponents/VendorSelectionAutoComplete';
import DriverSelection from 'SearchComponents/DriverSelectionAutocomplete';
import AccessControlWrapper from 'components/common/guards/AccessControlWrapper';
import { MODULE, PERMISSIONS, USERTYPE } from 'constant';
import { openSnackbar } from 'store/reducers/snackbar';
import WrapperButton from 'components/common/guards/WrapperButton';

const AdvanceReportForVendor = () => {
  const [selectedDriver, setSelectedDriver] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);

  const { loading, advanceReportData } = useSelector((state) => state.report);

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    const payload = {
      data: {
        startDate: formatDateUsingMoment(startDate),
        endDate: formatDateUsingMoment(endDate),
        searchByUids: [...selectedDriver, ...selectedVendor]
      }
    };

    dispatch(fetchAdvanceReports(payload));
  }, [startDate, endDate, selectedDriver, selectedVendor]);

  const downloadReports = useCallback(() => {
    if (advanceReportData.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'No Data Found',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      return;
    }
    console.log('Data = ', advanceReportData);

    const transformedData = advanceReportData.map((item) => ({
      userType: item.isDriver ? 'driver' : 'vendor',
      requestedBy: item.requestedById?.userName,
      approvedBy: item.approvedBy?.userName,
      advanceType: item.advanceTypeId?.advanceTypeName || 'N/A',
      interestRate: item.advanceTypeId?.interestRate,
      requestedAmount: item.requestedAmount,
      requestedInterest: item.advanceTypeId?.interestRate ? (item.requestedAmount * item.advanceTypeId?.interestRate) / 100 : 0,
      approvedAmount: item.approvedAmount,
      approvedInterest: item.advanceTypeId?.interestRate ? (item.approvedAmount * item.advanceTypeId?.interestRate) / 100 : 0,
      transactionId: item.transactionId,
      totalVehiclesCount: item.totalVehiclesCount,
      driverCount: item.driverCount
    }));
    console.log({ transformedData });
    // downloadAdvanceReport(transformedData, 'advanceReport');
  }, [advanceReportData]);

  return (
    <>
      <Stack gap={1}>
        {/* Filter */}
        <Stack direction={'row'} justifyContent={'space-between'} gap={2} alignItems={'center'}>
          <Stack direction={'row'} gap={2} alignItems={'center'}>
            {/* Driver Filter */}
            <Box sx={{ minWidth: '300px' }}>
              <DriverSelection
                value={selectedDriver}
                setSelectedOptions={setSelectedDriver}
                sx={{ minWidth: '300px', maxWidth: '600px' }}
              />
            </Box>

            <AccessControlWrapper allowedUserTypes={[USERTYPE.iscabProvider]}>
              {/* Vendor Filter */}
              <Box sx={{ minWidth: '300px' }}>
                <VendorSelection
                  value={selectedVendor}
                  setSelectedOptions={setSelectedVendor}
                  sx={{ minWidth: '300px', maxWidth: '600px' }}
                />
              </Box>
            </AccessControlWrapper>
          </Stack>

          <Stack direction={'row'} gap={2}>
            {/* Date Filter */}
            <DateRangeSelect
              startDate={startDate}
              endDate={endDate}
              selectedRange={range}
              prevRange={prevRange}
              setSelectedRange={setRange}
              onRangeChange={handleRangeChange}
              showSelectedRangeLabel
            />

            {/* Download Report */}
            <WrapperButton moduleName={MODULE.REPORT} permission={PERMISSIONS.CREATE}>
              <Button
                variant="contained"
                startIcon={<DocumentDownload />}
                color="secondary"
                onClick={downloadReports}
                size="medium"
                title="Download Report"
                disabled={loading}
              >
                Download Report
              </Button>
            </WrapperButton>
          </Stack>
        </Stack>

        {/* Main Part */}
        <Stack spacing={2}>
          {/* Analytic */}
          {/* <Analytic /> */}

          {/* Table */}
          {loading ? <TableSkeleton rows={10} columns={6} /> : <Table />}
        </Stack>
      </Stack>
    </>
  );
};

export default AdvanceReportForVendor;

