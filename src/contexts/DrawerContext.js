import React, { createContext, useContext, useState } from 'react';

// Create a context for the drawer
const DrawerContext = createContext();

// Custom hook to use the DrawerContext
export const useDrawer = () => {
  return useContext(DrawerContext);
};

// Provider component
export const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};
