import { Button, Chip, Stack } from '@mui/material';
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
  const { advanceReportData } = useSelector((state) => state.report);

  const columns = useMemo(
    () => [
  
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'User Type',
        accessor: 'isDriver',
        Cell: ({ row }) => {
          const isDriver = row.original.isDriver;
          return <Chip label={isDriver ? 'Driver' : 'Vendor'} color={isDriver ? 'primary' : 'info'} variant="light" size="small" />;
        }
      },
      {
        Header: 'Requested By',
        accessor: 'requestedById.userName'
      },
      {
        Header: 'Contact Number',
        accessor: 'advanceTypeId.contactNumber',
         Cell: ({ value }) => value || 'None'
      },
      {
        Header: 'Vehicle Number',
        accessor: 'totalVehicleList',
        Cell: ({ row }) => {
          console.log(row.original.totalVehicleList);
          const vehicleArray = row.original.totalVehicleList;
          return vehicleArray.length === 1 ? (
            vehicleArray[0].vehicleNumber
          ) : (
            <Chip label={'Muliple Vehicle'} color={'info'} variant="light" size="small" />
          );
        }
      },
      {
        Header: 'Advance Type',
        accessor: 'advanceTypeId.advanceTypeName',
         Cell: ({ value }) => value || 'None'
      },
      {
        Header: 'Interest Rate',
        accessor: 'advanceTypeId.interestRate',
        Cell: ({ value }) => {
          return value ? `${value}%` : 'N/A';
        }
      },
      {
        Header: 'Requested Amount',
        accessor: 'requestedAmount'
      },
      {
        Header: 'Requested Interest',
        accessor: 'companyGuardPrice',
        Cell: ({ row }) => {
          const requestedAmount = row.original.requestedAmount;
          const interestRate = row.original.advanceTypeId?.interestRate;
          return requestedAmount && interestRate ? `${(requestedAmount * interestRate) / 100}` : 'N/A';
        }
      },
      {
        Header: 'Approved Amount',
        accessor: 'approvedAmount'
      },
      {
        Header: 'Approved Interest',
        accessor: 'companyPenalty',
        Cell: ({ row }) => {
          const approvedAmount = row.original.approvedAmount;
          const interestRate = row.original.advanceTypeId?.interestRate;
          return approvedAmount && interestRate ? `${(approvedAmount * interestRate) / 100}` : 'N/A';
        }
      },
      {
        Header: 'Approved By',
        accessor: 'approvedBy.userName'
      }
    ],
    []
  );

  return (
    <>
      {advanceReportData && advanceReportData.length > 0 ? (
        <MainCard content={false}>
          <Stack gap={2}>
            <ReactTable columns={columns} data={advanceReportData} />
          </Stack>
        </MainCard>
      ) : (
        <EmptyTableDemo />
      )}
    </>
  );
};

export default Table;
