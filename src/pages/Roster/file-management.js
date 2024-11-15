import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RosterFileTable from 'sections/cabprovidor/roster/RosterFileTable';
import { fetchCompaniesRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';

const RosterFileList = () => {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const companyID = queryParams.get('companyID');

  const { rosterFiles, metaData, loading, error } = useSelector((state) => state.rosterFile);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchCompaniesRosterFile({ id: companyID, page: page, limit: limit }));
  }, [dispatch, page, limit, companyID]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  if (loading) return <TableSkeleton rows={10} columns={9} />;
  if (error) return <Error500 />;

  return (
    <RosterFileTable
      data={rosterFiles}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={handleLimitChange}
      lastPageNo={lastPageIndex}
    />
  );
};

export default RosterFileList;
