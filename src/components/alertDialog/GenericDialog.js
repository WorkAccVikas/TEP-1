import PropTypes from 'prop-types';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Stack } from '@mui/material';

const GenericDialog = ({ open, onClose, title = 'Notification', message, primaryButtonText = 'OK', onPrimaryButtonClick }) => {
  const handlePrimaryClick = () => {
    if (onPrimaryButtonClick) onPrimaryButtonClick();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {Array.isArray(message) ? (
            message.map((msg, index) => (
              <Typography key={index} variant="body1">
                {msg}
              </Typography>
            ))
          ) : (
            <Typography variant="body1">{message}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handlePrimaryClick} sx={{ textTransform: 'none' }}>
          {primaryButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GenericDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Whether the dialog is open
  onClose: PropTypes.func.isRequired, // Function to handle dialog close
  title: PropTypes.string, // Dialog title (default: 'Notification')
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired, // Message content
  primaryButtonText: PropTypes.string, // Text for the primary button (default: 'OK')
  onPrimaryButtonClick: PropTypes.func // Function to handle primary button click
};

export default GenericDialog;
