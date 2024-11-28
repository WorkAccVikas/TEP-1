import PropTypes from 'prop-types'
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const Card = ({ title, count, currency = false, currencySymbol = '₹' }) => {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>

        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {currency ? currencySymbol : ''} {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
};

export default Card;

Card.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  currency: PropTypes.bool,
  currencySymbol: PropTypes.string
};
