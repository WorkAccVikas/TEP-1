import { Box, Button, Stack } from '@mui/material';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { DocumentDownload } from 'iconsax-react';
import { downloadCompanyWiseReport } from 'pages/reports/utils/DownloadCompanyWiseReport';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import { useCallback, useEffect, useState } from 'react';
import CompanySelection from 'SearchComponents/CompanySelectionAutocomplete';
import VendorSelection from 'SearchComponents/VendorSelectionAutoComplete';
import { dispatch } from 'store';
import { useSelector } from 'store';
import { fetchCompanyWiseReports, fetchCompanyWiseReportsDriver } from 'store/slice/cabProvidor/reportSlice';
import { filterKeys, formatDateUsingMoment } from 'utils/helper';
import Analytic from './Analytic';
import TableSkeleton from 'components/tables/TableSkeleton';
import Table from './Table';
import AccessControlWrapper from 'components/common/guards/AccessControlWrapper';
import { MODULE, PERMISSIONS, USERTYPE } from 'constant';
import { openSnackbar } from 'store/reducers/snackbar';
import WrapperButton from 'components/common/guards/WrapperButton';
import DriverSelection from 'SearchComponents/DriverSelectionAutocomplete';

const CompanyWiseReportForVendor = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState([]);

  const { loading, companyReportDriverData } = useSelector((state) => state.report);
  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    let companyID = null;
    if (selectedCompanies.length > 0) {
      companyID = selectedCompanies.map((company) => company._id);
    }
    const payload = {
      data: {
        startDate: formatDateUsingMoment(startDate),
        endDate: formatDateUsingMoment(endDate),
        companyId: companyID || []
      }
    };

    dispatch(fetchCompanyWiseReportsDriver(payload));
  }, [startDate, endDate, selectedCompanies, selectedDriver]);

  const downloadReports = useCallback(() => {
    if (companyReportDriverData.length === 0) {
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
    const ignoredKeys = ['companyGuardPrice', 'vendorGuardPrice', 'companyRate', 'vendorRate', 'companyPenalty', 'vendorPenalty'];
    const filteredData = filterKeys(companyReportDriverData, ignoredKeys);
    downloadCompanyWiseReport(filteredData, 'companyWiseReport');
  }, [companyReportDriverData]);

  return (
    <>
      <Stack gap={1}>
        {/* Filter */}
        <Stack direction={'row'} justifyContent={'Space-between'} gap={2} alignItems={'center'}>
          <Stack direction={'row'} gap={2} alignItems={'center'}>
            <Box sx={{ minWidth: '300px' }}>
              <CompanySelection
                value={selectedCompanies}
                setSelectedOptions={setSelectedCompanies}
                sx={{ minWidth: '300px', maxWidth: '600px' }}
              />
            </Box>

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
          <Analytic />

          {/* Table */}
          {loading ? <TableSkeleton rows={10} columns={6} /> : <Table />}
        </Stack>
      </Stack>
    </>
  );
};

export default CompanyWiseReportForVendor;
