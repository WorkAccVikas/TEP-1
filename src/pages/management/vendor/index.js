// import EmptyTableDemo from 'components/tables/EmptyTable';
// import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VendorTable from 'sections/cabprovidor/vendorManagement/VendorTable';
import { fetchVendors } from 'store/slice/cabProvidor/vendorSlice';

const Vendor = () => {
  const dispatch = useDispatch();
  const { vendors, metaData, loading, error } = useSelector((state) => state.vendors);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchVendors({ page: page, limit: limit }));
  }, [dispatch, page, limit]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  // if (loading) return <TableSkeleton rows={10} columns={6} />;
  if (error) return <Error500 />;
  // if (vendors.length === 0) return <EmptyTableDemo />;

  return <VendorTable data={vendors} page={page} setPage={setPage} limit={limit} setLimit={handleLimitChange} lastPageNo={lastPageIndex} loading={loading}/>;
};

export default Vendor;
