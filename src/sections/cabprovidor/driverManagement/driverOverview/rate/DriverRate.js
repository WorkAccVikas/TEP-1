import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import axiosServices from 'utils/axios';
import MainCard from 'components/MainCard';
import CompanyFilter2 from 'pages/trips/filter/CompanyFilter2';
import DriverTable from 'pages/management/driver/driverRate/DriverTable';

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const DriverRate = ({ driverId }) => {
  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [companyRate, setCompanyRate] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updateKey, setUpdateKey] = useState(0);
  const [loading, setLoading] = useState('true');
  const [filterOptions, setFilterOptions] = useState({
    selectedCompany: {}
  });

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // Start loading
      try {
        const params = filterOptions.selectedCompany._id ? { companyId: filterOptions.selectedCompany._id } : {};
        const response = await axiosServices.get(`/driver/unwind/driver/rate?driverId=${driverId}`, { params });
        setDriverList(response.data.data);
        
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchdata();
  }, [driverId, updateKey, filterOptions]);

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {}, [companyRate]);

  return (
    <>
      <>
        <Stack gap={1} spacing={1}>
          <MainCard>
            {/* filter */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              {/* Company Filter */}
              <CompanyFilter2
                setFilterOptions={setFilterOptions}
                sx={{
                  color: '#fff',
                  '& .MuiSelect-select': {
                    padding: '0.5rem',
                    pr: '2rem'
                  },
                  '& .MuiSelect-icon': {
                    color: '#fff' // Set the down arrow color to white
                  },
                  width: '200px',
                  pb: 1
                }}
                value={filterOptions.selectedCompany}
              />
            </Box>
            <DriverTable
              data={driverList}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              updateKey={updateKey}
              setUpdateKey={setUpdateKey}
              loading={loading}
            />
          </MainCard>
        </Stack>
      </>
    </>
  );
};

export default DriverRate;
