/* eslint-disable no-unused-vars */
import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import ProtectedRoute from 'components/common/guards/ProtectedRoute';
import { MODULE, PERMISSIONS } from 'constant';
import Create from 'pages/invoice/create/Create2';
import { element } from 'prop-types';
import AllRosters from 'pages/Roster/AllRosters';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

const UnderConstruction = Loadable(lazy(() => import('components/maintenance/UnderConstruction')));

const PageNotFound = Loadable(lazy(() => import('pages/maintenance/error/404')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('pages')));
// Roster
const Roster = Loadable(lazy(() => import('pages/apps/roster')));
const RosterFileList = Loadable(lazy(() => import('pages/Roster/file-management')));
const MapRosterFile = Loadable(lazy(() => import('pages/Roster/map-roster')));
const ViewRoster = Loadable(lazy(() => import('pages/Roster/view-roster')));
const AssignTrips = Loadable(lazy(() => import('pages/Roster/assign-trips')));

// Invoice
const InvoiceList = Loadable(lazy(() => import('pages/invoice/list/List')));
const InvoiceCreate = Loadable(lazy(() => import('pages/invoice/create/Create2')));
const InvoiceDetails = Loadable(lazy(() => import('pages/invoice/details/Details')));

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

// ==============================|| MAIN ROUTES ||============================== //

const VendorRoutes = {
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

        // Application
        {
          path: 'apps',
          children: [
            // Roster
            {
              path: 'roster',
              children: [
                {
                  path: 'view',
                  element: <Roster />
                },
                {
                  path: 'create',
                  element: <UnderConstruction title="Roster Upload" />
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
                  path: 'view-roster',
                  element: <ViewRoster />
                },
                {
                  path: 'assign-trips',
                  element: <AssignTrips />
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
                //   element: <UnderConstruction title="Invoice Dashboard" />
                // },
                {
                  path: 'list',
                  element: <InvoiceList />
                },
                // {
                //   path: 'create',
                //   element: <Create />
                // },
                // {
                //   path: 'invoice',
                //   element: <InvoiceList />
                // },
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
                // {
                //   path: 'dashboard',
                //   element: <UnderConstruction title="User Dashboard" />
                // },
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
                // {
                //   path: 'dashboard',
                //   element: <UnderConstruction title="Company Dashboard" />
                // },
                {
                  path: 'view',
                  element: <Company />
                  //   element: <ProtectedRoute element={Company} moduleName={MODULE.COMPANY} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'overview/:id',
                  element: <CompanyOverview />
                  //   element: <ProtectedRoute element={CompanyOverview} moduleName={MODULE.COMPANY} permission={PERMISSIONS.READ} />
                }
              ]
            },
            // Driver
            {
              path: 'driver',
              children: [
                // {
                //   path: 'dashboard',
                //   element: <UnderConstruction title="Driver Dashboard" />
                // },
                {
                  path: 'view',
                  element: <Driver />
                  //   element: <ProtectedRoute element={Driver} moduleName={MODULE.DRIVER} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'overview/:id',
                  element: <DriverOverview />
                  //   element: <ProtectedRoute element={DriverOverview} moduleName={MODULE.DRIVER} permission={PERMISSIONS.READ} />
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
                // {
                //   path: 'dashboard',
                //   element: <UnderConstruction title="Cab Dashboard" />
                // },
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
            }
          ]
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

export default VendorRoutes;
