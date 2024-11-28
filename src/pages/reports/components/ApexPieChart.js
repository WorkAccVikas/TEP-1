import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';

// assets

// ==============================|| CHART ||============================== //

export const ApexPieChart = ({ labels, series }) => {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const mode = theme.palette.mode;

  const { primary } = theme.palette.text;
  const line = theme.palette.divider;
  const grey200 = theme.palette.secondary[200];
  const backColor = theme.palette.background.paper;

  const pieChartOptions = {
    chart: {
      type: 'pie'
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: true
    },
    labels,
    legend: {
      show: false
    }
  };

  const [options, setOptions] = useState(pieChartOptions);

  useEffect(() => {
    const primaryMain = theme.palette.primary.main;
    const primaryLight = theme.palette.primary[200];
    const secondary = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary[400];
    const secondaryDark = theme.palette.secondary.dark;
    const secondaryDarker = theme.palette.secondary[200];

    setOptions((prevState) => ({
      ...prevState,
      colors: [primaryMain, primaryLight, secondaryLight, secondary, secondaryDark, secondaryDarker],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false
      },
      grid: {
        borderColor: line
      },
      stroke: {
        colors: [backColor]
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, line, grey200, backColor, theme]);

  const isDataEmpty = series.every((value) => value === 0);
  const updatedOptions = {
    ...options,
    chart: {
      ...options.chart,
      background: isDataEmpty ? '#f0f0f0' : 'transparent', // Set grey background if data is empty
    },
    fill: {
      colors: isDataEmpty ? ['#d3d3d3'] : options.fill?.colors || undefined, // Grey color if empty
    },
    labels: isDataEmpty ? ['No Data Found'] : options.labels, // Remove labels if data is empty
    tooltip: {
      enabled: true, // Disable tooltip when data is empty
    },
  };
  return (
    <div id="chart">
      <ReactApexChart options={updatedOptions} series={isDataEmpty ? [13] : series} type="pie" height={downSM ? 280 : 350}  />
    </div>
  );
};

// PropTypes validation
ApexPieChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of strings
  series: PropTypes.arrayOf(PropTypes.number).isRequired // Array of numbers
};
