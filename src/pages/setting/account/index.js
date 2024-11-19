import { Button } from '@mui/material';
import GenericDialog from 'components/alertDialog/GenericDialog';
import CustomCircularLoader from 'components/CustomCircularLoader';
import Loadable from 'components/Loadable';
import { lazy, useState, useCallback, useEffect } from 'react';

const ManageAccountSettings = Loadable(lazy(() => import('pages/setting/account/ManageAccountSettings')));

const AccountSettings = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    setIsSettingsVisible((prev) => !prev);
  };

  // Memoize the render function to avoid unnecessary re-creation
  const renderManageAccountSettings = useCallback(() => {
    if (!isSettingsVisible) return null;
    return <ManageAccountSettings initialValues={data} isFirstTime={isFirstTime} />;
  }, [isSettingsVisible, data, isFirstTime]);

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
          // data: null
        };

        if (response.status === 200) {
          if (!response.data) {
            setIsOpen(true);
            setIsFirstTime(true);
            setMessage("You don't have any account settings yet. Please add your account settings.");
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

      {isOpen && (
        <GenericDialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setIsSettingsVisible(true);
          }}
          title="Important Information"
          // message={['Your profile has been successfully updated.', 'Please check your email for confirmation.']}
          message={message}
          primaryButtonText="Got it"
          onPrimaryButtonClick={() => {
            setIsOpen(false);
            setIsSettingsVisible(true);
          }}
        />
      )}
    </>
  );
};

export default AccountSettings;
