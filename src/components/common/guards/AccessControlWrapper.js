import PropTypes from 'prop-types';
import { useSelector } from 'store';

const AccessControlWrapper = ({ children, allowedUserTypes }) => {
  const { userType } = useSelector((state) => state.auth);

  const hasAccess = checkUserAccess(userType, allowedUserTypes);

  return hasAccess ? children : null;
};

export const checkUserAccess = (userType, allowedUserTypes) => {
  return allowedUserTypes.includes(userType);
};

AccessControlWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  allowedUserTypes: PropTypes.arrayOf(PropTypes.number).isRequired // Assuming userType is a number
};

export default AccessControlWrapper;
