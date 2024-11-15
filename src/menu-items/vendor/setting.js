// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, MenuBoard, Setting2 } from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard,
  setting: Setting2,
  invoice: Bill,
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const setting = {
  id: 'group-setting',
  title: <FormattedMessage id="setting" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'setting',
      title: <FormattedMessage id="user-setting" />,
      type: 'collapse',
      icon: icons.setting,
      children: [
        // Role
        {
          id: 'role',
          title: <FormattedMessage id="role" />,
          type: 'item',
          url: '/master/role',
          icon: icons.role
        }
      ]
    },
  ]
};

export default setting;
