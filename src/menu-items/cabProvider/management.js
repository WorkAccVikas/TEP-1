// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Buliding, Calendar1, Car, Profile, Profile2User, User } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: Calendar1,
  user: User,
  company: Buliding,
  driver: Profile,
  vehicle: Car,
  vendor: Profile2User
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const management = {
  id: 'management',
  title: <FormattedMessage id="management" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'user',
      title: <FormattedMessage id="user" />,
      type: 'item',
      url: '/management/user',
      icon: icons.user,
      permissions: {
        [MODULE.USER]: PERMISSIONS.READ
      }
    },
    {
      id: 'company',
      title: <FormattedMessage id="company" />,
      type: 'item',
      url: '/management/company',
      icon: icons.company,
      permissions: {
        [MODULE.COMPANY]: PERMISSIONS.READ
      }
    },
    {
      id: 'vendor',
      title: <FormattedMessage id="vendor" />,
      type: 'item',
      url: '/management/vendor',
      icon: icons.vendor,
      permissions: {
        [MODULE.VENDOR]: PERMISSIONS.READ
      }
    },
    {
      id: 'driver',
      title: <FormattedMessage id="driver" />,
      type: 'item',
      url: '/management/driver',
      icon: icons.driver,
      permissions: {
        [MODULE.DRIVER]: PERMISSIONS.READ
      }
    },
    {
      id: 'cabs',
      title: <FormattedMessage id="cabs" />,
      type: 'item',
      url: '/management/cab',
      icon: icons.vehicle,
      permissions: {
        [MODULE.CAB]: PERMISSIONS.READ
      }
    }
  ]
};

export default management;
