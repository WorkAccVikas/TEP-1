import { Button, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import EmptyTableDemo from 'components/tables/EmptyTable';
import { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import ReactTable from 'components/tables/reactTable3/ReactTable';
import { IndeterminateCheckbox } from 'components/third-party/ReactTable';
import { DocumentDownload } from 'iconsax-react';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'store';

const Table = () => {
  const { monthlyReportData } = useSelector((state) => state.report);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Driver Name',
        accessor: 'driverName',
        Cell: ({ value }) => value || 'N/A'
        // disableSortBy: true
      },
      {
        Header: 'Total Trip Completed',
        accessor: 'totalTripCompleted',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'Total Advances',
        accessor: 'totalAdvances',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'Advance Interest',
        accessor: 'advanceInterest',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'MCD/Toll Charge',
        accessor: 'totalMCDAndTollCharge',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'Total Penalty',
        accessor: 'totalPenalty',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'Total Office Charge Amount',
        accessor: 'totalOfficeChargeAmount',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'Total Guard Amount',
        accessor: 'totalDriverGuardAmount',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      },
      {
        Header: 'Total Amount',
        accessor: 'totalAmount',
        Cell: ({ value }) => (value === null || value === undefined ? 'N/A' : value)
        // disableSortBy: true
      }
    ],
    []
  );

  return (
    <>
      {monthlyReportData && monthlyReportData.length > 0 ? (
        <MainCard content={false}>
          <Stack gap={2}>
            <ReactTable columns={columns} data={monthlyReportData} pagesize={10}/>
          </Stack>
        </MainCard>
      ) : (
        <EmptyTableDemo />
      )}
    </>
  );
};

export default Table;
