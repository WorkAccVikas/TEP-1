import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography } from '@mui/material';

// third-party
import OtpInput from 'react18-input-otp';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { ThemeMode } from 'config';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = ({email}) => {
  const theme = useTheme();
  const [otp, setOtp] = useState();
  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.light;
  const { OTPSend,verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (otp.length === 6) {
      try {
        await verifyOTP(email, otp);
        // Handle success - navigate to another page or show a success message
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`, { replace: true });
      } catch (error) {
        
        if(error.response.status === 400){
 
          dispatch(
            openSnackbar({
              open: true,
              message: error.response.data.message,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      }
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: "Please enter a valid 6-digit OTP.",
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      )
    }
  };

  const handleResendCode = async () => {
    try {
      await OTPSend(email);  // Call OTPSend to resend the OTP
      dispatch(
        openSnackbar({
          open: true,
          message: 'OTP has been resent successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to resend OTP. Please try again.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <OtpInput
          value={otp}
          onChange={(otp) => setOtp(otp)}
          numInputs={6}
          containerStyle={{ justifyContent: 'space-between' }}
          inputStyle={{
            width: '100%',
            margin: '8px',
            padding: '10px',
            border: `1px solid ${borderColor}`,
            borderRadius: 4,
            ':hover': {
              borderColor: theme.palette.primary.main
            }
          }}
          focusStyle={{
            outline: 'none',
            boxShadow: theme.customShadows.primary,
            border: `1px solid ${theme.palette.primary.main}`
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <AnimateButton>
          <Button disableElevation fullWidth size="large" type="submit" variant="contained" onClick={handleVerify}>
            Continue
          </Button>
        </AnimateButton>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography>Not received Code?</Typography>
          <Typography variant="body1" sx={{ minWidth: 85, ml: 2, textDecoration: 'none', cursor: 'pointer' }} onClick={handleResendCode} color="primary">
            Resend code
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AuthCodeVerification;
