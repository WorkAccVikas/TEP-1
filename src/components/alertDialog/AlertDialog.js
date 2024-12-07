import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const AlertDialog = ({
  open,
  handleClose,
  handleConfirm,
  title,
  content,
  cancelledButtonTitle = 'Disagree',
  confirmedButtonTitle = 'Agree'
}) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle id="alert-dialog-title">{title || 'Use Google&apos;s location service?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {content ||
                'Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.'}
            </DialogContentText>
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
};

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  cancelledButtonTitle: PropTypes.string,
  confirmedButtonTitle: PropTypes.string
};

export default AlertDialog;
