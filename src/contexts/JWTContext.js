/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { createContext, useEffect } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { INITIALIZE, LOGIN, LOGOUT } from 'store/reducers/actions';

// project-imports
import axios from 'utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { MODULE, PERMISSIONS } from 'constant';
import { openSnackbar } from 'store/reducers/snackbar';
import CustomCircularLoader from 'components/CustomCircularLoader';

// const x = {
//   company: ['CREATE', 'edit'],
//   vendor: ['CREATE', 'Read'],
//   // vendor: ['Read'],
//   driver: ['add', 'read'],
//   invoice: ['add'],
//   reports: ['add'],
//   user: [''],
//   roster: ['READ'],
//   // role: ['READ', 'CREATE'],
//   // role: ['READ'],
//   // role: ['READ', 'UPDATE'],
//   role: ['READ', 'DELETE'],
//   // role: ['READ', 'CREATE', 'UPDATE'],
//   zone: ['CREATE', 'UPDATE', 'DELETE', 'READ'],
//   'cab-rate': ['read']
// };

// eslint-disable-next-line no-unused-vars

/** */

const x = {
  [MODULE.ROSTER]: [PERMISSIONS.CREATE],

  [MODULE.USER]: [PERMISSIONS.READ],
  [MODULE.COMPANY]: [PERMISSIONS.READ, PERMISSIONS.CREATE],
  [MODULE.VENDOR]: [PERMISSIONS.READ, PERMISSIONS.CREATE],
  [MODULE.DRIVER]: [PERMISSIONS.READ],
  [MODULE.CAB]: [PERMISSIONS.READ],

  [MODULE.ROLE]: [PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.DELETE],
  [MODULE.ZONE]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.DELETE],
  [MODULE.ZONE_TYPE]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE],
  [MODULE.CAB_TYPE]: [PERMISSIONS.READ, PERMISSIONS.DELETE, PERMISSIONS.CREATE],
  [MODULE.CAB_RATE]: [PERMISSIONS.READ],
  [MODULE.CAB_RATE_VENDOR]: [PERMISSIONS.READ],
  [MODULE.CAB_RATE_DRIVER]: [PERMISSIONS.CREATE],

  [MODULE.INVOICE]: [PERMISSIONS.READ],
  [MODULE.REPORT]: [PERMISSIONS.READ],
  [MODULE.LOAN]: [PERMISSIONS.READ],
  [MODULE.ADVANCE]: [PERMISSIONS.READ, PERMISSIONS.CREATE],
  [MODULE.ADVANCE_TYPE]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE]
};

// const x = null;

const chance = new Chance();

// Define the structure of your decoded JWT token if needed
const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(serviceToken);
    // change token verification logic here

    // return decoded.exp > Date.now() / 1000;
    return !!decoded;
  } catch (error) {
    console.error('Token verification failed', error);
    return false;
  }
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common['Authorization'] = `${serviceToken}`; // Added `Bearer` for better token handling
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // this function will check the session validation and will redirect to home/ login page
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const response = await axios.get('/user/view');
          // eslint-disable-next-line no-unused-vars
          console.log(response.data);
          const { userData, userSpecificData } = response.data;
          // console.log(userData, userSpecificData, userPermissions)
          dispatch({
            type: LOGIN,
            payload: {
              user: userData,
              userType: userData.userType,
              userSpecificData: userSpecificData,
              // userPermissions: userPermissions
              userPermissions: x
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      } finally {
        dispatch({
          type: INITIALIZE
        });
      }
    };

    init();
  }, [dispatch]); // Added `dispatch` dependency

  const login = async (email, password) => {
    const payload = {
      data: {
        userEmail: email,
        userPassword: password
      }
    };

    const response = await axios.post('/user/login', payload);
    const { userData, userSpecificData, userPermissions } = response.data;

    const userInfo = {
      userId: userData._id,
      userType: userData.userType
    };

    localStorage.setItem('userInformation', JSON.stringify(userInfo));

    setSession(userData.token);
    dispatch({
      type: LOGIN,
      payload: {
        user: userData,
        userType: userData.userType,
        userSpecificData: userSpecificData,
        // userPermissions: x
        userPermissions: userPermissions
      }
    });
  };

  const register = async (formData) => {
    try {
      // Recode this flow to ensure user verification logic
      await axios.post('/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.log('Error registering user:', error);
      throw error;
      // dispatch(openSnackbar({ message: 'Error registering user', variant: 'error', open: true, close: true }));
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const OTPSend = async (email) => {
    const payload = {
      data: {
        userEmail: email
      }
    };

    try {
      const response = await axios.post('/user/send/otp', payload);
      // console.log('OTP sent successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error sending OTP:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    const payload = {
      data: {
        userEmail: email,
        OTP: otp
      }
    };

    try {
      const response = await axios.post('/user/verify/otp', payload);
      // console.log('OTP verified successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const resetPassword = async (email, newPassword) => {
    const payload = {
      data: {
        userEmail: email,
        userPassword: newPassword
      }
    };

    try {
      const response = await axios.post('/user/reset/password', payload);
      // console.log('Password reset successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error resetting password:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const updateProfile = () => {
    // Handle profile update logic
  };
  if (auth.isInitialized !== undefined && !auth.isInitialized) {
    // return <Loader />;
    return <CustomCircularLoader />;
  }
  return (
    <JWTContext.Provider
      value={{
        ...auth, // Assuming auth contains the necessary state
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        verifyOTP,
        OTPSend
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node.isRequired // Ensure children are required
};

export default JWTContext;
