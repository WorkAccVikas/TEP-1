import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Chip, Drawer, InputAdornment, OutlinedInput, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { ThemeMode } from 'config';

// assets
import Loader from 'components/Loader';
import { SearchNormal1 } from 'iconsax-react';
import Error500_2 from 'pages/maintenance/error/500-2';
import { useSelector } from 'react-redux';
import CompanyList from './CompanyList';

// ==============================|| CHAT - DRAWER ||============================== //

function CompanyDrawer({ handleDrawerOpen, openCompanyListDrawer, setCompany }) {
  const theme = useTheme();
  const { companies = [], metaData, loading, error = null } = useSelector((state) => state.companies);

  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerBG = theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'white';

  // set user status on status menu click

  const [search, setSearch] = useState('');
  const handleSearch = async (event) => {
    const newString = event?.target.value;
    setSearch(newString);
  };

  if (loading) return <Loader />;

  if (error) return <Error500_2 />;
  return (
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
      open={openCompanyListDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
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
          <Stack spacing={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="h5" color="inherit">
                Companies
              </Typography>
              <Chip label={metaData.totalCount} component="span" color={theme.palette.mode === ThemeMode.DARK ? 'default' : 'secondary'} />
            </Stack>

            <OutlinedInput
              fullWidth
              id="input-search-header"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              sx={{
                '& .MuiOutlinedInput-input': {
                  p: '10.5px 0px 12px'
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchNormal1 style={{ fontSize: 'small' }} />
                </InputAdornment>
              }
            />
          </Stack>
        </Box>

        <SimpleBar
          sx={{
            overflowX: 'hidden',
            height: 'calc(100vh)',
            minHeight: matchDownLG ? 0 : 420
          }}
        >
          <Box sx={{ p: 3, pt: 0 }}>
            <CompanyList companies={companies} setCompany={setCompany} search={search} />
          </Box>
        </SimpleBar>
      </MainCard>
    </Drawer>
  );
}

CompanyDrawer.propTypes = {
  handleDrawerOpen: PropTypes.func,
  openMainDrawer: PropTypes.bool,
  setCompany: PropTypes.func
};

export default CompanyDrawer;
