import Error500 from 'pages/maintenance/error/500';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ZoneTypeTable from 'sections/cabprovidor/master/zoneType/ZoneTypeTable';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
const ZoneType = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { zoneTypes, loading, error } = useSelector((state) => state.zoneType);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    dispatch(fetchAllZoneTypes());
  }, [dispatch, updateKey]);

  // if (loading) return <TableSkeleton rows={10} columns={5} />;
  // if (error) return <Error500 />;
  // if (zoneTypes.length === 0) return <EmptyTableDemo />;

  return (
    <ZoneTypeTable
      data={zoneTypes}
      updateKey={updateKey}
      setUpdateKey={setUpdateKey}
      loading={loading}
    />
  );
};

export default ZoneType;
