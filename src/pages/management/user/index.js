import { Button, Stack } from '@mui/material';
import WrapperButton from 'components/common/guards/WrapperButton';
import EmptyTableDemo from 'components/tables/EmptyTable';
import Header from 'components/tables/genericTable/Header';
import TableSkeleton from 'components/tables/TableSkeleton';
import { MODULE, PERMISSIONS } from 'constant';
import { usePopup } from 'hooks/usePopup';
import { Add } from 'iconsax-react';
import Error500 from 'pages/maintenance/error/500';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import UserTable from 'sections/cabprovidor/userManagement/UserTable';
import { fetchUsers } from 'store/slice/cabProvidor/userSlice';

/* eslint-disable no-unused-vars */

const User = () => {
  const dispatch = useDispatch();
  const { users, metaData, loading, error } = useSelector((state) => state.users);
  const { open, handleClose, handleOpen } = usePopup();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lastPageIndex = metaData.lastPageNo;

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [page, limit, dispatch]);

  const handleLimitChange = useCallback((event) => {
    setLimit(+event.target.value);
    setPage(1);
  }, []);

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  // if (users.length === 0) return <EmptyTableDemo />;

  return (
    <>
      <Stack gap={1} spacing={1}>
        {/* <Header OtherComp={() => <ButtonComponent />} /> */}
        <UserTable data={users} page={page} setPage={setPage} limit={limit} setLimit={handleLimitChange} lastPageNo={lastPageIndex} loading={loading}/>
      </Stack>
    </>
  );
};

export default User;

// const ButtonComponent = () => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <Stack direction="row" spacing={1} alignItems="center">
//         <WrapperButton moduleName={MODULE.USER} permission={PERMISSIONS.CREATE}>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             size="small"
//             onClick={() => navigate('/management/user/add-user', { state: { from: '/' } })}
//           >
//             Add User
//           </Button>
//         </WrapperButton>
//       </Stack>
//     </>
//   );
// };
