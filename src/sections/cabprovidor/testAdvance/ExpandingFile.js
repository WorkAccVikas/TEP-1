// project-imports

import makeData from 'data/react-table';
import { useMemo } from 'react';
import ExpandingDetails from './ExpandingDetails';
import { Grid } from '@mui/material';

// ==============================|| REACT TABLE - EXPANDING ||============================== //

const Expanding = () => {
  const data = useMemo(() => makeData(20), []);

  return (
    // <Grid container spacing={3}>
      <Grid item xs={12}>
        <ExpandingDetails data={data.slice(11, 19)} />
      </Grid>
    // </Grid>
  );
};

export default Expanding;
