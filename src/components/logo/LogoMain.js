import PropTypes from 'prop-types';
import samplelogo from 'assets/images/logo.png';
import useAuth from 'hooks/useAuth';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => {
  const { accountSetting } = useAuth();

  const { logo = samplelogo, name = 'logo',favIcon="",title="" } = accountSetting || {};
  console.log("logo",logo);
  console.log("accountSetting",accountSetting);
  

  return <img src={logo} alt={name} width="100" />;
};

LogoMain.propTypes = {
  reverse: PropTypes.bool
};

export default LogoMain;
