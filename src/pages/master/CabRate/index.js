/* eslint-disable no-unused-vars */
import { MenuItem, Select, Stack, InputLabel, FormControl, Button } from '@mui/material';
import { MODULE, PERMISSIONS } from 'constant';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { filteredArrayOfObjectsByUserPermissions } from 'utils/helper';

const options = [
  {
    label: 'Cab Rate Master For Vendor',
    value: 'vendor',
    check: {
      [MODULE.CAB_RATE_VENDOR]: [PERMISSIONS.CREATE]
      // [MODULE.ROLE]: [PERMISSIONS.UPDATE, PERMISSIONS.DELETE]
      // [MODULE.ROLE]: [PERMISSIONS.CREATE, PERMISSIONS.DELETE]
    }
  },
  {
    label: 'Cab Rate Master For Driver',
    value: 'driver',
    check: {
      [MODULE.CAB_RATE_DRIVER]: [PERMISSIONS.CREATE]
      // [MODULE.USER]: [PERMISSIONS.CREATE, PERMISSIONS.DELETE]
    }
  }
];

const URL = {
  vendor: 'vendor',
  driver: 'driver'
};

const CabRate = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const { userPermissions } = useSelector((state) => state.auth);

  // Filter options dynamically based on user permissions
  const filteredOptions = useMemo(() => {
    const result = filteredArrayOfObjectsByUserPermissions(options, userPermissions);
    return result;
  }, [userPermissions]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const handleBtnClick = useCallback(() => {
    const url = URL[value];
    if (!url) {
      alert('Please select cab rate type');
      return;
    }
    navigate(`${url}`);
  }, [navigate, value]);

  return (
    <>
      <Stack gap={2}>
        <FormControl fullWidth>
          <InputLabel id="editable-select-cab-rate-label">Select Cab Rate Master</InputLabel>
          <Select
            labelId="editable-select-cab-rate-label"
            id="editable-select-cab-rate"
            value={value}
            label="Select Cab Rate Master"
            onChange={handleChange}
          >
            {filteredOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" size="medium" sx={{ alignSelf: 'center' }} onClick={handleBtnClick}>
          Submit
        </Button>
      </Stack>

      {/* {value && <p>Selected: {value}</p>} */}
    </>
  );
};

export default CabRate;
