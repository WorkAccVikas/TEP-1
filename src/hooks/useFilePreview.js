import { dispatch } from 'store';

const { useState, useCallback } = require('react');
const { openSnackbar } = require('store/reducers/snackbar');

export const useFilePreview = (config, fieldName, formik, initialFile = null) => {
  const [preview, setPreview] = useState(initialFile);

  const handlePreviewChange = useCallback((val) => {
    setPreview(val);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size and type
      if (file.size > config.fileSize) {
        handleError(fieldName, `File size exceeds the limit of ${config.getSizeString()}`);
        return;
      }

      if (!config.fileFormat.includes(file.type)) {
        handleError(fieldName, `Unsupported file format. Please upload a valid file.`);
        return;
      }

      // Image dimensions check
      const reader = new FileReader();
      reader.onload = () => {
        if (config.width && config.height) {
          const img = new Image();
          img.onload = () => {
            // console.log(img.width, img.height);
            if (img.width !== config.width || img.height !== config.height) {
              handleError(fieldName, `Invalid image dimensions. The image must be ${config.width}x${config.height} pixels.`);
              return;
            }
            setPreview(reader.result);
            formik.setFieldValue(fieldName, file);
            formik.setFieldTouched(fieldName, true);
          };
          img.src = reader.result;
        } else {
          // No dimension validation needed, set preview directly
          setPreview(reader.result);
          formik.setFieldValue(fieldName, file);
          formik.setFieldTouched(fieldName, true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleError = (fieldName, message) => {
    formik.setFieldValue(fieldName, null);
    setPreview('');
    formik.setFieldTouched(fieldName, true);
    formik.setFieldError(fieldName, message);

    dispatch(
      openSnackbar({
        open: true,
        message,
        variant: 'alert',
        alert: { color: 'error' },
        close: true
      })
    );
  };

  return {
    preview,
    handlePreviewChange,
    handleFileChange
  };
};
