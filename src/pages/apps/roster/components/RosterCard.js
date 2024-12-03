import PropTypes from 'prop-types';

// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// assets
import { ArrowDown3, ArrowSwapHorizontal, ArrowUp3 } from 'iconsax-react';

// ==============================|| INVOICE - CARD  ||============================== //

const TableWidgetCard = ({ color, title, count, percentage, isLoss, entries,even }) => {
  return (
    <Grid container direction="row" spacing={2} justifyContent="space-between">
      <Grid item xs={12} md={5}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle1">{title}</Typography>

          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1}>
              <Typography color="secondary">count</Typography>
              <Typography variant="subtitle1">{count}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={7}>
        <Box>
          <Stack direction="column" alignItems="flex-end" justifyContent="space-evenly">
            {percentage && (
              <Stack sx={{ ml: 1.25, pl: 1 }} direction="row" alignItems="center" spacing={1}>
                {!isLoss && <ArrowUp3 variant="Bold" style={{ fontSize: '0.75rem', color: `${color}` }} />}
                {isLoss && <ArrowDown3 variant="Bold" style={{ fontSize: '0.75rem', color: `${color}` }} />}
                <Typography color="secondary">{percentage}%</Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              
              <Typography color="secondary">Entries</Typography>
              <Typography variant="subtitle1" color="inherit" >
                {entries}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

TableWidgetCard.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  children: PropTypes.node,
  invoice: PropTypes.string
};

export default TableWidgetCard;
