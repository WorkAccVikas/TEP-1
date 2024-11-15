import Error500 from 'pages/maintenance/error/500';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from 'store/slice/cabProvidor/companySlice';
import PropTypes from 'prop-types';
import CompanyTable from 'sections/cabprovidor/companyManagement/CompanyTable';

const Company = () => {
  const dispatch = useDispatch();
  const { companies = [], metaData = {}, loading = false, error = null } = useSelector((state) => state.companies || {});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [lastPageNo, setLastPageNo] = useState(Math.ceil(metaData.totalCount / metaData.limit) || 1);

  useEffect(() => {
    dispatch(fetchCompanies({ page: page, limit: limit }));
  }, [dispatch, page, limit]);

  if (error) return <Error500 />;
  return (
    <CompanyTable
      data={companies}
      metaData={metaData}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      lastPageNo={lastPageNo}
      setLastPageNo={setLastPageNo}
      loading={loading}
    />
  );
};

Company.propTypes = {
  value: PropTypes.string
};

export default Company;
