import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RosterFileTable from 'sections/cabprovidor/roster/RosterFileTable';
import { dispatch } from 'store';
import { fetchCompaniesRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';

const RosterFileList = ({ theme, company }) => {
  const { metaData, rosterFiles, error, loading } = useSelector((state) => state.rosterFile);
  const [page, setPage] = useState(metaData.page || 1);
  const [limit, setLimit] = useState(metaData.limit || 10);
  const lastPageIndex = metaData.lastPageNo || 1;

  useEffect(() => {
    if (company && company._id) {
      dispatch(fetchCompaniesRosterFile({ id: company?._id, page, limit }));
    }
  }, [dispatch, company]);
  const handleLimitChange = useCallback(
    (event) => {
      setLimit(+event.target.value);
      setPage(1);
    },
    [company]
  );

  if (loading) return <TableSkeleton rows={rosterFiles.length || 10} columns={6} />;
  if (error) return <Error500 theme={theme} />;
  return (
    <RosterFileTable
      data={rosterFiles}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={handleLimitChange}
      lastPageNo={lastPageIndex}
    />
    // <></>
  );
};

export default RosterFileList;
