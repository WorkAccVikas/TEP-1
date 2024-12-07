// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MenuBoard } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const roster = {
  id: 'roster',
  title: <FormattedMessage id="roster" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'roster',
      title: <FormattedMessage id="roster" />,
      type: 'item',
      url: '/roster',
      icon: icons.samplePage,
      permissions: {
        [MODULE.ROSTER]: PERMISSIONS.READ
      }
    },
    {
      id: 'test',
      title: <FormattedMessage id="test" />,
      type: 'item',
      url: '/roster/test',
      icon: icons.samplePage,
      permissions: {
        [MODULE.ROSTER]: PERMISSIONS.READ
      }
    }
  ]
};

export default roster;
