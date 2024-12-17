import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent, TimelineConnector } from '@mui/lab';
import { Card, Bill, Car, WalletMoney } from 'iconsax-react';
import MainCard from 'components/MainCard';
import axiosServices from 'utils/axios';
import { Button, Stack, Box, CircularProgress } from '@mui/material';
import EmptyTableDemo from 'components/tables/EmptyTable';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

// adding styling according to icons
const getNotificationColors = (type) => {
  switch (type) {
    case 'ADVANCE':
      return { color: 'primary.darker', bgcolor: 'primary.lighter' };
    case 'INVOICE':
      return { color: 'success.darker', bgcolor: 'success.lighter' };
    case 'TRIP':
      return { color: 'warning.darker', bgcolor: 'warning.lighter' };
    case 'TRANSACTION':
      return { color: 'error.darker', bgcolor: 'error.lighter' };
    default:
      return { color: 'grey.800', bgcolor: 'grey.300' }; // Default color
  }
};

// picking icons according to notification type
function getIconByType(type) {
  switch (type) {
    case 'ADVANCE':
      return <Card size={24} variant="Bold" />;
    case 'INVOICE':
      return <Bill size={24} variant="Bold" />;
    case 'TRIP':
      return <Car size={24} variant="Bold" />;
    case 'TRANSACTION':
      return <WalletMoney size={24} variant="Bold" />;
    default:
      return null;
  }
}

// formatting date to desired one for ex - Yesterday, 03:42 PM
function formatDateTime(input) {
  const now = new Date();
  const inputDate = new Date(input);
  const padZero = (num) => (num < 10 ? `0${num}` : num);
  const formatTimeWithAmPm = (hours, minutes) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${padZero(formattedHours)}:${padZero(minutes)} ${period}`;
  };

  const isSameDay = now.toDateString() === inputDate.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === inputDate.toDateString();

  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();
  const formattedTime = formatTimeWithAmPm(hours, minutes);

  if (isSameDay) return { date: 'Today', time: formattedTime };
  if (isYesterday) return { date: 'Yesterday', time: formattedTime };

  return {
    date: `${inputDate.getDate()} ${inputDate.toLocaleString('default', { month: 'short' })}`,
    time: formattedTime
  };
}

let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Notification' }];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetch, setFetch] = useState(false);

  // Group notifications by date
  const groupNotificationsByDate = (notifications) => {
    return notifications.reduce((groups, notification) => {
      const { date } = formatDateTime(notification.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(notification);
      return groups;
    }, {});
  };

  // useEffect calling to get all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosServices.get('/notification/');
        const notification = response.data.data;
        const filteredNotifications = notification.filter((item) => !item.is_read);
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    fetchNotifications();
  }, [fetch]);

  // Handle Mark All Read
  const handleMarkAllRead = async () => {
    try {
      const notificationIds = notifications.map((item) => item._id); // Use notification._id
      if (notificationIds.length === 0) return;

      await axiosServices.put('/notification/update/status', {
        data: { notificationIds, status: true }
      });

      // Update local state to remove all unread notifications
      setNotifications([]);
      setFetch(true);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Show loading or empty table if no data
  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <EmptyTableDemo />
      </>
    );
  }

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <>
      <Breadcrumbs custom links={breadcrumbLinks} />
      <MainCard
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* Title on the left */}
            <Typography variant="h5">Notifications</Typography>
            {/* Mark All Read button on the right */}
            <Button
              variant="text"
              size="small"
              onClick={handleMarkAllRead}
              sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.main' }}
            >
              Mark All Read
            </Button>
          </Stack>
        }
      >
        <Timeline
          position="right"
          sx={{
            '& .MuiTimelineItem-root:before': {
              content: 'none' // Disable the pseudo-element
            },
            '& .MuiTimelineItem-root': { minHeight: 100 },
            '& .MuiTimelineOppositeContent-root': { display: 'none' },
            '& .MuiTimelineDot-root': {
              borderRadius: 1.25,
              boxShadow: 'none',
              margin: 0,
              ml: 1.25,
              mr: 1.25,
              p: 1,
              '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
            },
            '& .MuiTimelineContent-root': {
              borderRadius: 1,
              bgcolor: 'secondary.lighter',
              height: '100%',
              textAlign: 'left' // Align content to the left
            },
            '& .MuiTimelineSeparator-root': {
              textAlign: 'right' // Align separators to the right
            },
            '& .MuiTimelineConnector-root': { border: '1px dashed', borderColor: 'secondary.light', bgcolor: 'transparent' }
          }}
        >
          {Object.keys(groupedNotifications).map((date, index) => (
            <div key={index}>
              <Typography variant="h6" color="textPrimary" sx={{ mb: 2, fontWeight: 'bold' }}>
                {date}
              </Typography>
              {groupedNotifications[date].map((item, index) => {
                const { time } = formatDateTime(item.createdAt);
                return (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot sx={getNotificationColors(item.notificationType)}>{getIconByType(item.notificationType)}</TimelineDot>
                      {index !== groupedNotifications[date].length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography color="textSecondary">{item.content || 'No details provided.'}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {`${time}`}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </div>
          ))}
        </Timeline>
      </MainCard>
    </>
  );
}
