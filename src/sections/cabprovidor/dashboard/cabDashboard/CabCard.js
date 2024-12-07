// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { AddCircle, ArchiveBook, CloseCircle, DocumentText, DocumentUpload, DollarCircle, Folder2, ShoppingBag } from 'iconsax-react';
import { Box } from '@mui/material';
import { useDrawer } from 'contexts/DrawerContext';
import { useNavigate } from 'react-router';

// ==============================|| CAB - CARD ||============================== //

export default function CabCard({ handleFileUploadDialogue }) {
  const { isOpen, openDrawer } = useDrawer();
  const navigate=useNavigate();
  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={4} sm={2} lg={6}>
          <Box
            onClick={() => {
              // console.log('drawer', isOpen);
              // openDrawer();
              navigate('/management/cab/view');
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
        <Grid item xs={4} sm={2} lg={6}>
          <Box
            onClick={() => {
              navigate('/management/cab/add-cab')
            }}
            sx={{ cursor: 'pointer' }}
          >
            <MainCard>
              <Stack alignItems="center" spacing={2}>
                <Avatar size="md" type="filled" color="warning">
                  <AddCircle variant="Bold" />
                </Avatar>
                <Typography variant="subtitle1" color="text.secondary">
                  Add
                </Typography>
              </Stack>
            </MainCard>
          </Box>
        </Grid>
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
        </Grid>
        <Grid item xs={4} sm={2} lg={6}>
          <Box
            onClick={() => {
              console.log('handleuploadclick');
              // handleFileUploadDialogue();
            }}
            sx={{ cursor: 'pointer' }}
          >
            <MainCard>
              <Stack alignItems="center" spacing={2}>
                <Avatar size="md" type="filled">
                  <DocumentUpload variant="Bold" />
                </Avatar>
                <Typography variant="subtitle1" color="text.secondary">
                  Upload
                </Typography>
              </Stack>
            </MainCard>
          </Box>
        </Grid> */}
      </Grid>
    </MainCard>
  );
}
