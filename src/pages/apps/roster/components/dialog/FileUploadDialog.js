// material-ui
import styled from '@emotion/styled';
import { Button, Divider, CardContent, Modal, Stack, Typography, Box } from '@mui/material';
// project-imports
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { dispatch } from 'store';
import SearchComponent from '../CompanySearch';
import { uploadRosterFile } from 'store/slice/cabProvidor/rosterFileSlice';
import { useNavigate } from 'react-router';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const FileUploadDialog = ({ open, handleClose, setUploadFlag }) => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('companyId', selectedCompany._id);
    formData.append('rosterFile', files[0]);

    console.log();
    setLoading(true);
    try {
      const resultAction = await dispatch(uploadRosterFile(formData));
      if (uploadRosterFile.fulfilled.match(resultAction)) {
        // Upload successful
        console.log('resultAction.payload.data', resultAction.payload.data);
        if (resultAction.payload.data) {
          console.log('after');
          setFiles(null);
          setSelectedCompany(null);
          handleClose();
          console.log('Before navigate');
          navigate('/apps/roster/files', { state: { fileData: resultAction.payload.data, openTemplate: true } });
          setUploadFlag((prev) => prev + 1);
          console.log('After navigate');
        }
      } else {
        // Handle the rejected case
        console.error('Upload failed:', resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
      <MainCard
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Typography variant="h5">Upload Roster File</Typography>
          </Box>
        }
        modal
        darkTitle
        content={false}
        sx={{
          padding: 0 // Optional: Padding inside the card
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ px: 2.5, py: 1 }}>
            <SearchComponent setSelectedCompany={setSelectedCompany} sx={{ width: '300px' }} />
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<FaCloudUploadAlt />}>
              Select files
              <VisuallyHiddenInput type="file" accept=".xlsx,.xls,.csv" onChange={(event) => handleFileChange(event)} />
            </Button>
            {files && (
              <Typography variant="caption" sx={{ pl: 0.5, pt: 1 }}>
                {files[0].name}
              </Typography>
            )}
          </Stack>
        </CardContent>
        <Divider />
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
          <Button
            color="error"
            size="small"
            onClick={() => {
              setFiles(null);
              setSelectedCompany(null);
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button color="success" size="small" variant="contained" onClick={handleUpload} disabled={!files || loading || !selectedCompany}>
            Upload
          </Button>
        </Stack>
      </MainCard>
    </Modal>
  );
};

export default FileUploadDialog;
