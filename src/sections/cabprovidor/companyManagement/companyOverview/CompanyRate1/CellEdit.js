import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Select, MenuItem, Chip, Box, Stack, Slider, Tooltip, IconButton} from '@mui/material';
import { TickSquare } from 'iconsax-react';

export const CellEdit = ({ value: initialValue, row: { index }, column: { id, dataType }, updateData }) => {
  const [value, setValue] = useState(initialValue);
  const [showSelect, setShowSelect] = useState(false);

  const onChange = (e) => {
    setValue(e.target?.value);
  };

  const onBlur = () => {
    updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let userInfoSchema;
  switch (id) {
    case 'email':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().email('Enter valid email ').required('Email is a required field')
      });
      break;
    case 'age':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.number()
          .required('Age is required')
          .typeError('Age must be number')
          .min(18, 'You must be at least 18 years')
          .max(100, 'You must be at most 60 years')
      });
      break;
    case 'visits':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.number().typeError('Visits must be number').required('Required')
      });
      break;
    default:
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }

  let element;
  switch (dataType) {
    case 'text':
      element = (
        <Formik
          initialValues={{ userInfo: value }}
          enableReinitialize
          validationSchema={userInfoSchema}
          onSubmit={() => {}}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <TextField
                value={values.userInfo}
                id={`${index}-${id}`}
                name="userInfo"
                onChange={(e) => {
                  handleChange(e);
                  onChange(e);
                }}
                onBlur={handleBlur}
                error={touched.userInfo && Boolean(errors.userInfo)}
                helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                sx={{
                  '& .MuiOutlinedInput-input': { py: 0.75, px: 1, width: id === 'email' ? 150 : 80 },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              />
            </Form>
          )}
        </Formik>
      );
      break;
    case 'select':
      element = (
        <Select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 }, svg: { display: 'none' } }}
        >
          <MenuItem value="Complicated">
            <Chip color="error" label="Complicated" size="small" variant="light" />
          </MenuItem>
          <MenuItem value="Relationship">
            <Chip color="success" label="Relationship" size="small" variant="light" />
          </MenuItem>
          <MenuItem value="Single">
            <Chip color="info" label="Single" size="small" variant="light" />
          </MenuItem>
        </Select>
      );
      break;
    case 'progress':
      element = (
        <>
          {!showSelect ? (
            <Box onClick={() => setShowSelect(true)}>
              {/* Replace with appropriate progress component */}
              <div>{value}%</div>
            </Box>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, minWidth: 120 }}>
              <Slider
                value={value}
                min={0}
                max={100}
                step={1}
                onBlur={onBlur}
                onChange={(event, newValue) => setValue(newValue)}
                valueLabelDisplay="auto"
              />
              <Tooltip title={'Submit'}>
                <IconButton onClick={() => setShowSelect(false)}>
                  <TickSquare />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </>
      );
      break;
    default:
      element = <span></span>;
      break;
  }

  return element;
};
