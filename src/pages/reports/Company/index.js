import { Button, Stack } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, dispatch } from 'store';
import Analytic from './Analytic';
import Table from './Table';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import { formatDateForApi, formatDateUsingMoment } from 'utils/helper';
import { fetchCompanyWiseReports } from 'store/slice/cabProvidor/reportSlice';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { DocumentDownload } from 'iconsax-react';

const CompanyReports = () => {
  const { loading, companyReportData } = useSelector((state) => state.report);
  console.log(`🚀 ~ CompanyReports ~ companyReportData:`, companyReportData);

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.THIS_MONTH);

  useEffect(() => {
    console.log('Date Range Changed');
    console.log({ startDate, endDate });

    const payload = {
      startDate: formatDateUsingMoment(startDate),
      endDate: formatDateUsingMoment(endDate)
    };

    dispatch(fetchCompanyWiseReports(payload));
  }, [startDate, endDate]);

  const downloadReports = useCallback(() => {
    alert('Download Report');
    console.log('Data = ', companyReportData);
  }, [companyReportData]);

  return (
    <>
      <Stack gap={1}>
        {/* Filter */}
        <Stack direction={'row'} justifyContent={'flex-end'} gap={2} alignItems={'center'}>
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
        </Stack>

        {/* Main Part */}
        <Stack spacing={2}>
          {/* Analytic */}
          <Analytic />

          {/* Table */}
          {loading ? <CustomCircularLoader /> : <Table />}
        </Stack>
      </Stack>
    </>
  );
};

export default CompanyReports;
