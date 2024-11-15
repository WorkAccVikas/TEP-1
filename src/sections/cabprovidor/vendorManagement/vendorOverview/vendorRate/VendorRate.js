import { forwardRef, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

// assets
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  useTheme
} from '@mui/material';
import { Edit, Trash } from 'iconsax-react';
import { ThemeMode } from 'config';
import Draggable from 'react-draggable';
import { openSnackbar } from 'store/reducers/snackbar';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import VendorRateForm from './VendorRateForm';
import { CSVExport } from 'components/tables/reactTable2/ReactTable';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import { fetchAllVehicleTypes } from 'store/slice/cabProvidor/vehicleTypeSlice';
import CompanyRateReactTable from './CompanyRateReactTable';
import axiosServices from 'utils/axios';

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const PaperComponent = forwardRef((props, ref) => (
  <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper
      ref={ref}
      {...props}
      sx={{ width: '80vw', maxWidth: '800px' }} // Set width and maxWidth here
    />
  </Draggable>
));

const token = localStorage.getItem('serviceToken');

const VendorRate = ({ onClose, companyName }) => {
  const [searchParams] = useSearchParams();
  const companyID = searchParams.get('company');
  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [open, setOpen] = useState(false); // State to handle dialog visibility
  const [companyRate, setCompanyRate] = useState([]);
  const [initalFormData, setInitialFormData] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllVehicleTypes());
    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
  }, [dispatch]);

  const vehicleTypeList = useSelector((state) => state.vehicleTypes.vehicleTypes) || [];
  const zoneTypeList = useSelector((state) => state.zoneType.zoneTypes) || [];
  const zones = useSelector((state) => state.zoneName.zoneNames) || [];

  const optionsForCabRate = [
    { value: 0, label: 'Trip Basis' },
    { value: 1, label: 'Km Basis' },
    { value: 2, label: 'Fixed Charges' }
  ];

  const getCabRateLabel = (value) => {
    const option = optionsForCabRate.find((option) => option.value === value);
    return option ? option.label : 'Unknown'; // fallback if no match
  };

  const optionsForDualTrip = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' }
  ];

  const getDualTripLabel = (value) => {
    const option = optionsForDualTrip.find((option) => option.value === value);
    return option ? option.label : 'Unknown'; // fallback if no match
  };

  const handleClickOpen = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setInitialFormData({});
    setOpen(false); // Close the dialog
  };

  const handleFormSubmit = async (formValues) => {
    if (formValues.billingCycle === 'Custom') {
      formValues.billingCycle = formValues.customBillingCycle;
    }
    setCompanyRate([...companyRate, formValues]);
    // handleClose();
  };

  const handleSaveRate = async () => {
    const formValues = companyRate.map((item) => {
      return {
        zoneNameID: item.zoneNameID,
        zoneTypeID: item.zoneTypeID,
        cabRate: item.cabRate,
        cabAmount: item.cabAmount,
        dualTrip: item.dualTrip,
        dualTripAmount: item.dualTripAmount,
        guard: item.guard,
        guardPrice: item.guardPrice,
        selectedVehicleTypes: item.selectedVehicleTypes.map((vt) => ({
          id: vt._id,
          name: vt.vehicleTypeName
        })),
        vehicleAmounts: item.vehicleAmounts,
        vehicleAmountsDualTrip: item.vehicleAmountsDualTrip,
        billingCycle: item.billingCycle
      };
    });

    try {
      // Replace the URL with your API endpoint
      const response = await axiosServices.post(
        `/company/add/rates`,
        {
          data: {
            companyID: companyID,
            ratesForCompany: formValues // Directly passing formValues here
          }
        }
      );

      if (response.status === 201) {
        // Add the new rate to the existing data
        setData((prevData) => [...prevData, ...response.data.data]);

        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
      }

      setOpen(false); // Close the dialog after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDeleteRate = (rowIndex) => {
    setCompanyRate((prevRates) => prevRates.filter((_, index) => index !== rowIndex));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Zone Name',
        accessor: 'zoneNameID',
        Cell: ({ value }) => {
          const zoneType = zones.find((item) => item._id === value);
          return zoneType ? zoneType.zoneName : 'Unknown';
        }
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneTypeID',
        Cell: ({ value }) => {
          const zoneType = zoneTypeList.find((item) => item._id === value);
          return zoneType ? zoneType.zoneTypeName : 'Unknown';
        }
      },
      {
        Header: 'Cab Rate',
        accessor: 'cabRate',
        dataType: 'text',
        Cell: ({ value }) => {
          const label = getCabRateLabel(value);
          return <Chip label={label} color={value === 1 ? 'success' : value === 2 ? 'info' : 'warning'} variant="light" size="small" />;
        }
      },
      {
        Header: 'Amount',
        accessor: 'cabAmount',
        dataType: 'text',
        Cell: ({ value }) => {
          return (
            <Table>
              <TableBody>
                {value.map((item) => {
                  const vehicle = vehicleTypeList.find((item1) => item1._id === item.vehicleTypeID);
                  return (
                    <>
                      {vehicle && (
                        <TableRow key={item._id}>
                          <TableCell>
                            {vehicle.vehicleTypeName}
                            {'=>'} <b> ₹ {item.amount}</b>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          );
        }
      },
      {
        Header: 'Dual Trip',
        accessor: 'dualTrip',
        dataType: 'text',
        Cell: ({ value }) => {
          const label = getDualTripLabel(value);
          return (
            <Chip
              label={label}
              color={value === 1 ? 'success' : 'error'} // 'Yes' is primary, 'No' is default
              variant="light"
              size="small"
            />
          );
        }
      },
      {
        Header: 'Dual Trip Amount',
        accessor: 'dualTripAmount',
        dataType: 'text',
        Cell: ({ value }) => {
          return (
            <Table>
              <TableBody>
                {value.map((item) => {
                  const vehicle = vehicleTypeList.find((item1) => item1._id === item.vehicleTypeID);
                  return (
                    <>
                      {vehicle && (
                        <TableRow key={item._id}>
                          <TableCell>
                            {vehicle.vehicleTypeName}
                            {'=>'} <b> ₹ {item.amount}</b>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          );
        }
      },
      {
        Header: 'Guard',
        accessor: 'guard',
        dataType: 'text',
        Cell: ({ value }) => {
          const label = getDualTripLabel(value);
          return (
            <Chip
              label={label}
              color={value === 1 ? 'success' : 'error'} // 'Yes' is primary, 'No' is default
              variant="light"
              size="small"
            />
          );
        }
      },
      {
        Header: 'Guard Price',
        accessor: 'guardPrice',
        dataType: 'text',
        Cell: ({ row }) => {
          const guardValue = row.original.guard;
          return guardValue === 0 ? '0' : row.original.guardPrice;
        }
      },
      {
        Header: 'Billing Cycle Company',
        accessor: 'billingCycle',
        dataType: 'text'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          const theme = useTheme();
          const mode = theme.palette.mode;
          return (
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Edit"
              >
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInitialFormData(row.original);
                    handleClickOpen();
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Delete"
              >
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRate(row.index);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  const updateData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {}, [companyRate]);

  return (
    <>
      <MainCard title="Company Rates" content={false} secondary={<CSVExport data={data} filename={'cell-editable-table.csv'} />}>
        <ScrollX>
          {companyRate.length !== 0 && (
            <CompanyRateReactTable columns={columns} data={companyRate} updateData={updateData} skipPageReset={skipPageReset} />
          )}
        </ScrollX>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
            <Button color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleClickOpen}>
              Add
            </Button>
            <Button onClick={handleSaveRate} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
              Save
            </Button>
          </Stack>
        </Grid>
      </MainCard>

      <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
        <DialogTitle id="draggable-dialog-title">Add New Rate for {companyName}</DialogTitle>
        <DialogContent sx={{ scrollbarWidth: 'none' }}>
          <VendorRateForm
            zones={zones}
            zoneTypeList={zoneTypeList}
            vehicleTypeList={vehicleTypeList}
            onSubmit={handleFormSubmit}
            onClose={handleClose}
            initialData={initalFormData}
            companyName={companyName}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorRate;
