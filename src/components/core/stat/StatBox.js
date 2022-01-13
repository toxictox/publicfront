import Chart from "react-apexcharts";
import { Avatar, Box, Card, Divider, Typography } from "@material-ui/core";
import { alpha, useTheme } from "@material-ui/core/styles";

import ChevronDownIcon from "@icons/ChevronDown";
import ChevronUpIcon from "@icons/ChevronUp";

const BarChart = () => {
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: "transparent",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#7783DB"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  const chartSeries = [{ data: [10, 20, 30, 40, 50, 60, 5] }];

  return (
    <Chart options={chartOptions} series={chartSeries} type="bar" width={120} />
  );
};

const StatBox = (props) => {
  const { title, description, status, value } = props;
  return (
    <Card sx={{ height: "100%" }}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <div>
          <Typography color="textPrimary" variant="subtitle2">
            {title}
          </Typography>
          <Typography color="textPrimary" sx={{ mt: 1 }} variant="h5">
            {value}
          </Typography>
        </div>
        <BarChart />
      </Box>

      {status !== undefined ? (
        <>
          <Divider />
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              px: 3,
              py: 2,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: (theme) =>
                  alpha(
                    status
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    0.08
                  ),
                color: status ? "success.main" : "error.main",
                height: 36,
                width: 36,
              }}
            >
              {status === true ? (
                <ChevronUpIcon fontSize="small" />
              ) : (
                <ChevronDownIcon fontSize="small" />
              )}
            </Avatar>

            <Typography color="textSecondary" sx={{ ml: 1 }} variant="caption">
              {description}
            </Typography>
          </Box>
        </>
      ) : null}
    </Card>
  );
};

export default StatBox;
