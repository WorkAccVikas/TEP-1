import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const UpdateTitle = () => {
  // Access the title from the Redux state
  const title = useSelector((state) => state.accountSettings.settings?.title);

  useEffect(() => {
    // Update the document title
    if (title) {
      document.title = `Sewak Travels - ${title}`;
    }
  }, [title]); // Dependency array ensures this runs when 'title' changes

  return null; // This component doesn't render anything
};

export default UpdateTitle;
