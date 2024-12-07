// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Calendar1 } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: Calendar1
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const reports = {
  id: 'reports',
  title: <FormattedMessage id="reports" />,
  type: 'group',
  url: '/reports',
  icon: icons.samplePage,
  children: [
    {
      id: 'reports',
      title: <FormattedMessage id="reports" />,
      type: 'item',
      url: '/reports',
      icon: icons.samplePage,
      permissions: {
        [MODULE.REPORT]: PERMISSIONS.READ
      }
    }
  ]
};

export default reports;
