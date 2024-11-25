import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { Forbidden, Forbidden2, MoneyForbidden, Receipt21, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function GenerateInvoiceAlert({ title, open, handleClose, handleTripGeneration, tripData }) {
  console.log({ tripData });
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (Array.isArray(tripData) && tripData.length > 0) {
      const firstCompanyId = tripData[0].companyID?._id;
      const allSame = tripData.every((item) => item.companyID?._id === firstCompanyId);
      setIsEligible(allSame);
      setLoading(false);
    } else {
      setIsEligible(false);
      setLoading(false);
    }
  }, [tripData]);

  console.log({ isEligible });
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
      {!loading && (
        <DialogContent sx={{ mt: 2, my: 1 }}>
          {isEligible ? (
            <Stack alignItems="center" spacing={1.5}>
              <Avatar color="primary" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                <Receipt21 variant="Bold" />
              </Avatar>
              <Stack spacing={2}>
                <Typography variant="h4" align="center">
                  Generate Invoice for {tripData.length} trip/trips for <br />
                  {tripData[0]?.companyID?.company_name}
                </Typography>

                <Typography align="center">{'You will be redirected to Invoice'}</Typography>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                <Button fullWidth onClick={(e) => handleClose(e, false)} color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Button fullWidth color="primary" variant="contained" onClick={handleTripGeneration} autoFocus>
                  Proceed
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={1.5}>
              <Avatar color="warning" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                <Forbidden2 variant="Bold" />
              </Avatar>
              <Stack spacing={2}>
                <Typography variant="h4" align="center">
                  Trips with multiple companies selected
                </Typography>
                <Typography align="center">{'Please select trips with same companies for Inovice Generation'}</Typography>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ width: 1 }}>
                <Button fullWidth onClick={(e) => handleClose(e, false)} color="secondary" variant="outlined">
                  Dismiss
                </Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}

GenerateInvoiceAlert.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func
};
