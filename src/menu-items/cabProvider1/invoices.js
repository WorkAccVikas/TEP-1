// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, MenuBoard, Setting2, Wallet } from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard,
  setting:Setting2,
  invoice: Bill,
  account:Wallet
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const invoices = {
  id: 'group-setting',
  title: <FormattedMessage id="invoices" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
     // Invoices
    {
      id: 'invoice',
      title: <FormattedMessage id="invoice" />,
      type: 'collapse',
      url: '/apps/invoices/list',
      icon: icons.invoice,
      children: [
        // {
        //   id: 'list',
        //   title: <FormattedMessage id="list" />,
        //   type: 'item',
        //   url: '/apps/invoices/list',
        //   // icon: icons.view
        // },
        {
          id: 'create',
          title: <FormattedMessage id="create" />,
          type: 'item',
          url: '/apps/invoices/create',
          // icon: icons.upload
        }
      ]
    },
     // Advance
    //  {
    //     id: 'advance',
    //     title: <FormattedMessage id="advance" />,
    //     type: 'item',
    //     // url: '/apps/invoices/list',
    //     icon: icons.invoice,
    //   },
  ]
};

export default invoices;
