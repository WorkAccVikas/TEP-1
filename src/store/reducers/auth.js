// action - state management
import { REGISTER, LOGIN, LOGOUT, INITIALIZE } from './actions';

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  userType: null,
  userSpecificData: null,
  userPermissions: null
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      const { user, userType, userSpecificData, userPermissions } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        user: user,
        userType: userType,
        userSpecificData: userSpecificData,
        userPermissions: userPermissions
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        userType: null,
        userSpecificData: null,
        userPermissions: null
      };
    }
    case INITIALIZE: {
      return {
        ...state,
        isInitialized: true
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
