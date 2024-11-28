import PropTypes from 'prop-types';
import { Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

function Badge({ title, count, currency = false, currencySymbol = '₹' }) {
  return (
      <MainCard content={false}>
        <Stack alignItems="center" sx={{ py: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} /> */}
            <Typography>{title}</Typography>
          </Stack>
          <Typography variant="subtitle1">
            {currency ? currencySymbol : ''} {count}
          </Typography>
        </Stack>
      </MainCard>
  );
}

export default Badge;

Badge.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  currency: PropTypes.bool,
  currencySymbol: PropTypes.string
};
