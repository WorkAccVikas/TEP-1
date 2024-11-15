import Breadcrumbs from 'components/@extended/Breadcrumbs';
import TableSkeleton from 'components/tables/TableSkeleton';
import { APP_DEFAULT_PATH } from 'config';
import Error500 from 'pages/maintenance/error/500';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompaniesRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';
import RosterFileTable from './RosterFileTable';

const RosterFileList = () => {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const companyID = queryParams.get('companyID');

  const { rosterFiles, metaData, loading, error } = useSelector((state) => state.rosterFile);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchCompaniesRosterFile({ page: page, limit: limit }));
  }, [dispatch, page, limit, companyID]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH },{ title: 'Roster', to: '/apps/roster/test' }, { title: 'Excel Files' }];

  if (loading) return <TableSkeleton rows={10} columns={9} />;
  if (error) return <Error500 />;

  return (
    <>
      <Breadcrumbs custom heading="Excel Files" links={breadcrumbLinks} />

      <RosterFileTable
        data={rosterFiles}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={handleLimitChange}
        lastPageNo={lastPageIndex}
      />
    </>
  );
};

export default RosterFileList;
