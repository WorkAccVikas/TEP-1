import { useState } from 'react';

// material-ui
import { Button, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from 'components/MainCard';
import BasicInfo from 'sections/cabprovidor/vendorManagement/BasicInfo';
import SpecificDetail from 'sections/cabprovidor/vendorManagement/SpecificDetail';

// step options
const steps = ['Basic Information', 'Specific Details'];

const getStepContent = (
  step,
  handleNext,
  handleBack,
  setErrorIndex,
  basicInfo,
  setBasicInfo,
  specificDetail,
  setSpecificDetail,
  vendorId,
  setVendorId
) => {
  switch (step) {
    case 0:
      return (
        <BasicInfo
          handleNext={handleNext}
          setErrorIndex={setErrorIndex}
          basicInfo={basicInfo}
          setBasicInfo={setBasicInfo}
          vendorId={vendorId}
          setVendorId={setVendorId}
        />
      );
    case 1:
      return (
        <SpecificDetail
          handleNext={handleNext}
          handleBack={handleBack}
          setErrorIndex={setErrorIndex}
          specificDetail={specificDetail}
          setSpecificDetail={setSpecificDetail}
          vendorId={vendorId}
        />
      );
    // case 2:
    //   return <Review />;
    default:
      throw new Error('Unknown step');
  }
};

// ==============================|| FORMS WIZARD - VALIDATION ||============================== //

const AddVendor = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({});
  const [specificDetail, setSpecificDetail] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [errorIndex, setErrorIndex] = useState(null);
  const [vendorId, setVendorId] = useState(null);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    setErrorIndex(null);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <MainCard title="Add Vendor">
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label, index) => {
          const labelProps = {};

          if (index === errorIndex) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Error
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h3" align="center" gutterBottom>
              Vendor Added Successfully.
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button
                  variant="contained"
                  // color="error"
                  onClick={() => {
                    setBasicInfo({});
                    setPaymentData({});
                    setActiveStep(0);
                  }}
                  sx={{ my: 3, ml: 1 }}
                >
                  Add Vendor
                </Button>
              </AnimateButton>
            </Stack>
          </>
        ) : (
          <>
            {getStepContent(
              activeStep,
              handleNext,
              handleBack,
              setErrorIndex,
              basicInfo,
              setBasicInfo,
              paymentData,
              setPaymentData,
              specificDetail,
              setSpecificDetail,
              vendorId,
              setVendorId
            )}
          </>
        )}
      </>
    </MainCard>
  );
};

export default AddVendor;
