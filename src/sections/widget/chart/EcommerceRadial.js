import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';

// ==============================|| CHART ||============================== //

const EcommerceDataChart = ({ color }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '60%',
          background: 'transparent',
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front'
        },
        track: {
          background: alpha(color, 0.5),
          strokeWidth: '50%'
        },

        dataLabels: {
          show: true,
          name: {
            show: false
          },
          value: {
            formatter: (val) => val,
            offsetY: 7,
            color: color,
            fontSize: '20px',
            fontWeight: '700',
            show: true
          }
        }
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [color],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [color, mode, primary, secondary, line, theme]);

  const [series] = useState([30]);

  return <ReactApexChart options={options} series={series} type="radialBar" height={150} />;
};

EcommerceDataChart.propTypes = {
  color: PropTypes.string
};

// ==============================|| CHART WIDGET - ECOMMERCE RADIAL  ||============================== //

const EcommerceRadial = ({ color, title }) => {
  return (
    // <MainCard content={false}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2 }}>
        <Box sx={{ width: 70 }}>
          <EcommerceDataChart color={color} />
        </Box>
        <Stack>
          <Typography>{title}</Typography>
          {/* <Typography variant="subtitle1">$45,890</Typography> */}
        </Stack>
      </Stack>
    // </MainCard>
  );
};

EcommerceRadial.propTypes = {
  color: PropTypes.string
};

export default EcommerceRadial;
