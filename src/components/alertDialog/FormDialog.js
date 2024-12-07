import PropTypes from 'prop-types';
// material-ui
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';

// ==============================|| DIALOG - FORM ||============================== //

export default function FormDialog({
  open,
  handleClose,
  handleConfirm,
  handleTextChange,
  title,
  content,
  placeholder = 'Enter your remarks',
  cancelledButtonTitle = 'Disagree',
  confirmedButtonTitle = 'Agree',
  showError = false
}) {
  const [error, setError] = useState('');
  const [val, setVal] = useState('');

  const handleSubmit = () => {
    if (!val && showError) {
      setError('Remarks is mandatory');
      return;
    }
    handleConfirm();
  };

  const handleChange = (e) => {
    setError('');
    setVal(e.target.value);
    handleTextChange(e);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle>{title || 'Subscribe'}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {content || 'To subscribe to this website, please enter your email address here. We will send updates occasionally.'}
            </DialogContentText>
            <TextField
              id="name"
              placeholder={placeholder}
              value={val}
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              maxRows={4}
              onChange={handleChange}
              error={!!error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              {cancelledButtonTitle}
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {confirmedButtonTitle}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  cancelledButtonTitle: PropTypes.string,
  confirmedButtonTitle: PropTypes.string,
  showError: PropTypes.bool
};
