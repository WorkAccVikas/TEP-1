import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Autocomplete,
  FormHelperText,
  Divider,
  Typography,
} from "@mui/material";

import MainCard from "components/MainCard";
import { Container } from "@mui/system";

const optionsForCabRate = [
  { value: 0, label: "Trip Basis" },
  { value: 1, label: "Km Basis" },
  { value: 2, label: "Fixed Charges" },
];

const optionsForGuard = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
];

const optionsForDualTrip = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
];

const optionsForBillingCycle = [
  { value: "0", label: "Select" },
  { value: "Weekly", label: "Weekly" },
  { value: "15 Days", label: "15 Days" },
  { value: "1 Month", label: "1 Month" },
  { value: "2 Months", label: "2 Months" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Custom", label: "Custom" },
];

const CompanyRateForm = ({
  onSubmit,
  onClose,
  vehicleTypeList,
  zoneTypeList,
  zones,
  initialData = {},
  companyName,
}) => {
  const [formData, setFormData] = useState(() => ({
    zoneNameID: "",
    zoneTypeID: "",
    cabRate: 0,
    cabAmount: [],
    dualTrip: optionsForDualTrip[1].value,
    dualTripAmount: [],
    guard: optionsForGuard[1].value,
    guardPrice: "",
    selectedVehicleTypes: [],
    vehicleAmounts: {},
    vehicleAmountsDualTrip: {},
    billingCycle: "0",
    customBillingCycle: "",
    amount: "",
    ...initialData,
  }));

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(initialData).length) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleVehicleAmountChange = (vehicleId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleAmounts: {
        ...prevData.vehicleAmounts,
        [vehicleId]: value,
      },
    }));
  };

  const handleDualTripAmountChange = (vehicleId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleAmountsDualTrip: {
        ...prevData.vehicleAmountsDualTrip,
        [vehicleId]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.zoneNameID) newErrors.zoneNameID = "Zone Name is required";
    // if (!formData.zoneTypeID) newErrors.zoneTypeID = "Zone Type is required";
    if (formData.selectedVehicleTypes.length === 0)
      newErrors.selectedVehicleTypes =
        "At least one vehicle type must be selected";

    formData.selectedVehicleTypes.forEach((type) => {
      if (
        !formData.vehicleAmounts[type._id] ||
        formData.vehicleAmounts[type._id] <= 0
      ) {
        newErrors[
          `vehicleAmount_${type._id}`
        ] = `Amount for ${type.vehicleTypeName} must be greater than 0`;
      }
      if (
        formData.dualTrip === 1 &&
        (!formData.vehicleAmountsDualTrip[type._id] ||
          formData.vehicleAmountsDualTrip[type._id] <= 0)
      ) {
        newErrors[
          `dualTripAmount_${type._id}`
        ] = `Dual Trip Amount for ${type.vehicleTypeName} must be greater than 0`;
      }
    });

    if (formData.billingCycle === "Custom" && !formData.customBillingCycle) {
      newErrors.customBillingCycle = "Custom Billing Cycle is required";
    }

    if (formData.billingCycle === "0") {
      newErrors.billingCycle = "Please select a billing cycle";
    }

    // if (formData.guard === 1) {
    //   if (!formData.guardPrice || formData.guardPrice <= 0) {
    //     newErrors.guardPrice =
    //       "Guard Price is required and must be greater than 0";
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submittedData = {
        ...formData,
        cabAmount: formData.selectedVehicleTypes.map((type) => ({
          vehicleTypeID: type._id,
          amount: formData.vehicleAmounts[type._id] || 0,
        })),
        dualTripAmount:
          formData.dualTrip === 1
            ? formData.selectedVehicleTypes.map((type) => ({
                vehicleTypeID: type._id,
                amount: formData.vehicleAmountsDualTrip[type._id] || 0,
              }))
            : [],
      };
      onSubmit(submittedData);
    }
  };

  return (
    <Box sx={{ p: 1, py: 1.5 }}>
      <DialogContent>
        {/* Company Section */}
        <MainCard>
          <Typography variant="h6" gutterBottom>
            Company
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="outlined-number-read-only"
                defaultValue={companyName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          {/* Vehicle Type Section */}
          <Typography variant="h6" gutterBottom>
            Vehicle Type
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={vehicleTypeList}
                getOptionLabel={(option) => option.vehicleTypeName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Vehicle Types"
                    placeholder="Select..."
                    fullWidth
                    error={!!errors.selectedVehicleTypes}
                    helperText={errors.selectedVehicleTypes}
                  />
                )}
                onChange={(event, value) =>
                  handleChange("selectedVehicleTypes", value)
                }
                value={formData.selectedVehicleTypes}
                sx={{
                  "& .MuiOutlinedInput-root": { p: 0.8 },
                  "& .MuiAutocomplete-tag": {
                    bgcolor: "primary.lighter",
                    border: "1px solid",
                    borderColor: "primary.light",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          {/* Billing Section */}
          <Typography variant="h6" gutterBottom>
            Billing
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.billingCycle}
              >
                <InputLabel id="billing-cycle-select-label">
                  Billing Cycle
                </InputLabel>
                <Select
                  labelId="billing-cycle-select-label"
                  value={formData.billingCycle}
                  onChange={(e) => handleChange("billingCycle", e.target.value)}
                  label="Billing Cycle"
                >
                  {optionsForBillingCycle.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.billingCycle && (
                  <FormHelperText>{errors.billingCycle}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {formData.billingCycle === "Custom" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Custom Billing Cycle"
                  value={formData.customBillingCycle}
                  onChange={(e) =>
                    handleChange("customBillingCycle", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors.customBillingCycle}
                  helperText={errors.customBillingCycle}
                />
              </Grid>
            )}
          </Grid>
          <Divider sx={{ my: 1 }} />
          {/* Zone Section */}
          <Typography variant="h6" gutterBottom>
            Zone
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.zoneNameID}
              >
                <InputLabel id="zone-name-label">Zone Name</InputLabel>
                <Select
                  labelId="zone-name-label"
                  value={formData.zoneNameID}
                  onChange={(e) => handleChange("zoneNameID", e.target.value)}
                  label="Zone Name"
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone._id} value={zone._id}>
                      {zone.zoneName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.zoneNameID && (
                  <FormHelperText>{errors.zoneNameID}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.zoneTypeID}
              >
                <InputLabel id="zone-type-label">Zone Type</InputLabel>
                <Select
                  labelId="zone-type-label"
                  value={formData.zoneTypeID}
                  onChange={(e) => handleChange("zoneTypeID", e.target.value)}
                  label="Zone Type"
                >
                  {zoneTypeList.map((zoneType) => (
                    <MenuItem key={zoneType._id} value={zoneType._id}>
                      {zoneType.zoneTypeName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.zoneTypeID && (
                  <FormHelperText>{errors.zoneTypeID}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          {/* Cab Rate Details Section */}
          <Typography variant="h6" gutterBottom>
            Cab Rate Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="cab-rate-select-label">Cab Rate</InputLabel>
                <Select
                  labelId="cab-rate-label"
                  value={formData.cabRate}
                  onChange={(e) => handleChange("cabRate", e.target.value)}
                  label="Cab Rate"
                >
                  {optionsForCabRate.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {formData.selectedVehicleTypes.map((type) => (
                <TextField
                  sx={{ mb: 1 }}
                  key={type._id}
                  label={`Amount for ${type.vehicleTypeName}`}
                  name={type.vehicleTypeName}
                  type="number"
                  value={formData.vehicleAmounts[type._id] || ""}
                  onChange={(e) =>
                    handleVehicleAmountChange(
                      type._id,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors[`vehicleAmount_${type._id}`]}
                  helperText={errors[`vehicleAmount_${type._id}`]}
                />
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          {/* Dual Trip Details Section */}
          {formData.selectedVehicleTypes.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Dual Trip Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="dual-trip-select-label">
                      Dual Trip
                    </InputLabel>
                    <Select
                      labelId="dual-trip-select-label"
                      value={formData.dualTrip}
                      onChange={(e) => handleChange("dualTrip", e.target.value)}
                      label="Dual Trip"
                    >
                      {optionsForDualTrip.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  {formData.dualTrip === 1 &&
                    formData.selectedVehicleTypes.map((type) => (
                      <TextField
                        sx={{ mb: 1 }}
                        key={type._id}
                        label={`Dual Trip Amount for ${type.vehicleTypeName}`}
                        name={type.vehicleTypeName}
                        type="number"
                        value={formData.vehicleAmountsDualTrip[type._id] || ""}
                        onChange={(e) =>
                          handleDualTripAmountChange(
                            type._id,
                            parseFloat(e.target.value)
                          )
                        }
                        fullWidth
                        variant="outlined"
                        error={!!errors[`dualTripAmount_${type._id}`]}
                        helperText={errors[`dualTripAmount_${type._id}`]}
                      />
                    ))}
                </Grid>
              </Grid>
            </>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Guard Details Section */}
          <Typography variant="h6" gutterBottom>
            Guard Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="guard-select-label">Guard Required?</InputLabel>
                <Select
                  labelId="guard-select-label"
                  value={formData.guard}
                  onChange={(e) => handleChange("guard", e.target.value)}
                  label="Guard"
                >
                  {optionsForGuard.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {formData.guard === 1 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Guard Price"
                  type="number"
                  value={formData.guardPrice}
                  onChange={(e) =>
                    handleChange("guardPrice", parseFloat(e.target.value))
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors.guardPrice}
                  helperText={errors.guardPrice}
                />
              </Grid>
            )}
          </Grid>
        </MainCard>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>close</Button>
        <Button
          onClick={() => {
            setFormData({
              zoneNameID: "",
              zoneTypeID: "",
              cabRate: 0,
              cabAmount: [],
              dualTrip: optionsForDualTrip[1].value,
              dualTripAmount: [],
              guard: optionsForGuard[1].value,
              guardPrice: "",
              selectedVehicleTypes: [],
              vehicleAmounts: {},
              vehicleAmountsDualTrip: {},
              billingCycle: "0",
              customBillingCycle: "",
              amount: "",
            });
          }}
        >
          reset
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Box>
  );
};

export default CompanyRateForm;
