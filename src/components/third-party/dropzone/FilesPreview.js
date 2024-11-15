import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemText, ListItem, Typography, Stack } from '@mui/material';

// project-imports
import { DropzopType } from 'config';
import IconButton from 'components/@extended/IconButton';

// utils
import getDropzoneData from 'utils/getDropzoneData';

// assets
import { CloseCircle, Document, Eye } from 'iconsax-react';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

export default function FilesPreview({ showList = false, files, onRemove, type }) {
  const theme = useTheme();
  const hasFile = files.length > 0;
  const layoutType = type;

  return (
    <List
      disablePadding
      sx={{
        ...(hasFile && type !== DropzopType.standard && { my: 3 }),
        ...(type === DropzopType.standard && { width: 'calc(100% - 84px)' })
      }}
    >
      {files.map((file, index) => {
        const { key, name, size, preview, type: fileType } = getDropzoneData(file, index);

        return (
          <ListItem
            key={key}
            sx={{
              my: 1,
              px: 2,
              py: 0.75,
              borderRadius: 0.75,
              border: (theme) => `solid 1px ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {fileType.includes('image') ? (
              <img alt="preview" src={preview} style={{ width: 64, height: 64, borderRadius: 8, marginRight: theme.spacing(2) }} />
            ) : (
              <Document variant="Bold" style={{ width: 30, height: 30, fontSize: '1.5rem', marginRight: theme.spacing(2) }} />
            )}

            <ListItemText
              primary={
                <Typography
                  variant="subtitle2"
                  component="a"
                  onClick={() => window.open(preview, '_blank')}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main'
                    // textDecoration: 'underline',
                    // '&:hover': { color: 'primary.dark' }
                  }}
                >
                  {name}
                </Typography>
              }
            />

            {/* <ListItemText primary={<Typography variant="subtitle2">{name}</Typography>} /> */}

            {onRemove && (
              <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                <CloseCircle variant="Bold" style={{ fontSize: '1.16rem' }} />
              </IconButton>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

FilesPreview.propTypes = {
  showList: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  type: PropTypes.string
};
