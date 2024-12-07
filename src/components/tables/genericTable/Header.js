import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import { CSVExport } from 'components/third-party/ReactTable';
import DebouncedSearch from 'components/textfield/DebounceSearch';

const Header = ({
  search = false,
  exportFile = false,
  OtherComp = () => null, // Default component
  data = [],
  searchTerm,
  onSearchChange,
  handleSearch
}) => {
  return (
    <>
      <Stack direction="row" justifyContent={search ? 'space-between' : 'flex-end'}>
        {search && (
          <>
            <DebouncedSearch search={searchTerm} onSearchChange={onSearchChange} handleSearch={handleSearch} />
          </>
        )}

        <Stack direction={'row'} spacing={2} alignItems={'center'} gap={2}>
          {OtherComp && <OtherComp />}

          {exportFile && <CSVExport data={data} filename={'customer-list.csv'} />}
        </Stack>
      </Stack>
    </>
  );
};

// PropTypes definition
Header.propTypes = {
  search: PropTypes.bool, // If the search component should be shown
  exportFile: PropTypes.bool, // If the export file button should be shown
  OtherComp: PropTypes.elementType, // A component to be rendered as a prop
  data: PropTypes.arrayOf(PropTypes.object), // Data for CSV export
  searchTerm: PropTypes.string, // Current search term
  onSearchChange: PropTypes.func, // Handler for search term change
  handleSearch: PropTypes.func // Handler for debounce search
};

export default Header;

/** SUMMARY :
 *  - search box is configurable
 *  - if you want to display Buttons and other then pass OtherComp
 */
