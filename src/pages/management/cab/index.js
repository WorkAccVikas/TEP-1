/* eslint-disable no-unused-vars */
import { Button, CircularProgress, Stack } from '@mui/material';
import WrapperButton from 'components/common/guards/WrapperButton';
import Header from 'components/tables/genericTable/Header';
import { MODULE, PERMISSIONS } from 'constant';
import { Add } from 'iconsax-react';
import Error500 from 'pages/maintenance/error/500';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CabTable from 'sections/cabprovidor/cabManagement/CabTable';
import { fetchCabs } from 'store/slice/cabProvidor/cabSlice';

const Cab = () => {
  const dispatch = useDispatch();
  const { cabs, metaData, loading, error } = useSelector((state) => state.cabs);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchCabs({ page, limit }));
  }, [page, limit, dispatch]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  // if (cabs.length === 0) return <EmptyTableDemo />;

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header OtherComp={({loading}) => <ButtonComponent loading={loading}/>} />
        <CabTable data={cabs} page={page} setPage={setPage} limit={limit} setLimit={handleLimitChange} lastPageNo={lastPageIndex} loading={loading}/>
      </Stack>
    </>
  );
};

export default Cab;

const ButtonComponent = ({loading}) => {
  const navigate = useNavigate();
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <WrapperButton moduleName={MODULE.CAB} permission={PERMISSIONS.CREATE}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />} // Show loading spinner if loading
            onClick={() => navigate('/management/cab/add-cab')}
            size="small"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Loading...' : 'Add Cab'}
          </Button>
        </WrapperButton>
      </Stack>
    </>
  );
};
