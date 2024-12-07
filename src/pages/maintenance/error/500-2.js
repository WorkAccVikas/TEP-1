// material-ui
import { Box, Button, Drawer, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { fetchCompanies } from 'store/slice/cabProvidor/companySlice';
// ==============================|| ERROR 500 ||============================== //

function Error500_2() {
  const theme = useTheme();

  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerBG = theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'white';

  return (
    <>
      <Drawer
        sx={{
          width: 320,
          flexShrink: 0,
          zIndex: { xs: 1200, lg: 0 },
          '& .MuiDrawer-paper': {
            height: matchDownLG ? '100%' : 'auto',
            width: 320,
            boxSizing: 'border-box',
            position: 'relative',
            border: 'none',
            ...(!matchDownLG && {
              borderRadius: '12px 0 0 12px'
            })
          }
        }}
        variant={matchDownLG ? 'temporary' : 'persistent'}
        anchor="left"
        open={true} // Make sure to set this based on your state or props
        ModalProps={{ keepMounted: true }}
      >
        <MainCard
          sx={{
            bgcolor: matchDownLG ? 'transparent' : drawerBG,
            borderRadius: '12px 0 0 12px',
            borderRight: 'none'
          }}
          border={!matchDownLG}
          content={false}
        >
          <Box sx={{ p: 3, pb: 1 }}>
            <Grid container direction="row" alignItems="center" justifyContent="center">
              <Stack direction="column" spacing={1} alignItems="center">
                <Typography variant="h1" sx={{ textAlign: 'center' }}>
                  Internal Server Error
                </Typography>
              </Stack>
              <Button
                onClick={() => {
                  dispatch(fetchCompanies());
                }}
                variant="contained"
                sx={{ textTransform: 'none', mt: 8 }} // Add margin for spacing
              >
                retry
              </Button>
            </Grid>
          </Box>
          <SimpleBar
            sx={{
              overflowX: 'hidden',
              height: 'calc(70vh)',
              minHeight: matchDownLG ? 0 : 420
            }}
          >
            <Box sx={{ p: 3, pt: 0, mt: 5 }}>
              <Typography color="textSecondary" variant="body2" align="center" justifyContent={'center'}>
                Server error 500. We are fixing the problem. Please try again at a later stage.
              </Typography>
            </Box>
          </SimpleBar>
        </MainCard>
      </Drawer>
    </>
  );
}

export default Error500_2;
