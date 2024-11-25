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
            id: 'test',
            title: <FormattedMessage id="test" />,
            type: 'item',
            // url: '/apps/invoices/advance-type',
            // icon: icons.upload
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
            id: 'test',
            title: <FormattedMessage id="test" />,
            type: 'item',
            // url: '/apps/invoices/advance-type',
            // icon: icons.upload
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
            id: 'test',
            title: <FormattedMessage id="test" />,
            type: 'item',
            // url: '/apps/invoices/advance-type',
            // icon: icons.upload
          },
        ]
      }
      ]
    },
  ]
};

export default report;
