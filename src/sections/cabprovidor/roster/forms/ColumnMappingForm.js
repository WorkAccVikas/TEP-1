import { Button, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
// Initial list of mandatory columns
const INITIAL_LIST_TWO = [
  {
    name: 'tripDate',
    headerName: 'Trip Date',
    required: true,
    defaultValue: '2022-12-12T00:00:00.000'
  },
  {
    name: 'tripTime',
    headerName: 'Trip Time',
    required: true
  },
  {
    name: 'tripType',
    headerName: 'Trip Type',
    required: true
  },
  {
    name: 'zoneName',
    headerName: 'Zone Name',
    required: true
  },
  {
    name: 'zoneType',
    headerName: 'Zone Type',
    required: true
  },
  {
    name: 'vehicleType',
    headerName: 'Vehicle Type',
    required: true
  },
  {
    name: 'location',
    headerName: 'Location',
    required: false,
    defaultValue: ''
  },
  {
    name: 'guard',
    headerName: 'Guard',
    required: false,
    defaultValue: 0
  },
  {
    name: 'guardPrice',
    headerName: 'Guard Price',
    required: false,
    defaultValue: 0
  },
  {
    name: 'vehicleNumber',
    headerName: 'Vehicle Number',
    required: false,
    defaultValue: ''
  },
  {
    name: 'vehicleRate',
    headerName: 'Vehicle Rate',
    required: false,
    defaultValue: 0
  },
  {
    name: 'addOnRate',
    headerName: 'Add On Rate',
    required: false,
    defaultValue: 0
  },
  {
    name: 'penalty',
    headerName: 'Penalty',
    required: false,
    defaultValue: 0
  },
  {
    name: 'remarks',
    headerName: 'Remarks',
    required: false,
    defaultValue: ''
  }
];

export const HEADER_NAME_MAPPING = INITIAL_LIST_TWO.reduce((acc, curr) => {
  acc[curr.name] = curr.headerName;
  return acc;
}, {});

export const DEFAULT_VALUE_OPTIONAL = INITIAL_LIST_TWO.reduce((acc, item) => {
  if (!item.required && item.defaultValue !== undefined) {
    acc[item.name] = item.defaultValue;
  }
  return acc;
}, {});

export const DEFAULT_VALUE_REQUIRED = INITIAL_LIST_TWO.reduce((acc, item) => {
  if (item.defaultValue !== undefined) {
    acc[item.name] = item.defaultValue;
  }
  return acc;
}, {});

export const ColumnMappingForm = ({ columns, handleClose, handleOk }) => {
  const [selectedMandatory, setSelectedMandatory] = useState(
    INITIAL_LIST_TWO.reduce((acc, item) => {
      acc[item.name] = ''; // Initialize with empty values
      return acc;
    }, {})
  );

  // Handle selecting a fetched column for a mandatory item
  const handleSelectMandatory = (itemName, value) => {
    setSelectedMandatory((prev) => ({
      ...prev,
      [itemName]: value
    }));
  };
  const handleSave = () => {
    // console.log('selectedMandatory', selectedMandatory);

    const emptyStringResult = {};
    const filledResult = {};

    const selectedValues = Object.values(selectedMandatory);
    const startIndex = selectedValues.length > 0 ? selectedValues.length + 1 : 1;

    let emptyIndex = startIndex;

    // Iterate through selectedMandatory to populate both objects
    for (const [key, value] of Object.entries(selectedMandatory)) {
      if (value === '') {
        emptyStringResult[emptyIndex] = key; // Assigning numeric keys
        emptyIndex++;
      } else {
        filledResult[value] = key; // Mapping filled values
      }
    }

    // console.log('Empty String Result:', emptyStringResult);
    // console.log('Filled Result:', filledResult);

    // Combine both objects as needed
    // eslint-disable-next-line no-unused-vars
    const result = {
      ...filledResult,
      ...emptyStringResult
    };

    // console.log('Final Result:', result);
    handleOk(filledResult, emptyStringResult);
  };

  const isConfirmDisabled = () => {
    return INITIAL_LIST_TWO.filter((item) => item.required).some((item) => !selectedMandatory[item.name]);
  };

  const getFilteredOptions = (itemName) => {
    const selectedValues = Object.values(selectedMandatory).filter(Boolean);
    return columns.filter((option) => !selectedValues.includes(option) || option === selectedMandatory[itemName]);
  };

  return (
    <>
      <DialogTitle>Mapping Column</DialogTitle>
      <DialogContent>
        {INITIAL_LIST_TWO.map((item) => (
          <Grid container spacing={3} xs={12} key={item.name} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} lg={6}>
              <Stack>
                <Typography>{item.headerName}</Typography>
                <Typography variant="body2" color={item.required ? 'error' : 'primary'}>
                  {item.required ? '(Mandatory)' : '(Optional)'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} spacing={3} lg={6}>
              <Select
                value={selectedMandatory[item.name]}
                onChange={(e) => handleSelectMandatory(item.name, e.target.value)}
                displayEmpty
                sx={{ flexGrow: 1 }}
              >
                <MenuItem value="" disabled>
                  Select a fetched column
                </MenuItem>
                {getFilteredOptions(item.name).map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={isConfirmDisabled()}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

ColumnMappingForm.propTypes = {
  columns: PropTypes.array,
  handleClose: PropTypes.func,
  handleOk: PropTypes.func
};

export default ColumnMappingForm;
