import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  Tabs,
  Tab,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip,
  Button
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project-imports
import Loader from 'components/Loader';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { HeaderSort, TablePagination } from 'components/third-party/ReactTable';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete, getInvoiceList } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';

// assets
import { Edit, Eye, InfoCircle, Trash } from 'iconsax-react';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import * as XLSX from 'xlsx';
import moment from 'moment';
import axiosServices from 'utils/axios';
import { getMergeResult } from './utils/MappingAlgorithem';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, handleSaveRoster }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['remarks', 'addOnRate', 'vehicleRate', 'vehicleNumber', 'guard', 'location'], // These may need to be updated or removed based on your new data structure
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef = useRef(null);

  // ================ Tab ================
  const groups = ['All', 'Unverified', 'Verified', 'Discarded'];
  const countGroup = data.map((item) => item.status);
  const counts = {
    Unverified: countGroup.filter((status) => status === 0).length,
    Verified: countGroup.filter((status) => status === 1).length,
    Discarded: countGroup.filter((status) => status === 2).length
  };

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab === 'Unverified' ? 0 : activeTab === 'Verified' ? 1 : 2);
  }, [activeTab]);

  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Tabs Section */}
          <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ flexGrow: 1 }}>
            {groups.map((status, index) => (
              <Tab
                key={index}
                label={status}
                value={status}
                icon={
                  <Chip
                    label={status === 'All' ? data.length : counts[status]}
                    color={status === 'All' ? 'primary' : status === 'Verified' ? 'success' : status === 'Discarded' ? 'error' : 'warning'}
                    variant="light"
                    size="small"
                  />
                }
                iconPosition="end"
              />
            ))}
          </Tabs>

          {/* Button Section */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveRoster} // Replace this with your actual onClick function
          >
            Save Roster
          </Button>
        </Stack>
      </Box>
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 1 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 2}>
          <>
            {headerGroups.map((group) => (
              <Stack key={group} direction={matchDownSM ? 'column' : 'row'} spacing={2} {...group.getHeaderGroupProps()}>
                {group.headers.map(
                  (column) =>
                    column.canFilter && (
                      <Box key={column} {...column.getHeaderProps([{ className: column.className }])}>
                        {column.render('Filter')}
                      </Box>
                    )
                )}
              </Stack>
            ))}
          </>
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| Roster - LIST ||============================== //

const ViewRosterTest = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { fileData, selectedValue } = location.state || {};
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState([]);
  const [earliestDate, setEarliestDate] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [zoneInfo, setZoneInfo] = useState(null);
  const [vehicleTypeInfo, setVehicleTypeInfo] = useState(null);
  const [mappedRowData, setMappedRowData] = useState([]);
  const requiredHeaders = Object.values(selectedValue?.mappedData);

  useEffect(() => {
    if (fileData?.rosterUrl) {
      fetchExcelData(fileData.rosterUrl);
    }
  }, [fileData?.rosterUrl]);

  const fetchExcelData = async (url) => {
    try {
      const response = await fetch(url); // Fetch the Excel file
      const data = await response.arrayBuffer(); // Convert to binary data
      const workbook = XLSX.read(data, { type: 'array' }); // Read the workbook
      const sheetName = workbook.SheetNames[0]; // Get the first sheet name
      const sheet = workbook.Sheets[sheetName]; // Get the sheet by name
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]; // Extract headers

      checkHeaders(headers, sheet); // Check if required headers are present
    } catch (error) {
      console.error('Error fetching or parsing Excel file:', error);
    }
  };

  const validateExcelFile = async (fileData) => {
    await axiosServices.put('/tripData/update/roster/status', {
      data: {
        _id: fileData._id,
        rosterStatus: 2
      }
    });
  };

  const checkHeaders = (headers, sheet) => {
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header)); // Find missing headers

    if (missingHeaders.length > 0) {
      alert(`Missing headers: ${missingHeaders.join(', ')}`);
      validateExcelFile(fileData);
      navigate(-1);
    } else {
      mapDataToMappedKeysInBatches(sheet, headers);
    }
  };

  const mapDataToMappedKeysInBatches = (sheet, headers, batchSize = 1000) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const dataRows = rows.slice(1); // Skip header
    const totalRows = dataRows.length;
    let batchIndex = 0;
    let shouldContinue = true; // Flag to determine whether to continue processing
    let allDates = []; // Store all valid dates

    const processBatch = () => {
      if (!shouldContinue) return; // If we should stop, don't continue processing

      const batch = dataRows.slice(batchIndex, batchIndex + batchSize);

      const mappedBatch = batch
        .map((row) => {
          const isRowEmpty = row.every((cell) => !cell);
          if (isRowEmpty) {
            shouldContinue = false; // Stop further processing on empty row
            return null; // Skip this row
          }

          const rowObject = {};
          const mappedData = selectedValue?.mappedData;
          const dateFormat = selectedValue?.dateFormat || 'DD-MM-YYYY';
          const timeFormat = selectedValue?.timeFormat || 'HH:mm';
          const pickupType = selectedValue?.pickupType || 'pickup';
          const dropType = selectedValue?.dropType || 'drop';
          let tripDateValue;

          Object.keys(mappedData).forEach((key) => {
            const excelHeader = mappedData[key];
            const headerIndex = headers.indexOf(excelHeader);

            if (headerIndex !== -1) {
              let value = row[headerIndex];

              if (key === 'tripDate' && value) {
                // Excel date serial to string in 'yyyy-mm-dd' format
                value = XLSX.SSF.format('yyyy-mm-dd', value);
                tripDateValue = moment(value, 'YYYY-MM-DD'); // Parse as a moment object

                // Ensure the date is formatted as 'yyyy-mm-dd'
                value = tripDateValue.format('YYYY-MM-DD');
              }
              if (key === 'tripTime' && value) {
                const timeIn24HourFormat = XLSX.SSF.format('hh:mm', value); // Convert Excel serial time to HH:mm format
                value = moment(timeIn24HourFormat, 'HH:mm').format('hh:mm A'); // Format to 12-hour time with AM/PM

                if (value === 'Invalid date') {
                  value = 'N/A';
                }
              }

              if (key === 'tripType' && value) {
                console.log({ value });
                value = value.toLowerCase() === pickupType.toLowerCase() ? 1 : value.toLowerCase() === dropType.toLowerCase() ? 2 : 'N/A';
              }

              rowObject[key] = value;
            }
          });

          // Add missing fields with default value 0

          // Add the valid tripDate to allDates array
          if (tripDateValue && tripDateValue.isValid()) {
            allDates.push(tripDateValue);
          }

          Object.keys(rowObject).forEach((key) => {
            if (!rowObject[key]) {
              // Use "in" operator to check for property existence
              rowObject[key] = 0; // Set undefined fields to 0
            }
          });

          if (rowObject['guardPrice']) {
            rowObject['guard'] = 0;
          } else {
            rowObject['guard'] = 1;
          }

          return rowObject;
        })
        .filter((row) => row !== null); // Filter out null rows

      setExcelData((prevData) => [...prevData, ...mappedBatch]);

      // Find and set the earliest and latest date
      if (allDates.length > 0) {
        const minDate = moment.min(allDates);
        const maxDate = moment.max(allDates);

        setEarliestDate((prevDate) => (prevDate ? moment.min(prevDate, minDate) : minDate));
        setLatestDate((prevDate) => (prevDate ? moment.max(prevDate, maxDate) : maxDate));
      }

      batchIndex += batchSize;
      if (batchIndex < totalRows && shouldContinue) {
        setTimeout(processBatch, 0); // Process the next batch after this one
      } else {
        setLoading(false); // Data processing complete
      }
    };

    processBatch(); // Start processing
  };

  const fetchAllZoneInfo = async () => {
    const response = await axiosServices.get('/zoneType/grouped/by/zone');
    setZoneInfo(response.data.data);
  };

  const fetchAllVehicleTypeInfo = async () => {
    const response = await axiosServices.get('/vehicleType');
    const vehicleTypes = response.data.data.map((vehicle) => ({
      _id: vehicle._id,
      vehicleTypeName: vehicle.vehicleTypeName
    }));
    setVehicleTypeInfo(vehicleTypes);
  };

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    fetchAllZoneInfo();
    fetchAllVehicleTypeInfo();
  }, []);

  useEffect(() => {
    if (excelData.length > 0 && zoneInfo && vehicleTypeInfo) {
      const result = getMergeResult(excelData, zoneInfo, vehicleTypeInfo);
      setMappedRowData(result);
      setLoading(false); // Set loading to false after processing is complete
    }
  }, [excelData, zoneInfo, vehicleTypeInfo]);

  const columns = useMemo(
    () => [
      {
        title: 'Sr No.',
        Header: 'Sr No.',
        accessor: (row, i) => i + 1, // Adding 1 to index for SR No. to start from 1 instead of 0
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ row }) => row.index + 1, // Adjusted to display the row number
        className: 'cell-center'
      },
      {
        Header: 'Trip Date',
        accessor: 'tripDate',
        className: 'cell-center',
        disableFilters: true
      },
      {
        Header: 'Trip Time',
        accessor: 'tripTime',
        disableFilters: true,
        Cell: ({ value }) => {
          console.log({ value });
          return value; // Adjust as per your type definitions
        }
      },
      {
        Header: 'Trip Type',
        accessor: 'tripType',
        disableFilters: true,
        Cell: ({ value }) => {
          return value === 1 ? 'Pickup' : value === 2 ? 'Drop' : 'N/A'; // Adjust as per your type definitions
        }
      },
      {
        Header: 'Zone Name',
        accessor: 'zoneName',
        disableFilters: true,
        Cell: ({ row }) => {
          const { zoneName, zoneNameArray } = row.original;
          const hasError = !zoneNameArray || zoneNameArray.length !== 1;
          const errorMessage =
            zoneNameArray.length > 1 ? `multiple zone with name : ${zoneName} found` : `zone name : ${zoneName} not found`;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {zoneName}
              {hasError && (
                <Tooltip title={errorMessage}>
                  <IconButton size="small" color="error">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneType',
        disableFilters: true,

        Cell: ({ row }) => {
          const { zoneType, zoneTypeArray } = row.original;
          const hasError = !zoneTypeArray || zoneTypeArray.length !== 1;
          const errorMessage =
            zoneTypeArray.length > 1 ? `multiple zone with name : ${zoneType} found` : `zone name : ${zoneType} not found`;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {zoneType}
              {hasError && (
                <Tooltip title={errorMessage}>
                  <IconButton size="small" color="error">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        Header: 'Location',
        accessor: 'location',
        disableFilters: true
      },
      {
        Header: 'Guard',
        accessor: 'guard',
        disableFilters: true
      },
      {
        Header: 'Vehicle Type',
        accessor: 'vehicleType',
        disableFilters: true,
        Cell: ({ row }) => {
          const { vehicleType, vehicleTypeArray } = row.original;
          const hasError = !vehicleTypeArray || vehicleTypeArray.length !== 1;
          const errorMessage =
            vehicleTypeArray.length > 1
              ? `multiple vehicle type with name : ${vehicleType} found`
              : `vehicle type name : ${vehicleType} not found`;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {vehicleType}
              {hasError && (
                <Tooltip title={errorMessage}>
                  <IconButton size="small" color="error">
                    <InfoCircle />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        Header: 'Vehicle Number',
        accessor: 'vehicleNumber',
        disableFilters: true
      },
      {
        Header: 'Vehicle Rate',
        accessor: 'vehicleRate',
        disableFilters: true
      },
      {
        Header: 'Add-On Rate',
        accessor: 'addOnRate',
        disableFilters: true
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        disableFilters: true
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        Cell: ({ value }) => {
          switch (value) {
            case 0:
              return <Chip color="info" label="Unverified" size="small" variant="light" />; // Change as needed
            case 1:
              return <Chip color="success" label="Verified" size="small" variant="light" />; // Change as needed
            default:
              return <Chip color="error" label="Discarded" size="small" variant="light" />;
          }
        }
      }
    ],
    [] // dependencies array can be adjusted based on other states if needed
  );

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Roster', to: '/apps/roster/dashboard' },
    { title: 'Create Roster' }
  ];

  const handleSaveRoster = async () => {
    const rosterFileId = fileData._id;
    const companyID = fileData.companyId._id;
    const startDate = earliestDate._i;
    const endDate = latestDate._i;

    const payload = {
      data: {
        rosterFileId: rosterFileId,
        companyID: companyID,
        tripsData: mappedRowData,
        fileData: {
          startDate: startDate,
          endDate: endDate
        }
      }
    };
    setLoading(true);
    try {
      // First request
      const response = await axiosServices.post('/tripData/map/roster', payload);

      if (response.status === 201) {
        // If the first request was successful, proceed with the second request
        const updateResponse = await axiosServices.put('/tripData/update/roster/status', {
          data: {
            _id: fileData._id,
            rosterStatus: 1
          }
        });
        setLoading(false);
        if (updateResponse.data.success) {
          navigate('/apps/roster/all-roster');
        }
      }
    } catch (error) {
      console.error('Error occurred during requests:', error);
      // Handle error as needed
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;

  return (
    <>
      <Breadcrumbs custom heading="Create Roster" links={breadcrumbLinks} />

      <MainCard content={false}>
        <ScrollX>{mappedRowData && <ReactTable columns={columns} data={mappedRowData} handleSaveRoster={handleSaveRoster} />}</ScrollX>
      </MainCard>
    </>
  );
};

ViewRosterTest.propTypes = {
  row: PropTypes.object,
  values: PropTypes.object,
  email: PropTypes.string,
  avatar: PropTypes.node,
  customer_name: PropTypes.string,
  invoice_id: PropTypes.string,
  id: PropTypes.number,
  value: PropTypes.object,
  toggleRowExpanded: PropTypes.func,
  isExpanded: PropTypes.bool,
  getToggleAllPageRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func
};

export default ViewRosterTest;
