// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DocumentCode2, OceanProtocol, Level, ShieldCross, InfoCircle, I24Support, Driving } from 'iconsax-react';

// icons
const icons = {
  samplePage: DocumentCode2,
  menuLevel: OceanProtocol,
  menuLevelSubtitle: Level,
  disabledMenu: ShieldCross,
  chipMenu: InfoCircle,
  documentation: I24Support,
  roadmap: Driving
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const support = {
  id: 'other',
  title: <FormattedMessage id="others" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/dashboard',
      icon: icons.samplePage
    },
    {
      id: 'documentation',
      title: <FormattedMessage id="documentation" />,
      type: 'item',
      url: 'https://phoenixcoded.gitbook.io/able-pro/v/react/',
      icon: icons.documentation,
      external: true,
      target: true,
      chip: {
        label: 'gitbook',
        color: 'info',
        size: 'small'
      }
    },
    {
      id: 'roadmap',
      title: <FormattedMessage id="roadmap" />,
      type: 'item',
      url: 'https://phoenixcoded.gitbook.io/able-pro/v/react/roadmap',
      icon: icons.roadmap,
      external: true,
      target: true
    }
  ]
};

export default support;
