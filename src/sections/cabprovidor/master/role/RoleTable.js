/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Box, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ReactTable from 'components/tables/reactTable/ReactTable';
import { useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import DataTable from 'sections/cabprovidor/master/role/DataTable';
import GenericChip from 'sections/cabprovidor/master/role/GenericChip';
import { ThemeMode } from 'config';
import { Edit, Trash } from 'iconsax-react';
import WrapperButton from 'components/common/guards/WrapperButton';
import { PERMISSIONS } from 'constant';

/* eslint-disable no-unused-vars */
const RoleTable = ({ data, page, setPage, limit, setLimit, lastPageNo, handleChangeRoleId, handleModalOpenRemove }) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const mode = theme.palette.mode;

  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        className: 'cell-center'
        // disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Role Name',
        accessor: 'role_name',
        minWidth: 100
      },
      // {
      //   Header: 'Description',
      //   accessor: 'description',
      //   disableSortBy: true,
      //   Cell: () => {
      //     return 'vikas';
      //   },
      //   maxWidth: 100
      // },
      {
        Header: 'Permissions',
        accessor: 'permissions',
        Cell: ({ value }) => {
          //   const module = Object.keys(value);
          const permissions = formatObjectEntries(value);
          //   return 'vikas';
          return (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                rowGap: 2,
                maxWidth: '100%',
                marginInline: 'auto',
                padding: 1
              }}
            >
              {permissions.map((item, index) => {
                return (
                  <Chip
                    label={item}
                    key={index}
                    sx={{ color: 'text.primary', bgcolor: 'grey.300', fontSize: '0.75rem', textTransform: 'capitalize' }}
                  />
                );
              })}
              {/* {permissions.map((item, index) => {
                return <GenericChip label={item} key={index} />;
              })} */}
            </Box>
          );
        },
        minWidth: 300
      },
      {
        Header: 'Action',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <WrapperButton moduleName="Role" permission={PERMISSIONS.UPDATE}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title="Edit"
                >
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Row = ', row.original);
                      // alert(`Edit = ${row.original._id}`);
                      handleChangeRoleId(row.original._id);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              </WrapperButton>

              <WrapperButton moduleName="Role" permission={PERMISSIONS.DELETE}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title="Delete"
                >
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      // alert(`Delete = ${row.original._id}`);
                      handleModalOpenRemove(row.original._id);
                    }}
                  >
                    <Trash />
                  </IconButton>
                </Tooltip>
              </WrapperButton>
            </Stack>
          );
        },
        maxWidth: 100
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <MainCard content={false}>
          <DataTable columns={columns} data={data} hiddenColumns={['id']} />
        </MainCard>
      </Stack>
    </>
  );
};

RoleTable.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  limit: PropTypes.number,
  setLimit: PropTypes.func,
  lastPageNo: PropTypes.number,
  setLastPageNo: PropTypes.func,
  handleChangeRoleId: PropTypes.func.isRequired,
  handleModalOpenRemove: PropTypes.func.isRequired
};

export default RoleTable;

/**
 * Formats the entries of an object where the values are arrays of strings.
 * It combines each key with its corresponding array values, producing a new array
 * where each element is in the format: "key - value".
 *
 * @param {Object} obj - The input object, where each key has an array of strings as its value.
 * @returns {Array} A flattened array of formatted strings where each string is in the
 *          form "key - value".
 *
 * @example
 * const x = {
 *   "Dashboard": ["Create", "Read", "Update", "Delete"],
 *   "Roster": ["Create", "Read"]
 * };
 *
 * formatObjectEntries(x);
 *  Output: [
 *    'Dashboard - Create',
 *    'Dashboard - Read',
 *    'Dashboard - Update',
 *    'Dashboard - Delete',
 *    'Roster - Create',
 *    'Roster - Read'
 *  ]
 */
function formatObjectEntries(obj) {
  return Object.keys(obj).flatMap((section) => obj[section].map((action) => `${section} - ${action}`));
}
