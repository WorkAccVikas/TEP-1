import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers';

import { LOGOUT } from './reducers/actions';

// Persist config
const persistConfig = {
  key: 'sewak',
  version: 1,
  storage,
  blacklist: ['snackbar', 'menu'], // Do not persist snackbar, menu
  whitelist: ['auth', 'companies', 'vendors', 'zoneName', 'vehicleTypes', 'roles', 'zoneType'] // Always persist these slices
};

const persistedReducer = persistReducer(persistConfig, reducers);

const resetOnLogoutMiddleware = (store) => (next) => (action) => {
  if (action.type === LOGOUT) {
    store.dispatch({ type: 'companies/reset' });
    store.dispatch({ type: 'vendors/reset' });
  }
  return next(action);
};

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(resetOnLogoutMiddleware) // Add custom middleware here
});

// Persistor setup
export const persistor = persistStore(store);

// Custom hooks for dispatch and selector
const useDispatch = () => useAppDispatch();
const useSelector = useAppSelector;
const { dispatch } = store;

// Exporting the store, dispatch, useSelector, and useDispatch
export { dispatch, useSelector, useDispatch };
