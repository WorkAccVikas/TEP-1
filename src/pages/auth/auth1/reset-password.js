// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router';
import AuthResetPassword from 'sections/auth/auth-forms/AuthResetPassword';

// project-imports
import AuthWrapper2 from 'sections/auth/AuthWrapper2';

// ================================|| RESET PASSWORD ||================================ //

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  return (
  <AuthWrapper2>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
          <Typography variant="h3">Reset Password</Typography>
          <Typography color="secondary">Please choose your new password</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthResetPassword email={email}/>
      </Grid>
    </Grid>
  </AuthWrapper2>
);
};

export default ResetPassword;
