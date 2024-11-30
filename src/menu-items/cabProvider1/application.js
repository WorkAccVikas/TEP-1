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

const roster = {
  id: 'group-application',
  title: <FormattedMessage id="application" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Roster
    {
      id: 'roster',
      title: <FormattedMessage id="roster" />,
      type: 'item',
      icon: icons.samplePage,
      url: '/apps/roster/all-roster',
      // children: [
      //   {
      //     id: 'view',
      //     title: <FormattedMessage id="view" />,
      //     type: 'item',
      //     url: '/apps/roster/all-roster'
      //     // icon: icons.upload
      //   },
      //   {
      //     id: 'upload',
      //     title: <FormattedMessage id="upload" />,
      //     type: 'item',
      //     url: '/apps/roster/create'
      //     // icon: icons.upload
      //   },
      //   {
      //     id: 'files',
      //     title: <FormattedMessage id="files" />,
      //     type: 'item',
      //     url: '/apps/roster/file-management'
      //     // icon: icons.upload
      //   }
      //   // {
      //   //   id: 'trips',
      //   //   title: <FormattedMessage id="trips" />,
      //   //   type: 'item',
      //   //   url: '/apps/trips/list',
      //   //   // icon: icons.view
      //   // },
      // ]
    },

    // Invoices
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'item',
      url: '/apps/invoices/list',
      icon: icons.invoice
    },

    // Trips
    {
      id: 'trips',
      title: <FormattedMessage id="trips" />,
      type: 'item',
      url: '/apps/trips/list',
      icon: icons.trip
    },
  ]
};

export default roster;
