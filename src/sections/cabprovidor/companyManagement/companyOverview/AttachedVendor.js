import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import { Box, Eye } from 'iconsax-react';
import { ThemeMode } from 'config';
import ReactTable, { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';

const AttachedVendor = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        className: 'cell-center',
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Vendor Company Name',
        accessor: 'vendorCompanyName'
      },
      {
        Header: 'Work Email',
        accessor: 'workEmail'
      },
      {
        Header: 'Mobile Number',
        accessor: 'workMobileNumber'
      },
      {
        Header: 'Address',
        accessor: 'officeAddress'
      },
      {
        Header: 'View Rate',
        className: 'cell-left',
        disableSortBy: true,
        Cell: () => {
          // const navigate = useNavigate();
          const theme = useTheme();
          const mode = theme.palette.mode;
          // const companyID = row.original._id;
          return (
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="View"
              >
                <IconButton
                  color="secondary"
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   navigate(`/branch-management?company=${companyID}`); // Use navigate for redirection
                  // }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  return (
    <MainCard title="Attached Vendors List" content={false}>
      <ScrollX>
        {loading ? (
          <Box
            sx={{
              height: '100vh',
              width: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <ReactTable columns={columns} data={data} />
        ) : (
          <TableNoDataMessage text="No Vendor Found" />
        )}
      </ScrollX>
    </MainCard>
  );
};

AttachedVendor.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default AttachedVendor;
