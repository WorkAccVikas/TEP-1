import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to alert the user before leaving the page.
 * This covers page reload, browser back button, and manual back button clicks.
 *
 * @param {boolean} isEnabled - Enable or disable the alert functionality.
 * @param {string} message - Custom alert message to display.
 */
const useBeforeUnloadAlert = (isEnabled = true, message = 'Are you sure you want to leave?') => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isEnabled) {
        event.preventDefault();
        event.returnValue = message;
      }
    };

    const handleNavigation = (event) => {
      if (isEnabled && !window.confirm(message)) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [isEnabled, message, navigate, location]);
};

export default useBeforeUnloadAlert;
