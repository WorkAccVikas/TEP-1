import { Button, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import ReactTable from 'components/tables/reactTable3/ReactTable';
import { IndeterminateCheckbox } from 'components/third-party/ReactTable';
import { DocumentDownload } from 'iconsax-react';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'store';

const Table = () => {
  const { companyReportData } = useSelector((state) => state.report);
  console.log(`🚀 ~ Table ~ companyReportData:`, companyReportData);

  const columns = useMemo(
    () => [
      // {
      //   title: 'Row Selection',
      //   Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />,
      //   accessor: 'selection',
      //   Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
      //   disableSortBy: true,
      //   disableFilters: true
      // },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Company Name',
        accessor: 'company_name'
        // disableSortBy: true
      },
      {
        Header: 'Trip Count',
        accessor: 'tripCount'
        // disableSortBy: true
      },
      {
        Header: 'Company Guard Price',
        accessor: 'companyGuardPrice'
        // disableSortBy: true
      },
      {
        Header: 'Company Rate',
        accessor: 'companyRate'
        // disableSortBy: true
      },
      {
        Header: 'Company Penalty',
        accessor: 'companyPenalty'
        // disableSortBy: true
      },
      {
        Header: 'Vendor Guard Price',
        accessor: 'vendorGuardPrice'
        // disableSortBy: true
      },
      {
        Header: 'Vendor Rate',
        accessor: 'vendorRate'
        // disableSortBy: true
      },
      {
        Header: 'Vendor Penalty',
        accessor: 'vendorPenalty'
        // disableSortBy: true
      },
      {
        Header: 'Driver Guard Price',
        accessor: 'driverGuardPrice'
        // disableSortBy: true
      },
      {
        Header: 'Driver Rate',
        accessor: 'driverRate'
        // disableSortBy: true
      },
      {
        Header: 'Driver Penalty',
        accessor: 'driverPenalty'
        // disableSortBy: true
      },
      {
        Header: 'Add On Rate',
        accessor: 'addOnRate'
        // disableSortBy: true
      },
      {
        Header: 'MCD Charge',
        accessor: 'mcdCharge'
        // disableSortBy: true
      },
      {
        Header: 'Toll Charge',
        accessor: 'tollCharge'
        // disableSortBy: true
      }
    ],
    []
  );

  const downloadReports = useCallback(() => {
    alert('Download Report');
    console.log('Data = ', companyReportData);
  }, []);

  return (
    <>
      {companyReportData && companyReportData.length > 0 ? (
        <MainCard>
          <Stack gap={2}>
            {/* Header */}
            <Stack direction={'row'} justifyContent={'flex-end'} gap={2}>
              <Button variant="contained" startIcon={<DocumentDownload />} color="secondary" onClick={downloadReports}>
                Download Report
              </Button>
            </Stack>

            {/* Table */}
            <ReactTable columns={columns} data={companyReportData} />
          </Stack>
        </MainCard>
      ) : (
        <TableNoDataMessage text="No Data Found" />
      )}
    </>
  );
};

export default Table;
