/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { memo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
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
  },
  favicon: {
    fileSize: 512 * 1024, // 512KB
    fileFormat: ['image/x-icon', 'image/png', 'image/svg+xml']
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
    }),
  favIcon: Yup.mixed()
    .nullable()
    .test('fileSize', 'The favicon file is too large', (value) => {
      if (value) {
        return value.size <= CONFIG.favicon.fileSize;
      }
      return true;
    })
    .test('fileFormat', 'Unsupported favicon format', (value) => {
      if (value) {
        return CONFIG.favicon.fileFormat.includes(value.type);
      }
      return true;
    })
});

const ManageAccountSettings = memo(({ initialValues }) => {
  console.log('ManageAccountSettings Render');
  console.log(initialValues);

  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState('');
  //   const [logoPreview, setLogoPreview] = useState(
  //     'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kim_Jong-un_April_2019_%28cropped%29.jpg'
  //   );

  const fileInputRef = useRef(null); // Create a ref for the file input
  const [faviconPreview, setFaviconPreview] = useState('');
  //   const [faviconPreview, setFaviconPreview] = useState(
  //     'https://cdn4.vectorstock.com/i/1000x1000/28/08/north-korea-flag-icon-isolate-print-vector-30902808.jpg'
  //   );
  const faviconInputRef = useRef(null);

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
      favIcon: null
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

          // navigate('/dashboard', { replace: true });
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

  const handleFaviconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > CONFIG.favicon.fileSize) {
        formik.setFieldValue('favIcon', null);
        setFaviconPreview('');
        formik.setFieldTouched('favIcon', true);
        dispatch(
          openSnackbar({
            open: true,
            message: 'The favicon file is too large. Please upload a file smaller than 512KB.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
        return;
      }

      if (!CONFIG.favicon.fileFormat.includes(file.type)) {
        formik.setFieldValue('favIcon', null);
        setFaviconPreview('');
        formik.setFieldTouched('favIcon', true);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Unsupported favicon format. Please upload an .ico, .png, or .svg file.',
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
        setFaviconPreview(reader.result);
        formik.setFieldValue('favIcon', file);
        formik.setFieldTouched('favIcon', true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconButtonClick = () => {
    if (faviconInputRef.current) {
      faviconInputRef.current.click();
    }
  };

  return (
    <>
      <MainCard title="Account Settings">
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit} noValidate>
            <Stack gap={2}>
              <Grid container spacing={3}>
                {/* Logo */}
                <Grid item xs={12} md={6}>
                  <Stack direction="column" alignItems="center" spacing={2}>
                    {/* Title */}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Upload Logo
                    </Typography>

                    {/* Drag and Drop Zone */}
                    <div
                      onClick={handleButtonClick}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        handleLogoChange({ target: { files: [file] } });
                      }}
                      style={{
                        width: 150,
                        height: 150,
                        border: logoPreview ? 'none' : '2px dashed #1976d2',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        background: logoPreview ? `url(${logoPreview}) no-repeat center / cover` : '#f0f0f0',
                        overflow: 'hidden'
                      }}
                      title="Click or drag an image to upload"
                    >
                      {/* Default Icon */}
                      {!logoPreview && <FaRegUserCircle style={{ fontSize: 50, color: '#90caf9' }} />}

                      {/* Hover Overlay for Remove */}
                      {logoPreview && (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.6)',
                            color: '#fff',
                            display: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            fontSize: 16,
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            formik.setFieldValue('logo', null);
                            setLogoPreview('');
                          }}
                          className="logo-overlay"
                        >
                          <Typography>Remove Logo</Typography>
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleLogoChange} />
                    </div>

                    {/* Validation Feedback */}
                    {formik.touched.logo && formik.errors.logo ? (
                      <Typography variant="body2" color="error">
                        {formik.errors.logo}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'gray' }}>
                        * Accepts JPEG/PNG formats up to 1MB.
                      </Typography>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MainCard title="Favicon" sx={{ textAlign: 'center', padding: 3 }}>
                    <Stack direction="column" alignItems="center" spacing={2}>
                      <Typography variant="body1" color="textSecondary">
                        Add a favicon to personalize your account settings. Supported formats: .ico, .png, .svg.
                      </Typography>
                      <Avatar
                        src={faviconPreview || '/static/images/favicon-placeholder.png'} // Placeholder image
                        alt="Favicon"
                        sx={{
                          width: 64,
                          height: 64,
                          cursor: 'pointer',
                          border: '2px dashed',
                          borderColor: formik.errors.favIcon ? 'error.main' : 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease, border-color 0.3s ease'
                          }
                        }}
                        onClick={handleFaviconButtonClick}
                        title="Click to upload favicon"
                      />
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept=".ico,image/png,image/svg+xml"
                        hidden
                        onChange={handleFaviconChange}
                      />
                      <FormControl fullWidth sx={{ alignItems: 'center' }}>
                        <FormHelperText sx={{ fontStyle: 'italic', color: formik.errors.favIcon ? 'error.main' : 'textSecondary' }}>
                          {formik.touched.favIcon && formik.errors.favIcon
                            ? formik.errors.favIcon
                            : 'Upload a favicon file (.ico, .png, .svg, max 512KB).'}
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </MainCard>
                </Grid>

                {/* Name */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name" sx={{ fontWeight: 600 }}>
                      Name
                    </InputLabel>
                    <TextField
                      fullWidth
                      {...formik.getFieldProps('name')}
                      id="name"
                      type="text"
                      // label="Name"
                      placeholder="Name"
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Stack>
                </Grid>

                {/* Title */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="title" sx={{ fontWeight: 600 }}>
                      Title
                    </InputLabel>
                    <TextField
                      fullWidth
                      {...formik.getFieldProps('title')}
                      id="title"
                      type="text"
                      // label="Title"
                      placeholder="Title"
                      onBlur={formik.handleBlur}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </Stack>
                </Grid>

                {/* Favicon */}
                {/* <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5">Favicon</Typography>
                    <Avatar
                      src={faviconPreview || ''}
                      alt="Favicon"
                      sx={{ width: 64, height: 64, cursor: 'pointer' }}
                      title="Upload Favicon"
                      onClick={handleFaviconButtonClick}
                    ></Avatar>
                    <input ref={faviconInputRef} type="file" accept=".ico,image/png,image/svg+xml" hidden onChange={handleFaviconChange} />
                    <FormControl fullWidth sx={{ alignItems: 'center' }}>
                      <FormHelperText sx={{ fontStyle: 'italic' }}>
                        {formik.touched.favIcon && formik.errors.favIcon
                          ? formik.errors.favIcon
                          : '* Upload a favicon file (.ico, .png, .svg, max 512KB)'}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid> */}

                {/* <Grid item xs={12}>
                  <Typography variant="subtitle1">Favicon</Typography>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                    <Avatar
                      sx={{ width: 64, height: 64, cursor: 'pointer' }}
                      src={faviconPreview || ''}
                      onClick={() => faviconInputRef.current.click()}
                    />
                    <Button variant="contained" size="small" onClick={() => faviconInputRef.current.click()}>
                      Upload Favicon
                    </Button>
                    <input ref={faviconInputRef} type="file" accept=".ico,image/png,image/svg+xml" hidden onChange={handleFaviconChange} />
                  </Stack>
                </Grid> */}
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
});

export default ManageAccountSettings;
