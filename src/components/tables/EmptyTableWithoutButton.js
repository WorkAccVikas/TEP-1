// material-ui
import { Table, TableBody, TableHead } from '@mui/material';

// third-party
// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { EmptyTable } from 'components/third-party/ReactTable';

// ==============================|| REACT TABLE - EMPTY ||============================== //

const EmptyTableWithoutButton = () => {
  return (
    <>
      <MainCard content={false}>
        <ScrollX>
          <Table>
            <TableHead sx={{ borderTopWidth: 2 }}></TableHead>
            <TableBody>
              <EmptyTable msg="No Data" colSpan={7} />
            </TableBody>
          </Table>
        </ScrollX>
      </MainCard>
    </>
  );
};

export default EmptyTableWithoutButton;
