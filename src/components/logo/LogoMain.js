import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/logo.png';
import logo from 'assets/images/logo.png';
import { ThemeMode } from 'config';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => {
  const theme = useTheme();
  return <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="icon logo" width="100" />;
};

LogoMain.propTypes = {
  reverse: PropTypes.bool
};

export default LogoMain;
