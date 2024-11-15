/ eslint-disable no-unused-vars /;
import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import ProtectedRoute from 'components/common/guards/ProtectedRoute';
import { MODULE, PERMISSIONS } from 'constant';

// import RosterDashboard from 'pages/apps/test/dashboard';
import MapRosterFileTest from 'pages/apps/test/CreateRosterTemplateDrawer.js';
import ViewRosterTest from 'pages/apps/test/List';
import ViewRosterTest1 from 'pages/apps/test/ViewRoster';
import AddRosterFileForm from 'pages/apps/test/components/AddRosterFileForm';
import DriverRate from 'pages/management/driver/driverRate/DriverRate';
import VendorRatelisting from 'pages/management/vendor/vendorRate/VendorRatelisting';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

const UnderConstruction = Loadable(lazy(() => import('components/maintenance/UnderConstruction')));

const PageNotFound = Loadable(lazy(() => import('pages/maintenance/error/404')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('pages')));
const ProfileOverview = Loadable(lazy(() => import('pages/overview/ProfileOverview')));
// Roster
const Roster = Loadable(lazy(() => import('pages/apps/roster')));
const RosterFileList = Loadable(lazy(() => import('pages/apps/test/RosterFileManagement')));
const MapRosterFile = Loadable(lazy(() => import('pages/Roster/map-roster')));
const ViewRoster = Loadable(lazy(() => import('pages/Roster/view-roster')));
const AssignTrips = Loadable(lazy(() => import('pages/Roster/assign-trips')));
const AllRosters = Loadable(lazy(() => import('pages/Roster/AllRosters')));

// Invoice
const InvoiceList = Loadable(lazy(() => import('pages/invoice/list/List')));
const InvoiceCreate = Loadable(lazy(() => import('pages/invoice/create/Create2')));
const InvoiceDetails = Loadable(lazy(() => import('pages/invoice/details/Details')));

//Trip
const TripList = Loadable(lazy(() => import('pages/trips/TripList')));

// Management
const User = Loadable(lazy(() => import('pages/management/user')));
const AddUser = Loadable(lazy(() => import('pages/management/user/AddUser')));
// Vendor
const Vendor = Loadable(lazy(() => import('pages/management/vendor')));
const AddVendor = Loadable(lazy(() => import('pages/management/vendor/AddVendor')));
const VendorOverview = Loadable(lazy(() => import('pages/overview/VendorOverview')));

// Driver
const Driver = Loadable(lazy(() => import('pages/management/driver')));
const DriverOverview = Loadable(lazy(() => import('pages/overview/DriverOverview')));
// const AddDriver = Loadable(lazy(() => import('pages/management/driver/AddDriver')));

// Cab
const Cab = Loadable(lazy(() => import('pages/management/cab')));
const AddCab = Loadable(lazy(() => import('pages/management/cab/AddCab')));
// company
const Company = Loadable(lazy(() => import('pages/management/company')));
const AddCompany = Loadable(lazy(() => import('pages/management/company/AddCompany')));
const AddBranch = Loadable(lazy(() => import('pages/management/company/AddBranch')));
const CompanyOverview = Loadable(lazy(() => import('pages/overview/CompanyOverview')));
const CompanyRateListing = Loadable(lazy(() => import('pages/management/company/addCompanyRate/CompanyRate1/CompanyRateListing')));

// reports
const Reports = Loadable(lazy(() => import('pages/Reports')));
// Invoice
// const Invoice = Loadable(lazy(() => import('pages/invoices/Invoice')));
const Loans = Loadable(lazy(() => import('pages/invoices/Loans')));
const Advance = Loadable(lazy(() => import('pages/invoices/advance')));
const AdvanceType = Loadable(lazy(() => import('pages/invoices/advance/AdvanceType')));
// Master
const Role = Loadable(lazy(() => import('pages/master/Role')));
const Zone = Loadable(lazy(() => import('pages/master/zones')));
const ZoneType = Loadable(lazy(() => import('pages/master/zones/ZoneType')));

const CabType = Loadable(lazy(() => import('pages/master/CabType')));
// Cab Rate
const CabRate = Loadable(lazy(() => import('pages/master/CabRate')));
const AddCabRateVendor = Loadable(lazy(() => import('pages/master/CabRate/Vendor')));
const AddCabRateDriver = Loadable(lazy(() => import('pages/master/CabRate/Driver')));

// Dashboard
const RosterDashboard = Loadable(lazy(() => import('pages/dashboard/rosterDashboard/RosterDashboard')));
const CabDashBoard = Loadable(lazy(() => import('pages/dashboard/cabDashboard/CabDashBoard')));
const DriverDashboard = Loadable(lazy(() => import('pages/dashboard/driverDashboard/DriverDashboard')));
const VendorDashboard = Loadable(lazy(() => import('pages/dashboard/vendorDashboard/VendorDashboard')));
const CompanyDashboard = Loadable(lazy(() => import('pages/dashboard/companyDashboard/CompanyDashboard')));
const UserDashboard = Loadable(lazy(() => import('pages/dashboard/userDashboard/UserDashboard')));
const InvoiceDashboard = Loadable(lazy(() => import('pages/dashboard/invoiceDashboard/InvoiceDashboard')));

// Dashboard
const RosterDashboard1 = Loadable(lazy(() => import('pages/apps/test/dashboard')));

// Settings
const InvoiceSettings = Loadable(lazy(() => import('pages/setting/invoice')));

const Temp1 = Loadable(lazy(() => import('temp1')));
// ==============================|| MAIN ROUTES ||============================== //

const CabProvidorRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        // Dashboard
        {
          path: 'dashboard',
          element: <Dashboard />
          //   element: <UnderConstruction title="Dashboard" />
        },

        {
          path: 'profile-overview',
          element: <ProfileOverview />
        },

        // Application
        {
          path: 'apps',
          children: [
            // Roster
            {
              path: 'roster',
              children: [
                // {
                //   path: 'dashboard',
                //   element: <RosterDashboard />
                // },
                {
                  path: 'view',
                  element: <Roster />
                },
                {
                  path: 'create',
                  element: <AddRosterFileForm />
                },
                {
                  path: 'file-management',
                  element: <RosterFileList />
                },
                {
                  path: 'map-roster',
                  element: <MapRosterFile />
                },
                {
                  path: 'test-view',
                  element: <ViewRosterTest />
                },
                {
                  path: 'test-view-1',
                  element: <ViewRosterTest1 /> // Render Company only for base path
                },
                {
                  path: 'assign-trips',
                  element: <AssignTrips />
                },
                // {
                //   path: 'test',
                //   element: <RosterDashboard1 />
                // },
                {
                  path: 'test-map',
                  element: <MapRosterFileTest />
                },
                {
                  path: 'test-view',
                  element: <ViewRoster /> // Render Company only for base path
                },
                {
                  path: 'all-roster',
                  element: <AllRosters />
                }
              ]
            },

            // Invoices
            {
              path: 'invoices',
              children: [
                // {
                //   path: 'dashboard',
                //   element: <InvoiceDashboard />
                // },
                {
                  path: 'list',
                  element: <InvoiceList />
                },
                {
                  path: 'create',
                  element: <InvoiceCreate />
                },
                {
                  path: 'details/:id',
                  element: <InvoiceDetails />
                },
                {
                  path: 'edit/:id',
                  element: <UnderConstruction title="Edit Invoice" />
                },
                {
                  path: 'loans',
                  element: <Loans />
                },
                {
                  path: 'advance',
                  element: <Advance />
                  //   element: <ProtectedRoute element={Advance} moduleName={MODULE.ADVANCE} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'advance-type',
                  element: <AdvanceType />
                  //   element: <ProtectedRoute element={AdvanceType} moduleName={MODULE.ADVANCE_TYPE} permission={PERMISSIONS.READ} />
                }
              ]
            },

            // Trips
            {
              path: 'trips',
              children: [
                {
                  path: 'list',
                  element: <TripList />
                }
              ]
            }
          ]
        },

        // Management
        {
          path: 'management',
          children: [
            // User
            {
              path: 'user',
              children: [
                {
                  path: 'dashboard',
                  element: <UserDashboard />
                },
                {
                  path: 'view',
                  element: <User />
                  //   element: <ProtectedRoute element={User} moduleName={MODULE.USER} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-user',
                  element: <AddUser />
                  //   element: <ProtectedRoute element={AddUser} moduleName={MODULE.USER} permission={PERMISSIONS.CREATE} />
                }
              ]
            },
            // Company
            {
              path: 'company',
              children: [
                {
                  path: 'dashboard',
                  element: <CompanyDashboard />
                },
                {
                  path: 'view',
                  element: <Company />
                  //   element: <ProtectedRoute element={Company} moduleName={MODULE.COMPANY} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-company',
                  element: <AddCompany />
                  //   element: <ProtectedRoute element={AddCompany} moduleName={MODULE.COMPANY} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'add-company-branch',
                  element: <AddBranch />
                  //   element: <ProtectedRoute element={AddBranch} moduleName={MODULE.COMPANY} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'overview/:id',
                  element: <CompanyOverview />
                  //   element: <ProtectedRoute element={CompanyOverview} moduleName={MODULE.COMPANY} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-company-rate',
                  element: <CompanyRateListing />
                }
              ]
            },
            // Vendor
            {
              path: 'vendor',
              children: [
                {
                  path: 'dashboard',
                  element: <VendorDashboard />
                },
                {
                  path: 'view',
                  element: <Vendor />
                  //   element: <ProtectedRoute element={Vendor} moduleName={MODULE.VENDOR} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-vendor',
                  element: <AddVendor />
                  //   element: <ProtectedRoute element={AddVendor} moduleName={MODULE.VENDOR} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'overview/:id',
                  element: <VendorOverview />
                  //   element: <ProtectedRoute element={VendorOverview} moduleName={MODULE.VENDOR} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'view-vendor-rate',
                  element: <VendorRatelisting />
                },
                {
                  path: 'add-vendor-rate',
                  element: <AddCabRateVendor />
                }
              ]
            },
            // Driver
            {
              path: 'driver',
              children: [
                {
                  path: 'dashboard',
                  element: <DriverDashboard />
                },
                {
                  path: 'view',
                  element: <Driver />
                  //   element: <ProtectedRoute element={Driver} moduleName={MODULE.DRIVER} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'overview/:id',
                  element: <DriverOverview />
                  //   element: <ProtectedRoute element={DriverOverview} moduleName={MODULE.DRIVER} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'view-driver-rate',
                  element: <DriverRate />
                },
                {
                  path: 'add-driver-rate',
                  element: <AddCabRateDriver />
                }
                // {
                //   path: 'add-driver',
                //   element: <AddDriver />
                // }
              ]
            },
            // Cab
            {
              path: 'cab',
              children: [
                {
                  path: 'dashboard',
                  element: <CabDashBoard />
                },
                {
                  path: 'view',
                  element: <Cab />
                  //   element: <ProtectedRoute element={Cab} moduleName={MODULE.CAB} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-cab',
                  element: <AddCab />
                  //   element: <ProtectedRoute element={AddCab} moduleName={MODULE.CAB} permission={PERMISSIONS.CREATE} />
                }
              ]
            }
          ]
        },

        // Reports
        {
          path: 'reports',
          element: <Reports />
        },

        // Master
        {
          path: 'master',
          children: [
            {
              path: 'role',
              element: <Role />
              //   element: <ProtectedRoute element={Role} moduleName={MODULE.ROLE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'zone',
              element: <Zone />
              //   element: <ProtectedRoute element={Zone} moduleName={MODULE.ZONE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'zone-type',
              element: <ZoneType />
              //   element: <ProtectedRoute element={ZoneType} moduleName={MODULE.ZONE_TYPE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'cab-type',
              element: <CabType />
              //   element: <ProtectedRoute element={CabType} moduleName={MODULE.CAB_TYPE} permission={PERMISSIONS.READ} />
            }
          ]
        },

        // Settings
        {
          path: 'settings',
          children: [
            // {
            //   path: 'account',
            //   element: <UnderConstruction title="Account Settings" />
            // },
            // {
            //   path: 'roster',
            //   element: <UnderConstruction title="Roster Settings" />
            // },
            {
              path: 'invoice',
              element: <InvoiceSettings />
            }
          ]
        },

        {
          path: 'temp1',
          element: <Temp1 />
        }
      ]
    },

    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },

    {
      path: '*',
      element: <PageNotFound />
    }
  ]
};

export default CabProvidorRoutes;
