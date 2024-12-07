import Error500 from 'pages/maintenance/error/500';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvanceTypeTable from 'sections/cabprovidor/advances/AdvanceTypeTable';
import { fetchAdvanceType } from 'store/slice/cabProvidor/advanceTypeSlice';
const AdvanceType = () => {
  const dispatch = useDispatch();
  const { advanceType, metaData, loading, error } = useSelector((state) => state.advanceType);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [lastPageNo, setLastPageNo] = useState(Math.ceil(metaData.totalCount / metaData.limit) || 1);
  const [key, setKey] = useState(0);
  const userInfo = JSON.parse(localStorage.getItem('userInformation'));

  const advanceCabProviderId = userInfo.userId;

  useEffect(() => {
    dispatch(fetchAdvanceType(advanceCabProviderId));
  }, [dispatch, key]);

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  // if (advanceType.length === 0) return <EmptyTableDemo />;

  return (
    <AdvanceTypeTable
      data={advanceType}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      lastPageNo={lastPageNo}
      setLastPageNo={setLastPageNo}
      updateKey={key}
      setUpdateKey={setKey}
      loading={loading}
    />
  );
};

export default AdvanceType;
