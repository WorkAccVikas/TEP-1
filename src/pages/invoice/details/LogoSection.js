// material-ui
import { useTheme } from '@mui/material/styles';

import logoIconDark from 'assets/images/logo_icon.png';
import logoIcon from 'assets/images/logo_icon.png';
import { ThemeMode } from 'config';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoSection = () => {
  const theme = useTheme();

  return <img src={'https://www.taxi.in/uploads/images/business2311/logo-sewak-travels.jpg'} alt="icon logo" width="100" height={'100'} />;
};

export default LogoSection;
