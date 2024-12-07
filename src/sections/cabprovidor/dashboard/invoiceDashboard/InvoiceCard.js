// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { DocumentText, DocumentUpload } from 'iconsax-react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';

// ==============================|| INVOICE - CARD ||============================== //

export default function InvoiceCard({ handleFileUploadDialogue }) {
  const navigate=useNavigate();
  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={4} sm={2} lg={6}>
          <Box
            onClick={() => {
              // console.log('drawer', isOpen);
              // openDrawer();
              navigate('/apps/invoices/list');
            }}
            sx={{ cursor: 'pointer' }}
          >
            <MainCard>
              <Stack alignItems="center" spacing={2}>
                <Avatar size="md" type="filled">
                  <DocumentText variant="Bold" />
                </Avatar>
                <Typography variant="subtitle1" color="text.secondary">
                  All
                </Typography>
              </Stack>
            </MainCard>
          </Box>
        </Grid>
        {/* <Grid item xs={4} sm={2} lg={6}>
          <MainCard>
            <Stack alignItems="center" spacing={2}>
              <Avatar size="md" type="filled" color="info">
                <ArchiveBook variant="Bold" />
              </Avatar>
              <Typography variant="subtitle1" color="text.secondary">
                Reports
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={4} sm={2} lg={6}>
          <MainCard>
            <Stack alignItems="center" spacing={2}>
              <Avatar size="md" type="filled" color="success">
                <DollarCircle variant="Bold" />
              </Avatar>
              <Typography variant="subtitle1" color="text.secondary">
                Paid
              </Typography>
            </Stack>
          </MainCard>
        </Grid> */}
        {/* <Grid item xs={4} sm={2} lg={6}>
          <Box
            onClick={() => {
              console.log('handleuploadclick');
              // navigate('/apps/roster/file-management')
            }}
            sx={{ cursor: 'pointer' }}
          >
            <MainCard>
              <Stack alignItems="center" spacing={2}>
                <Avatar size="md" type="filled" color="warning">
                  <Folder2 variant="Bold" />
                </Avatar>
                <Typography variant="subtitle1" color="text.secondary">
                  Files
                </Typography>
              </Stack>
            </MainCard>
          </Box>
        </Grid> */}
        {/* <Grid item xs={4} sm={2} lg={6}>
          <MainCard>
            <Stack alignItems="center" spacing={2}>
              <Avatar size="md" type="filled" color="error">
                <CloseCircle variant="Bold" />
              </Avatar>
              <Typography variant="subtitle1" color="text.secondary">
                Cancelled
              </Typography>
            </Stack>
          </MainCard>
        </Grid> */}
        <Grid item xs={4} sm={2} lg={6}>
          <Box
            onClick={() => {
              // console.log('handleuploadclick');
              // handleFileUploadDialogue();
              navigate('/apps/invoices/create');
            }}
            sx={{ cursor: 'pointer' }}
          >
            <MainCard>
              <Stack alignItems="center" spacing={2}>
                <Avatar size="md" type="filled" color="warning">
                  <DocumentUpload variant="Bold" />
                </Avatar>
                <Typography variant="subtitle1" color="text.secondary">
                  Upload
                </Typography>
              </Stack>
            </MainCard>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
}
