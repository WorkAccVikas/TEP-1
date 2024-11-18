import { useDrawer } from 'contexts/DrawerContext';
import CreateRosterTemplate from 'pages/apps/test/CreateRosterTemplateDrawer';
import { useEffect } from 'react';

const RosterSetting = () => {
  const { openDrawer, closeDrawer } = useDrawer();

  useEffect(() => {
    openDrawer();
    return () => {
      closeDrawer();
    };
  }, []);

  return (
    <>
      <CreateRosterTemplate />
    </>
  );
};

export default RosterSetting;

/** SUMMARY : Create Template Dialog Open for Create New Roster Template */
