import { Box, Chip, CircularProgress, Stack } from '@mui/material';
import ScrollX from 'components/ScrollX';
import ReactTable, { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { openDrawer } from 'store/reducers/menu';

const CompanyWiseRoster = ({ rosterData, id }) => {
  const location = useLocation();

  // Parse the query string
  const searchParams = new URLSearchParams(location.search);

  // Access individual query parameters
  const fromDate = searchParams.get('fromDate'); // e.g., "2023-10-03"
  const toDate = searchParams.get('toDate'); // e.g., "2023-10-10"

  const data = useMemo(() => rosterData || [], [rosterData]);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState([]);
  // const [add, setAdd] = useState(false);
  const [trip, setTrip] = useState(false);
  const [, setSelectedRowData] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handletTrip = (data) => {
    setSelectedRowData(data); // Store the selected row data
    setTrip(!trip);
    if (customer && !trip) setCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        className: 'cell-center',
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Company Name',
        accessor: 'companyID.company_name'
      },
      {
        Header: 'Trip Date',
        accessor: (row) => new Date(row.tripDate).toLocaleDateString()
      },
      {
        Header: 'Trip Time',
        accessor: (row) => new Date(row.tripTime * 1000).toLocaleTimeString()
      },
      {
        Header: 'Trip Type',
        accessor: 'tripType',
        Cell: ({ value }) => {
          if (value === '1') {
            return 'Pickup';
          } else if (value === '2') {
            return 'Drop';
          }
        }
      },
      {
        Header: 'Zone Name',
        accessor: 'zoneName'
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneType'
      },
      {
        Header: 'Location',
        accessor: 'location'
      },
      {
        Header: 'Guard',
        accessor: 'guard'
      },
      {
        Header: 'Guard Price',
        accessor: 'guardPrice'
      },
      {
        Header: 'Vehicle Type',
        accessor: 'vehicleType'
      },
      {
        Header: 'Vehicle Number',
        accessor: 'vehicleNumber'
      },
      {
        Header: 'Vehicle Rate',
        accessor: 'vehicleRate'
      },
      {
        Header: 'Add On Rate',
        accessor: 'addOnRate'
      },
      {
        Header: 'Penalty',
        accessor: 'penalty'
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
      },
      {
        Header: 'Added By',
        accessor: 'addedBy.userName'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value) {
            return <Chip color="success" label="Active" size="small" variant="light" />;
          } else {
            return <Chip color="error" label="Inactive" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Assignment',
        accessor: 'assignedVehicle',
        Cell: ({ row }) => {
          return (
            <Chip
              color="info"
              variant="light"
              size="small"
              label="Assign Trip"
              sx={{
                ':hover': {
                  backgroundColor: 'rgb(70,128,255)',
                  color: 'white',
                  cursor: 'pointer'
                }
              }}
              onClick={() => {
                handletTrip(row.original);
              }}
            />
          );
        }
      }
    ],
    []
  );

  // useEffect(() => {
  //   // hide left drawer when email app opens
  //   const drawerCall = dispatch(openDrawer(false));
  //   Promise.all([drawerCall]).then(() => setLoading(false));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleAssignTrips = () => {
    navigate(`/assign-trips/${id}?fromDate=${fromDate}&toDate=${toDate}`);
  };

  return (
    <>
      <Stack gap={2}>
        <ScrollX>
          {loading ? (
            <Box
              sx={{
                height: '100vh',
                width: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CircularProgress />
            </Box>
          ) : data.length > 0 ? (
            <>
              <ReactTable columns={columns} data={data || []} handleAdd={handleAssignTrips} buttonTitle="Assigned Trip" search />
            </>
          ) : (
            <TableNoDataMessage text="No Roster Found" />
          )}
        </ScrollX>

        {/* {data && <Button onClick={handleAssignTrips}>Assign Trips</Button>} */}
      </Stack>

      {/* <Dialog
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          keepMounted
          fullWidth
          onClose={handletTrip}
          open={trip}
          sx={{ "& .MuiDialog-paper": { p: 0 }, transition: "transform 225ms" }}
          aria-describedby="alert-dialog-slide-description"
        >
          <RosterAssignForm
            handleAdd={handletTrip}
            rosterData={selectedRowData}
            id={id}
          />
        </Dialog> */}
    </>
  );
};

export default CompanyWiseRoster;
