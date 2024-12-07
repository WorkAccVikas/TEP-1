import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import moment from 'moment';
import DateRangeSelect2, { DATE_RANGE_OPTIONS } from 'components/DateRange/DateRangeSelect';
import useDateRange from 'hooks/useDateRange';

const One = () => {
  const [count, setCount] = useState(10);
  const { startDate, endDate, range, setRange, handleRangeChange } = useDateRange();

  useEffect(() => {
    console.log('API calling for startDate and endDate', startDate, endDate);
    console.log('API CALLING ...............');
    const payload = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    };
    alert(JSON.stringify(payload, null, 2));
  }, [startDate, endDate]);

  return (
    <>
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
        <Button variant="contained" onClick={() => setCount(count + 1)} color="success">
          Count: {count}
        </Button>

        <DateRangeSelect2
          startDate={startDate}
          endDate={endDate}
          selectedRange={range}
          setSelectedRange={setRange}
          onRangeChange={handleRangeChange}
          showSelectedRangeLabel
        />
      </Stack>

      {startDate && endDate && (
        <div style={{ marginTop: 16 }}>
          <Typography variant="body2">Start Date: {moment(startDate).format('YYYY-MM-DD')}</Typography>
          <Typography variant="body2">End Date: {moment(endDate).format('YYYY-MM-DD')}</Typography>
        </div>
      )}
    </>
  );
};

export default One;
