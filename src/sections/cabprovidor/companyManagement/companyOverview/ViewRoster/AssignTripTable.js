import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'utils/axios';
import { Box, Button, Checkbox, CircularProgress, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import { dispatch } from 'store';
import { useSelector } from 'store';
import { omitKeysFromArray } from 'utils/helper';
import { openSnackbar } from 'store/reducers/snackbar';
import { useLocation, useParams } from 'react-router';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import ReactTable from './editRosterTable/ReactTable';
import PaginationBox from './editRosterTable/Pagination';
import { fetchAllVehicleTypes } from 'store/slice/cabProvidor/vehicleTypeSlice';

const optionsForGuard = [
  //   { value: "", label: <em>Placeholder</em>, disabled: true, hide: true },
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' }
];

const optionsForTripType = [
  {
    value: 1,
    label: 'Pickup'
  },
  {
    value: 2,
    label: 'Drop'
  }
];

/**
 * Checks if all elements in the given array are non-empty strings.
 *
 * @param {Array<string>} arr - The array of strings to be evaluated.
 * @returns {boolean} - Returns `true` if all elements are non-empty after trimming whitespace; otherwise, `false`.
 *
 * The function uses the `every` method to iterate through the array `arr`.
 * Each element is trimmed of leading and trailing whitespace, and checked to ensure it is not an empty string.
 * An empty string after trimming indicates that the corresponding element is considered empty.
 * If any element is empty, the function will return `false`; if all elements are valid, it will return `true`.
 */

// Helper function to check if a value is empty
const isEmpty = (value) => value === '';

// Conditions for invalid values using functions
const invalidConditions = {
  tripId: isEmpty, // Invalid if empty string
  tripDate: isEmpty, // Invalid if empty string
  tripTime: (value) => value < 0 || value === '', // Invalid if negative
  zoneNameID: isEmpty, // Invalid if empty string
  vehicleTypeID: isEmpty, // Invalid if empty string
  vehicleNumber: isEmpty, // Invalid if empty string
  driverId: isEmpty, // Invalid if empty string
  tripType: (value) => typeof value !== 'number' || value === '', // Invalid if not a number or empty
  // guard: (value) => value < 0, // Invalid if negative
  // guardPrice: (value) => value < 0 || value > 1000, // Invalid if negative or greater than 1000
  vehicleRate: (value) => value < 0 || value === ''
};

const AssignTripTable = () => {
  const { id } = useParams();
  // const { fromDate, toDate } = useSearchParams();

  const location = useLocation();

  // Parse the query string
  const searchParams = new URLSearchParams(location.search);

  // Access individual query parameters
  const fromDate = searchParams.get('fromDate'); // e.g., "2023-10-03"
  const toDate = searchParams.get('toDate'); // e.g., "2023-10-10"

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [lastPageNo, setLastPageNo] = useState(1);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [centralData] = useState(() => (localStorage.getItem('centralData') ? JSON.parse(localStorage.getItem('centralData')) : []));
  const [optionsForCabAmount, setOptionsForCabAmount] = useState([]);

  const [zoneTypeOptions, setZoneTypeOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);

  const [rates, setRates] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const [dummyForVehiclesAndDriver, setDummyForVehiclesAndDriver] = useState([]);

  const zonesOptions = useSelector((state) => state.zone.zones);
  const zoneTypeAllOptions = useSelector((state) => state.zoneType.zoneTypes);
  const vehicleTypeOptions = useSelector((state) => state.vehicleType.data);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((val) => {
    setPage(val);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.post(`/tripData/trip/requests/company?page=${page}&limit=${limit}`, {
          data: {
            // companyId: "663e0b2b692625507ec05015",
            companyId: id,
            fromDate: fromDate,
            toDate: toDate,
            tripStatus: 1
          }
        });

        if (response.status === 200) {
          //   setData(response.data.data);
          setLastPageNo(Math.ceil(response.data.totalCount / response.data.limit));

          if (Array.isArray(centralData) && centralData.length > 0) {
            // modify data with central data

            const modifiedData = response.data.data.map((row) => {
              const found = centralData.find((i) => i.tripId === row._id);

              return {
                tripId: found?.tripId || row._id || '',
                companyID: found?.companyID || row.companyID._id || '',

                trip_date: found?.trip_date || row.tripDate || '',
                tripDate: found?.tripDate || '',

                trip_time: found?.tripTime || row.tripTime || '',
                tripTime: found?.tripTime || '',

                tripType: found?.tripType || row.tripType || 0,

                zoneName: found?.zoneName || row.zoneName || '',
                zoneNameID: found?.zoneNameID || '',

                zoneType: found?.zoneType || row.zoneType || '',
                zoneTypeID: found?.zoneTypeID || '',

                location: found?.location || row.location || '',

                guard: found?.guard || row.guard || 0,
                guardPrice: found?.guardPrice || row.guardPrice || 0,

                vehicleType: found?.vehicleType || row.vehicleType || '',
                vehicleTypeID: found?.vehicleTypeID || '',

                vehicle_number: found?.vehicle_number?.vehicleNumber || row.vehicleNumber || '',
                vehicleNumber: found?.vehicleNumber || '',

                driver_id: found?.driver_id || '',
                driverId: found?.driverId || '',

                vehicleRate: found?.vehicleRate || typeof row.vehicleRate === 'number' ? row.vehicleRate : 0 || 0,
                addOnRate: found?.addOnRate || row.addOnRate || 0,
                penalty: found?.penalty || row.penalty || 0,
                remarks: found?.remarks || row.remarks || '',

                isValidRow: found ? true : false
              };
            });

            setData(modifiedData);
          } else {
            // central data not available or empty

            const modifiedData = response.data.data.map((row) => ({
              tripId: row._id,
              companyID: row.companyID._id,
              trip_date: row.tripDate,
              tripDate: '',
              trip_time: row.tripTime,
              tripTime: '',
              tripType: row.tripType,
              zoneName: row.zoneName,
              zoneNameID: '',
              zoneType: row.zoneType,
              zoneTypeID: '',
              location: row.location,
              guard: row.guard,
              guardPrice: row.guardPrice,
              vehicleType: row.vehicleType,
              vehicleTypeID: '',
              vehicle_number: row.vehicleNumber,
              vehicleNumber: '',
              driver_id: '',
              driverId: '',
              vehicleRate: typeof row.vehicleRate === 'number' ? row.vehicleRate : 0,
              addOnRate: row.addOnRate,
              penalty: row.penalty,
              remarks: row.remarks,
              isValidRow: false
            }));
            setData(modifiedData);
          }
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, refetch]);

  useEffect(() => {
    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
    dispatch(fetchAllVehicleTypes());
  }, []);

  useEffect(() => {
    async function fetchRatesByCompany() {
      const response = await axios.get(`/company/all/rates?companyId=${id}`);

      if (response.status === 200) {
        setRates(response.data.data);
      }
    }

    fetchRatesByCompany();
  }, []);

  useEffect(() => {
    async function fetchVehiclesAndDriver() {
      try {
        const response = await axios.get(`/vehicle/list/all`);

        if (response.status === 200) {
          setDummyForVehiclesAndDriver(response.data.data);
        }
      } catch (error) {
        console.log('Error at fetchVehiclesAndDriver: ', error);
      }
    }

    fetchVehiclesAndDriver();
  }, []);

  const columns = useMemo(
    () => [
      // Valid
      {
        Header: 'Valid',
        accessor: 'valid',
        Cell: ({ row }) => (
          <>
            {/* <Checkbox checked={isRowValid(row.original)} readOnly /> */}
            <Checkbox
              checked={row.original.isValidRow}
              readOnly
              disableFocusRipple
              disableTouchRipple
              disableRipple
              sx={{
                cursor: 'not-allowed' // Set the cursor to 'default' for a normal cursor
              }}
            />
          </>
        ),
        disableFilters: true,
        disableSortBy: true
      },
      // Trip ID (text)
      {
        Header: 'Trip ID',
        accessor: 'tripId',
        dataType: 'text',
        editableCondition: () => false
      },
      // Zone Name (autoComplete)
      {
        Header: 'Zone Name',
        // accessor: "zoneNameID",
        accessor: 'zoneName',
        dataType: 'autoComplete',
        properties: {
          options: zonesOptions, // mandatory
          displayName: 'zoneName', // mandatory
          placeholder: 'Select Zone Name'
        }
      },
      // Zone Type (autoComplete)
      {
        Header: 'Zone Type',
        // accessor: "zoneTypeID",
        accessor: 'zoneType',
        dataType: 'autoComplete',
        properties: {
          // options: zoneTypeAllOptions,
          options: zoneTypeOptions,
          displayName: 'zoneTypeName',
          placeholder: 'Select Zone Type'
        }
      },
      // Vehicle Type (autoComplete)
      {
        Header: 'Vehicle Type',
        // accessor: "vehicleTypeID",
        accessor: 'vehicleType',
        dataType: 'autoComplete',
        properties: {
          options: vehicleTypeOptions,
          displayName: 'vehicleTypeName',
          placeholder: 'Select Vehicle Type'
        }
      },
      // Vehicle Rate (select)
      {
        Header: 'Vehicle Rate',
        accessor: 'vehicleRate',
        dataType: 'select',
        properties: {
          options: optionsForCabAmount, // mandatory to pass this for select field
          noDataText: 'No Rate Found'
        }
      },
      // Vehicle Number (autoComplete)
      {
        Header: 'Vehicle Number',
        accessor: 'vehicle_number',
        dataType: 'autoComplete',
        properties: {
          options: dummyForVehiclesAndDriver,
          displayName: 'vehicleNumber',
          placeholder: 'Select Vehicle Number'
        }
      },
      // Driver (autoComplete)
      {
        Header: 'Driver',
        accessor: 'driver_id',
        dataType: 'autoComplete',
        properties: {
          options: driverOptions,
          displayName: 'userName',
          placeholder: 'Select Driver'
        }
      },
      // Guard (select)
      {
        Header: 'Guard',
        accessor: 'guard',
        dataType: 'select',
        properties: {
          options: optionsForGuard // mandatory to pass this for select field
        }
      },
      // Guard Price (number)
      {
        Header: 'Guard Price',
        accessor: 'guardPrice',
        dataType: 'number',
        editableCondition: (row) => row.guard !== 0 // Guard price should be editable if guard is not 0
      },
      // Trip Type (select)
      {
        Header: 'Trip Type',
        accessor: 'tripType',
        dataType: 'select',
        properties: {
          options: optionsForTripType // mandatory to pass this for select field
        }
      },
      // Trip Date (date)
      {
        Header: 'Trip Date',
        accessor: 'trip_date',
        dataType: 'date'
      },
      // Trip Time (time)
      {
        Header: 'Trip Time',
        accessor: 'trip_time',
        dataType: 'time'
      },
      // Add On Rate (number)
      {
        Header: 'Add On Rate',
        accessor: 'addOnRate',
        dataType: 'number'
      },
      // Penalty (number)
      {
        Header: 'Penalty',
        accessor: 'penalty',
        dataType: 'number'
      },
      // Location (text)
      {
        Header: 'Location',
        accessor: 'location',
        dataType: 'text'
      },
      // Remarks (text)
      {
        Header: 'Remarks',
        accessor: 'remarks',
        dataType: 'text'
      }
    ],
    [driverOptions, zonesOptions, zoneTypeOptions, vehicleTypeOptions, optionsForCabAmount]
  );

  const updateData = (rowIndex, columnId, value) => {
    // we also turn on the flag to not reset the page

    if (columnId === 'zoneName') {
      const filterZoneType = zoneTypeAllOptions.filter((item) => item.zoneId._id === value._id);
      setZoneTypeOptions(filterZoneType);
    }
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const oldRow = old[rowIndex];
          let oldZoneName;
          let oldZoneNameId;
          if (columnId === 'zoneName') {
            oldZoneName = oldRow.zoneName;
            // eslint-disable-next-line no-unused-vars
            oldZoneNameId = oldRow.zoneNameID;
            setOptionsForCabAmount([]);
          }

          let res = {
            ...old[rowIndex],
            ...(columnId === 'guard' ? (value === 0 ? { guardPrice: 0 } : {}) : {}),
            [columnId]: value,
            ...(columnId === 'zoneName' && {
              zoneNameID: value._id,
              ...(typeof oldZoneName === 'object' && {
                zoneType: '',
                zoneTypeID: '',
                vehicleType: '',
                vehicleTypeID: '',
                vehicleRate: 0
              })
            }),
            ...(columnId === 'zoneType' && { zoneTypeID: value._id }),
            ...(columnId === 'vehicleType' && { vehicleTypeID: value._id }),
            ...(columnId === 'trip_date' && {
              tripDate: value.toISOString()
            }),
            ...(columnId === 'trip_time' && {
              tripTime: value.getTime() / 1000
            }),
            ...(columnId === 'vehicle_number' &&
              (typeof value === 'object'
                ? {
                    vehicleNumber: value._id,
                    driver_id: '',
                    driverId: ''
                  }
                : { vehicleNumber: value._id })),
            ...(columnId === 'driver_id' && { driverId: value._id })
          };

          const { zoneNameID: oldZoneNameID, zoneTypeID: oldZoneTypeID, vehicleTypeID: oldVehicleTypeID } = res;

          if (oldZoneNameID && oldZoneTypeID && oldVehicleTypeID && ['zoneName', 'zoneType', 'vehicleType'].includes(columnId)) {
            const result = getCabAmountsByZoneAndType(rates, oldZoneNameID, oldZoneTypeID);

            setOptionsForCabAmount(result);
          }

          if (columnId === 'vehicle_number') {
            const vehicleNumberID = value._id;
            const filterDrivers = dummyForVehiclesAndDriver
              .filter((item) => item._id === vehicleNumberID)
              .flatMap((item) => item.assignedDriver.map((driver) => driver.driverId))
              .filter((item) => item !== null);
            setDriverOptions(filterDrivers);
          }

          let newRes = removeNestedObjects(res);

          const isValidRow = isObjectValidBasedOnConditions(newRes, invalidConditions);

          //   isRowValid(res);
          newRes = {
            ...newRes,
            isValidRow
          };

          res = {
            ...res,
            isValidRow
          };

          return res;
          // return newRes;
        }
        return row;
      })
    );
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const saveLater = useCallback(() => {
    const result = data.filter((item) => item.isValidRow);

    if (result.length > 0) {
      // Create a merged array with updated objects
      const result1 = centralData.map((itemX) => {
        // Find if the item exists in array y
        const itemY = result.find((itemY) => itemY.tripId === itemX.tripId);
        return itemY ? { ...itemX, ...itemY } : itemX;
      });

      // Add the remaining unique items from y
      const uniqueFromY = result.filter((itemY) => !centralData.some((itemX) => itemX.tripId === itemY.tripId));

      // Combine both arrays
      const output = [...result1, ...uniqueFromY];

      localStorage.setItem(`centralData`, JSON.stringify(output));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Trip temporary saved successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please assign a valid trip',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  }, [data]);

  const assignTripToDriver = useCallback(async () => {
    try {
      const result = data.filter((item) => item.isValidRow);

      if (result.length > 0) {
        const resultId = result.map((item) => item.tripId);

        const omitKeys = ['trip_date', 'trip_time', 'zoneName', 'zoneType', 'vehicleType', 'vehicle_number', 'driver_id', 'isValidRow'];
        const assignTripsData = omitKeysFromArray(result, omitKeys);

        const payload = {
          data: {
            assignTripsData
          }
        };

        const response = await axios.post(`/assignTrip/to/driver`, payload);

        if (response?.status === 201) {
          // alert("Trip assigned successfully");
          const result = centralData.filter((item) => !resultId.includes(item.tripId));
          localStorage.setItem(`centralData`, JSON.stringify(result));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Trip assigned successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          setRefetch(true);
        }
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Please assign a valid trip',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      }
    } catch (error) {
      console.log(`🚀 ~ error ~ assignTripToDriver::`, error);
    }
  }, [data]);

  return (
    <>
      <MainCard>
        <Stack gap={3}>
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
          ) : data?.length > 0 ? (
            <>
              <Stack direction="row" alignItems="center" justifyContent="flex-end">
                <Stack direction="row" gap={2}>
                  <Button onClick={saveLater} variant="contained" color="secondary">
                    Save Later
                  </Button>
                  <Button onClick={assignTripToDriver} variant="contained">
                    Assign Trip
                  </Button>
                </Stack>
              </Stack>
              <ScrollX>
                <ReactTable columns={columns} data={data} updateData={updateData} skipPageReset={skipPageReset} />
              </ScrollX>

              <PaginationBox
                pageSize={limit}
                setPageSize={handleLimitChange}
                pageIndex={page}
                gotoPage={handlePageChange}
                lastPageIndex={lastPageNo}
              />
            </>
          ) : (
            <>
              <TableNoDataMessage text="No Data Found" />
            </>
          )}
        </Stack>
      </MainCard>
    </>
  );
};

export default AssignTripTable;

/**
 * Removes keys from the object that contain nested objects.
 *
 * @param {Object} obj - The original object from which to remove nested objects.
 * @returns {Object} A new object containing only the non-object key-value pairs.
 *
 * This function iterates over the properties of the input object and checks
 * the type of each property's value. If a property's value is not an object
 * (including arrays) and not null, it is added to the result object.
 * This is useful for filtering out complex structures and retaining only
 * primitive values (strings, numbers, booleans).
 */
function removeNestedObjects(obj) {
  const result = {}; // Initialize an empty object to store non-object keys

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      // Ensure the property belongs to the object itself
      const value = obj[key]; // Get the value associated with the current key

      // Check if the value is not an object and not null
      if (typeof value !== 'object' || value === null) {
        result[key] = value; // Add non-object key-value pair to the result
      }
    }
  }

  return result; // Return the new object with only non-object keys
}

/**
 * Checks the validity of an object based on specified invalid conditions.
 *
 * @param {Object} obj - The object to be validated.
 * @param {Object} invalidConditions - An object where each key corresponds to a property in the `obj` and
 *                                      each value is a function that takes the property value as an argument
 *                                      and returns a boolean indicating whether the value is considered invalid.
 *
 * @returns {boolean} - Returns `true` if all properties in the `obj` pass the invalid conditions (i.e., are valid);
 *                      returns `false` if any property fails its corresponding invalid condition.
 *
 * @example
 * const obj = {
    zoneTypeID: 'delhi',
    guard: 0,
    guardPrice: 1000,
    vehicle_number: 'dl01aa256',
  };

  const invalidConditions = {
    zoneTypeID: (value) => value === '', // Invalid if empty string
    guard: (value) => value < 0, // Invalid if negative
    guardPrice: (value) => value < 0 || value > 1000, // Invalid if negative or greater than 1000
    vehicle_number: (value) => value === '', // Invalid if empty
  };
               
 * const result = isObjectValidBasedOnConditions(obj, conditions); // Checks if 'obj' is valid based on 'conditions'.
 */

function isObjectValidBasedOnConditions(obj, invalidConditions) {
  for (const key in invalidConditions) {
    const isInvalid = invalidConditions[key]; // This is now a function
    const value = obj[key];

    // Call the function to check if the value is invalid
    if (isInvalid(value)) {
      return false;
    }
  }
  return true;
}

/**
 * Retrieves a list of cab amounts for a specific zone and zone type.
 * The function filters the provided data array based on the given zone ID and zone type ID,
 * then maps the matching vehicle types and their corresponding amounts into a new array.
 * Each item in the returned array contains a 'value' representing the amount and a 'label'
 * formatted as "VehicleTypeName - Amount".
 *
 * @param {Array} data - The input data array containing zones, zone types, and cab amounts.
 * @param {string} zoneId - The ID of the zone to filter the data by.
 * @param {string} zoneTypeId - The ID of the zone type to filter the data by.
 * @returns {Array} - An array of objects where each object contains 'value' (amount) and 'label' (formatted string).
 *                    Returns an empty array if no matching zone and zone type is found.
 */
function getCabAmountsByZoneAndType(data, zoneId, zoneTypeId) {
  // Find the zone and type that matches the given zoneId and zoneTypeId
  const zoneData = data.find((zone) => zone.zoneNameID._id === zoneId && zone.zoneTypeID._id === zoneTypeId);

  // If no matching zone is found, return an empty array
  if (!zoneData) return [];

  // Map the cabAmount data to the desired format
  return zoneData.cabAmount.map((cab) => ({
    value: cab.amount,
    label: `${cab.vehicleTypeID.vehicleTypeName} - ${cab.amount}`
  }));
}

/** SUMMARY :
 *  - Editable Table for assign Drivers to trip
 *  - Working with ALL API calls
 */
