import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Badge,
  Box,
  ClickAwayListener,
  Link,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import { ThemeMode } from 'config';

// assets
import { Gift, MessageText1, Notification, Setting2 } from 'iconsax-react';
import Avatar from 'components/@extended/Avatar';
import { useNavigate } from 'react-router';
import axiosServices from 'utils/axios';

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //
function formatDateTime(input) {
  const now = new Date(); // Current date and time
  const inputDate = new Date(input); // Input date

  // Helper to add leading zero for single-digit numbers
  const padZero = (num) => (num < 10 ? `0${num}` : num);

  // Helper to format time with AM/PM
  const formatTimeWithAmPm = (hours, minutes) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${padZero(formattedHours)}:${padZero(minutes)} ${period}`;
  };

  // Get date differences
  const isSameDay = now.toDateString() === inputDate.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === inputDate.toDateString();

  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();
  const formattedTime = formatTimeWithAmPm(hours, minutes);

  if (isSameDay) {
    const diffMs = new Date() - inputDate; // Difference in milliseconds
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) {
      return { timeAgo: `${diffSecs} seconds ago`, time: formattedTime };
    } else if (diffHours < 1) {
      return { timeAgo: `${diffMins} minutes ago`, time: formattedTime };
    } else {
      return { timeAgo: `${diffHours} hours ago`, time: formattedTime };
    }
  } else if (isYesterday) {
    const formattedDate = `${padZero(inputDate.getDate())}-${padZero(inputDate.getMonth() + 1)}-${inputDate.getFullYear()}`;
    return { date: formattedDate, time: formattedTime };
  } else {
    // Fallback for other dates
    const formattedDate = `${padZero(inputDate.getDate())}-${padZero(inputDate.getMonth() + 1)}-${inputDate.getFullYear()}`;
    return { date: formattedDate, time: formattedTime };
  }
}
const NotificationPage = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [read] = useState(2);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const handleClick = () => {
    setOpen(false); // Close the NotificationPage
    navigate('/notification');
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'secondary.200' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axiosServices.get('/notification/');
      const notification = response.data.data;
      console.log({ notification });
      const filteredNotifications = notification.filter((item) => !item.is_read);
      console.log({ filteredNotifications });
      setNotifications(filteredNotifications);
    };
    fetchNotifications();
  }, []);

  function getIconByType(type) {
    switch (type) {
      case 'invoice':
        return (
          <Avatar type="filled">
            <Gift size={20} variant="Bold" />
          </Avatar>
        );
      case 'advance':
        return (
          <Avatar type="outlined">
            <MessageText1 size={20} variant="Bold" />
          </Avatar>
        );
      case 'roster':
        return (
          <Avatar>
            <Setting2 size={20} variant="Bold" />
          </Avatar>
        );
      case 'INVOICE':
        return (
          <ListItemAvatar>
            <Avatar type="combined">IN</Avatar>
          </ListItemAvatar>
        );
      default:
        return (
          <Avatar type="filled">
            <Gift size={20} variant="Bold" /> {/* Default fallback */}
          </Avatar>
        );
    }
  }
  return (
    <Box sx={{ flexShrink: 0, ml: 0.5 }}>
      <IconButton
        color="secondary"
        variant="light"
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        size="large"
        sx={{ color: 'secondary.main', bgcolor: open ? iconBackColorOpen : iconBackColor, p: 1 }}
      >
        <Badge badgeContent={read} color="success" sx={{ '& .MuiBadge-badge': { top: 2, right: 4 } }}>
          <Notification variant="Bold" />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} sx={{ overflow: 'hidden' }} in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                borderRadius: 1.5,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">Notifications</Typography>
                    <Link href="#" variant="h6" color="primary">
                      Mark all read
                    </Link>
                  </Stack>
                  <List
                    component="nav"
                    sx={{
                      '& .MuiListItemButton-root': {
                        p: 1.5,
                        my: 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                          borderColor: theme.palette.primary.light
                        },
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {notifications.map((item) => {
                      const { timeAgo, time } = formatDateTime(item.createdAt);
                      return (
                        <ListItemButton key={item._id}>
                          <ListItemAvatar>
                            {/* <Avatar type="filled">
                              <Gift size={20} variant="Bold" />
                            </Avatar> */}
                            {getIconByType(item.notificationType)}
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                It&apos;s{' '}
                                <Typography component="span" variant="subtitle1">
                                  Cristina danny&apos;s
                                </Typography>{' '}
                                birthday today.
                              </Typography>
                            }
                            secondary={timeAgo}
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" noWrap>
                              {time}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      );
                    })}

                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar type="outlined">
                          <MessageText1 size={20} variant="Bold" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            <Typography component="span" variant="subtitle1">
                              Aida Burg
                            </Typography>{' '}
                            commented your post.
                          </Typography>
                        }
                        secondary="5 August"
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          6:00 PM
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar>
                          <Setting2 size={20} variant="Bold" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            Your Profile is Complete &nbsp;
                            <Typography component="span" variant="subtitle1">
                              60%
                            </Typography>{' '}
                          </Typography>
                        }
                        secondary="7 hours ago"
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          2:45 PM
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar type="combined">C</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            <Typography component="span" variant="subtitle1">
                              Cristina Danny
                            </Typography>{' '}
                            invited to join{' '}
                            <Typography component="span" variant="subtitle1">
                              Meeting.
                            </Typography>
                          </Typography>
                        }
                        secondary="Daily scrum meeting time"
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          9:10 PM
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  </List>
                  <Stack direction="row" justifyContent="center">
                    <Link variant="h6" color="primary" onClick={handleClick}>
                      View all
                    </Link>
                  </Stack>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default NotificationPage;
