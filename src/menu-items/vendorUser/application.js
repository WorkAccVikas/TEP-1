// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, Car, DocumentUpload, Eye, MenuBoard } from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard,
  view: Eye,
  upload: DocumentUpload,
  invoice: Bill,
  trip: Car
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const application = {
  id: 'group-application',
  title: <FormattedMessage id="application" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Trips
    {
      id: 'trips',
      title: <FormattedMessage id="trips" />,
      type: 'item',
      url: '/apps/trips/list',
      icon: icons.trip
    },
    // Invoices
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'item',
      url: '/apps/invoices/list',
      icon: icons.invoice
    }
  ]
};

export default application;
