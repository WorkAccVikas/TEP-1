import PropTypes from 'prop-types';
// material-ui
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

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
  confirmedButtonTitle = 'Agree'
}) {
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
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              maxRows={4}
              onChange={handleTextChange}
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              {cancelledButtonTitle}
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
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
  confirmedButtonTitle: PropTypes.string
};
