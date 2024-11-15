import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import ProtectedRoute from 'components/common/guards/ProtectedRoute';
import { MODULE, PERMISSIONS } from 'constant';
// import List from 'pages/invoice/list/List';
import Create from 'pages/invoice/create/Create';
import RosterTest from 'pages/test/Roster';
import RosterDashboard from 'pages/apps/test/dashboard';
import MapRosterFileTest from 'pages/apps/test/CreateRosterTemplateDrawer.js';
import List from 'pages/apps/test/List';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('pages')));
// Roster
const Roster = Loadable(lazy(() => import('pages/apps/roster')));
const RosterFileList = Loadable(lazy(() => import('pages/Roster/file-management')));
const MapRosterFile = Loadable(lazy(() => import('pages/Roster/map-roster')));
const ViewRoster = Loadable(lazy(() => import('pages/Roster/view-roster')));
const AssignTrips = Loadable(lazy(() => import('pages/Roster/assign-trips')));

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
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        // {
        //   path: 'roster',
        //   element: <Roster />
        // },
        {
          path: 'roster',
          children: [
            {
              path: '',
              element: <Dashboard /> // Render Company only for base path
            },
            {
              path: 'test-view',
              element: <List /> // Render Company only for base path
            },
            {
              path: 'test',
              element: <RosterDashboard /> // Render Company only for base path
            },
            {
              path: 'test-map',
              element: <MapRosterFileTest /> // Render Company only for base path
            },
            {
              path: 'file-management',
              element: <RosterFileList /> // Render Company only for base path
            },
            {
              path: 'map-roster',
              element: <MapRosterFile /> // Render Company only for base path
            },
            {
              path: 'view-roster',
              element: <ViewRoster /> // Render Company only for base path
            },
            {
              path: 'assign-trips',
              element: <AssignTrips /> // Render Company only for base path
            }
          ]
        },
        {
          path: 'management',
          children: [
            {
              path: 'user',
              children: [
                {
                  path: '',
                  // element: <User />
                  element: <ProtectedRoute element={User} moduleName={MODULE.USER} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-user',
                  // element: <AddUser />
                  element: <ProtectedRoute element={AddUser} moduleName={MODULE.USER} permission={PERMISSIONS.CREATE} />
                }
              ]
            },
            {
              path: 'company',
              children: [
                {
                  path: '',
                  // element: <Company /> // Render Company only for base path
                  element: <ProtectedRoute element={Company} moduleName={MODULE.COMPANY} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-company',
                  // element: <AddCompany />
                  element: <ProtectedRoute element={AddCompany} moduleName={MODULE.COMPANY} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'add-company-branch',
                  // element: <AddBranch />
                  element: <ProtectedRoute element={AddBranch} moduleName={MODULE.COMPANY} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'overview/:id',
                  // element: <CompanyOverview />
                  element: <ProtectedRoute element={CompanyOverview} moduleName={MODULE.COMPANY} permission={PERMISSIONS.READ} />
                }
              ]
            },
            {
              path: 'vendor',
              children: [
                {
                  path: '',
                  // element: <Vendor />
                  element: <ProtectedRoute element={Vendor} moduleName={MODULE.VENDOR} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-vendor',
                  // element: <AddVendor />
                  element: <ProtectedRoute element={AddVendor} moduleName={MODULE.VENDOR} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'overview/:id',
                  // element: <VendorOverview />
                  element: <ProtectedRoute element={VendorOverview} moduleName={MODULE.VENDOR} permission={PERMISSIONS.READ} />
                }
              ]
            },
            {
              path: 'driver',
              children: [
                {
                  path: '',
                  // element: <Driver />
                  element: <ProtectedRoute element={Driver} moduleName={MODULE.DRIVER} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'overview/:id',
                  element: <ProtectedRoute element={DriverOverview} moduleName={MODULE.DRIVER} permission={PERMISSIONS.READ} />
                }
                // {
                //   path: 'add-driver',
                //   element: <AddDriver />
                // }
              ]
            },
            {
              path: 'cab',
              children: [
                {
                  path: '',
                  // element: <Cab />
                  element: <ProtectedRoute element={Cab} moduleName={MODULE.CAB} permission={PERMISSIONS.READ} />
                },
                {
                  path: 'add-cab',
                  // element: <AddCab />
                  element: <ProtectedRoute element={AddCab} moduleName={MODULE.CAB} permission={PERMISSIONS.CREATE} />
                }
              ]
            }
          ]
        },
        {
          path: 'invoices',
          children: [
            {
              path: 'invoice',
              element: <List />
            },
            {
              path: 'Create-invoice',
              element: <Create />
            },
            {
              path: 'invoice',
              element: <List />
            },
            {
              path: 'loans',
              element: <Loans />
            },
            {
              path: 'advance',
              // element: <Advance />
              element: <ProtectedRoute element={Advance} moduleName={MODULE.ADVANCE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'advance-type',
              // element: <AdvanceType />
              element: <ProtectedRoute element={AdvanceType} moduleName={MODULE.ADVANCE_TYPE} permission={PERMISSIONS.READ} />
            }
          ]
        },
        {
          path: 'reports',
          element: <Reports />
        },
        {
          path: 'master',
          children: [
            {
              path: 'role',
              // element: <Role />
              element: <ProtectedRoute element={Role} moduleName={MODULE.ROLE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'zone',
              // element: <Zone />
              element: <ProtectedRoute element={Zone} moduleName={MODULE.ZONE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'zone-type',
              // element: <ZoneType />
              element: <ProtectedRoute element={ZoneType} moduleName={MODULE.ZONE_TYPE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'cab-type',
              // element: <CabType />
              element: <ProtectedRoute element={CabType} moduleName={MODULE.CAB_TYPE} permission={PERMISSIONS.READ} />
            },
            {
              path: 'cab-rate',
              children: [
                {
                  path: '',
                  // element: <CabRate />
                  element: (
                    <ProtectedRoute
                      element={CabRate}
                      modulePermissions={{
                        // [MODULE.CAB_RATE_VENDOR]: PERMISSIONS.CREATE,
                        // [MODULE.CAB_RATE_VENDOR]: [PERMISSIONS.READ, PERMISSIONS.DELETE],
                        [MODULE.CAB_RATE_VENDOR]: [PERMISSIONS.READ, PERMISSIONS.DELETE, PERMISSIONS.CREATE],
                        [MODULE.CAB_RATE_DRIVER]: PERMISSIONS.DELETE
                      }}
                    />
                  )
                },
                {
                  path: 'vendor',
                  // element: <AddCabRateVendor />
                  element: <ProtectedRoute element={AddCabRateVendor} moduleName={MODULE.CAB_RATE_VENDOR} permission={PERMISSIONS.CREATE} />
                },
                {
                  path: 'driver',
                  // element: <AddCabRateDriver />
                  element: <ProtectedRoute element={AddCabRateDriver} moduleName={MODULE.CAB_RATE_DRIVER} permission={PERMISSIONS.CREATE} />
                }
              ]
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
    }
  ]
};

export default CabProvidorRoutes;
