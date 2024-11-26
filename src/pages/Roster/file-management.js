import { Stack } from '@mui/material';
import TableSkeleton from 'components/tables/TableSkeleton';
import useDateRange, { TYPE_OPTIONS } from 'hooks/useDateRange';
import Error500 from 'pages/maintenance/error/500';
import DateRangeSelect from 'pages/trips/filter/DateFilter';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RosterFileTable from 'sections/cabprovidor/roster/RosterFileTable';
import { fetchCompaniesRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';
import { formatDateUsingMoment } from 'utils/helper';

const RosterFileList = () => {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const companyID = queryParams.get('companyID');

  const { rosterFiles, metaData, loading, error } = useSelector((state) => state.rosterFile);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  const { startDate, endDate, range, setRange, handleRangeChange, prevRange } = useDateRange(TYPE_OPTIONS.THIS_MONTH);

  useEffect(() => {
    dispatch(
      fetchCompaniesRosterFile({
        id: companyID,
        page: page,
        limit: limit,
        // startDate: formatDateUsingMoment(startDate),
        // endDate: formatDateUsingMoment(endDate)
      })
    );
  }, [dispatch, page, limit, companyID,startDate,endDate]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  if (loading) return <TableSkeleton rows={10} columns={9} />;
  if (error) return <Error500 />;

  return (
    <>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 2 }}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
          <DateRangeSelect
            startDate={startDate}
            endDate={endDate}
            selectedRange={range}
            prevRange={prevRange}
            setSelectedRange={setRange}
            onRangeChange={handleRangeChange}
            showSelectedRangeLabel
            sx={{ height: '36px', width: '180px', mb: '0px' }}
          />
        </Stack>
      </Stack>
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
