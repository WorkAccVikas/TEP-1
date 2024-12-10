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
import { fetchCompanyWiseReports } from 'store/slice/cabProvidor/reportSlice';
import { formatDateUsingMoment } from 'utils/helper';
import Analytic from './Analytic';
import TableSkeleton from 'components/tables/TableSkeleton';
import Table from './Table';

const CompanyWiseReportForVendor = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);

  const { loading, companyReportData } = useSelector((state) => state.report);
  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.LAST_30_DAYS);

  useEffect(() => {
    console.log({ selectedCompanies });

    let companyID = null;
    if (selectedCompanies.length > 0) {
      companyID = selectedCompanies.map((company) => company._id);
    }
    console.log('selectedVendor = ', selectedVendor);

    const selectedVendorID = selectedVendor.map((vendor) => vendor.vendorId);
    const payload = {
      data: {
        startDate: formatDateUsingMoment(startDate),
        endDate: formatDateUsingMoment(endDate),
        companyId: companyID || [],
        vendorIds: selectedVendorID || []
      }
    };

    dispatch(fetchCompanyWiseReports(payload));
  }, [startDate, endDate, selectedCompanies, selectedVendor]);

  const downloadReports = useCallback(() => {
    console.log('Data = ', companyReportData);
    downloadCompanyWiseReport(companyReportData, 'companyWiseReport');
  }, [companyReportData]);

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

            <Box sx={{ minWidth: '300px' }}>
              <VendorSelection
                value={selectedVendor}
                setSelectedOptions={setSelectedVendor}
                sx={{ minWidth: '300px', maxWidth: '600px' }}
              />
            </Box>
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
            <Button
              variant="contained"
              startIcon={<DocumentDownload />}
              color="secondary"
              onClick={downloadReports}
              size="medium"
              title="Download Report"
            >
              Download Report
            </Button>
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
