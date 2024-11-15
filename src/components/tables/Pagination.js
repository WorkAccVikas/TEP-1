import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormControl, Grid, MenuItem, Select, Stack, TextField, Typography, Pagination } from '@mui/material';

// let options = [5, 10, 25, 50, 100];

const PaginationBox = ({ pageSize, setPageSize = () => {}, pageIndex, gotoPage, lastPageIndex, options = [5, 10, 25, 50, 100] }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePagination = (event, value) => {
    gotoPage(value);
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ width: 'auto' }}>
      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="secondary">
              Row per page
            </Typography>

            <FormControl sx={{ m: 1 }}>
              <Select
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={pageSize}
                onChange={setPageSize}
                size="small"
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Typography variant="caption" color="secondary">
            Go to
          </Typography>

          <TextField
            size="small"
            type="number"
            value={10}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 1;
              gotoPage(page);
            }}
            InputProps={{
              inputProps: { min: 1, max: lastPageIndex } // Optional: Set minimum value
            }}
            sx={{
              '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 }
            }}
          />
        </Stack>
      </Grid>

      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          count={lastPageIndex}
          page={pageIndex}
          onChange={handleChangePagination}
          color="primary"
          variant="combined"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

// PropTypes
PaginationBox.propTypes = {
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  pageIndex: PropTypes.number.isRequired,
  gotoPage: PropTypes.func.isRequired,
  lastPageIndex: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.number)
};

export default PaginationBox;
