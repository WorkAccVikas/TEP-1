// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, Car, DocumentUpload, Eye, MenuBoard } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  view: Eye,
  upload: DocumentUpload,
  invoice: Bill,
  trip:Car
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const roster = {
  id: 'group-application',
  title: <FormattedMessage id="roster" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Roster
    {
      id: 'roster',
      title: <FormattedMessage id="roster" />,
      type: 'collapse',
      icon: icons.samplePage,
      url: '/apps/roster/all-roster',
      children: [
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/roster/create',
          // icon: icons.upload
        },
        {
          id: 'files',
          title: <FormattedMessage id="files" />,
          type: 'item',
          url: '/apps/roster/file-management',
          // icon: icons.upload
        },
        {
          id: 'trips',
          title: <FormattedMessage id="trips" />,
          type: 'item',
          url: '/apps/trips/list',
          // icon: icons.view
        },
      ]
    },

    // Invoices
    // {
    //   id: 'invoices',
    //   title: <FormattedMessage id="invoices" />,
    //   type: 'collapse',
    //   // url: '/apps/invoices/dashboard',
    //   icon: icons.invoice,
    //   children: [
    //     {
    //       id: 'list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/invoices/list',
    //       // icon: icons.view
    //     },
    //     {
    //       id: 'create',
    //       title: <FormattedMessage id="create" />,
    //       type: 'item',
    //       url: '/apps/invoices/create',
    //       // icon: icons.upload
    //     }
    //   ]
    // },

     // Trips
    //  {
    //   id: 'trips',
    //   title: <FormattedMessage id="trips" />,
    //   type: 'collapse',
    //   // url: '/apps/invoices/dashboard',
    //   icon: icons.trip,
    //   children: [
    //     {
    //       id: 'list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/trips/list',
    //       // icon: icons.view
    //     },
    //   ]
    // }
  ]
};

export default roster;
