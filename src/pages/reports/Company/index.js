import { Autocomplete, Box, Button, Stack } from '@mui/material';
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
import axios from 'utils/axios';
import MultipleAutocomplete from 'components/autocomplete/MultipleAutocomplete';

const CompanyReports = () => {
  const [company, setCompany] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const { loading, companyReportData } = useSelector((state) => state.report);
  console.log(`🚀 ~ CompanyReports ~ companyReportData:`, companyReportData);

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.THIS_MONTH);

  useEffect(() => {
    console.log('Date Range Changed');
    console.log({ startDate, endDate });
    console.log({ selectedCompanies });

    let companyID = null;
    if (selectedCompanies.length > 0) {
      companyID = selectedCompanies.map((company) => company._id);
    }
    console.log('companyID = ', companyID);
    const payload = {
      query: {
        startDate: formatDateUsingMoment(startDate),
        endDate: formatDateUsingMoment(endDate)
      },
      // ...(selectedCompanies.length > 0 ? { companyID } : {})
      body: {
        companyID
      }
    };

    dispatch(fetchCompanyWiseReports(payload));
  }, [startDate, endDate, selectedCompanies]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get('/company/all');
        setCompany(response.data.companies);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    fetchCompanyData();
  }, []);

  const downloadReports = useCallback(() => {
    alert('Download Report');
    console.log('Data = ', companyReportData);
  }, [companyReportData]);

  const handleSelectionChange = useCallback((event, value) => {
    console.log(`🚀 ~ handleSelectionChange ~ value:`, value);
    setSelectedCompanies(value);
  }, []);

  return (
    <>
      <Stack gap={1}>
        {/* Filter */}
        <Stack direction={'row'} justifyContent={'flex-end'} gap={2} alignItems={'center'}>
          {/* Company Filter */}
          <Box sx={{ width: '40%' }}>
            <MultipleAutocomplete
              options={company || []}
              label="Select Companies"
              placeholder="Start typing..."
              value={selectedCompanies}
              onChange={handleSelectionChange}
              getOptionLabel={(option) => option.company_name}
              renderOption={(props, option) => (
                <li {...props}>
                  <strong>{option.company_name}</strong> - {option.billingCycle}
                </li>
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              disableCloseOnSelect
            />
          </Box>

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
