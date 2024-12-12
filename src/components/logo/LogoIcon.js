
import samplelogo from 'assets/images/logo_icon.png';
import useAuth from 'hooks/useAuth';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const { accountSetting } = useAuth();

  const { smallLogo = samplelogo, name = 'logo' } = accountSetting || {};

  return <img src={smallLogo} alt={name} width="40" />;
};

export default LogoIcon;
