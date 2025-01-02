import { Box, Button, Stack } from '@mui/material';
import TableSkeleton from 'components/tables/TableSkeleton';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { DocumentDownload } from 'iconsax-react';
import { downloadCabWiseReport } from 'pages/reports/utils/DownloadCabWIserReport';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import { useCallback, useEffect, useState } from 'react';
import VehicleSelection from 'SearchComponents/VehicleSelectionAutoComplete';
import VendorSelection from 'SearchComponents/VendorSelectionAutoComplete';
import { useSelector } from 'store';
import Analytic from './Analytic';
import { filterAndExtractValues, filterKeys, formatDateUsingMoment } from 'utils/helper';
import { dispatch } from 'store';
import { fetchCabWiseReports, fetchDriverMonthlyReports } from 'store/slice/cabProvidor/reportSlice';
import Table from './Table';
import AccessControlWrapper from 'components/common/guards/AccessControlWrapper';
import { MODULE, PERMISSIONS, USERTYPE } from 'constant';
import { openSnackbar } from 'store/reducers/snackbar';
import WrapperButton from 'components/common/guards/WrapperButton';
import DriverSelection from 'SearchComponents/DriverSelectionAutocomplete';
import { downloadMonthlyReport } from 'pages/reports/utils/DownloadMonthlyReport';

const CabWiseReportForVendor = () => {
  const [selectedCab, setSelectedCab] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState([]);

  const { loading, monthlyReportData } = useSelector((state) => state.report);

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    let cabID = null;
    if (selectedCab.length > 0) {
      cabID = selectedCab.map((cab) => cab._id);
    }

    const selectedDriverID = selectedDriver.map((item) => item._id);

    const payload = {
      data: {
        startDate: formatDateUsingMoment(startDate),
        endDate: formatDateUsingMoment(endDate)
      }
    };

    dispatch(fetchDriverMonthlyReports(payload));
  }, [startDate, endDate]);

  const downloadReports = useCallback(() => {
    if (monthlyReportData.length === 0) {
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
    const ignoredKeys = ['companyGuardPrice', 'vendorGuardPrice', 'companyRate', 'vendorRate', 'companyPenalty', 'vendorPenalty','driverId'];
    const filteredData = filterKeys(monthlyReportData, ignoredKeys);
    downloadMonthlyReport(filteredData, 'monthlyReport');
  }, [monthlyReportData]);

  return (
    <>
      <Stack gap={1}>
        {/* Filter */}
        <Stack direction={'row'} justifyContent={'Space-between'} gap={2} alignItems={'center'}>
          <Stack direction={'row'} gap={2} alignItems={'center'}>
           
            {/* <Box sx={{ minWidth: '300px' }}>
              <VehicleSelection value={selectedCab} setSelectedOptions={setSelectedCab} sx={{ minWidth: '300px', maxWidth: '600px' }} />
            </Box> */}

            {/* <AccessControlWrapper allowedUserTypes={[USERTYPE.iscabProvider]}>
              <Box sx={{ minWidth: '300px' }}>
               
                <DriverSelection
                  value={selectedDriver}
                  setSelectedOptions={setSelectedDriver}
                  sx={{ minWidth: '300px', maxWidth: '600px' }}
                />
              </Box>
            </AccessControlWrapper> */}
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

export default CabWiseReportForVendor;
