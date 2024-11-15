import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

// project-imports
import IconButton from 'components/@extended/IconButton';
// import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, TableDocument } from 'iconsax-react';
import { useDrawer } from 'contexts/DrawerContext';
import CreateRosterTemplate from '../CreateRosterTemplateDrawer.js';

// ==============================|| DIALOG - SIMPLE ||============================== //

function RosterTemplateDialog({ onClose, selectedValue, open, templates }) {
  console.log('templates', templates);

  const theme = useTheme();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const { openDrawer } = useDrawer();

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Grid item>
            <DialogTitle>Select Roster Template</DialogTitle>
          </Grid>
          <Grid item sx={{ mr: 1.5 }}>
            <IconButton color="secondary" onClick={handleClose}>
              <Add style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
          </Grid>
        </Grid>

        <List sx={{ p: 2.5 }}>
          {templates &&
            templates.map((template, index) => (
              <ListItemButton
                onClick={() => handleListItemClick(template)}
                key={template._id}
                selected={selectedValue === template}
                sx={{ p: 1.25 }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <TableDocument />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={template.templateName} />
              </ListItemButton>
            ))}
          <ListItemButton
            autoFocus
            onClick={() => {
              handleClose();
              openDrawer();
            }}
            sx={{ p: 1.25 }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 32, height: 32 }}>
                <Add style={{ fontSize: '0.625rem' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add New Template" />
          </ListItemButton>
        </List>
      </Dialog>
      <CreateRosterTemplate />
    </>
  );
}

export default RosterTemplateDialog;
