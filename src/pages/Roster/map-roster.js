import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { read, utils } from 'xlsx'; // Ensure you have xlsx library installed
import Dialog from '@mui/material/Dialog';
import axiosServices from 'utils/axios';
import CustomCircularLoader from 'components/CustomCircularLoader';
import ColumnMappingForm, { DEFAULT_VALUE_OPTIONAL, DEFAULT_VALUE_REQUIRED } from 'sections/cabprovidor/roster/forms/ColumnMappingForm';
import { RawRosterTable } from 'sections/cabprovidor/roster/RawRosterTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Button, Stack } from '@mui/material';
import { isNotEmptyObject } from 'utils/helper';
import { excelDateToJSDate, excelTimeToJSFormattedTime, isExcelDate } from 'utils/roster-mapping-helpers';
import { ExportCircle } from 'iconsax-react';
import { dispatch } from 'store';
import { uploadRosterData } from 'store/slice/cabProvidor/rosterDataSlice';
import { useSelector } from 'react-redux';
import TableSkeleton from 'components/tables/TableSkeleton';

const MapRosterFile = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { fileData } = location.state || {};

  console.log('filedata', fileData);
  const [loading, setLoading] = useState(true);
  const [excelSheetHeaders, setExcelSheetHeaders] = useState(null);
  const [openMappingDialoge, setOpenMappingDialoge] = useState(false); // Initially false
  const [mappedColumn, setMappedColumn] = useState([]);
  const [value, setValue] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { loading: dataUploadLoading } = useSelector((state) => state.rosterData);

  const mappedColumnRef = useRef(mappedColumn);
  useEffect(() => {
    mappedColumnRef.current = mappedColumn;
  }, [mappedColumn]);

  // Paginated data state
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const mappedHeaders = useRef({}); // Use useRef for mappedHeaders

  const handlePageChange = useCallback((value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  // Memoized fetchAndConvertFile function
  const fetchAndConvertFile = useCallback(async (data) => {
    setLoading(true);
    try {
      // Fetch the URL from the server
      const response = await axiosServices.get(`cabProvider/rosterurl?rosterId=${data._id}`);
      const fileUrl = response.data.rosterData.rosterUrl;
      // console.log(fileUrl);

      if (fileUrl) {
        // Fetch the file and convert it to a blob
        const res = await fetch(fileUrl);
        const blob = await res.blob();

        // Create a File object from the blob
        const file = new File([blob], 'rosterData.xlsx', {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          lastModified: Date.now() // You can adjust the last modified date as needed
        });
        setSelectedFile(file);
        // Log the file and fetch headers
        return file;
      } else {
        console.warn('No file URL found'); // Warn if no URL is found
      }
    } catch (error) {
      console.error('Error fetching or converting the file:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHeadersFromExcel = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const rows = utils.sheet_to_json(worksheet, { header: 1, raw: true });

      if (rows.length > 0) {
        const headers = rows[0]; // First row is headers
        setExcelSheetHeaders(headers);
        setOpenMappingDialoge(true); // Open dialog when headers are set
      } else {
        console.warn('No headers found in rows'); // Warn if no headers found
        setOpenMappingDialoge(false); // Close dialog if no headers
      }
    } catch (error) {
      console.error('Error fetching headers:', error);
      setOpenMappingDialoge(false); // Close dialog on error
    }
  };

  const formatExcelData = async (blob, selectedColumns, unselectedColumns = {}) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const rows = utils.sheet_to_json(worksheet, { header: 1, raw: true });
      const fileData = [];
      const headers = rows[0]; // First row is headers
      let indices = selectedColumns.map((col) => headers.indexOf(col));

      if (Object.keys(unselectedColumns).length > 0) {
        const x = Object.keys(unselectedColumns).map(Number);
        indices.push(...x);
      }

      for (let i = 1; i < rows.length; i++) {
        const rowData = {};
        const row = rows[i];
        indices.forEach((index, idx) => {
          const cellValue = row[index];

          if (typeof cellValue === 'undefined') {
            rowData[mappedHeaders.current[selectedColumns[idx]] || unselectedColumns[index]] =
              DEFAULT_VALUE_REQUIRED[mappedHeaders.current[selectedColumns[idx]]] ?? DEFAULT_VALUE_OPTIONAL?.[unselectedColumns?.[index]];
          } else if (isExcelDate(cellValue)) {
            // Convert Excel date number to JavaScript Date
            rowData[mappedHeaders.current[selectedColumns[idx]] || unselectedColumns[index]] = excelDateToJSDate(cellValue); // Convert Excel date
          } else if (cellValue > 0 && cellValue < 1) {
            // If the cell contains an Excel time fraction (between 0 and 1)
            rowData[mappedHeaders.current[selectedColumns[idx]] || unselectedColumns[index]] = excelTimeToJSFormattedTime(cellValue); // Convert Excel time fraction to HH:mm
          } else {
            // Otherwise, treat it as a regular cell value
            rowData[mappedHeaders.current[selectedColumns[idx]] || unselectedColumns[index]] =
              cellValue || DEFAULT_VALUE_OPTIONAL?.[unselectedColumns?.[index]];
          }
        });

        fileData.push(rowData); // Push row data
      }

      return fileData;
    } catch (error) {
      console.log('Error in formatExcelData:', error);
      throw error; // Throw error to be handled in parseSheetData
    }
  };

  const parseSheetData = useCallback(async (file) => {
    try {
      setLoading(true);
      await fetchHeadersFromExcel(file);
      const formattedData = await formatExcelData(file, mappedColumnRef.current);
      setValue(formattedData.filter(isNotEmptyObject));
      setCount(formattedData.length);
    } catch (error) {
      console.log('Error in parseSheetData:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  const uploadTRoasterDB = async () => {
    if (value.length > 0 && fileData) {
      const tripsData = value;
      const companyId = fileData.companyId;
      const file_id = fileData._id;
      const payload = {
        data: {
          companyID: companyId,
          tripsData: tripsData
        }
      };

      const resultAction = dispatch(uploadRosterData({ data: payload, file_id: file_id }));
      if (uploadRosterData.fulfilled.match(resultAction)) {
        navigate(-2);
      }
    }
  };
  // Navigate back if fileData is not available
  useEffect(() => {
    const fetchFileData = async () => {
      if (!fileData) {
        navigate(-1); // Navigate back to the previous page
      } else {
        const file = await fetchAndConvertFile(fileData);
        console.log(file);
        if (file) {
          parseSheetData(file);
        }
      }
    };

    fetchFileData(); // Call the async function
  }, [fileData, navigate, fetchAndConvertFile, parseSheetData]);

  if (loading) return <CustomCircularLoader />;
  if (dataUploadLoading) return <TableSkeleton rows={value.length > 9 ? 10 : value.length} columns={9} />;
  return (
    <>
      {value.length > 0 && !openMappingDialoge && (
        <>
          <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button variant="contained" startIcon={<ExportCircle />} onClick={uploadTRoasterDB}>
                Upload
              </Button>
            </Stack>
          </Stack>
          <MainCard content={false}>
            <ScrollX>
              <RawRosterTable
                count={count}
                items={value}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
              />
            </ScrollX>
          </MainCard>
        </>
      )}

      <Dialog
        open={openMappingDialoge}
        onClose={() => setOpenMappingDialoge(false)}
        maxWidth="xl"
        PaperProps={{
          style: { width: '80%', maxWidth: '600px' }
        }}
      >
        <ColumnMappingForm
          columns={excelSheetHeaders}
          handleClose={() => setOpenMappingDialoge(false)}
          handleOk={async (obj, unselectedColumns) => {
            const selectedColumns = Object.keys(obj);
            setMappedColumn(selectedColumns);
            mappedHeaders.current = obj;
            const formattedData = await formatExcelData(selectedFile, selectedColumns, unselectedColumns);
            // console.log('formattedData = ', formattedData);
            setValue(formattedData);
            setCount(formattedData.length);
            setLoading(false);
            setOpenMappingDialoge(false);
          }}
        />
        {/* You can add more content to the dialog here */}
      </Dialog>
    </>
  );
};

export default MapRosterFile;
