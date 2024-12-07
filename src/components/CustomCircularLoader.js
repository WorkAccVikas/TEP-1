import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const CustomCircularLoader = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default CustomCircularLoader;
