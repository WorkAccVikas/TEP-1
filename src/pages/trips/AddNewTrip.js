import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Form, Formik, FormikProvider, useFormik } from 'formik';
import { Add } from 'iconsax-react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dispatch } from 'store';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import ConfigurableAutocomplete from 'components/autocomplete/ConfigurableAutocomplete';
import { useCallback, useEffect, useRef, useState } from 'react';
import { openSnackbar } from 'store/reducers/snackbar';
import SearchComponent from 'pages/apps/test/CompanySearch';
import GenericSelect from 'components/select/GenericSelect';
import { useSelector } from 'store';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import NumericInput from 'components/textfield/NumericInput';
import axiosServices from 'utils/axios';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { addNewTrip, fetchTripDetails, updateTrip } from 'store/slice/cabProvidor/tripSlice';
import { formatDateUsingMoment } from 'utils/helper';
import { FaSyncAlt } from 'react-icons/fa';
import { alpha, useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import { fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchDrivers1 } from 'store/slice/cabProvidor/driverSlice';
import { fetchCab1 } from 'store/slice/cabProvidor/cabSlice';
import moment from 'moment';

const NUMERIC_INPUT_FIELD = {
  // guardPrice: {
  //   defaultValue: 0
  // },
  companyGuardPrice: {
    defaultValue: 0,
    min: 0
  },
  companyRate: {
    defaultValue: 0,
    min: 0
  },
  companyPenalty: {
    defaultValue: 0,
    min: 0
  },

  vendorGuardPrice: {
    defaultValue: 0,
    min: 0
  },
  vendorRate: {
    defaultValue: 0,
    min: 0
  },
  vendorPenalty: {
    defaultValue: 0,
    min: 0
  },

  driverGuardPrice: {
    defaultValue: 0,
    min: 0
  },
  driverRate: {
    defaultValue: 0,
    min: 0
  },
  driverPenalty: {
    defaultValue: 0,
    min: 0
  },

  addOnRate: {
    defaultValue: 0,
    min: 0
  },
  mcdCharge: {
    defaultValue: 0,
    min: 0
  },
  tollCharge: {
    defaultValue: 0,
    min: 0
  }
  // penalty: {
  //   defaultValue: 0
  // }
};

// const validationSchema = Yup.object().shape({
//   // companyID: Yup.string().required('Company is required'),
//   companyID: Yup.mixed()
//     .test(
//       'is-null-or-object',
//       'Field must be null or a valid object',
//       (value) => value === null || (typeof value === 'object' && !Array.isArray(value))
//     )
//     .required('Company is required'), // If required is mandatory.,
//   tripDate: Yup.date().required('Trip date is required'),
//   tripTime: Yup.string().required('Trip time is required'),
//   returnTripTime: Yup.string().when('dualTrip', (val, schema) => {
//     console.log(`🚀 ~ returnTripTime:Yup.string ~ val:`, val);
//     if (val[0]) {
//       return Yup.string()
//         .test('is-less-than-tripTime', 'Return trip time must be later than the trip time', function (value) {
//           console.log(`🚀 ~ returnTripTime:Yup.string ~ value:`, value);
//           const { tripTime } = this.parent;
//           const returnTime = value;

//           const time1 = moment(tripTime, 'HH:mm');
//           const time2 = moment(returnTime, 'HH:mm');
//           console.log(`🚀 ~ tripTime:`, tripTime);
//           return time2.isAfter(time1);
//         })
//         .required('Return trip time is required');
//     } else {
//       return Yup.string().notRequired();
//     }
//   }),
//   tripType: Yup.number().required('Trip type is required'),
//   zoneNameID: Yup.string().required('Zone name is required'),
//   zoneTypeID: Yup.string().required('Zone type is required'),
//   vehicleTypeID: Yup.string().required('Vehicle type is required'),
//   vehicleNumber: Yup.string().required('Vehicle number is required'),
//   driverId: Yup.string().required('Driver is required'),

//   // guardPrice: Yup.number()
//   //   .typeError('Must be a number')
//   //   .min(NUMERIC_INPUT_FIELD.guardPrice.defaultValue, 'Guard Price must be at least ₹0'),

//   companyRate: Yup.number()
//     .typeError('Must be a number')
//     .min(NUMERIC_INPUT_FIELD.companyRate.min, `Company Rate must be at least ₹${NUMERIC_INPUT_FIELD.companyRate.min}`)
//     .required('Company Rate is required')
// });

const generateValidationSchema = (id) => {
  return Yup.object().shape({
    // companyID: Yup.string().required('Company is required'),
    companyID: Yup.mixed()
      .test(
        'is-null-or-object',
        'Field must be null or a valid object',
        (value) => value === null || (typeof value === 'object' && !Array.isArray(value))
      )
      .required('Company is required'), // If required is mandatory.,
    tripDate: Yup.date().required('Trip date is required'),
    tripTime: Yup.string().required('Trip time is required'),
    // returnTripTime: Yup.string().when('dualTrip', (val, schema) => {
    //   console.log(`🚀 ~ returnTripTime:Yup.string ~ val:`, val);
    //   if (val[0]) {
    //     return Yup.string()
    //       .test('is-less-than-tripTime', 'Return trip time must be later than the trip time', function (value) {
    //         console.log(`🚀 ~ returnTripTime:Yup.string ~ value:`, value);
    //         const { tripTime } = this.parent;
    //         const returnTime = value;

    //         const time1 = moment(tripTime, 'HH:mm');
    //         const time2 = moment(returnTime, 'HH:mm');
    //         console.log(`🚀 ~ tripTime:`, tripTime);
    //         return time2.isAfter(time1);
    //       })
    //       .required('Return trip time is required');
    //   } else {
    //     return Yup.string().notRequired();
    //   }
    // }),
    returnTripTime: id
      ? Yup.string().notRequired()
      : Yup.string().when('dualTrip', (val, schema) => {
          console.log(`🚀 ~ returnTripTime:Yup.string ~ val:`, val);
          if (val[0]) {
            return Yup.string()
              .test('is-less-than-tripTime', 'Return trip time must be later than the trip time', function (value) {
                console.log(`🚀 ~ returnTripTime:Yup.string ~ value:`, value);
                const { tripTime } = this.parent;
                const returnTime = value;

                const time1 = moment(tripTime, 'HH:mm');
                const time2 = moment(returnTime, 'HH:mm');
                console.log(`🚀 ~ tripTime:`, tripTime);
                return time2.isAfter(time1);
              })
              .required('Return trip time is required');
          } else {
            return Yup.string().notRequired();
          }
        }),
    tripType: Yup.number().required('Trip type is required'),
    zoneNameID: Yup.string().required('Zone name is required'),
    zoneTypeID: Yup.string().required('Zone type is required'),
    vehicleTypeID: Yup.string().required('Vehicle type is required'),
    vehicleNumber: Yup.string().required('Vehicle number is required'),
    driverId: Yup.string().required('Driver is required'),

    // guardPrice: Yup.number()
    //   .typeError('Must be a number')
    //   .min(NUMERIC_INPUT_FIELD.guardPrice.defaultValue, 'Guard Price must be at least ₹0'),

    companyRate: Yup.number()
      .typeError('Must be a number')
      .min(NUMERIC_INPUT_FIELD.companyRate.min, `Company Rate must be at least ₹${NUMERIC_INPUT_FIELD.companyRate.min}`)
      .required('Company Rate is required')
  });
};

const TRIP_TYPE = {
  PICKUP: 1,
  DROP: 2
};

const DUAL_TRIP = {
  NO: 0,
  YES: 1
};

const optionsForTripType = [
  { value: TRIP_TYPE.PICKUP, label: 'Pickup' },
  { value: TRIP_TYPE.DROP, label: 'Drop' }
];

const DRIVER_TYPE = {
  VENDOR_DRIVER: 1,
  CAB_PROVIDER: 2
};

const getInitialValues = (data) => {
  console.log('data', data);
  return {
    tripId: data?._id || null,

    companyID: data?.companyID || null,
    tripDate: data?.tripDate ? new Date(data?.tripDate) : null,
    tripTime: data?.tripTime || '',
    returnTripTime: '',
    tripType: data?.tripType || 0,

    zoneNameID: data?.zoneNameID?._id || '',
    zoneTypeID: data?.zoneTypeID?._id || null,
    vehicleTypeID: data?.vehicleTypeID?._id || '',
    vehicleNumber: data?.vehicleNumber?._id || '',
    driverId: data?.driverId?._id || '',
    location: data?.location || '',

    guard: data?.guard || 0,
    dualTrip: data?.isDualTrip || 0,

    companyGuardPrice: data?.companyGuardPrice || 0,
    companyRate: data?.companyRate || 0,
    companyPenalty: data?.companyPenalty || 0,

    vendorGuardPrice: data?.vendorGuardPrice || 0,
    vendorRate: data?.vendorRate || 0,
    vendorPenalty: data?.vendorPenalty || 0,

    driverGuardPrice: data?.driverGuardPrice || 0,
    driverRate: data?.driverRate || 0,
    driverPenalty: data?.driverPenalty || 0,

    addOnRate: data?.addOnRate || 0,

    mcdCharge: data?.mcdCharge || 0,

    tollCharge: data?.tollCharge || 0,
    remarks: data?.remarks || ''
  };
};

const updatePayload = (values, driverType) => {
  return {
    data: {
      tripId: values.tripId || null,
      companyID: values.companyID._id,
      tripDate: formatDateUsingMoment(values.tripDate),
      tripTime: values.tripTime,

      tripType: values.tripType,

      zoneNameID: values.zoneNameID,
      zoneTypeID: values.zoneTypeID || null,
      vehicleTypeID: values.vehicleTypeID,
      vehicleNumber: values.vehicleNumber,
      driverId: values.driverId,
      location: values.location,

      guard: values.guard,
      isDualTrip: values.dualTrip,

      companyGuardPrice: values.companyGuardPrice,
      companyRate: values.companyRate,
      companyPenalty: values.companyPenalty,

      vendorGuardPrice: driverType === DRIVER_TYPE.VENDOR_DRIVER ? values.vendorGuardPrice : -1,
      vendorRate: driverType === DRIVER_TYPE.VENDOR_DRIVER ? values.vendorRate : -1,
      vendorPenalty: driverType === DRIVER_TYPE.VENDOR_DRIVER ? values.vendorPenalty : -1,

      driverGuardPrice: driverType === DRIVER_TYPE.CAB_PROVIDER ? values.driverGuardPrice : -1,
      driverRate: driverType === DRIVER_TYPE.CAB_PROVIDER ? values.driverRate : -1,
      driverPenalty: driverType === DRIVER_TYPE.CAB_PROVIDER ? values.driverPenalty : -1,

      addOnRate: values.addOnRate,
      mcdCharge: values.mcdCharge,
      tollCharge: values.tollCharge,

      remarks: values.remarks
    }
  };
};
const createPayload = (values, item, driverType) => {
  return {
    data: {
      companyID: values.companyID._id,
      tripDate: formatDateUsingMoment(values.tripDate),
      tripTime: item,
      tripType: values.tripType,

      zoneNameID: values.zoneNameID,
      zoneTypeID: values.zoneTypeID || null,
      vehicleTypeID: values.vehicleTypeID,
      vehicleNumber: values.vehicleNumber,
      driverId: values.driverId,
      location: values.location,

      guard: values.guard,
      isDualTrip: values.dualTrip,

      companyGuardPrice: values.companyGuardPrice,
      companyRate: values.companyRate,
      companyPenalty: values.companyPenalty,

      vendorGuardPrice: driverType === DRIVER_TYPE.VENDOR_DRIVER ? values.vendorGuardPrice : null,
      vendorRate: driverType === DRIVER_TYPE.VENDOR_DRIVER ? values.vendorRate : null,
      vendorPenalty: driverType === DRIVER_TYPE.VENDOR_DRIVER ? values.vendorPenalty : null,

      driverGuardPrice: driverType === DRIVER_TYPE.CAB_PROVIDER ? values.driverGuardPrice : null,
      driverRate: driverType === DRIVER_TYPE.CAB_PROVIDER ? values.driverRate : null,
      driverPenalty: driverType === DRIVER_TYPE.CAB_PROVIDER ? values.driverPenalty : null,

      addOnRate: values.addOnRate,
      mcdCharge: values.mcdCharge,
      tollCharge: values.tollCharge,

      remarks: values.remarks
    }
  };
};

const AddNewTrip = ({ handleClose, handleRefetch, id }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [syncLoading, setSyncLoading] = useState(false);
  const [driverType, setDriverType] = useState(0);
  const [rateDetails, setRateDetails] = useState(null);
  const [syncRate, setSyncRate] = useState(false);

  const zoneList = useSelector((state) => state.zoneName.zoneNames);
  const zoneTypeList = useSelector((state) => state.zoneType.zoneTypes);
  const vehicleTypeList = useSelector((state) => state.vehicleTypes.vehicleTypes);
  const vehicleNumberList = useSelector((state) => state.cabs.cabs1);
  const driverList = useSelector((state) => state.drivers.drivers1);

  useEffect(() => {
    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
    dispatch(fetchAllVehicleTypesForAll());
    dispatch(fetchDrivers1());
    dispatch(fetchCab1());
  }, []);

  useEffect(() => {
    console.log('id', id);

    async function fetchDetails() {
      try {
        // TODO : API call FOR GETTING DETAILS
        console.log('Api call for get details (At Trip Updating)');
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        // const response = await axiosServices.get(`/assignTrip/getTripById?assignTripID=${id}`);
        // const data = response.data.data;
        // console.log('data = ', data);
        // setDetails(data);
        const response = await dispatch(fetchTripDetails(id)).unwrap();
        console.log(`🚀 ~ fetchDetails ~ response:`, response);

        if (response.vendorGuardPrice === -1 && response.vendorRate === -1 && response.vendorPenalty === -1) {
          setDriverType(DRIVER_TYPE.CAB_PROVIDER); // Cab Provider Driver
        } else {
          setDriverType(DRIVER_TYPE.VENDOR_DRIVER); // Vendor Driver
        }
        setDetails(response);
      } catch (error) {
        console.log('Error :: fetchDetails =', error);
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
        setLoading(false); // Set loading to false after data is fetched
      }
    }

    if (id) {
      fetchDetails();
    } else {
      setLoading(false); // Set loading to false after data is fetched
    }
  }, [id]);

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // alert('Form submitted');

      if (id) {
        // TODO : API call FOR UPDATING
        const payload = {
          data: {
            companyID: values.companyID._id,
            tripDate: formatDateUsingMoment(values.tripDate),

            tripTime: values.tripTime,
            tripType: values.tripType,

            zoneNameID: values.zoneNameID._id,
            zoneTypeID: values.zoneTypeID._id,
            vehicleTypeID: values.vehicleTypeID._id,
            vehicleNumber: values.vehicleNumber._id,
            driverId: values.driverId._id,

            location: values.location,

            guard: values.guard,
            dualTrip: values.dualTrip,

            companyGuardPrice: values.companyGuardPrice,
            companyRate: values.companyRate,
            companyPenalty: values.companyPenalty,
            vendorGuardPrice: values.vendorGuardPrice,
            vendorRate: values.vendorRate,
            vendorPenalty: values.vendorPenalty,
            driverGuardPrice: values.driverGuardPrice,
            driverRate: values.driverRate,
            driverPenalty: values.driverPenalty,

            addOnRate: values.addOnRate,
            mcdCharge: values.mcdCharge,
            tollCharge: values.tollCharge,

            remarks: values.remarks
          }
        };
        await dispatch(updateTrip(updatePayload(values, driverType))).unwrap();
      } else {
        if (!syncRate) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Please sync rates first',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
          return;
        }

        // TODO : API call FOR ADDING
        const payload = {
          data: {
            companyID: values.companyID._id,
            tripDate: formatDateUsingMoment(values.tripDate),
            tripTime: values.tripTime,
            tripType: values.tripType,

            zoneNameID: values.zoneNameID._id,
            zoneTypeID: values.zoneTypeID?._id || null,
            vehicleTypeID: values.vehicleTypeID._id,
            vehicleNumber: values.vehicleNumber._id,
            driverId: values.driverId._id,
            location: values.location,

            guard: values.guard,

            companyGuardPrice: values.companyGuardPrice,
            companyRate: values.companyRate,
            companyPenalty: values.companyPenalty,

            vendorGuardPrice: values.vendorGuardPrice,
            vendorRate: values.vendorRate,
            vendorPenalty: values.vendorPenalty,

            driverGuardPrice: values.driverGuardPrice,
            driverRate: values.driverRate,
            driverPenalty: values.driverPenalty,

            addOnRate: values.addOnRate,
            mcdCharge: values.mcdCharge,
            tollCharge: values.tollCharge,

            remarks: values.remarks
          }
        };

        const x = [values.tripTime];

        if (values.dualTrip === DUAL_TRIP.YES) x.push(values.returnTripTime);
        console.log('x = ', x);

        x.forEach((x) => console.log('kki = ', createPayload(values, x)));

        // await dispatch(addNewTrip(payload)).unwrap();
        await dispatch(addNewTrip(createPayload(values, x[0], driverType))).unwrap();
        if (values.dualTrip === DUAL_TRIP.YES) {
          await dispatch(addNewTrip(createPayload(values, x[1], driverType))).unwrap();
        }
      }

      resetForm();
      dispatch(
        openSnackbar({
          open: true,
          message: `Trip ${id ? 'updated' : 'added'} successfully`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );

      handleClose();
      handleRefetch();
    } catch (error) {
      console.log('Error :: onSubmit =', error);
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
    }
  };

  const formik = useFormik({
    // initialValues: {
    //   companyID: null,
    //   // companyID: {
    //   //   _id: '673747f2625e65ed39170463',
    //   //   effectiveDate: '2024-09-05T00:00:00.000Z',
    //   //   company_name: '12NovNewCompany69',
    //   //   billingCycle: '15 days'
    //   // },

    //   // companyID: {
    //   //   companyContract: '',
    //   //   _id: '665868063d44db9cf1622592',
    //   //   company_name: 'IN TECHNOLOGIES'
    //   // },
    //   tripDate: null,
    //   // tripDate: new Date("2023-01-01"),
    //   tripTime: '',
    //   // tripTime: '18:29',
    //   tripType: 0,
    //   // tripType: TRIP_TYPE.DROP,

    //   zoneNameID: '',
    //   // zoneNameID: '6683a39f6b40c6fd23bdf10e',

    //   zoneTypeID: '',
    //   // zoneTypeID: '67064e03b01e45d7dc31577f',

    //   vehicleTypeID: '',
    //   // vehicleTypeID: '66ea730fd326be54846fe25d',

    //   vehicleNumber: '',
    //   // vehicleNumber: '66c5e12165a3fdb07835b284',

    //   driverId: '',
    //   // driverId: '66cd81f8fd138969b5fe2e78',

    //   location: '',
    //   // location: 'NSP',

    //   guard: 0,
    //   // guardPrice: 0,
    //   // guardPrice: 90,

    //   companyGuardPrice: 0,
    //   // companyGuardPrice: 45,
    //   companyRate: 0,
    //   // companyRate: 136,
    //   companyPenalty: 0,
    //   // companyPenalty: 352,

    //   vendorGuardPrice: 0,
    //   // vendorGuardPrice: 70,
    //   vendorRate: 0,
    //   // vendorRate: 86,
    //   vendorPenalty: 0,
    //   // vendorPenalty: 452,

    //   driverGuardPrice: 0,
    //   // driverGuardPrice: 650,
    //   driverRate: 0,
    //   // driverRate: 40,
    //   driverPenalty: 0,
    //   // driverPenalty: 452,

    //   addOnRate: 0,
    //   // addOnRate: 30,

    //   // penalty: 0,
    //   // penalty: 115,

    //   mcdCharge: 0,
    //   // mcdCharge: 11,

    //   tollCharge: 0,
    //   // tollCharge : 22,
    //   remarks: ''
    // },

    initialValues: getInitialValues(details),
    enableReinitialize: true,
    // validationSchema,
    validationSchema: generateValidationSchema(id),
    onSubmit
  });

  const handleCompanySelection = useCallback(
    (selectedCompany) => {
      console.log(selectedCompany);
      // formik.setFieldValue('companyID', selectedCompany?._id || ''); // Update companyID in formik
      formik.setFieldValue('companyID', selectedCompany); // Update companyID in formik
    },
    [formik]
  );

  const handleTripTypeChange = useCallback(
    (event) => {
      const selectedType = event.target.value;
      console.log(`🚀 ~ AddNewTrip ~ selectedType:`, selectedType);
      formik.setFieldValue('tripType', selectedType);
    },
    [formik]
  );

  const handleBlurField =
    (fieldName, defaultValue = 0) =>
    (event) => {
      const value = event.target.value;
      // Convert the value to a number or set it to the default value if empty
      formik.setFieldValue(fieldName, value === '' ? defaultValue : Number(value), true);
      formik.handleBlur(event); // Trigger Formik's blur handling
    };

  const handleChangeNumeric = (fieldName) => (event) => {
    const value = event.target.value;
    formik.setFieldValue(fieldName, value === '' ? '' : Number(value));
  };

  const isSyncing =
    !formik.values.companyID ||
    !formik.values.zoneNameID ||
    !formik.values.zoneTypeID ||
    !formik.values.vehicleTypeID ||
    !formik.values.driverId;
  console.log('isSyncing = ', isSyncing);

  const handleSyncRates = useCallback(async () => {
    try {
      console.log('API call for fetch Rates .........');
      const payload = {
        data: {
          companyID: formik.values.companyID?._id,
          vehicleTypeID: formik.values.vehicleTypeID,
          zoneNameID: formik.values.zoneNameID,
          zoneTypeID: formik.values.zoneTypeID,
          driverId: formik.values.driverId
        }
      };
      setSyncLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await axiosServices.post('/tripData/amount/by/driver/id', payload);
      const data = response.data.data;
      console.log(`🚀 ~ handleSyncRates ~ response:`, response);
      console.log('data = ', data);

      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // setSyncLoading(true);
      // // Cab Provider Driver
      // const data = {
      //   driverGuardPrice: 100,
      //   driverAmount: 600,
      //   driverDualAmount: 900,

      //   vendorGuardPrice: null,
      //   vendorAmount: null,
      //   vendorDualAmount: null,

      //   companyGuardPrice: 200,
      //   companyAmount: 700,
      //   companyDualAmount: 5000
      // };

      // // Vendor Driver
      // const data = {
      //   driverGuardPrice: null,
      //   driverAmount: null,
      //   driverDualAmount: null,

      //   vendorGuardPrice: 25,
      //   vendorAmount: 500,
      //   vendorDualAmount: 4000,

      //   companyGuardPrice: 200,
      //   companyAmount: 700,
      //   companyDualAmount: 1000
      // };

      setRateDetails(data);
      setSyncRate(true);

      if (typeof data.vendorGuardPrice !== 'object' && typeof data.vendorAmount !== 'object' && typeof data.vendorDualAmount !== 'object') {
        console.log('Vendor Driver');
        formik.setFieldValue('vendorGuardPrice', formik.values.guard ? data.vendorGuardPrice || 0 : 0);
        formik.setFieldValue('vendorRate', formik.values.dualTrip ? (data.vendorDualAmount || 0) / 2 : data.vendorAmount || 0); // data.driverAmount);
        formik.setFieldValue('companyGuardPrice', formik.values.guard ? data.companyGuardPrice || 0 : 0);
        formik.setFieldValue('companyRate', formik.values.dualTrip ? (data.companyDualAmount || 0) / 2 : data.companyAmount || 0);
        // formik.setFieldValue('vendorPenalty', formik.values.vendorPenalty || 0);

        // formik.setFieldValue('driverGuardPrice', -1);
        // formik.setFieldValue('driverRate', -1);
        // formik.setFieldValue('driverPenalty', -1);

        setDriverType(DRIVER_TYPE.VENDOR_DRIVER); // Vendor Driver
      } else {
        console.log('Cab Provider Driver');
        formik.setFieldValue('driverGuardPrice', formik.values.guard ? data.driverGuardPrice || 0 : 0);
        formik.setFieldValue('driverRate', formik.values.dualTrip ? (data.driverDualAmount || 0) / 2 : data.driverAmount || 0); // data.driverAmount);
        formik.setFieldValue('companyGuardPrice', formik.values.guard ? data.companyGuardPrice || 0 : 0);
        formik.setFieldValue('companyRate', formik.values.dualTrip ? (data.companyDualAmount || 0) / 2 : data.companyAmount || 0);

        // formik.setFieldValue('driverPenalty', formik.values.driverPenalty || 0);

        // formik.setFieldValue('vendorGuardPrice', -1);
        // formik.setFieldValue('vendorRate', -1);
        // formik.setFieldValue('vendorPenalty', -1);

        setDriverType(DRIVER_TYPE.CAB_PROVIDER); // Cab Provider Driver
      }
    } catch (error) {
      console.log('Error :: handleSyncRates = ', error);
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
      setSyncLoading(false);
    }
  }, [formik]);

  useEffect(() => {
    const handleSyncRates = async () => {
      try {
        const payload = {
          data: {
            companyID: formik.values.companyID?._id,
            vehicleTypeID: formik.values.vehicleTypeID,
            zoneNameID: formik.values.zoneNameID,
            zoneTypeID: formik.values.zoneTypeID,
            driverId: formik.values.driverId
          }
        };
        console.log('PPP = ', payload);

        if (
          formik.values.companyID &&
          formik.values.vehicleTypeID &&
          formik.values.zoneNameID &&
          formik.values.zoneTypeID &&
          formik.values.driverId
        ) {
          console.log('API Call .................');
          const response = await axiosServices.post('/tripData/amount/by/driver/id', payload);
          const data = response.data.data;

          setRateDetails(data);
          setSyncRate(true);

          if (data.vendorGuardPrice !== 0 && data.vendorAmount !== 0 && data.vendorDualAmount !== 0) {
            console.log('Vendor Driver');
            formik.setFieldValue('vendorGuardPrice', formik.values.guard ? data.vendorGuardPrice || 0 : 0);
            formik.setFieldValue('vendorRate', formik.values.dualTrip ? (data.vendorDualAmount || 0) / 2 : data.vendorAmount || 0); // data.driverAmount);
            formik.setFieldValue('companyGuardPrice', formik.values.guard ? data.companyGuardPrice || 0 : 0);
            formik.setFieldValue('companyRate', formik.values.dualTrip ? (data.companyDualAmount || 0) / 2 : data.companyAmount || 0);

            setDriverType(DRIVER_TYPE.VENDOR_DRIVER); // Vendor Driver
          } else {
            console.log('Cab Provider Driver');
            formik.setFieldValue('driverGuardPrice', formik.values.guard ? data.driverGuardPrice || 0 : 0);
            formik.setFieldValue('driverRate', formik.values.dualTrip ? (data.driverDualAmount || 0) / 2 : data.driverAmount || 0); // data.driverAmount);
            formik.setFieldValue('companyGuardPrice', formik.values.guard ? data.companyGuardPrice || 0 : 0);
            formik.setFieldValue('companyRate', formik.values.dualTrip ? (data.companyDualAmount || 0) / 2 : data.companyAmount || 0);

            setDriverType(DRIVER_TYPE.CAB_PROVIDER); // Cab Provider Driver
          }
        }
      } catch (error) {
        console.log('Error :: handleSyncRates = ', error);
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
      }
    };

    if (id) {
      handleSyncRates();
    }
  }, [
    formik.values.companyID,
    formik.values.vehicleTypeID,
    formik.values.zoneNameID,
    formik.values.zoneTypeID,
    formik.values.driverId,
    id
  ]);

  const handleGuardChange = (event) => {
    const val = event.target.checked;
    console.log('🚀 ~ handleGuardChange ~ val:', val);
    formik.setFieldValue('guard', val ? 1 : 0);

    if (!rateDetails) return;

    if (!val) {
      formik.setFieldValue('companyGuardPrice', 0);
      formik.setFieldValue('vendorGuardPrice', 0);
      formik.setFieldValue('driverGuardPrice', 0);
    } else {
      formik.setFieldValue('companyGuardPrice', rateDetails.companyGuardPrice || 0);
      formik.setFieldValue('vendorGuardPrice', rateDetails.vendorGuardPrice || 0);
      formik.setFieldValue('driverGuardPrice', rateDetails.driverGuardPrice || 0);
    }
  };

  const handleDualTripChange = (event) => {
    const val = event.target.checked;
    console.log('🚀 ~ handleGuardChange ~ val:', val);
    formik.setFieldValue('dualTrip', val ? 1 : 0);

    console.log('🚀 ~ handleDualTripChange ~ rateDetails:', rateDetails);

    if (!rateDetails) return;

    if (!val) {
      console.log('rateDeals = ', rateDetails);
      formik.setFieldValue('driverRate', rateDetails.driverAmount);
      formik.setFieldValue('vendorRate', rateDetails.vendorAmount);
      formik.setFieldValue('companyRate', rateDetails.companyAmount);
    } else {
      formik.setFieldValue('driverRate', (rateDetails.driverDualAmount || 0) / 2);
      formik.setFieldValue('vendorRate', (rateDetails.vendorDualAmount || 0) / 2);
      formik.setFieldValue('companyRate', (rateDetails.companyDualAmount || 0) / 2);
    }
  };

  if (loading) return <CustomCircularLoader />;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form onSubmit={formik.handleSubmit} noValidate style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
              <DialogTitle id="alert-dialog-title">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{id ? 'Edit' : 'Add'} New Trip</Typography>
                  <IconButton onClick={handleClose} color="inherit" aria-label="close">
                    <Add style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                </Stack>
              </DialogTitle>
            </AppBar>
            <Divider />
            <DialogContent>
              <Grid container spacing={1} rowGap={1}>
                {/* Trip Details */}
                <Grid item xs={12}>
                  <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                      Trip Details
                    </Typography>

                    {/* Guard & Dual Trip */}
                    <Stack direction="row" spacing={1}>
                      {/* Guard */}
                      <FormControlLabel
                        control={
                          <Switch name="guard" checked={Boolean(formik.values.guard)} onChange={handleGuardChange} color="secondary" />
                        }
                        label="Guard"
                      />

                      {/* Dual Trip */}
                      <FormControlLabel
                        control={<Switch name="dualTrip" checked={Boolean(formik.values.dualTrip)} onChange={handleDualTripChange} />}
                        disabled={!!id}
                        label="Dual Trip"
                      />
                    </Stack>
                  </Stack>

                  <Grid container spacing={1}>
                    {/* Company Name */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        {/* <Typography variant="subtitle1">Company Name</Typography> */}
                        <InputLabel htmlFor="companyID" required>
                          Company Name
                        </InputLabel>

                        {id ? (
                          <Chip label={formik.values.companyID?.company_name} color="primary" />
                        ) : (
                          <>
                            <SearchComponent setSelectedCompany={handleCompanySelection} value={formik.values.companyID} disableClearable />

                            {formik.touched.companyID && formik.errors.companyID && (
                              <Typography variant="caption" color="error">
                                {formik.errors.companyID}
                              </Typography>
                            )}
                          </>
                        )}
                      </Stack>
                    </Grid>

                    {/* Trip Date */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        {/* <Typography variant="subtitle1">Trip Date</Typography> */}
                        <InputLabel htmlFor="tripDate" required>
                          Trip Date
                        </InputLabel>

                        <DatePicker
                          id="tripDate" // Set the id here for association
                          value={formik.values.tripDate}
                          onChange={(date) => {
                            formik.setFieldTouched('tripDate', true, true); // Mark the field as touched

                            formik.setFieldValue('tripDate', date);
                          }}
                          renderInput={(params) => <TextField {...params} id="tripDate" />}
                        />
                        {formik.touched.tripDate && formik.errors.tripDate && (
                          <Typography variant="caption" color="error">
                            {formik.errors.tripDate}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                    {/* Trip Type */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="tripType" required>
                          Trip Type
                        </InputLabel>

                        <GenericSelect
                          // label="Trip Type"
                          placeholder="Select Trip Type"
                          id="tripType"
                          name="tripType"
                          options={optionsForTripType}
                          value={formik.values.tripType}
                          onChange={handleTripTypeChange}
                          fullWidth
                        />
                      </Stack>
                    </Grid>

                    {/* Location */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="location">Location</InputLabel>

                        <TextField id="location" name="location" type="text" placeholder="Location" {...formik.getFieldProps('location')} />
                      </Stack>
                    </Grid>

                    {/* Trip Time */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="tripTime" required>
                          Trip Time
                        </InputLabel>

                        <Tooltip title="Select the time of the trip">
                          <TextField
                            id="tripTime"
                            name="tripTime"
                            type="time"
                            value={formik.values.tripTime}
                            onChange={formik.handleChange}
                            error={formik.touched.tripTime && Boolean(formik.errors.tripTime)}
                            helperText={formik.touched.tripTime && formik.errors.tripTime}
                            fullWidth
                            autoComplete="tripTime"
                          />
                        </Tooltip>
                      </Stack>
                    </Grid>

                    {!id && formik.values.dualTrip === DUAL_TRIP.YES && (
                      <>
                        {/* Trip Time */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="tripTime" required>
                              Return Trip Time
                            </InputLabel>

                            <Tooltip title="Select the return trip time">
                              <TextField
                                id="returnTripTime"
                                name="returnTripTime"
                                type="time"
                                value={formik.values.returnTripTime}
                                onChange={formik.handleChange}
                                error={formik.touched.returnTripTime && Boolean(formik.errors.returnTripTime)}
                                helperText={formik.touched.returnTripTime && formik.errors.returnTripTime}
                                fullWidth
                                autoComplete="returnTripTime"
                              />
                            </Tooltip>
                          </Stack>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>

                {/* Trip Additional Details */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Trip Additional Details
                  </Typography>

                  <Grid container spacing={1}>
                    {/* Zone Name */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="zoneNameID" required>
                          Zone Name
                        </InputLabel>

                        <Autocomplete
                          id="zoneNameID"
                          name="zoneNameID"
                          // value={formik.values.zoneNameID}
                          // onChange={(event, newValue) => {
                          //   formik.setFieldValue('zoneNameID', newValue);
                          // }}
                          value={zoneList.find((zone) => zone._id === formik.values.zoneNameID) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('zoneNameID', newValue ? newValue._id : null);
                          }}
                          options={zoneList}
                          getOptionLabel={(option) => option.zoneName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Zone'}
                              error={formik.touched.zoneNameID && Boolean(formik.errors.zoneNameID)}
                              helperText={formik.touched.zoneNameID && formik.errors.zoneNameID}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Zone Type */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="zoneTypeID" required>
                          Zone Type
                        </InputLabel>

                        <Autocomplete
                          id="zoneTypeID"
                          name="zoneTypeID"
                          value={zoneTypeList.find((zone) => zone._id === formik.values.zoneTypeID) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('zoneTypeID', newValue ? newValue._id : null);
                          }}
                          // options={zoneTypeList}
                          options={zoneTypeList
                            .filter((zoneType) => zoneType.zoneId._id === formik.values.zoneNameID)
                            .sort((a, b) => a.zoneTypeName.localeCompare(b.zoneTypeName))}
                          getOptionLabel={(option) => option.zoneTypeName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Zone Type'}
                              error={formik.touched.zoneTypeID && Boolean(formik.errors.zoneTypeID)}
                              helperText={formik.touched.zoneTypeID && formik.errors.zoneTypeID}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Vehicle Type */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="vehicleTypeID" required>
                          Vehicle Type
                        </InputLabel>

                        <Autocomplete
                          id="vehicleTypeID"
                          name="vehicleTypeID"
                          value={vehicleTypeList.find((item) => item._id === formik.values.vehicleTypeID) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('vehicleTypeID', newValue ? newValue._id : null);
                          }}
                          options={vehicleTypeList}
                          getOptionLabel={(option) => option.vehicleTypeName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Vehicle Type'}
                              error={formik.touched.vehicleTypeID && Boolean(formik.errors.vehicleTypeID)}
                              helperText={formik.touched.vehicleTypeID && formik.errors.vehicleTypeID}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Vehicle Number */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="vehicleNumber" required>
                          Vehicle Number
                        </InputLabel>

                        <Autocomplete
                          id="vehicleNumber"
                          name="vehicleNumber"
                          value={vehicleNumberList.find((item) => item._id === formik.values.vehicleNumber) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('vehicleNumber', newValue ? newValue._id : null);
                          }}
                          options={vehicleNumberList}
                          getOptionLabel={(option) => option.vehicleNumber}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Vehicle Number'}
                              error={formik.touched.vehicleNumber && Boolean(formik.errors.vehicleNumber)}
                              helperText={formik.touched.vehicleNumber && formik.errors.vehicleNumber}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>

                    {/* Driver */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="driverId" required>
                          Driver
                        </InputLabel>

                        <Autocomplete
                          id="driverId"
                          name="driverId"
                          value={driverList.find((item) => item._id === formik.values.driverId) || null}
                          onChange={(event, newValue) => {
                            formik.setFieldValue('driverId', newValue ? newValue._id : null);
                          }}
                          options={driverList}
                          getOptionLabel={(option) => option.userName}
                          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensures proper matching
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={'Select Driver'}
                              error={formik.touched.driverId && Boolean(formik.errors.driverId)}
                              helperText={formik.touched.driverId && formik.errors.driverId}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Company/Vendor/Driver Guard Price/Rate/Penalty */}
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 1 }}>
                    <Typography variant="h5">Rates, Penalties & Charges</Typography>

                    <Tooltip
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                            opacity: 0.9
                          }
                        }
                      }}
                      // title="Sync Rates"
                      title={
                        isSyncing
                          ? 'Please select company, zone, zone type, vehicle type, vehicle number & driver.'
                          : syncLoading
                          ? 'Please wait...'
                          : 'Click to sync rates.'
                      }
                      // disableFocusListener
                    >
                      <span>
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          endIcon={
                            syncLoading ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress color="info" size={16} />
                              </Box>
                            ) : (
                              <FaSyncAlt />
                            )
                          }
                          disabled={isSyncing || syncLoading}
                          onClick={handleSyncRates}
                        >
                          Sync Rates
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>

                  <Grid container spacing={1}>
                    {/* Company Guard Price */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="companyGuardPrice">Company Guard Price</InputLabel>

                        <NumericInput
                          id="companyGuardPrice"
                          fieldName="companyGuardPrice"
                          value={formik.values.companyGuardPrice}
                          onChange={handleChangeNumeric('companyGuardPrice')}
                          onBlur={handleBlurField('companyGuardPrice')}
                          error={formik.touched.companyGuardPrice && Boolean(formik.errors.companyGuardPrice)}
                          helperText={formik.touched.companyGuardPrice && formik.errors.companyGuardPrice}
                          disabled
                        />
                      </Stack>
                    </Grid>

                    {/* Company Rate */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="companyRate">Company Rate</InputLabel>

                        <NumericInput
                          id="companyRate"
                          fieldName="companyRate"
                          value={formik.values.companyRate}
                          onChange={handleChangeNumeric('companyRate')}
                          onBlur={handleBlurField('companyRate')}
                          error={formik.touched.companyRate && Boolean(formik.errors.companyRate)}
                          helperText={formik.touched.companyRate && formik.errors.companyRate}
                          disabled
                        />
                      </Stack>
                    </Grid>

                    {/* Company Penalty */}
                    <Grid item xs={2}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="companyPenalty">Company Penalty</InputLabel>

                        <NumericInput
                          id="companyPenalty"
                          fieldName="companyPenalty"
                          value={formik.values.companyPenalty}
                          onChange={handleChangeNumeric('companyPenalty')}
                          onBlur={handleBlurField('companyPenalty')}
                          error={formik.touched.companyPenalty && Boolean(formik.errors.companyPenalty)}
                          helperText={formik.touched.companyPenalty && formik.errors.companyPenalty}
                        />
                      </Stack>
                    </Grid>

                    {/* {((!id && driverType === DRIVER_TYPE.VENDOR_DRIVER) || (id && formik.values.vendorGuardPrice !== -1)) && ( */}
                    {driverType === DRIVER_TYPE.VENDOR_DRIVER && (
                      <>
                        {/* Vendor Guard Price */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="vendorGuardPrice">Vendor Guard Price</InputLabel>

                            <NumericInput
                              id="vendorGuardPrice"
                              fieldName="vendorGuardPrice"
                              value={formik.values.vendorGuardPrice}
                              onChange={handleChangeNumeric('vendorGuardPrice')}
                              onBlur={handleBlurField('vendorGuardPrice')}
                              error={formik.touched.vendorGuardPrice && Boolean(formik.errors.vendorGuardPrice)}
                              helperText={formik.touched.vendorGuardPrice && formik.errors.vendorGuardPrice}
                              disabled
                            />
                          </Stack>
                        </Grid>

                        {/* Vendor Rate */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="vendorRate">Vendor Rate</InputLabel>

                            <NumericInput
                              id="vendorRate"
                              fieldName="vendorRate"
                              value={formik.values.vendorRate}
                              onChange={handleChangeNumeric('vendorRate')}
                              onBlur={handleBlurField('vendorRate')}
                              error={formik.touched.vendorRate && Boolean(formik.errors.vendorRate)}
                              helperText={formik.touched.vendorRate && formik.errors.vendorRate}
                              disabled
                            />
                          </Stack>
                        </Grid>

                        {/* Vendor Penalty */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="vendorPenalty">Vendor Penalty</InputLabel>

                            <NumericInput
                              id="vendorPenalty"
                              fieldName="vendorPenalty"
                              value={formik.values.vendorPenalty}
                              onChange={handleChangeNumeric('vendorPenalty')}
                              onBlur={handleBlurField('vendorPenalty')}
                              error={formik.touched.vendorPenalty && Boolean(formik.errors.vendorPenalty)}
                              helperText={formik.touched.vendorPenalty && formik.errors.vendorPenalty}
                            />
                          </Stack>
                        </Grid>
                      </>
                    )}

                    {/* {((!id && driverType === DRIVER_TYPE.CAB_PROVIDER) || (id && formik.values.driverGuardPrice !== -1)) && ( */}
                    {driverType === DRIVER_TYPE.CAB_PROVIDER && (
                      <>
                        {/* Driver Guard Price */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="driverGuardPrice">Driver Guard Price</InputLabel>

                            <NumericInput
                              id="driverGuardPrice"
                              fieldName="driverGuardPrice"
                              value={formik.values.driverGuardPrice}
                              onChange={handleChangeNumeric('driverGuardPrice')}
                              onBlur={handleBlurField('driverGuardPrice')}
                              error={formik.touched.driverGuardPrice && Boolean(formik.errors.driverGuardPrice)}
                              helperText={formik.touched.driverGuardPrice && formik.errors.driverGuardPrice}
                              disabled
                            />
                          </Stack>
                        </Grid>

                        {/* Driver Rate */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="driverRate">Driver Rate</InputLabel>

                            <NumericInput
                              id="driverRate"
                              fieldName="driverRate"
                              value={formik.values.driverRate}
                              onChange={handleChangeNumeric('driverRate')}
                              onBlur={handleBlurField('driverRate')}
                              error={formik.touched.driverRate && Boolean(formik.errors.driverRate)}
                              helperText={formik.touched.driverRate && formik.errors.driverRate}
                              disabled
                            />
                          </Stack>
                        </Grid>

                        {/* Driver Penalty */}
                        <Grid item xs={2}>
                          <Stack gap={1}>
                            <InputLabel htmlFor="driverPenalty">Driver Penalty</InputLabel>

                            <NumericInput
                              id="driverPenalty"
                              fieldName="driverPenalty"
                              value={formik.values.driverPenalty}
                              onChange={handleChangeNumeric('driverPenalty')}
                              onBlur={handleBlurField('driverPenalty')}
                              error={formik.touched.driverPenalty && Boolean(formik.errors.driverPenalty)}
                              helperText={formik.touched.driverPenalty && formik.errors.driverPenalty}
                            />
                          </Stack>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>

                {/* Other Charges */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>
                    Other Charges
                  </Typography>

                  <Grid container spacing={1}>
                    {/* Add On Rate */}
                    <Grid item xs={4}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="addOnRate">Add On Rate</InputLabel>

                        <NumericInput
                          id="addOnRate"
                          fieldName="addOnRate"
                          value={formik.values.addOnRate}
                          onChange={handleChangeNumeric('addOnRate')}
                          onBlur={handleBlurField('addOnRate')}
                          error={formik.touched.addOnRate && Boolean(formik.errors.addOnRate)}
                          helperText={formik.touched.addOnRate && formik.errors.addOnRate}
                        />
                      </Stack>
                    </Grid>

                    {/* MCD Charge */}
                    <Grid item xs={4}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="mcdCharge">MCD Charge</InputLabel>

                        <NumericInput
                          id="mcdCharge"
                          fieldName="mcdCharge"
                          value={formik.values.mcdCharge}
                          onChange={handleChangeNumeric('mcdCharge')}
                          onBlur={handleBlurField('mcdCharge')}
                          error={formik.touched.mcdCharge && Boolean(formik.errors.mcdCharge)}
                          helperText={formik.touched.mcdCharge && formik.errors.mcdCharge}
                        />
                      </Stack>
                    </Grid>

                    {/* Toll Charge */}
                    <Grid item xs={4}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="tollCharge">Toll Charge</InputLabel>

                        <NumericInput
                          id="tollCharge"
                          fieldName="tollCharge"
                          value={formik.values.tollCharge}
                          onChange={handleChangeNumeric('tollCharge')}
                          onBlur={handleBlurField('tollCharge')}
                          error={formik.touched.tollCharge && Boolean(formik.errors.tollCharge)}
                          helperText={formik.touched.tollCharge && formik.errors.tollCharge}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>
                    Additional Information
                  </Typography>

                  <Grid container>
                    {/* Remarks */}
                    <Grid item xs={12} md={6}>
                      <Stack gap={1}>
                        <InputLabel htmlFor="remarks">Remarks</InputLabel>

                        <TextField fullWidth id="remarks" placeholder="Remarks" {...formik.getFieldProps('remarks')} />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />

            <DialogActions>
              <Button color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                {id ? 'Save' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default AddNewTrip;
