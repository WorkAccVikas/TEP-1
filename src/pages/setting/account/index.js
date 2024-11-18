import { useRef, useState } from 'react';
import { Avatar, Button, Divider, FormControl, FormHelperText, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { Form, FormikProvider, useFormik } from 'formik';
import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import * as Yup from 'yup';
import { FaRegUserCircle } from 'react-icons/fa';

const CONFIG = {
  logo: {
    fileSize: 1 * 1024 * 1024, // 1MB
    fileFormat: ['image/jpeg', 'image/png']
  }
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  title: Yup.string().required('Title is required'),
  logo: Yup.mixed()
    .nullable()
    .test('fileSize', 'The file is too large', (value) => {
      if (value) {
        return value.size <= CONFIG.logo.fileSize; // 1MB max size
      }
      return true; // If no file is selected, validation passes
    })
    .test('fileFormat', 'Unsupported Format', (value) => {
      if (value) {
        return CONFIG.logo.fileFormat.includes(value.type);
      }
      return true; // If no file is selected, validation passes
    })
});

const AccountSettings = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    console.log(file.size);
    if (file) {
      if (file.size > CONFIG.logo.fileSize) {
        // 1MB max size
        formik.setFieldValue('logo', null); // Clear the logo field
        setLogoPreview(''); // Clear the preview

        if (formik.values.logo) {
          formik.setFieldTouched('logo', '');
        }
        dispatch(
          openSnackbar({
            open: true,
            message: 'The file is too large. Please upload a file smaller than 1MB.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
        return;
      }

      if (!CONFIG.logo.fileFormat.includes(file.type)) {
        // Validate file format
        formik.setFieldValue('logo', null); // Clear the logo field
        setLogoPreview(''); // Clear the preview

        if (formik.values.logo) {
          formik.setFieldTouched('logo', '');
        }
        dispatch(
          openSnackbar({
            open: true,
            message: 'Unsupported format. Please upload a JPEG or PNG image.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
        formik.setFieldValue('logo', file);
        formik.setFieldTouched('logo', true); // Mark the field as touched
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      title: '',
      logo: null,
      favIcon: ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        alert('Form submitted');
        console.log(values);

        // TODO : API call FOR ADD/UPDATE (ONE API ONLY)

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const response = {
          status: 200
        };

        if (response.status >= 200 && response.status < 300) {
          resetForm();

          dispatch(
            openSnackbar({
              open: true,
              message: 'Account details have been successfully updated',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );

          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.log(error);
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
    }
  });

  return (
    <>
      <MainCard title="Account Settings">
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit} noValidate>
            <Stack gap={2}>
              <Grid container spacing={3}>
                {/* Logo */}
                <Grid item xs={12}>
                  <Stack direction="column" alignItems="center" spacing={2}>
                    <Typography variant="h5">Logo</Typography>
                    <Avatar
                      src={logoPreview || ''}
                      alt="Logo"
                      sx={{ width: 100, height: 100, cursor: 'pointer' }}
                      title="Upload Logo"
                      onClick={handleButtonClick}
                    ></Avatar>
                    {/* Hidden input field */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoChange} // Handle file selection
                    />
                    {/* {formik.touched.logo && formik.errors.logo && <Typography color="error">{formik.errors.logo}</Typography>} */}
                    <FormControl fullWidth sx={{ alignItems: 'center' }}>
                      <FormHelperText sx={{ fontStyle: 'italic' }}>
                        {formik.touched.logo && formik.errors.logo ? formik.errors.logo : '* Upload a logo image (JPEG or PNG, max 1MB)'}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
                {/* Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    {...formik.getFieldProps('name')}
                    type="text"
                    label="Name"
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>

                {/* Title */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    {...formik.getFieldProps('title')}
                    type="text"
                    label="Title"
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>

                {/* Favicon */}
                <Grid item xs={12} sm={6}></Grid>
              </Grid>

              <Divider />

              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    navigate(-1, { replace: true });
                  }}
                  title="Cancel"
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit" title="Save" disabled={formik.isSubmitting || !formik.dirty}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Form>
        </FormikProvider>
      </MainCard>
    </>
  );
};

export default AccountSettings;
