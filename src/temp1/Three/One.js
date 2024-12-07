import React, { useState } from 'react';
import { Button } from '@mui/material';
import GenericDialog from './GenericDialog';

const One = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Show Dialog
      </Button>
      <GenericDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Important Information"
        message={['Your profile has been successfully updated.', 'Please check your email for confirmation.']}
        primaryButtonText="Got it"
        onPrimaryButtonClick={() => alert('Primary button clicked')}
      />
    </>
  );
};

export default One;
