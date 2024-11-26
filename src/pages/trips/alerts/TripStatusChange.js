import PropTypes from 'prop-types';

// material-ui
import { Button, CircularProgress, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { Check, Trash } from 'iconsax-react';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function CustomAlert({
  title,
  subtitle,
  open,
  handleClose,
  handleCancel,
  icon,
  setRemarks,
  handleStatusPending,
  handleStatusCompleted,
  loading
}) {
  return (
    <Dialog
      open={open}
      onClose={(e) => handleClose(e, false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={1.5}>
          {icon}
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              {title}
            </Typography>
            <TextField
              placeholder="Enter Remark"
              id="url-start-adornment"
              InputProps={{
                startAdornment: 'Remarks:'
              }}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <Typography align="center">{subtitle}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleCancel} color="error" variant="contained" disabled={loading}>
              Cancelled
            </Button>
            <Button fullWidth onClick={handleStatusPending} color="warning" variant="contained" disabled={loading}>
              Pending
            </Button>
            <Button fullWidth color="success" variant="contained" onClick={handleStatusCompleted} disabled={loading}>
              Completed
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ width: 1 }}>
            <Button fullWidth onClick={(e) => handleClose(e, false)} color="secondary" variant="outlined">
              Dismiss
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

CustomAlert.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func
};
