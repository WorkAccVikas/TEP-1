import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// third-party
import { useDropzone } from 'react-dropzone';

// project-imports
import RejectionFiles from 'components/dropzone/RejectionFiles';
import PlaceholderContent from 'components/dropzone/PlaceholderContent';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

const SingleFileUpload = ({ error, file, setFieldValue, sx, saveTo = 'files', acceptedFileType = 'image/*' }) => {
  const theme = useTheme();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      [acceptedFileType]: []
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFieldValue(
        saveTo,
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
          })
        )
      );
    }
  });

  const thumbs =
    file &&
    file.map((item) => (
      <img
        key={item.name}
        alt={item.name}
        src={item?.preview}
        style={{
          top: 8,
          left: 8,
          borderRadius: 2,
          position: 'absolute',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          background: theme.palette.background.paper
        }}
        onLoad={() => {
          URL.revokeObjectURL(item?.preview);
        }}
      />
    ));

  const onRemove = () => {
    setFieldValue(saveTo, null);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(file && {
            padding: '12% 0'
          })
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent />
        {thumbs}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

SingleFileUpload.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.array,
  setFieldValue: PropTypes.func,
  sx: PropTypes.object,
  saveTo: PropTypes.string,
  acceptedFileType: PropTypes.string
};

export default SingleFileUpload;
