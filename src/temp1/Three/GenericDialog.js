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

export default GenericDialog;
