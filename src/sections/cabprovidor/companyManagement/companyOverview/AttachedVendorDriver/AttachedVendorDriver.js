
// material-ui
import { Grid } from '@mui/material';

// project-imports
// import makeData from 'data/react-table';
import ExpandingSubTable from './ExpandingSubTable';
import { useMemo } from 'react';
import makeData from 'data/react-table';

// ==============================|| REACT TABLE - EXPANDING ||============================== //

const AttachedVendorDriver = () => {
  const data = useMemo(() => makeData(20), []);

  return (
    <Grid item xs={12}>
      <ExpandingSubTable data={data.slice(11, 19)} />
    </Grid>
  );
};

export default AttachedVendorDriver;
