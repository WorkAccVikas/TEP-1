// import EmptyTableDemo from 'components/tables/EmptyTable';
// import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvanceTable from 'sections/cabprovidor/advances/AdvanceTable';
import { fetchAdvances } from 'store/slice/cabProvidor/advanceSlice';
const Advance = () => {
  const dispatch = useDispatch();
  const { advances, metaData, loading, error } = useSelector((state) => state.advances);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [lastPageNo, setLastPageNo] = useState(Math.ceil(metaData.totalCount / metaData.limit) || 1);
  const [key, setKey] = useState(0);

  useEffect(() => {
    dispatch(fetchAdvances());
  }, [dispatch, key]);

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  // if (advances.length === 0) return <EmptyTableDemo />;

  return (
    <AdvanceTable
      data={advances}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      lastPageNo={lastPageNo}
      setLastPageNo={setLastPageNo}
      key={key}
      setKey={setKey}
      loading={loading}
    />
  );
};

export default Advance;
