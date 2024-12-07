import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography
} from '@mui/material';

const CustomDialog = ({ open, onSave }) => {
  const [discountOption, setDiscountOption] = useState('no-discount');
  const [taxOption, setTaxOption] = useState('line-item');
  const [roundingOption, setRoundingOption] = useState('no-rounding');
  const [additionalItems, setAdditionalItems] = useState('yes');

  const handleDiscountChange = (event) => {
    setDiscountOption(event.target.value);
  };

  const handleTaxChange = (event) => {
    setTaxOption(event.target.value);
  };

  const handleRoundingChange = (event) => {
    setRoundingOption(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setAdditionalItems(event.target.value);
  };

  const handleSave = () => {
    // Call the onSave function passed from Create to handle closing the dialog
    onSave({
      discountOption,
      additionalItems,
      taxOption,
      roundingOption,
    });
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'red' }}>
        <Typography variant="h5">Set Your Transaction Preferences</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Do you give discounts?</Typography>
        <RadioGroup value={discountOption} onChange={handleDiscountChange}>
          <FormControlLabel value="no-discount" control={<Radio />} label="I don't give discounts" />
          <FormControlLabel value="line-item" control={<Radio />} label="At Line Item Level" />
          <FormControlLabel value="transaction-level" control={<Radio />} label="At Transaction Level" />
        </RadioGroup>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Do you want to add any additional charges?
        </Typography>
        <RadioGroup value={additionalItems} onChange={handleCheckboxChange}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Handle Tax at:
        </Typography>
        <RadioGroup value={taxOption} onChange={handleTaxChange}>
          <FormControlLabel value="line-item" control={<Radio />} label="At Line Item Level" />
          <FormControlLabel value="group-level" control={<Radio />} label="At Group Level" />
        </RadioGroup>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Rounding off in Transactions
        </Typography>
        <RadioGroup value={roundingOption} onChange={handleRoundingChange}>
          <FormControlLabel value="no-rounding" control={<Radio />} label="No rounding" />
          <FormControlLabel value="round-to-whole" control={<Radio />} label="Rounding off the total to the nearest whole number" />
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save and Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
