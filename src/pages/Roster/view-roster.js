import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import ViewRosterTable from 'sections/cabprovidor/roster/ViewRosterTable';
import { fetchRosterDataByDate } from 'store/slice/cabProvidor/rosterDataSlice';
import { convertToDateUsingMoment } from 'utils/helper';
import { isExcelDate } from 'utils/roster-mapping-helpers';

const ViewRoster = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const { formData, fileData } = location.state || {};

  const { rosterData, metaData, loading, error } = useSelector((state) => state.rosterData);

  // State management
  const [page, setPage] = useState(metaData?.page || 1);
  const [limit, setLimit] = useState(metaData?.limit || 10);

  const [lastPageNo, setLastPageNo] = useState(Math.ceil(metaData.totalCount / metaData.limit) || 1);

  const fetchDataViaForm = useCallback(
    async (formData) => {
      const payload = {
        data: {
          companyId: formData.companyId,
          fromDate: formData.startDate,
          toDate: formData.endDate,
          tripStatus: 1
        }
      };
      await dispatch(fetchRosterDataByDate({ data: payload, page: page, limit: limit }));
    },
    [dispatch, formData, limit, page]
  );

  const fetchDataViaFile = useCallback(async () => {
    const payload = {
      data: {
        companyId: fileData.companyID,
        fromDate: isExcelDate(fileData.startDate) ? convertToDateUsingMoment(fileData.startDate) : fileData.startDate,
        toDate: isExcelDate(fileData.endDate) ? convertToDateUsingMoment(fileData.endDate) : fileData.endDate,
        tripStatus: 1
      },
      page,
      limit
    };
    await dispatch(fetchRosterDataByDate({ data: payload }));
  }, [dispatch, fileData, limit, page]);

  useEffect(() => {
    if (formData) {
      fetchDataViaForm(formData);
    }
    if (fileData) {
      fetchDataViaFile();
    }
  }, [formData, fileData, limit, page, fetchDataViaForm, fetchDataViaFile]);

  if (loading) return <TableSkeleton rows={10} columns={9} />;
  if (error) return <Error500 />;
  if (rosterData.length === 0) return <EmptyTableDemo />;
  return (
    <ViewRosterTable
      data={rosterData}
      metaData={metaData}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      lastPageNo={lastPageNo}
      setLastPageNo={setLastPageNo}
      payload={fileData || formData}
    />
  );
};

export default ViewRoster;
