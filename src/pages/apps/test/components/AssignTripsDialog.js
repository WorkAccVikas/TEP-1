import PropTypes from 'prop-types';
import { useMemo, useState, forwardRef, useEffect } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
// third-party
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

// project-imports
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';

import makeData from 'data/react-table';
// material-ui
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Add } from 'iconsax-react';
import CSVExport from 'components/third-party/CSVExport';
import CellEditable from './CellEditable';
import axiosServices from 'utils/axios';
// import CellEditable from 'components/third-party/CellEditable';
import { CloseCircle, Edit2, Send } from 'iconsax-react';
import RowEditable from './RowEditable';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AssignTripsDialog({ data: tripData, open, handleClose, setInitateRender, fileData }) {
  // const [data, setData] = useState(() => makeData(10));
  const [data, setData] = useState([]);
  const [payload1, setPayload1] = useState([]);
  const [zoneInfo, setZoneInfo] = useState([]);
  const [vehicleTypeInfo, setVehicleTypeInfo] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [companyRate, setCompanyrate] = useState([]);
  const [driverRate, setDriverRate] = useState([]);
  console.log({ zoneInfo });
  console.log({ fileData });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // This will return the date in yyyy-mm-dd format
  };

  const generateTrips = async () => {
    const assignedTripsArray = payload1.map((item) => {
      return {
        _roster_id: item._roster_id,
        tripId: item._roster_id,
        companyID: item._company_info?._id,
        tripDate: formatDate(item._trip_date),
        tripTime: item._trip_time,
        tripType: item.tripType,
        zoneNameID: item._zoneName._id,
        zoneTypeID: item._zoneType._id,
        location: item.location,
        guard: item._guard_1,
        guardPrice: item._guard_price_1,
        vehicleTypeID: item._vehicleType._id,
        vehicleNumber: item._cab._id,
        driverId: item._driver._id,
        companyRate: item._companyRate,
        vendorRate: 0,
        driverRate: item._driverRate_or_vendorRate,
        _driverRate_or_vendorRate: item._driverRate_or_vendorRate,
        addOnRate: item._additional_rate,
        penalty: item._penalty_1,
        remarks: 'gg1'
      };
    });

    const rosterUploadArray = payload1.map((item) => {
      return {
        vehicleTypeArray: item._vehicleType ? [{ _id: item._vehicleType._id, vehicleTypeName: item._vehicleType.vehicleTypeName }] : [],

        zoneNameArray: item._zoneName ? [{ _id: item._zoneName._id, zoneName: item._zoneName.zoneName }] : [],

        zoneTypeArray: item._zoneType ? [{ _id: item._zoneType._id, zoneTypeName: item._zoneType.zoneTypeName }] : [],

        zoneName: item._zoneName?.zoneName || 'N/A',
        zoneType: item._zoneType?.zoneTypeName || 'N/A',
        vehicleType: item._vehicleType?.vehicleTypeName || 'N/A',
        vehicleNumber: item._driver?.assignedVehicle?.vehicleId?.vehicleNumber || 'N/A',
        rosterMapDataId: item._roster_id,
        _roster_id: item._roster_id,
        tripId: item._roster_id,
        companyID: item._company_info?._id,
        tripDate: formatDate(item._trip_date),
        tripTime: item._trip_time,
        tripType: item.tripType,
        zoneNameID: item._zoneName?._id,
        zoneTypeID: item._zoneType?._id,
        location: item.location,
        guard: item._guard_1,
        guardPrice: item._guard_price_1,
        vehicleTypeID: item._vehicleType?._id,
        // vehicleNumber: item._cab?.vehicleNumber || 'N/A',
        driverId: item._driver?._id,
        companyRate: item._companyRate,
        vendorRate: 0,
        driverRate: item._driverRate_or_vendorRate,
        _driverRate_or_vendorRate: item._driverRate_or_vendorRate,
        addOnRate: item._additional_rate,
        penalty: item._penalty_1,
        remarks: 'gg1',
        status: 3
      };
    });

    // const updatedTargetArray = data.map((targetItem) => {
    //   // Find the matching payload item by comparing tripId and _id
    //   const matchingPayload = payload1.find((payloadItem) => payloadItem.tripId === targetItem._id);

    //   // If a match is found, replace all the fields except _id
    //   if (matchingPayload) {
    //     return {
    //       ...matchingPayload, // Copy all properties from the matching payload item
    //       _id: targetItem._id, // Keep the original _id from targetItem
    //       status: 3
    //     };
    //   }

    //   // If no match is found, return the original targetItem
    //   return targetItem;
    // });

    const fileId = tripData[0].rosterFileId;

    const _generateTripPayLoad = {
      data: {
        rosterFileId: fileId,
        assignTripsData: assignedTripsArray
      }
    };

    const _mappedRosterDataPayload = {
      data: {
        tripsData: rosterUploadArray
      }
    };

    try {
      const response = await axiosServices.post('/assignTrip/to/driver', _generateTripPayLoad);
      if (response.status === 201) {
        const response1 = await axiosServices.put('/tripData/map/roster/update', _mappedRosterDataPayload);
        if (response1.data.success) {
          alert(`${payload1.length} Trips Created`);
          handleClose();
          setPayload1([]);
          setInitateRender((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
    }

    // setPayload1([]);
  };

  //helper data fetch
  useEffect(() => {
    const fetchAllZoneInfo = async () => {
      const response = await axiosServices.get('/zoneType/grouped/by/zone');
      setZoneInfo(response.data.data);
    };

    const fetchAllVehicleTypeInfo = async () => {
      const response = await axiosServices.get('/vehicleType');
      setVehicleTypeInfo(response.data.data);
    };

    const fetchDrivers = async () => {
      const response = await axiosServices.get('/driver/all?drivertype=1');
      setDrivers(response.data.data.result);
    };

    fetchAllZoneInfo();
    fetchAllVehicleTypeInfo();
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchCompanyRate = async () => {
      const companyId = fileData?.companyId?._id;
      if (!companyId) return;
      const response = await axiosServices.get(`/company/unwind/rates?companyId=${companyId}`);
      console.log('fetchCompanyRate', response.data.data);
      setCompanyrate(response.data.data);
    };

    const fetchDriverRate = async () => {
      const companyId = fileData?.companyId?._id;
      if (!companyId) return;
      const response = await axiosServices.get(`/driver/all/driver/rate?companyID=${companyId}`);
      console.log('fetchDriverRate', response.data.data);
      setDriverRate(response.data.data);
    };

    fetchCompanyRate();
    fetchDriverRate();
  }, [fileData]);
  console.log({ tripData });
  useEffect(() => {
    if (tripData?.length > 0) {
      const mappedData = tripData.map((item) => ({
        ...item, // Spread existing properties
        location: item.location,
        _trip_date: item.tripDate,
        _trip_time: item.tripTime,
        _discount_1: 0, // Default values
        _penalty_1: item.penalty,
        _dual_trip: 0,
        _trip_status: item.status,
        _file_id: item.rosterFileId,
        _roster_id: item?._id,
        _dualTrip_1: 0,
        _guard_1: item.guard,
        _company_info: item?.companyID,
        _additional_rate: item.addOnRate,
        _guard_price_1: item.guardPrice,
        _tax_1: 0,
        _companyRate: item.vehicleRate,
        _driverRate_or_vendorRate: 0,
        // _vendorrateRate: 0,

        _zoneName:
          item.zoneNameArray?.length === 1
            ? {
                _id: item.zoneNameArray[0]?._id || null, // Add fallback for undefined
                zoneName: item.zoneNameArray[0]?.zoneName || 'N/A', // Fallback for undefined zoneName
                zoneType: zoneInfo?.find((zone) => zone?._id === item.zoneNameArray[0]?._id)?.zoneType || [] // Fallback for undefined zoneType
              }
            : {
                _id: null,
                zoneName: item.zoneName || 'N/A', // Fallback for undefined zoneName
                zoneType: [] // Fallback for no matching zoneType
              },

        _zoneType:
          item.zoneTypeArray?.length === 1
            ? {
                _id: item.zoneTypeArray[0]?._id || null, // Add fallback for undefined
                zoneTypeName: item.zoneTypeArray[0]?.zoneTypeName || 'N/A' // Fallback for undefined zoneTypeName
              }
            : { _id: null, zoneTypeName: item.zoneType || 'N/A' }, // Fallback for undefined zoneType

        _vehicleType:
          item.vehicleTypeArray?.length === 1
            ? {
                _id: item.vehicleTypeArray[0]?._id || null, // Add fallback for undefined
                vehicleTypeName: item.vehicleTypeArray[0]?.vehicleTypeName || 'N/A' // Fallback for undefined vehicleTypeName
              }
            : { _id: null, vehicleTypeName: item.vehicleType || 'N/A' }, // Fallback for undefined vehicleType

        _driver: { _id: null, userName: null },
        _cab: { _id: null, vehicleNumber: null },
        _zoneName_options: zoneInfo || [], // Ensure zoneInfo is not undefined
        _vehicleType_options: vehicleTypeInfo || [], // Ensure vehicleTypeInfo is not undefined
        _drivers_options: drivers || [], // Ensure drivers is not undefined
        _company_Rate: companyRate || null, // Fallback if companyRate is undefined
        _driver_rate: driverRate || null // Fallback if driverRate is undefined
      }));

      setData(mappedData);
    }
  }, [tripData, drivers, vehicleTypeInfo, zoneInfo, companyRate, driverRate]);

  console.log({ data });
  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: '_trip_date',
        dataType: 'date',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Time',
        accessorKey: '_trip_time',
        dataType: 'plain_text',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Zone Name',
        accessorKey: '_zoneName',
        dataType: 'zoneName',
        meta: {
          zoneInfo: zoneInfo
        }
      },
      {
        header: 'Zone Type',
        accessorKey: '_zoneType',
        dataType: 'zoneType'
      },
      {
        header: 'Vehicle Type',
        accessorKey: '_vehicleType',
        dataType: 'vehicleType'
      },
      {
        header: 'Driver',
        accessorKey: '_driver',
        dataType: 'driver'
      },
      {
        header: 'Cab',
        accessorKey: '_cab',
        dataType: 'cab'
      },
      {
        header: 'Dual Trip',
        accessorKey: '_dual_trip',
        dataType: 'checkbox',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Guard',
        accessorKey: '_guard_1',
        dataType: 'checkbox',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Guard Price',
        accessorKey: '_guard_price_1',
        dataType: 'guardPrice',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Company Rate',
        accessorKey: '_companyRate',
        dataType: 'companyRate',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Penalty',
        accessorKey: '_penalty_1',
        dataType: 'penalty',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Additonal rate',
        accessorKey: '_additional_rate',
        dataType: 'additionalRate',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Driver/Vendor Rate',
        accessorKey: '_driverRate_or_vendorRate',
        dataType: 'driverVendorRate',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Location',
        accessorKey: 'location',
        dataType: 'plain_text',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Status',
        accessorKey: 'select',
        dataType: 'select'
      },
      {
        header: 'Actions',
        id: 'edit',
        cell: (info) => <EditAction {...info} payload1={payload1} setPayload1={setPayload1} />,
        meta: {
          className: 'cell-center'
        }
      }
    ],
    []
  );

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Add style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Assign New Trips
            </Typography>
            <Button sx={{ ml: 2, flex: 0.2 }} color="success" variant="contained" onClick={generateTrips}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <ReactTable {...{ data, columns, setData }} />
      </Dialog>
    </>
  );
}
// ==============================|| REACT TABLE ||============================== //

function EditAction({ row, table, setPayload1, payload1 }) {
  const meta = table?.options?.meta;

  const setSelectedRow = (e) => {
    meta?.setSelectedRow((old) => ({
      ...old,
      [row.id]: !old[row.id]
    }));
    // @ts-ignore
    meta?.revertData(row.index, e?.currentTarget.name === 'cancel');
  };

  const saveRow = () => {
    const rosterId = row.original._roster_id; // Assuming rosterId exists in row.original
    const { _drivers_options, _vehicleType_options, _zoneName_options, ...cleanedRow } = row.original;

    setPayload1((prev) => {
      // Check if the current row already exists in payload1 based on rosterId
      const existingRowIndex = prev.findIndex((item) => item._roster_id === rosterId);

      if (existingRowIndex > -1) {
        // If the row exists, replace it with the cleaned row (without unwanted keys)
        const updatedPayload = [...prev];
        updatedPayload[existingRowIndex] = cleanedRow; // Overwrite the existing row with the cleaned data
        return updatedPayload;
      } else {
        // If the row does not exist, add the cleaned row to the array
        return [...prev, cleanedRow];
      }
    });

    // Reset the selectedRow state
    meta?.setSelectedRow((old) => ({
      ...old,
      [row.id]: !old[row.id]
    }));
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {meta?.selectedRow[row.id] && (
        <Tooltip title="Cancel">
          <IconButton color="error" name="cancel" onClick={setSelectedRow}>
            <CloseCircle size="15" variant="Outline" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={meta?.selectedRow[row.id] ? 'Save' : 'Edit'}>
        <IconButton
          color={meta?.selectedRow[row.id] ? 'success' : 'primary'}
          onClick={meta?.selectedRow[row.id] ? saveRow : setSelectedRow}
        >
          {meta?.selectedRow[row.id] ? <Send size="15" variant="Outline" /> : <Edit2 variant="Outline" />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, setData }) {
  const [originalData, setOriginalData] = useState(() => [...data]);
  const [selectedRow, setSelectedRow] = useState({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      cell: RowEditable
    },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      selectedRow,
      setSelectedRow,
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
        } else {
          setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
        }
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value
              };
            }
            return row;
          })
        );
      }
    },
    debugTable: true
  });

  let headers = [];
  table.getAllColumns().map(
    (columns) =>
      // @ts-ignore
      columns.columnDef.accessorKey &&
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        // @ts-ignore
        key: columns.columnDef.accessorKey
      })
  );

  return (
    <ScrollX>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} {...header.column.columnDef.meta}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ScrollX>
  );
}
