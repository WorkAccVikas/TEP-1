// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, Calendar1, Card, Wallet } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: Calendar1,
  loan:Wallet,
  advance:Card,
  invoice: Bill
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const invoice = {
  id: 'invoices',
  title: <FormattedMessage id="invoices" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'invoice',
      title: <FormattedMessage id="invoice" />,
      type: 'item',
      url: '/invoices/invoice',
      icon: icons.invoice,
      permissions: {
        [MODULE.INVOICE]: PERMISSIONS.READ
      }
    },
    {
      id: 'create-invoice',
      title: <FormattedMessage id="create-invoice" />,
      type: 'item',
      url: '/invoices/create-invoice',
      icon: icons.invoice,
      permissions: {
        [MODULE.INVOICE]: PERMISSIONS.READ
      }
    },
    {
      id: 'loans',
      title: <FormattedMessage id="loans" />,
      type: 'item',
      url: '/invoices/loans',
      icon: icons.loan,
      permissions: {
        [MODULE.LOAN]: PERMISSIONS.READ
      }
    },
    {
      id: 'advance',
      title: <FormattedMessage id="advance" />,
      type: 'item',
      url: '/invoices/advance',
      icon: icons.advance,
      permissions: {
        [MODULE.ADVANCE]: PERMISSIONS.READ
      }
    }
  ]
};

export default invoice;
