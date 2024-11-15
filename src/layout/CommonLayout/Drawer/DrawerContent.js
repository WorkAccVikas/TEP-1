import PropTypes from 'prop-types';

// project-imports
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRWAER - CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      height: { xs: 'calc(100vh - 70px)', md: 'calc(100% - 70px)' },
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column'
      }
    }}
  ></SimpleBar>
);

DrawerContent.propTypes = {
  searchValue: PropTypes.string
};

export default DrawerContent;
