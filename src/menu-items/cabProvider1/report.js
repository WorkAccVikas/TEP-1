// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MenuBoard } from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard
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
          title: <FormattedMessage id="company1" />,
          // type: 'collapse',
          type: 'item',
          url: '/reports/company-report',
          icon: icons.samplePage
          // children: [
          //   {
          //     id: 'company report',
          //     title: <FormattedMessage id="company report" />,
          //     type: 'item',
          //     url: '/reports'
          //   }
          // ]
        },

        {
          id: 'cab-report',
          title: <FormattedMessage id="cab" />,
          // type: 'collapse',
          type: 'item',
          url: '/reports/cab-report',
          icon: icons.samplePage
        },

        {
          id: 'advance',
          title: <FormattedMessage id="advance" />,
          // type: 'collapse',
          type: 'item',
          url: '/reports/advance-report',
          icon: icons.samplePage
        }

        // // Vendor
        // {
        //   id: 'vendor',
        //   title: <FormattedMessage id="vendor1" />,
        //   type: 'collapse',
        //   icon: icons.samplePage,
        //   children: [
        //     {
        //       id: 'cabreports',
        //       title: <FormattedMessage id="cabreports" />,
        //       type: 'item',
        //       url: '/reports'
        //     },
        //     {
        //       id: 'invoicereports',
        //       title: <FormattedMessage id="invoicereports" />,
        //       type: 'item',
        //       url: '/reports'
        //     },
        //     {
        //       id: 'mcdreports',
        //       title: <FormattedMessage id="mcdreports" />,
        //       type: 'item',
        //       url: '/reports'
        //     }
        //   ]
        // },
        // // Driver
        // {
        //   id: 'driver',
        //   title: <FormattedMessage id="driver1" />,
        //   type: 'collapse',
        //   icon: icons.samplePage,
        //   children: [
        //     {
        //       id: 'cabreports',
        //       title: <FormattedMessage id="cabreports" />,
        //       type: 'item',
        //       url: 'reports-driver'
        //     },
        //     {
        //       id: 'invoicereports',
        //       title: <FormattedMessage id="invoicereports" />,
        //       type: 'item',
        //       url: 'reports-driver'
        //     },
        //     {
        //       id: 'mcdreports',
        //       title: <FormattedMessage id="mcdreports" />,
        //       type: 'item',
        //       url: 'reports-driver'
        //     }
        //   ]
        // }
      ]
    }
  ]
};

export default report;
