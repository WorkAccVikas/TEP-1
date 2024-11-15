import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, Grid, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, Stack, Typography } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';

// assets
import { ArrowDown, ArrowSwapHorizontal, ArrowUp, Chart, HomeTrendUp, ShoppingCart } from 'iconsax-react';

// ==============================|| CHART ||============================== //

const EcommerceDataChart = ({ data }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    fill: {
      opacity: [1, 0.5]
    },
    grid: {
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => '₹ ' + val + ' thousands'
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary.main],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        },
        axisBorder: {
          show: false,
          color: line
        },
        axisTicks: {
          show: false
        },
        tickAmount: 11
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      legend: {
        labels: {
          colors: 'secondary.main'
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series, setSeries] = useState(data);

  useEffect(() => {
    setSeries(data);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="bar" height={250} />;
};

EcommerceDataChart.propTypes = {
  data: PropTypes.array
};

// ==============================|| CHART WIDGET - PROJECT ANALYTICS ||============================== //

export default function OverviewGraph() {
  const [age, setAge] = useState('20');

  const chartData = [
    [
      {
        name: 'Total Balance',
        data: [76, 85, 101, 98, 87, 105, 91]
      },
      {
        name: 'Outstanding Receivable',
        data: [44, 55, 57, 56, 61, 58, 63]
      }
    ],
    [
      {
        name: 'Total Balance',
        data: [80, 101, 90, 65, 120, 105, 85]
      },
      {
        name: 'Outstanding Receivable',
        data: [45, 30, 57, 45, 78, 48, 63]
      }
    ],
    [
      {
        name: 'Total Balance',
        data: [79, 85, 107, 95, 83, 115, 97]
      },
      {
        name: 'Outstanding Receivable',
        data: [48, 56, 50, 54, 68, 53, 65]
      }
    ],
    [
      {
        name: 'Total Balance',
        data: [90, 111, 105, 55, 70, 65, 75]
      },
      {
        name: 'Outstanding Receivable',
        data: [55, 80, 57, 45, 38, 48, 43]
      }
    ]
  ];

  const [data] = useState(chartData[0]);

  const handleChangeSelect = (event) => {
    setAge(event.target.value);
  };

  return (
    <MainCard content={false} title="Company Name">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <Select id="demo-simple-select" value={age} onChange={handleChangeSelect}>
                        <MenuItem value={10}>Last 12 days</MenuItem>
                        <MenuItem value={20}>Last Week</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {/* <IconButton color="secondary" variant="outlined" sx={{ color: 'text.secondary' }}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" variant="outlined" sx={{ color: 'text.secondary' }}>
                    <Maximize4 />
                  </IconButton>
                  <IconButton color="secondary" variant="outlined" sx={{ color: 'text.secondary' }}>
                    <More />
                  </IconButton> */}
                </Stack>
                <EcommerceDataChart data={data} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
                <ListItem
                  divider
                  secondaryAction={
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography variant="subtitle1">-245</Typography>
                      <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArrowDown style={{ transform: 'rotate(45deg)' }} size={14} /> 10.6%
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                      <Chart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color="text.secondary">Outstanding Receivable</Typography>}
                    secondary={<Typography variant="subtitle1">1,800</Typography>}
                  />
                </ListItem>
                <ListItem
                  divider
                  secondaryAction={
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography variant="subtitle1">+2,100</Typography>
                      <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArrowUp style={{ transform: 'rotate(45deg)' }} size={14} /> 30.6%
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                      <HomeTrendUp />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color="text.secondary">Revenue</Typography>}
                    secondary={<Typography variant="subtitle1">₹5,667</Typography>}
                  />
                </ListItem>
                <ListItem
                  divider
                  secondaryAction={
                    <Stack spacing={0.25} alignItems="flex-end">
                      <Typography variant="subtitle1">-26</Typography>
                      <Typography color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ArrowSwapHorizontal size={14} /> 5%
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                      <ShoppingCart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography color="text.secondary">Total Balance</Typography>}
                    secondary={<Typography variant="subtitle1">128</Typography>}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainCard>
  );
}
