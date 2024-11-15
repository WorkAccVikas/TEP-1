export const MandatoryFields = [
    {
        name: 'zoneName',
        headerName: 'Zone Name',
        required: true
      },
      {
        name: 'zoneType',
        headerName: 'Zone Type',
        required: true
      },
      {
        name: 'vehicleType',
        headerName: 'Vehicle Type',
        required: true
      },
      {
        name: 'tripType',
        headerName: 'Trip Type',
        required: true
      },
      {
        name: 'location',
        headerName: 'Location',
        required: false,
        defaultValue: ''
      },
      

    {
      name: 'tripDate',
      headerName: 'Trip Date',
      required: true,
      defaultValue: '2022-12-12T00:00:00.000'
    },
    {
      name: 'tripTime',
      headerName: 'Trip Time',
      required: true
    },
  
    
  
   
    {
      name: 'guard',
      headerName: 'Guard',
      required: false,
      defaultValue: 0
    },
    {
      name: 'guardPrice',
      headerName: 'Guard Price',
      required: false,
      defaultValue: 0
    },
    {
      name: 'vehicleNumber',
      headerName: 'Vehicle Number',
      required: false,
      defaultValue: ''
    },
    {
      name: 'vehicleRate',
      headerName: 'Vehicle Rate',
      required: false,
      defaultValue: 0
    },
    {
      name: 'addOnRate',
      headerName: 'Add On Rate',
      required: false,
      defaultValue: 0
    },
    {
      name: 'penalty',
      headerName: 'Penalty',
      required: false,
      defaultValue: 0
    },
    {
      name: 'remarks',
      headerName: 'Remarks',
      required: false,
      defaultValue: ''
    }
  ];