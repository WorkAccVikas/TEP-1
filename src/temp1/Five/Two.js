import useBeforeUnloadAlert from 'hooks/useBackButtonAlert';
import React, { useState } from 'react';

const Two = () => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  useBeforeUnloadAlert(isFormDirty);

  return (
    <div>
      <h1>Form Page</h1>
      <input type="text" onChange={() => setIsFormDirty(true)} placeholder="Type something..." />
    </div>
  );
};

export default Two;
