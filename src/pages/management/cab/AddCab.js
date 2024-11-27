/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import UploadSingleFile from 'components/dropzone/SingleFile';
import MainCard from 'components/MainCard';
import FormikTextField from 'components/textfield/TextField';
import { USERTYPE } from 'constant';
import { Form, FormikProvider, useFormik } from 'formik';
import { Add, DocumentUpload, Trash } from 'iconsax-react';
import MultiFileUpload from 'pages/apps/test/components/MultiFileUpload';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { openSnackbar } from 'store/reducers/snackbar';
import { addCab, editCab, fetchCabDetails } from 'store/slice/cabProvidor/cabSlice';
import { fetchAllVendors } from 'store/slice/cabProvidor/vendorSlice';
import { convertToDateUsingMoment, formatDateUsingMoment } from 'utils/helper';
import * as Yup from 'yup';

const MAX_VEHICLE_IMAGES = 7; // Maximum number of allowed vehicle images

export const getInitialValuesByUserTypeForCreation = (userType) => {
  switch (userType) {
    case USERTYPE.iscabProvider:
      return {
        vehicletype: '',
        vehicletypeName: '',
        vendorId: '',
        vendorName: '',

        fitnessDate: null,
        insuranceExpiryDate: null,
        pollutionExpiryDate: null,
        permitOneYrExpiryDate: null,
        permitFiveYrExpiryDate: null,

        fuelType: 0,
        fireCylinder: 0,
        firstAidBox: 0,
        phoneStand: 0,
        bluetooth: 0,
        perfume: 0,
        umbrella: 0,
        torch: 0,
        GPS: 0,

        vehicleName: '',
        vehicleNumber: '',
        GPS_EMI: '0',

        fitnessDate_Doc: null,
        insuranceExpiryDate_Doc: null,
        pollutionExpiryDate_Doc: null,
        RC_Model_doc: null,
        permitOneYrExpiryDate_doc: null,
        permitFiveYrExpiryDate_doc: null,
        vehicleImages: []
      };

    case USERTYPE.iscabProviderUser:
      return {
        vehicletype: '',
        vehicletypeName: '',
        vendorId: '',
        vendorName: '',

        fitnessDate: null,
        insuranceExpiryDate: null,
        pollutionExpiryDate: null,
        permitOneYrExpiryDate: null,
        permitFiveYrExpiryDate: null,

        fuelType: 0,
        fireCylinder: 0,
        firstAidBox: 0,
        phoneStand: 0,
        bluetooth: 0,
        perfume: 0,
        umbrella: 0,
        torch: 0,
        GPS: 0,

        vehicleName: '',
        vehicleNumber: '',
        GPS_EMI: '0',

        fitnessDate_Doc: null,
        insuranceExpiryDate_Doc: null,
        pollutionExpiryDate_Doc: null,
        RC_Model_doc: null,
        permitOneYrExpiryDate_doc: null,
        permitFiveYrExpiryDate_doc: null,
        vehicleImages: []
      };

    case USERTYPE.isVendor:
      return {
        vehicletype: '',
        vehicletypeName: '',

        fitnessDate: null,
        insuranceExpiryDate: null,
        pollutionExpiryDate: null,
        permitOneYrExpiryDate: null,
        permitFiveYrExpiryDate: null,

        fuelType: 0,
        fireCylinder: 0,
        firstAidBox: 0,
        phoneStand: 0,
        bluetooth: 0,
        perfume: 0,
        umbrella: 0,
        torch: 0,
        GPS: 0,

        vehicleName: '',
        vehicleNumber: '',
        GPS_EMI: '0',

        fitnessDate_Doc: null,
        insuranceExpiryDate_Doc: null,
        pollutionExpiryDate_Doc: null,
        RC_Model_doc: null,
        permitOneYrExpiryDate_doc: null,
        permitFiveYrExpiryDate_doc: null,
        vehicleImages: []
      };

    case USERTYPE.isVendorUser:
      return {
        vehicletype: '',
        vehicletypeName: '',

        fitnessDate: null,
        insuranceExpiryDate: null,
        pollutionExpiryDate: null,
        permitOneYrExpiryDate: null,
        permitFiveYrExpiryDate: null,

        fuelType: 0,
        fireCylinder: 0,
        firstAidBox: 0,
        phoneStand: 0,
        bluetooth: 0,
        perfume: 0,
        umbrella: 0,
        torch: 0,
        GPS: 0,

        vehicleName: '',
        vehicleNumber: '',
        GPS_EMI: '0',

        fitnessDate_Doc: null,
        insuranceExpiryDate_Doc: null,
        pollutionExpiryDate_Doc: null,
        RC_Model_doc: null,
        permitOneYrExpiryDate_doc: null,
        permitFiveYrExpiryDate_doc: null,
        vehicleImages: []
      };

    default:
      return {};
  }
};

export const getInitialValuesByUserTypeForUpdate = (data, userType) => {
  console.log('data', data);

  switch (userType) {
    case USERTYPE.iscabProvider:
      return {
        _id: data?._id,
        cabProviderId: data.cabProviderId,
        vendorId: data.vendorId || 'null',
        vehicletype: data.vehicletype._id,
        vehicletypeName: data.vehicletype.vehicleTypeName,
        vehicleName: data.vehicleName,
        vehicleNumber: data.vehicleNumber,
        GPS_EMI: data.GPS_EMI,

        fuelType: data.fuelType,
        fireCylinder: data.fireCylinder,
        firstAidBox: data.firstAidBox,
        phoneStand: data.phoneStand,
        bluetooth: data.bluetooth,
        perfume: data.perfume,
        umbrella: data.umbrella,
        torch: data.torch,
        GPS: data.GPS,

        fitnessDate: typeof data?.fitnessDate === 'undefined' ? null : convertToDateUsingMoment(data?.fitnessDate),
        insuranceExpiryDate: typeof data?.insuranceExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.insuranceExpiryDate),
        pollutionExpiryDate: typeof data?.pollutionExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.pollutionExpiryDate),
        permitOneYrExpiryDate:
          typeof data?.permitOneYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitOneYrExpiryDate),
        permitFiveYrExpiryDate:
          typeof data?.permitFiveYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitFiveYrExpiryDate),

        fitnessDate_Doc: '',
        fitnessDate_DocUrl: data?.fitnessDate_Doc,
        insuranceExpiryDate_Doc: '',
        insuranceExpiryDate_DocUrl: data?.insuranceExpiryDate_Doc,
        pollutionExpiryDate_Doc: '',
        pollutionExpiryDate_DocUrl: data?.pollutionExpiryDate_Doc,
        RC_Model_doc: '',
        RC_Model_docUrl: data?.RC_Model_doc,
        permitOneYrExpiryDate_doc: '',
        permitOneYrExpiryDate_docUrl: data?.permitOneYrExpiryDate_doc,
        permitFiveYrExpiryDate_doc: '',
        permitFiveYrExpiryDate_docUrl: data?.permitFiveYrExpiryDate_doc,
        vehicleImages: data?.vehicleImages
      };

    case USERTYPE.iscabProviderUser:
      return {
        _id: data?._id,
        cabProviderId: data.cabProviderId,
        vendorId: data.vendorId || 'null',
        vehicletype: data.vehicletype._id,
        vehicletypeName: '',
        vehicleName: data.vehicleName,
        vehicleNumber: data.vehicleNumber,
        GPS_EMI: data.GPS_EMI,

        fuelType: data.fuelType,
        fireCylinder: data.fireCylinder,
        firstAidBox: data.firstAidBox,
        phoneStand: data.phoneStand,
        bluetooth: data.bluetooth,
        perfume: data.perfume,
        umbrella: data.umbrella,
        torch: data.torch,
        GPS: data.GPS,

        fitnessDate: typeof data?.fitnessDate === 'undefined' ? null : convertToDateUsingMoment(data?.fitnessDate),
        insuranceExpiryDate: typeof data?.insuranceExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.insuranceExpiryDate),
        pollutionExpiryDate: typeof data?.pollutionExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.pollutionExpiryDate),
        permitOneYrExpiryDate:
          typeof data?.permitOneYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitOneYrExpiryDate),
        permitFiveYrExpiryDate:
          typeof data?.permitFiveYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitFiveYrExpiryDate),

        fitnessDate_Doc: '',
        fitnessDate_DocUrl: data?.fitnessDate_Doc,
        insuranceExpiryDate_Doc: '',
        insuranceExpiryDate_DocUrl: data?.insuranceExpiryDate_Doc,
        pollutionExpiryDate_Doc: '',
        pollutionExpiryDate_DocUrl: data?.pollutionExpiryDate_Doc,
        RC_Model_doc: '',
        RC_Model_docUrl: data?.RC_Model_doc,
        permitOneYrExpiryDate_doc: '',
        permitOneYrExpiryDate_docUrl: data?.permitOneYrExpiryDate_doc,
        permitFiveYrExpiryDate_doc: '',
        permitFiveYrExpiryDate_docUrl: data?.permitFiveYrExpiryDate_doc,
        vehicleImages: data?.vehicleImages
      };

    case USERTYPE.isVendor:
      return {
        _id: data?._id,
        cabProviderId: data.cabProviderId,
        vendorId: data.vendorId || 'null',
        vehicletype: data.vehicletype._id,
        vehicletypeName: '',
        vehicleName: data.vehicleName,
        vehicleNumber: data.vehicleNumber,
        GPS_EMI: data.GPS_EMI,

        fuelType: data.fuelType,
        fireCylinder: data.fireCylinder,
        firstAidBox: data.firstAidBox,
        phoneStand: data.phoneStand,
        bluetooth: data.bluetooth,
        perfume: data.perfume,
        umbrella: data.umbrella,
        torch: data.torch,
        GPS: data.GPS,

        fitnessDate: typeof data?.fitnessDate === 'undefined' ? null : convertToDateUsingMoment(data?.fitnessDate),
        insuranceExpiryDate: typeof data?.insuranceExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.insuranceExpiryDate),
        pollutionExpiryDate: typeof data?.pollutionExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.pollutionExpiryDate),
        permitOneYrExpiryDate:
          typeof data?.permitOneYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitOneYrExpiryDate),
        permitFiveYrExpiryDate:
          typeof data?.permitFiveYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitFiveYrExpiryDate),

        fitnessDate_Doc: '',
        fitnessDate_DocUrl: data?.fitnessDate_Doc,
        insuranceExpiryDate_Doc: '',
        insuranceExpiryDate_DocUrl: data?.insuranceExpiryDate_Doc,
        pollutionExpiryDate_Doc: '',
        pollutionExpiryDate_DocUrl: data?.pollutionExpiryDate_Doc,
        RC_Model_doc: '',
        RC_Model_docUrl: data?.RC_Model_doc,
        permitOneYrExpiryDate_doc: '',
        permitOneYrExpiryDate_docUrl: data?.permitOneYrExpiryDate_doc,
        permitFiveYrExpiryDate_doc: '',
        permitFiveYrExpiryDate_docUrl: data?.permitFiveYrExpiryDate_doc,
        vehicleImages: data?.vehicleImages
      };

    case USERTYPE.isVendorUser:
      return {
        _id: data?._id,
        cabProviderId: data.cabProviderId,
        vendorId: data.vendorId || 'null',
        vehicletype: data.vehicletype._id,
        vehicletypeName: '',
        vehicleName: data.vehicleName,
        vehicleNumber: data.vehicleNumber,
        GPS_EMI: data.GPS_EMI,

        fuelType: data.fuelType,
        fireCylinder: data.fireCylinder,
        firstAidBox: data.firstAidBox,
        phoneStand: data.phoneStand,
        bluetooth: data.bluetooth,
        perfume: data.perfume,
        umbrella: data.umbrella,
        torch: data.torch,
        GPS: data.GPS,

        fitnessDate: typeof data?.fitnessDate === 'undefined' ? null : convertToDateUsingMoment(data?.fitnessDate),
        insuranceExpiryDate: typeof data?.insuranceExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.insuranceExpiryDate),
        pollutionExpiryDate: typeof data?.pollutionExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.pollutionExpiryDate),
        permitOneYrExpiryDate:
          typeof data?.permitOneYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitOneYrExpiryDate),
        permitFiveYrExpiryDate:
          typeof data?.permitFiveYrExpiryDate === 'undefined' ? null : convertToDateUsingMoment(data?.permitFiveYrExpiryDate),

        fitnessDate_Doc: '',
        fitnessDate_DocUrl: data?.fitnessDate_Doc,
        insuranceExpiryDate_Doc: '',
        insuranceExpiryDate_DocUrl: data?.insuranceExpiryDate_Doc,
        pollutionExpiryDate_Doc: '',
        pollutionExpiryDate_DocUrl: data?.pollutionExpiryDate_Doc,
        RC_Model_doc: '',
        RC_Model_docUrl: data?.RC_Model_doc,
        permitOneYrExpiryDate_doc: '',
        permitOneYrExpiryDate_docUrl: data?.permitOneYrExpiryDate_doc,
        permitFiveYrExpiryDate_doc: '',
        permitFiveYrExpiryDate_docUrl: data?.permitFiveYrExpiryDate_doc,
        vehicleImages: data?.vehicleImages
      };

    default:
      return {};
  }
};

const handleFileChange = (event) => {
  // Check if files are selected
  if (event.target.files.length > 0) {
    const uploadedFiles = Array.from(event.target.files);

    // Filter out duplicate files based on the name
    setFiles((prevFiles) => {
      const existingFileNames = prevFiles.map((file) => file.name);
      const uniqueFiles = uploadedFiles.filter((file) => !existingFileNames.includes(file.name));
      return [...prevFiles, ...uniqueFiles];
    });
  }
};

const initialValuesFun = (data, userType) => {
  if (data) {
    return getInitialValuesByUserTypeForUpdate(data, userType) || {};
  } else {
    return getInitialValuesByUserTypeForCreation(userType) || {};
  }
};

const getPayloadForUpdate = (values, userType) => {
  console.log(`🚀 ~ getPayloadForUpdate ~ values:`, values);
  switch (userType) {
    case USERTYPE.iscabProvider: {
      const formData = new FormData();
      formData.append('_id', values._id);
      formData.append('vehicletype', values.vehicletype);
      formData.append('vendorId', values.vendorId || 'null');
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values.vehicleImages);
      return formData;
    }

    case USERTYPE.iscabProviderUser: {
      const formData = new FormData();
      formData.append('_id', values._id);
      formData.append('vehicletype', values.vehicletype);
      formData.append('vendorId', values.vendorId || 'null');
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values.vehicleImages);
      return formData;
    }

    case USERTYPE.isVendor: {
      const formData = new FormData();
      formData.append('_id', values._id);
      formData.append('vehicletype', values.vehicletype);
      formData.append('vendorId', values.vendorId || 'null');
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values.vehicleImages);
      return formData;
    }

    case USERTYPE.isVendorUser: {
      const formData = new FormData();
      formData.append('_id', values._id);
      formData.append('vehicletype', values.vehicletype);
      formData.append('vendorId', values.vendorId || 'null');
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values.vehicleImages);
      return formData;
    }
    default:
      return {};
  }
};

const getPayloadForCreation = (values, userType, vehicleImages) => {
  switch (userType) {
    case USERTYPE.iscabProvider: {
      const formData = new FormData();
      // console.log('values.vehicleImages', values.vehicleImages);

      formData.append('vehicletype', values.vehicletype);
      formData.append('vendorId', values.vendorId || 'null');
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      // formData.append('vehicleImages', values?.vehicleImages);

      // Append multiple vehicle images
      vehicleImages.forEach((item) => {
        formData.append('vehicleImage', item.file);
      });

      // const vehicleImageArray = []
      // if (values?.vehicleImages && values.vehicleImages.length > 0) {
      //   // Convert each file into a Blob and concatenate them

      //   const combinedBlob = new Blob(values.vehicleImages, { type: values.vehicleImages[0].type });

      //   // Create a new File from the combined Blob
      //   const combinedFile = new File([combinedBlob], "combined-vehicle-images", {
      //     type: values.vehicleImages[0].type,
      //   });

      //   console.log("combinedFile",combinedFile);

      //   console.log();

      //   // Append the single file to FormData
      //   formData.append("vehicleImages", combinedFile);
      // }

      //       if (values?.vehicleImages && values.vehicleImages.length > 0) {
      //         values.vehicleImages.forEach((file) => {
      //           vehicleImageArray.push(file);
      //         });
      //       }
      // console.log({vehicleImageArray});

      //       formData.append('vehicleImages', vehicleImageArray)
      return formData;
    }

    case USERTYPE.iscabProviderUser: {
      const formData = new FormData();
      formData.append('vehicletype', values.vehicletype);
      formData.append('vendorId', values.vendorId || 'null');
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values?.vehicleImages);
      return formData;
    }

    case USERTYPE.isVendor: {
      const formData = new FormData();
      formData.append('vehicletype', values.vehicletype);
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values?.vehicleImages);
      return formData;
    }

    case USERTYPE.isVendorUser: {
      const formData = new FormData();
      formData.append('vehicletype', values.vehicletype);
      formData.append('vehicleName', values.vehicleName);
      formData.append('vehicleNumber', values.vehicleNumber);
      formData.append('GPS_EMI', values.GPS_EMI);

      // formData.append('fitnessDate', values.fitnessDate);
      formData.append('fitnessDate', formatDateUsingMoment(values.fitnessDate, 'DD/MM/YYYY'));
      formData.append('insuranceExpiryDate', formatDateUsingMoment(values.insuranceExpiryDate, 'DD/MM/YYYY'));
      formData.append('pollutionExpiryDate', formatDateUsingMoment(values.pollutionExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitOneYrExpiryDate', formatDateUsingMoment(values.permitOneYrExpiryDate, 'DD/MM/YYYY'));
      formData.append('permitFiveYrExpiryDate', formatDateUsingMoment(values.permitFiveYrExpiryDate, 'DD/MM/YYYY'));

      formData.append('fuelType', values.fuelType);
      formData.append('fireCylinder', values.fireCylinder);
      formData.append('firstAidBox', values.firstAidBox);
      formData.append('phoneStand', values.phoneStand);
      formData.append('bluetooth', values.bluetooth);
      formData.append('perfume', values.perfume);
      formData.append('umbrella', values.umbrella);
      formData.append('torch', values.torch);
      formData.append('GPS', values.GPS);

      formData.append('fitnessDate_Doc', values.fitnessDate_Doc?.[0]);
      formData.append('insuranceExpiryDate_Doc', values.insuranceExpiryDate_Doc?.[0]);
      formData.append('pollutionExpiryDate_Doc', values.pollutionExpiryDate_Doc?.[0]);
      formData.append('RC_Model_doc', values.RC_Model_doc?.[0]);
      formData.append('permitOneYrExpiryDate_doc', values.permitOneYrExpiryDate_doc?.[0]);
      formData.append('permitFiveYrExpiryDate_doc', values.permitFiveYrExpiryDate_doc?.[0]);
      formData.append('vehicleImages', values?.vehicleImages);
      return formData;
    }

    default:
      return {};
  }
};

const sliceName = 'cabs';

const AddCab = () => {
  const [showGpsEmi, setShowGpsEmi] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isCreating, getSingleDetails } = useSelector((state) => state[sliceName]);

  const userType = useSelector((state) => state.auth.userType);
  const vendors = useSelector((state) => state.vendors.allVendors);
  console.log(`🚀 ~ AddCab ~ vendors:`, vendors);
  const vehicleTypes = useSelector((state) => state.vehicleTypes.vehicleTypes);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [vehicleImageError, setVehicleImageError] = useState(''); // State for error messages

  const fileInputRef = useRef();

  console.log('id', id);
  console.log('getSingleDetails', getSingleDetails);

  const triggerFileInput = () => {
    // console.log('trigger Function click');
    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    // setVehicleImages([...e.target.files]);
    const files = Array.from(event.target.files);

    const totalImages = vehicleImages.length + files.length;

    if (totalImages > MAX_VEHICLE_IMAGES) {
      setVehicleImageError(`You can only upload up to ${MAX_VEHICLE_IMAGES} images.`);
      return;
    }
    setVehicleImageError(''); // Clear any previous errors

    const newImages = files.map((file) => ({
      id: Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }));
    setVehicleImages((prev) => [...prev, ...newImages]);
  };

  const handleDelete = (id) => {
    setVehicleImages((prev) => prev.filter((img) => img.id !== id));
    setVehicleImageError(''); // Clear error if applicable
  };

  const handleOpenDialog = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (userType === USERTYPE.iscabProvider || userType === USERTYPE.iscabProviderUser) {
      dispatch(fetchAllVendors());
    }

    (async () => {
      try {
        if (id) {
          console.log('API Calling .......');

          const result = await dispatch(fetchCabDetails(id)).unwrap();
          console.log(`🚀 ~ Manage ~ result:`, result);
        }
      } catch (error) {
        console.log(`🚀 ~ Manage ~ error:`, error);
        navigate('/management/cab/view', { replace: true });
      }
    })();
  }, [dispatch, userType]);

  // const data = id? null : getSingleDetails;
  const data = isCreating ? null : getSingleDetails;

  console.log('getSingleDetails', getSingleDetails);
  console.log('isCreating', isCreating);
  console.log('data', data);

  const validationSchema = Yup.object({
    vehicletype: Yup.string().required('Vehicletype is required').min(1, 'Vehicletype is required'),
    vehicleNumber: Yup.string().required('VehicleNumber is required').min(1, 'VehicleNumber is required'),
    vehicleName: Yup.string().required('VehicleName is required').min(1, 'VehicleName is required'),
    // fitnessDate: Yup.date().required('Fitness Date is required'),
    // fitnessDate_Doc: id ? Yup.mixed().required('FitnessDate_Doc is required') : Yup.mixed(),
    // insuranceExpiryDate: Yup.date().required('Permit expiry date is required'),
    // insuranceExpiryDate_Doc: id ? Yup.mixed().required('InsuranceExpiryDate_Doc is required') : Yup.mixed(),
    // pollutionExpiryDate: Yup.date().required('PollutionExpiryDate is required'),
    // pollutionExpiryDate_Doc: id ? Yup.mixed().required('PollutionExpiryDate_Doc is required') : Yup.mixed(),
    // permitOneYrExpiryDate: Yup.date().required('PermitOneYrExpiryDate is required'),
    // permitOneYrExpiryDate_doc: id ? Yup.mixed().required('PermitOneYrExpiryDate_doc is required') : Yup.mixed(),
    // permitFiveYrExpiryDate: Yup.date().required('PermitFiveYrExpiryDate is required'),
    // permitFiveYrExpiryDate_doc: id ? Yup.mixed().required('PermitFiveYrExpiryDate_doc is required') : Yup.mixed(),
    // RC_Model_doc: id ? Yup.mixed().required('RC_Model_doc is required') : Yup.mixed(),
    fuelType: Yup.boolean(),
    fireCylinder: Yup.boolean(),
    firstAidBox: Yup.boolean(),
    phoneStand: Yup.boolean(),
    bluetooth: Yup.boolean(),
    perfume: Yup.boolean(),
    umbrella: Yup.boolean(),
    torch: Yup.boolean(),
    GPS: Yup.boolean(),
    GPS_EMI: showGpsEmi ? Yup.number().required('GPS EMI is required').positive('GPS EMI must be a positive number') : Yup.number()
  });

  const formik = useFormik({
    initialValues: initialValuesFun(data, userType),
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!id) {
          const formData = getPayloadForCreation(values, userType, vehicleImages);

          const response = await dispatch(addCab(formData)).unwrap();
        } else {
          console.log('API Calling (UPDATE) .......');
          const formData = getPayloadForUpdate(values, userType);
          await dispatch(editCab(formData));
        }

        // const message = isCreating ? messages[sliceName].CREATE : messages[sliceName].UPDATE;
        const message = id ? 'Cab details have been successfully updated' : 'Cab details have been successfully added';

        dispatch(
          openSnackbar({
            open: true,
            message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );

        setSubmitting(false);
        resetForm();
        navigate('/management/cab/view', { replace: true });
      } catch (error) {
        console.log('Error :: formikHandleSubmit =', error);
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
        setSubmitting(false);
      }
    }
  });

  // console.log('formik', formik.values.vehicleImages);

  const { errors, touched, handleSubmit, handleBlur, isSubmitting, getFieldProps, setFieldValue, values, dirty, initialValues } = formik;

  useEffect(() => {
    if (formik.values.GPS === 0) {
      setShowGpsEmi(false);
    } else {
      setShowGpsEmi(true);
    }
  }, [formik.values.GPS]);

  const handleSwitchChange = useCallback((event) => {
    const { name, checked } = event.target;
    setFieldValue(name, checked ? 1 : 0);
  }, []);

  const handlePreview = useCallback((fileUrl) => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const style = !id && (userType === USERTYPE.iscabProvider || userType === USERTYPE.iscabProviderUser) ? 3 : 4;

  return (
    <>
      <MainCard>
        <FormikProvider value={formik}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Details */}
                <Grid item xs={12}>
                  <MainCard title="Basic Details">
                    <Grid container spacing={2}>
                      {/* Vendor Company Name */}
                      {!id && (userType === USERTYPE.iscabProvider || userType === USERTYPE.iscabProviderUser) && (
                        <Grid item xs={12} sm={3}>
                          <Stack spacing={1}>
                            <InputLabel>Vendor Company Name</InputLabel>
                            <FormikAutocomplete
                              name="vendorId"
                              options={vendors}
                              placeholder="Self"
                              getOptionLabel={(option) => option['vendorCompanyName']}
                              saveValue="vendorId"
                              value={vendors?.find((item) => item['vendorId'] === values['vendorId']) || null}
                              renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                  {option['vendorCompanyName']}
                                </Box>
                              )}
                            />
                          </Stack>
                        </Grid>
                      )}

                      {/* Vehicle Type */}
                      <Grid item xs={12} sm={style}>
                        <Stack spacing={1}>
                          <InputLabel>Vehicle Type</InputLabel>
                          <FormikAutocomplete
                            name="vehicletype"
                            options={vehicleTypes}
                            placeholder="Vehicle type"
                            getOptionLabel={(option) => option['vehicleTypeName']}
                            saveValue="_id"
                            value={vehicleTypes?.find((item) => item['_id'] === values['vehicletype']) || null}
                            renderOption={(props, option) => (
                              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option['vehicleTypeName']}
                              </Box>
                            )}
                          />
                        </Stack>
                      </Grid>

                      {/* Vehicle Number */}
                      <Grid item xs={12} sm={style}>
                        <Stack spacing={1}>
                          <InputLabel>Vehicle Number</InputLabel>
                          <FormikTextField
                            name="vehicleNumber"
                            id="vehicleNumber"
                            placeholder="Enter Vehicle Number"
                            fullWidth
                            onChange={(e) => {
                              const value = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); // allows letters, numbers, and spaces
                              setFieldValue('vehicleNumber', value);
                            }}
                          />
                        </Stack>
                      </Grid>

                      {/* Modal Name */}
                      <Grid item xs={12} sm={style}>
                        <Stack spacing={1}>
                          <InputLabel>Modal Name</InputLabel>
                          <FormikTextField name="vehicleName" id="vehicleName" placeholder="Enter Modal Name" fullWidth />
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                {/* Documents */}
                <Grid item xs={12}>
                  <MainCard title="Documents">
                    <Grid container spacing={2}>
                      {/* Fitness */}
                      <Grid item xs={12} sm={4}>
                        <MainCard title="Fitness">
                          <Stack spacing={1} gap={2}>
                            <DatePicker
                              label="Select Fitness Date"
                              sx={{ width: '100%' }}
                              value={values.fitnessDate}
                              format="dd/MM/yyyy"
                              minDate={new Date()}
                              onChange={(newValue) => {
                                setFieldValue('fitnessDate', newValue);
                              }}
                            />
                            {!!formik.errors.fitnessDate && formik.touched.fitnessDate && (
                              <Typography
                                sx={{
                                  color: 'red',
                                  fontSize: '13px',
                                  paddingBlock: '0',
                                  marginTop: '-12px !important',
                                  marginBottom: '0 !important'
                                }}
                              >
                                {formik.errors.fitnessDate || ''}
                              </Typography>
                            )}
                            <UploadSingleFile
                              saveTo="fitnessDate_Doc"
                              setFieldValue={setFieldValue}
                              file={values.fitnessDate_Doc}
                              acceptedFileType="application/pdf"
                              error={touched.fitnessDate_Doc && !!errors.fitnessDate_Doc}
                            />

                            {id && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => handlePreview(values.fitnessDate_DocUrl)}
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        </MainCard>
                      </Grid>

                      {/* Insurance */}
                      <Grid item xs={12} sm={4}>
                        <MainCard title="Insurance">
                          <Stack spacing={1} gap={2}>
                            <DatePicker
                              label="Select Insurance Date"
                              sx={{ width: '100%' }}
                              value={values.insuranceExpiryDate}
                              format="dd/MM/yyyy"
                              minDate={new Date()}
                              onChange={(newValue) => {
                                setFieldValue('insuranceExpiryDate', newValue);
                              }}
                            />
                            {!!formik.errors.insuranceExpiryDate && formik.touched.insuranceExpiryDate && (
                              <Typography
                                sx={{
                                  color: 'red',
                                  fontSize: '13px',
                                  paddingBlock: '0',
                                  marginTop: '-12px !important',
                                  marginBottom: '0 !important'
                                }}
                              >
                                {formik.errors.insuranceExpiryDate || ''}
                              </Typography>
                            )}
                            <UploadSingleFile
                              setFieldValue={setFieldValue}
                              file={values.insuranceExpiryDate_Doc}
                              saveTo="insuranceExpiryDate_Doc"
                              acceptedFileType="application/pdf"
                              error={touched.insuranceExpiryDate_Doc && !!errors.insuranceExpiryDate_Doc}
                            />

                            {id && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => handlePreview(values.insuranceExpiryDate_DocUrl)}
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        </MainCard>
                      </Grid>

                      {/* Pollution */}
                      <Grid item xs={12} sm={4}>
                        <MainCard title="Pollution">
                          <Stack spacing={1} gap={2}>
                            <DatePicker
                              label="Select Pollution Expiry Date"
                              sx={{
                                width: '100%'
                                // border: !!formik.errors.pollutionExpiryDate && formik.touched.pollutionExpiryDate ? 'red' : 'auto'
                              }}
                              value={values.pollutionExpiryDate}
                              format="dd/MM/yyyy"
                              minDate={new Date()}
                              onChange={(newValue) => setFieldValue('pollutionExpiryDate', newValue)}
                            />
                            {!!formik.errors.pollutionExpiryDate && formik.touched.pollutionExpiryDate && (
                              <Typography
                                sx={{
                                  color: 'red',
                                  fontSize: '13px',
                                  paddingBlock: '0',
                                  marginTop: '-12px !important',
                                  marginBottom: '0 !important'
                                }}
                              >
                                {formik.errors.pollutionExpiryDate || ''}
                              </Typography>
                            )}
                            <UploadSingleFile
                              setFieldValue={setFieldValue}
                              file={values.pollutionExpiryDate_Doc}
                              saveTo="pollutionExpiryDate_Doc"
                              acceptedFileType="application/pdf"
                              error={touched.pollutionExpiryDate_Doc && !!errors.pollutionExpiryDate_Doc}
                            />

                            {id && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => handlePreview(values.pollutionExpiryDate_DocUrl)}
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        </MainCard>
                      </Grid>

                      {/* Permit 1 year */}
                      <Grid item xs={12} sm={4}>
                        <MainCard title="Permit 1 year">
                          <Stack spacing={1} gap={2}>
                            <DatePicker
                              label="Select Permit 1 year Expiry Date"
                              sx={{ width: '100%' }}
                              value={values.permitOneYrExpiryDate}
                              format="dd/MM/yyyy"
                              minDate={new Date()}
                              onChange={(newValue) => setFieldValue('permitOneYrExpiryDate', newValue)}
                            />
                            {!!formik.errors.permitOneYrExpiryDate && formik.touched.permitOneYrExpiryDate && (
                              <Typography
                                sx={{
                                  color: 'red',
                                  fontSize: '13px',
                                  paddingBlock: '0',
                                  marginTop: '-12px !important',
                                  marginBottom: '0 !important'
                                }}
                              >
                                {formik.errors.permitOneYrExpiryDate || ''}
                              </Typography>
                            )}
                            <UploadSingleFile
                              setFieldValue={setFieldValue}
                              file={values.permitOneYrExpiryDate_doc}
                              saveTo="permitOneYrExpiryDate_doc"
                              acceptedFileType="application/pdf"
                              error={touched.permitOneYrExpiryDate_doc && !!errors.permitOneYrExpiryDate_doc}
                            />

                            {id && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => handlePreview(values.permitOneYrExpiryDate_docUrl)}
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        </MainCard>
                      </Grid>

                      {/* Permit 5 years */}
                      <Grid item xs={12} sm={4}>
                        <MainCard title="Permit 5 years">
                          <Stack spacing={1} gap={2}>
                            <DatePicker
                              label="Select Permit 5 years Expiry Date"
                              sx={{ width: '100%' }}
                              value={values.permitFiveYrExpiryDate}
                              format="dd/MM/yyyy"
                              minDate={new Date()}
                              onChange={(newValue) => {
                                // Ensure newValue is a Date object
                                if (newValue instanceof Date && !isNaN(newValue)) {
                                  setFieldValue('permitFiveYrExpiryDate', newValue);
                                } else {
                                  setFieldValue('permitFiveYrExpiryDate', null);
                                }
                              }}
                            />
                            {!!formik.errors.permitFiveYrExpiryDate && formik.touched.permitFiveYrExpiryDate && (
                              <Typography
                                sx={{
                                  color: 'red',
                                  fontSize: '13px',
                                  paddingBlock: '0',
                                  marginTop: '-12px !important',
                                  marginBottom: '0 !important'
                                }}
                              >
                                {formik.errors.permitFiveYrExpiryDate || ''}
                              </Typography>
                            )}
                            <UploadSingleFile
                              setFieldValue={setFieldValue}
                              file={values.permitFiveYrExpiryDate_doc}
                              saveTo="permitFiveYrExpiryDate_doc"
                              acceptedFileType="application/pdf"
                              error={touched.permitFiveYrExpiryDate_doc && !!errors.permitFiveYrExpiryDate_doc}
                            />

                            {id && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => handlePreview(values.permitFiveYrExpiryDate_docUrl)}
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        </MainCard>
                      </Grid>

                      {/* RC Model */}
                      <Grid item xs={12} sm={4}>
                        <MainCard
                          sx={{
                            height: 1,
                            '& .MuiCardContent-root': {
                              height: 1,
                              display: 'flex',
                              flexDirection: 'column'
                            }
                          }}
                        >
                          <Grid id="print" container spacing={2.25}>
                            <Grid item xs={12}>
                              <Typography variant="h5">RC</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider />
                            </Grid>
                            <Grid item xs={12}>
                              <UploadSingleFile
                                setFieldValue={setFieldValue}
                                file={values.RC_Model_doc}
                                saveTo="RC_Model_doc"
                                acceptedFileType="application/pdf"
                                error={touched.RC_Model_doc && !!errors.RC_Model_doc}
                              />
                            </Grid>
                          </Grid>

                          {id && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              sx={{ mt: 'auto', mb: 0 }}
                              onClick={() => handlePreview(values.RC_Model_docUrl)}
                            >
                              Preview
                            </Button>
                          )}
                        </MainCard>
                      </Grid>

                      {/* RC */}
                      {/* <Grid item xs={12} sm={4}>
                        <MainCard title="RC">
                          <Stack spacing={1} gap={2}>
                            <UploadSingleFile
                              setFieldValue={setFieldValue}
                              file={values.RC_Model_doc}
                              saveTo="RC_Model_doc"
                              error={
                                touched.RC_Model_doc && !!errors.RC_Model_doc
                              }
                            />

                            {id && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() =>
                                  handlePreview(values.RC_Model_docUrl)
                                }
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        </MainCard>
                      </Grid> */}
                    </Grid>
                  </MainCard>
                </Grid>

                {/* Compliance 1 */}
                <Grid item xs={12}>
                  <MainCard title="Compliance 1">
                    <Grid container spacing={2}>
                      {/* Fuel Type */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Fuel Type : </InputLabel>
                            <Switch
                              checked={values.fuelType}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="fuelType"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              <InputLabel>Fuel Type : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              {' '}
                              <Switch
                                checked={values.fuelType}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="fuelType"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* Fire Cylinder */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Fire Cylinder : </InputLabel>
                            <Switch
                              checked={values.fireCylinder}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="fireCylinder"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              <InputLabel>Fire Cylinder : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              {' '}
                              <Switch
                                checked={values.fireCylinder}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="fireCylinder"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* First Aid Box */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>First Aid Box : </InputLabel>
                            <Switch
                              checked={values.firstAidBox}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="firstAidBox"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              {' '}
                              <InputLabel>First Aid Box : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              {' '}
                              <Switch
                                checked={values.firstAidBox}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="firstAidBox"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* Phone Stand */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Phone Stand : </InputLabel>
                            <Switch
                              checked={values.phoneStand}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="phoneStand"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              <InputLabel>Phone Stand : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <Switch
                                checked={values.phoneStand}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="phoneStand"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* Bluetooth */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Bluetooth : </InputLabel>
                            <Switch
                              checked={values.bluetooth}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="bluetooth"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              <InputLabel>Bluetooth : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <Switch
                                checked={values.bluetooth}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="bluetooth"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* Perfume */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Perfume : </InputLabel>
                            <Switch
                              checked={values.perfume}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="perfume"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              {' '}
                              <InputLabel>Perfume : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              {' '}
                              <Switch
                                checked={values.perfume}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="perfume"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* Umbrella */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Umbrella : </InputLabel>
                            <Switch
                              checked={values.umbrella}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="umbrella"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              <InputLabel>Umbrella : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <Switch
                                checked={values.umbrella}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="umbrella"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      {/* Torch */}
                      <Grid item xs={3}>
                        <Stack spacing={1}>
                          {/* <Stack direction="row" spacing={1} justifyContent="space-between">
                            <InputLabel>Torch : </InputLabel>
                            <Switch
                              checked={values.torch}
                              inputProps={{ 'aria-label': 'switch' }}
                              name="torch"
                              onChange={handleSwitchChange}
                            />
                          </Stack> */}

                          <Grid container spacing={1} alignItems={'center'}>
                            <Grid item xs={6}>
                              <InputLabel>Torch : </InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                              <Switch
                                checked={values.torch}
                                inputProps={{ 'aria-label': 'switch' }}
                                name="torch"
                                onChange={handleSwitchChange}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                {/* Compliance 2 */}
                <Grid item xs={12}>
                  <MainCard title="Compliance 2">
                    <Grid container spacing={4}>
                      {/* GPS */}
                      <Grid item xs={3}>
                        <Stack direction={'row'} spacing={1} justifyContent="space-between">
                          <InputLabel>GPS</InputLabel>
                          <Switch checked={values.GPS} inputProps={{ 'aria-label': 'switch' }} name="GPS" onChange={handleSwitchChange} />
                        </Stack>
                      </Grid>

                      {/* GPS EMI */}
                      <Grid item xs={5}>
                        <Stack spacing={1} direction={'row'} justifyContent="space-between">
                          {showGpsEmi && (
                            <>
                              <InputLabel>GPS EMI</InputLabel>
                              <FormikTextField
                                name="GPS_EMI"
                                id="GPS_EMI"
                                placeholder="Enter GPS EMI"
                                InputProps={{
                                  startAdornment: '₹'
                                }}
                              />
                            </>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                {/* Vehicle Images Upload */}
                <Grid item xs={12}>
                  <MainCard title="Upload Vehicle Images">
                    <Box p={3}>
                      <Stack gap={2}>
                        <Box
                          border="2px dashed #ccc"
                          borderRadius="8px"
                          p={3}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexDirection="column"
                          sx={{
                            cursor: vehicleImages.length < MAX_VEHICLE_IMAGES ? 'pointer' : 'not-allowed',
                            '&:hover': {
                              borderColor: vehicleImages.length < MAX_VEHICLE_IMAGES ? '#1976d2' : '#ccc'
                            }
                          }}
                          onClick={vehicleImages.length < MAX_VEHICLE_IMAGES ? triggerFileInput : undefined}
                        >
                          <DocumentUpload fontSize="large" color="primary" />
                          <Typography variant="body1" color="textSecondary">
                            Click here to upload images of your vehicle
                          </Typography>
                          <Button variant="contained" component="label" sx={{ mt: 2 }} onClick={(e) => e.stopPropagation()}>
                            Upload Images
                            <input ref={fileInputRef} hidden accept="image/*" type="file" multiple onChange={handleFileUpload} />
                          </Button>
                          {vehicleImageError && (
                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                              {vehicleImageError}
                            </Typography>
                          )}
                        </Box>

                        <Typography variant="caption" color="textSecondary">
                          {`Allowed formats: jpg, png, jpeg. Max size: ${MAX_VEHICLE_IMAGES} images.`}
                        </Typography>
                      </Stack>

                      {vehicleImages.length > 0 && (
                        <Box mt={4}>
                          <Typography variant="h6" gutterBottom>
                            Uploaded Vehicle Images (
                            <Typography component="span" sx={{ fontWeight: 'bold' }}>
                              {vehicleImages.length}/{MAX_VEHICLE_IMAGES}
                            </Typography>
                            )
                          </Typography>
                          <Grid container spacing={2}>
                            {vehicleImages.map((image) => (
                              <Grid item xs={12} sm={6} md={2} key={image.id}>
                                <Card onClick={() => handleOpenDialog(image)} sx={{ cursor: 'pointer' }} title={image.name}>
                                  <CardMedia component="img" height="140" image={image.url} alt={image.name} />
                                  <CardContent
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <Typography variant="body2" noWrap>
                                      {image.name}
                                    </Typography>
                                    <IconButton
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(image.id);
                                      }}
                                    >
                                      <Trash />
                                    </IconButton>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <Stack
                          gap={2}
                          sx={{
                            height: 'inherit'
                          }}
                        >
                          <DialogTitle
                            sx={{
                              fontWeight: 'bold',
                              bgcolor: 'primary.main',
                              color: 'white'
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignContent="center">
                              <Typography variant="h6">{selectedImage?.name}</Typography>
                              <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                                <Add style={{ transform: 'rotate(45deg)' }} />
                              </IconButton>
                            </Stack>
                          </DialogTitle>
                          <DialogContent>
                            {selectedImage && (
                              <img src={selectedImage.url} alt={selectedImage.name} style={{ width: '100%', borderRadius: '8px' }} />
                            )}
                          </DialogContent>
                        </Stack>
                      </Dialog>
                    </Box>
                  </MainCard>
                </Grid>

                {/* Actions */}
                <Grid item xs={12}>
                  <DialogActions>
                    <Button color="error" onClick={() => navigate('/management/cab/view')}>
                      Cancel
                    </Button>
                    <Button variant="contained" type="submit" disabled={isSubmitting || !dirty}>
                      {!id ? 'Add' : 'Save'}
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          </LocalizationProvider>
        </FormikProvider>
      </MainCard>
    </>
  );
};

export default AddCab;
