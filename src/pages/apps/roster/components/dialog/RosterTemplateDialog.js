
// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Add, TableDocument } from 'iconsax-react';
import CreateRosterTemplate from './components/CreateRosterTemplateDrawer';

// ==============================|| DIALOG - SIMPLE ||============================== //

function RosterTemplateDialog({ onClose, selectedValue, open, templates }) {
  const theme = useTheme();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

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
        </List>
      </Dialog>
      <CreateRosterTemplate />
    </>
  );
}

export default RosterTemplateDialog;
