import { useEffect, useState } from 'react';
// assets
import { Button, CircularProgress, Stack } from '@mui/material';
import CompanyRateReactTable from './CompanyRateReactTable';
import Header from 'components/tables/genericTable/Header';
import WrapperButton from 'components/common/guards/WrapperButton';
import { Add, Box } from 'iconsax-react';
import CompanyRate from './CompanyRate';
import axiosServices from 'utils/axios';
import { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import AccessControlWrapper from 'components/common/guards/AccessControlWrapper';
import { USERTYPE } from 'constant';
import { useSelector } from 'store';

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const API = {
  [USERTYPE.iscabProvider]: `/company/unwind/rates?companyId=`,
  [USERTYPE.isVendor]: '/cabRateMaster/unwind/rate?companyID='
};

const CompanyRateListing = ({ companyName, id }) => {
  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [companyRate, setCompanyRate] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updateKey, setUpdateKey] = useState(0);
  const [loading, setLoading] = useState('true');
  const [showCompanyList, setShowCompanyList] = useState(false);

  const userType = useSelector((state) => state.auth.userType);
  console.log('🚀 ~ CompanyRateListing ~ userType:', userType);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axiosServices.get(API[userType] + id);
      setCompanyList(response.data.data);
      setLoading(false);
      console.log('response.data', response.data.data);
    };

    fetchdata();
  }, [id, userType]);

  const handleAddRate = () => {
    setShowCompanyList(true);
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {}, [companyRate]);

  const handleBackToList = () => {
    setShowCompanyList(false);
  };

  return (
    <>
      {!showCompanyList ? ( // Conditional rendering based on showCompanyList state
        <Stack gap={1} spacing={1}>
          <Header OtherComp={({ loading }) => <ButtonComponent loading={loading} onAddRate={handleAddRate} />} />

          <MainCard title="Company Rates" content={false}>
            <ScrollX>
              {loading ? (
                <TableSkeleton rows={10} columns={6} />
              ) : companyList.length !== 0 ? (
                <CompanyRateReactTable
                  data={companyList}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  updateKey={updateKey}
                  setUpdateKey={setUpdateKey}
                  loading={loading}
                />
              ) : (
                <EmptyTableDemo />
              )}
            </ScrollX>
          </MainCard>

          {/* {companyList.length !== 0 && (
            <CompanyRateReactTable
              data={companyList}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              updateKey={updateKey}
              setUpdateKey={setUpdateKey}
              loading={loading}
            />
          )} */}
        </Stack>
      ) : (
        <CompanyRate id={id} companyName={companyName} onBackToList={handleBackToList} /> // Render CompanyList1 when the state is true
      )}
    </>
  );
};

export default CompanyRateListing;

const ButtonComponent = ({ loading, onAddRate }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <AccessControlWrapper allowedUserTypes={[USERTYPE.iscabProvider]}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
          onClick={onAddRate} // Call the onAddRate function when button is clicked
          size="small"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : ' Add Rate'}
        </Button>
      </AccessControlWrapper>
    </Stack>
  );
};
