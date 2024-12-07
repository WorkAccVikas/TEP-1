// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router';
import AuthCodeVerification from 'sections/auth/auth-forms/AuthCodeVerification';
import AuthWrapper2 from 'sections/auth/AuthWrapper2';

// project-imports

// ================================|| CODE VERIFICATION ||================================ //

const OTPverification = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email'); // Get the email from the URL

  const obfuscatedEmail = email
    ? `${email.substring(0, 4)}****@${email.split('@')[1]}`
    : 'your email'; // Obfuscating the email for display

  return (
    <AuthWrapper2>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="h3">Enter Verification Code</Typography>
            <Typography color="secondary">We sent you a code on your email.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {/* Display obfuscated email */}
          <Typography>We&apos;ve sent you a code on {obfuscatedEmail}</Typography>
        </Grid>
        <Grid item xs={12}>
          <AuthCodeVerification email={email} />
        </Grid>
      </Grid>
    </AuthWrapper2>
  );
};

export default OTPverification;
