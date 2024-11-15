// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, MenuBoard} from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard,
  invoice: Bill,
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
      type: 'item',
      url: '/apps/invoices/list',
      icon: icons.invoice,
    },
  ]
};

export default invoices;
