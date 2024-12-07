import { getCaseInsensitiveValue, USERTYPE } from 'constant';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

/**
 * WrapperButton component conditionally renders children based on user permissions.
 *
 * @param {React.ReactNode} children - The button or element to render.
 * @param {string} moduleName - The module name for which permission is being checked.
 * @param {string} permission - The required permission for the module.
 * @returns {React.ReactNode|null} - The children component if permission exists, or null if not.
 */
const WrapperButton = ({ children, moduleName, permission }) => {
  const { userPermissions, userType } = useSelector((state) => state.auth);

  // Display button for cab provider or vendor
  if ([USERTYPE.iscabProvider, USERTYPE.isVendor].includes(userType)) {
    return children;
  }

  // If user permissions are not available, then don't show the button
  if (!userPermissions) {
    return null;
  }

  const hasPermission = checkPermission(userPermissions, moduleName, permission);

  return hasPermission ? children : null;
};

WrapperButton.propTypes = {
  children: PropTypes.node,
  moduleName: PropTypes.string.isRequired, // The name of the module (e.g., "company")
  permission: PropTypes.string.isRequired // The required permission (e.g., "create")
};

export default WrapperButton;

/**
 * Function to check if the user has the required permission for the module.
 *
 * @param {object} permissionsObject - The object containing all permissions for modules.
 * @param {string} moduleName - The module name for which permission is being checked.
 * @param {string} permission - The required permission for the module.
 * @returns {boolean} - Returns true if permission exists, false otherwise.
 */
export function checkPermission(permissionsObject, moduleName, permission) {
  const normalizedModuleName = moduleName.toLowerCase();
  const normalizedPermission = permission.toLowerCase();

  //   const modulePermissions = permissionsObject[normalizedModuleName] || []; // sensitively compare the module name
  const modulePermissions = getCaseInsensitiveValue(permissionsObject, normalizedModuleName) || []; // insensitively compare the module name

  return modulePermissions.some((perm) => perm.toLowerCase() === normalizedPermission);
}
