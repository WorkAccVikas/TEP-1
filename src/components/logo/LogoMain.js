import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/logo.png';
import logo from 'assets/images/logo.png';
import { ThemeMode } from 'config';
import { useSelector } from 'store';
import { CircularProgress } from '@mui/material';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => {
  const theme = useTheme();
  const logos = useSelector((state) => state.accountSettings.settings?.logo);
  const name = useSelector((state) => state.accountSettings.settings?.name);
  // console.log(logos);
  // return <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="icon logo" width="100" />;
  // return <img src={logos || logo} alt="icon logo" width="100" />;

  // if (!logos) {
  //   return <CircularProgress />;
  // }

  return <img src={logos || logo} alt={name} width="100" />;
};

LogoMain.propTypes = {
  reverse: PropTypes.bool
};

export default LogoMain;
