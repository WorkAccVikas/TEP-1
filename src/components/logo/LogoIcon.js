// material-ui
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import logoIconDark from 'assets/images/logo_icon.png';
import logoIcon from 'assets/images/logo_icon.png';
import { ThemeMode } from 'config';
import { useSelector } from 'store';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();
  const smallLogo = useSelector((state) => state.accountSettings.settings?.smallLogo);
  const name = useSelector((state) => state.accountSettings.settings?.name);

  console.log(`🚀 ~ LogoIcon ~ smallLogo:`, smallLogo);
  console.log(`logoIcon`, logoIcon);

  // if (!smallLogo) {
  //   return <CircularProgress />;
  // }

  return <img src={smallLogo || logoIcon} alt={name} width="40" />;
};

export default LogoIcon;
