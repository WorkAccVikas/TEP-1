import PropTypes from 'prop-types';
import logo from 'assets/images/logo.png';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => {

  return <img src={logo} alt={name} width="100" />;
};

LogoMain.propTypes = {
  reverse: PropTypes.bool
};

export default LogoMain;
