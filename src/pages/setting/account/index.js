import { Button } from '@mui/material';
import CustomCircularLoader from 'components/CustomCircularLoader';
import Loadable from 'components/Loadable';
import { lazy, useState, useCallback, useEffect } from 'react';

const ManageAccountSettings = Loadable(lazy(() => import('pages/setting/account/ManageAccountSettings')));

const AccountSettings = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleToggle = () => {
    setIsSettingsVisible((prev) => !prev);
  };

  // Memoize the render function to avoid unnecessary re-creation
  const renderManageAccountSettings = useCallback(() => {
    if (!isSettingsVisible) return null;
    return <ManageAccountSettings initialValues={data} />;
  }, [isSettingsVisible, data]);

  useEffect(() => {
    (async () => {
      try {
        // TODO : API call for fetch account settings
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const response = {
          status: 200,
          data: {
            name: 'Ram',
            title: 'Ram Travels',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kim_Jong-un_April_2019_%28cropped%29.jpg',
            favIcon: 'https://cdn4.vectorstock.com/i/1000x1000/28/08/north-korea-flag-icon-isolate-print-vector-30902808.jpg'
          }
        };

        if (response.status >= 200) {
          if (!response.data) {
            setIsOpen(true);
            return;
          }
          setData(response.data);
          setIsSettingsVisible(true);
        }
      } catch (error) {
        console.log('Error at fetchAccountSettings: ', error);
        dispatch(
          openSnackbar({
            open: true,
            message: error?.message || 'Something went wrong',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading ? (
        <CustomCircularLoader />
      ) : (
        <>
          {/* <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
          <Button variant="contained" onClick={handleToggle}>
            Manage Account
          </Button> */}
          {renderManageAccountSettings()}
        </>
      )}
    </>
  );
};

export default AccountSettings;
