import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import ReactTable from 'components/tables/reactTable/ReactTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import { useSelector } from 'react-redux';
import { dispatch } from 'store';
import PaginationBox from 'components/tables/Pagination';
import { formattedDate } from 'utils/helper';
import { fetchCabs } from 'store/slice/cabProvidor/cabSlice';

const AttachedVehicle = ({ vendorId }) => {
  const { cabs, metaData, error } = useSelector((state) => state.cabs);
  const userType = useSelector((state) => state.auth.userType);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  //  useEffect: get attached vendor to the vendor by vendor Id

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchCabs({ page, limit, vendorID: vendorId }));
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [page, limit, vendorId]); // Only fetch data when id changes

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

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
        Header: 'Cab Name',
        accessor: 'vehicleName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Cab Type',
        accessor: 'vehicleTypeName',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Cab Number',
        accessor: 'vehicleNumber',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        // disableSortBy: true,
        Cell: ({ row }) => {
          const { values } = row;
          const time = values['createdAt'];
          return (
            <Typography
              sx={{
                width: 'fit-content', // Dynamically adjusts to the content
                minWidth: '60px', // Ensures enough space for minimum display
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' // Prevents text from wrapping
              }}
            >
              {' '}
              {time ? formattedDate(time, 'DD/MM/YYYY') : 'N/A'}
            </Typography>
          );
        }
      }
    ],
    [userType]
  );

  return (
    <>
      <MainCard title="Attached Cabs List" content={false}>
        <ScrollX>
          {loading ? (
            <TableSkeleton rows={10} columns={5} />
          ) : cabs.length > 0 ? (
            <ReactTable columns={columns} data={cabs} hideHeader />
          ) : (
            <EmptyTableDemo />
          )}
        </ScrollX>
        <Box>
          {cabs.length > 0 && (
            <div style={{ padding: '10px' }}>
              <PaginationBox
                pageIndex={page}
                gotoPage={setPage}
                pageSize={limit}
                setPageSize={handleLimitChange}
                lastPageIndex={lastPageIndex}
              />
            </div>
          )}
        </Box>
      </MainCard>
    </>
  );
};

AttachedVehicle.propTypes = {
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string
};

export default AttachedVehicle;
