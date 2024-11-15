import PropTypes from 'prop-types';
import { Chip, Typography } from '@mui/material';

const ACTION_COLORS = {
  create: '#4CAF50', // Green
  update: '#2196F3', // Blue
  read: '#9E9E9E', // Grey
  delete: '#F44336' // Red
};

const GenericChip = ({ label }) => {
  // Split the input label into primary and secondary text based on the delimiter
  const [primaryText, secondaryText] = label.split(' - ');

  return (
    <Chip
      label={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {primaryText}
          </Typography>
          <Typography variant="caption" sx={{ color: ACTION_COLORS[secondaryText.toLowerCase()] || 'text.secondary' }}>
            {secondaryText}
          </Typography>
        </div>
      }
      sx={{ bgcolor: 'grey.300', fontSize: '0.75rem', textTransform: 'capitalize', p: '2rem 1rem' }}
    />
  );
};

GenericChip.propTypes = {
  label: PropTypes.string.isRequired
};

export default GenericChip;
