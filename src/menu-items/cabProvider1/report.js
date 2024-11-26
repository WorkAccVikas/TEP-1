// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MenuBoard } from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard,
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const report = {
  id: 'group-application',
  title: <FormattedMessage id="reports" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Report
    {
      id: 'reports',
      title: <FormattedMessage id="reports" />,
      type: 'collapse',
      icon: icons.samplePage,
      children: [
        // Company
      {
        id: 'company',
        title: <FormattedMessage id="company" />,
        type: 'collapse',
        icon: icons.samplePage,
        children: [
          {
            id: 'rosterreports',
            title: <FormattedMessage id="rosterreports" />,
            type: 'item',
            url: '/reports',
          },
        ]
      },
       // Vendor
      {
        id: 'vendor',
        title: <FormattedMessage id="vendor" />,
        type: 'collapse',
        icon: icons.samplePage,
        children: [
          {
            id: 'cabreports',
            title: <FormattedMessage id="cabreports" />,
            type: 'item',
            url: '/reports',
          },
          {
            id: 'invoicereports',
            title: <FormattedMessage id="invoicereports" />,
            type: 'item',
            url: '/reports',
          },
          {
            id: 'mcdreports',
            title: <FormattedMessage id="mcdreports" />,
            type: 'item',
            url: '/reports',
          },
        ]
      },
       // Driver
      {
        id: 'driver',
        title: <FormattedMessage id="driver" />,
        type: 'collapse',
        icon: icons.samplePage,
        children: [
          {
            id: 'cabreports',
            title: <FormattedMessage id="cabreports" />,
            type: 'item',
            url: 'reports-driver'
          },
          {
            id: 'invoicereports',
            title: <FormattedMessage id="invoicereports" />,
            type: 'item',
            url: 'reports-driver'
          },
          {
            id: 'mcdreports',
            title: <FormattedMessage id="mcdreports" />,
            type: 'item',
            url: 'reports-driver'
          },
        ]
      }
      ]
    },
  ]
};

export default report;
