import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project-imports
import EditBasicInfo from 'sections/cabprovidor/vendorManagement/EditBasicInfo';
import EditSpecificDetail from 'sections/cabprovidor/vendorManagement/EditSpecificDetail';
import { useParams } from 'react-router';
import { dispatch } from 'store';
import { fetchVendorsById } from 'store/slice/cabProvidor/vendorSlice';

// ==============================|| FORMS WIZARD - VALIDATION ||============================== //

const EditVendor = () => {
  const { id } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({});
  const [specificDetail, setSpecificDetail] = useState({});
  // const [paymentData, setPaymentData] = useState({});
  // const [errorIndex, setErrorIndex] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (id) {
      console.log('Full id', id);
      setVendorId(id);
      dispatch(fetchVendorsById(id)).then((data) => {
        if (data && data.payload) {
          console.log(data.payload);
          setBasicInfo(data.payload.userData || {});
          setSpecificDetail(data.payload.userSpecificData || {});
          // setPaymentData(data.payload.paymentData || {});
          setUserId(data.payload.userSpecificData._id || null);
        }
      });
    }
  }, [id, dispatch]);

  // console.log('basicInfo', basicInfo);
  console.log('specificDetail', specificDetail);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    // setErrorIndex(null);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Grid container spacing={3}>
      {/* Basic Info */}
      <Grid item xs={12}>
        <EditBasicInfo
          handleNext={handleNext}
          // setErrorIndex={setErrorIndex}
          basicInfo={basicInfo}
          setBasicInfo={setBasicInfo}
          vendorId={vendorId}
          setVendorId={setVendorId}
        />
      </Grid>

      {/* Specific Info */}
      <Grid item xs={12}>
        <EditSpecificDetail
          handleNext={handleNext}
          handleBack={handleBack}
          // setErrorIndex={setErrorIndex}
          specificDetail={specificDetail}
          setSpecificDetail={setSpecificDetail}
          userId={userId}
        />
      </Grid>
    </Grid>
  );
};

export default EditVendor;
