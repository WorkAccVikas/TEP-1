import Breadcrumbs from 'components/@extended/Breadcrumbs';
import TableSkeleton from 'components/tables/TableSkeleton';
import { APP_DEFAULT_PATH } from 'config';
import Error500 from 'pages/maintenance/error/500';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompaniesRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';
import RosterFileTable from './components/RosterFileTable';
import FileUploadDialog from './components/dialog/FileUploadDialog';
import { useLocation } from 'react-router';

const RosterFileList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { fileData, openTemplate } = location.state || {};
  const [uploadFlag, setUploadFlag] = useState(0);

  const { rosterFiles, metaData, loading, error } = useSelector((state) => state.rosterFile);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchCompaniesRosterFile({ page: page, limit: limit }));
  }, [dispatch, page, limit, uploadFlag]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Roster', to: '/apps/roster' }, { title: 'Excel Files' }];

  // fileUpload Dialog
  const [openFileUploadDialog, setOpenFileUploadDialog] = useState(false);

  const handleFileUploadOpen = () => {
    setOpenFileUploadDialog(true);
  };
  const handleFileUploadClose = () => {
    setOpenFileUploadDialog(false);
  };

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
        handleFileUploadOpen={handleFileUploadOpen}
        openTemplate={openTemplate}
        fileData={fileData}
      />

      <FileUploadDialog
        setUploadFlag={setUploadFlag}
        open={openFileUploadDialog}
        handleOpen={handleFileUploadOpen}
        handleClose={handleFileUploadClose}
      />
    </>
  );
};

export default RosterFileList;
