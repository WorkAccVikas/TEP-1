// project-imports
import Routes from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { DrawerProvider } from 'contexts/DrawerContext';
import UpdateTitle from 'pages/UpdateTitle';
import ScrollToTop from 'react-scroll-to-top';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
    const favIcon = useSelector((state) => state.accountSettings.settings?.favIcon);


    console.log("favIcon",favIcon);
    // console.log("state.accountSettings.settings",state.accountSettings.settings);
    

  useEffect(() => {
    if (favIcon) {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = favIcon; // Dynamically set the favicon URL
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = favIcon;
        document.head.appendChild(newLink);
      }
    }
  }, [favIcon]);
  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <ScrollTop>
            <AuthProvider>
              <>
                <Notistack>
                  <DrawerProvider>
                    <UpdateTitle />
                    <Routes />
                    <ScrollToTop smooth color="#fff" style={{ backgroundColor: 'rgb(67,125,255)', borderRadius: '50%' }} height="20" width="20" />
                  </DrawerProvider>
                  <Snackbar />
                </Notistack>
              </>
            </AuthProvider>
          </ScrollTop>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
  );
};

export default App;
