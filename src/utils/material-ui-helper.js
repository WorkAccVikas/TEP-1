import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';

export const handleNumericInput = (event) => {
  const { value } = event.target;
  const newValue = value.replace(/[^0-9]/g, '');
  if (value !== newValue) {
    // alert('Only numeric values are allowed.');
    dispatch(
      openSnackbar({
        open: true,
        message: 'Please enter numbers only',
        variant: 'alert',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        alert: {
          color: 'error'
        },
        close: false
      })
    );
  }
  event.target.value = newValue;
};
