/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// assets
import { Clock, MinusCirlce, TickCircle } from 'iconsax-react';
import { COMPANY_STATUS } from './CompanyDetails';

// ==============================|| CHAT - AVATAR STATUS ICONS ||============================== //

const AvatarStatus = ({ status }) => {
  const theme = useTheme();

  switch (status) {
    case COMPANY_STATUS.Active:
      return <TickCircle size={14} variant="Bold" style={{ color: theme.palette.success.main }} />;

    case COMPANY_STATUS.Inactive:
      return <MinusCirlce size={14} variant="Bold" style={{ color: theme.palette.secondary.main }} />;

    // case 'offline':
    //   return <Clock size={14} variant="Bold" style={{ color: theme.palette.warning.main }} />;

    default:
      return null;
  }
};

AvatarStatus.propTypes = {
  status: PropTypes.string
};

export default AvatarStatus;
