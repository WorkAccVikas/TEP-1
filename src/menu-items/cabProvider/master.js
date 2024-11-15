// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Car, Location, MenuBoard, Profile2User } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  zone:Location,
  vehicle:Car,
  role:Profile2User
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const master = {
  id: 'master',
  title: <FormattedMessage id="master" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'role',
      title: <FormattedMessage id="role" />,
      type: 'item',
      url: '/master/role',
      icon: icons.role,
      permissions: {
        [MODULE.ROLE]: PERMISSIONS.READ
      }
    },
    {
      id: 'zone',
      title: <FormattedMessage id="zone" />,
      type: 'item',
      url: '/master/zone',
      icon: icons.zone,
      permissions: {
        [MODULE.ZONE]: PERMISSIONS.READ
      }
    },
    {
      id: 'cab-type',
      title: <FormattedMessage id="cab-type" />,
      type: 'item',
      url: '/master/cab-type',
      icon: icons.vehicle,
      permissions: {
        [MODULE.CAB_TYPE]: PERMISSIONS.READ
      }
    },
    {
      id: 'cab-rate',
      title: <FormattedMessage id="cab-rate" />,
      type: 'item',
      url: '/master/cab-rate',
      icon: icons.samplePage,
      permissions: {
        [MODULE.CAB_RATE_VENDOR]: PERMISSIONS.CREATE,
        [MODULE.CAB_RATE_DRIVER]: PERMISSIONS.CREATE
      }
    }
  ]
};

export default master;
