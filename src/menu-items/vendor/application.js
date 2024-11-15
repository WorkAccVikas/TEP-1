// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, MenuBoard } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  invoice: Bill
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const application = {
  id: 'group-application',
  title: <FormattedMessage id="application" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Roster
    // {
    //   id: 'roster',
    //   title: <FormattedMessage id="roster" />,
    //   type: 'collapse',
    //   icon: icons.samplePage,
    //   children: [
    //     {
    //       id: 'list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/roster/all-roster',
    //     },
    //   ]
    // },

    // Invoices
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'collapse',
      // url: '/apps/invoices/dashboard',
      icon: icons.invoice,
      children: [
        {
          id: 'list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/invoices/list',
          // icon: icons.samplePage,
        },
        // {
        //   id: 'create',
        //   title: <FormattedMessage id="create" />,
        //   type: 'item',
        //   url: '/apps/invoices/create',
        //   // icon: icons.samplePage,
        // }
      ]
    }
  ]
};

export default application;
