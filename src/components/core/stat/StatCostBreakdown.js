import Chart from "react-apexcharts";
import numeral from "numeral";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const data = {
  series: [
    {
      color: "#FFB547",
      data: 10859,
      label: "Отказ",
    },
    {
      color: "#7BC67E",
      data: 35690,
      label: "В ожидании",
    },
    {
      color: "#7783DB",
      data: 95020,
      label: "Прибыль",
    },
  ],
};

const FinanceCostBreakdown = (props) => {
  const theme = useTheme();
  const { title } = props;

  const chartOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: data.series.map((item) => item.color),
    dataLabels: {
      enabled: false,
    },
    labels: data.series.map((item) => item.label),
    legend: {
      show: false,
    },
    stroke: {
      colors: [theme.palette.background.paper],
      width: 1,
    },
    theme: {
      mode: theme.palette.mode,
    },
  };

  const chartSeries = data.series.map((item) => item.data);

  return (
    <Card {...props}>
      <CardHeader title={title} />
      <CardContent>
        <Chart
          height="300"
          options={chartOptions}
          series={chartSeries}
          type="pie"
        />
        {data.series.map((item) => (
          <Box
            key={item.label}
            sx={{
              alignItems: "center",
              display: "flex",
              p: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: item.color,
                borderRadius: "50%",
                height: 8,
                width: 8,
              }}
            />
            <Typography color="textPrimary" sx={{ ml: 2 }} variant="subtitle2">
              {item.label}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography color="textSecondary" variant="subtitle2">
              {numeral(item.data).format("$0,0.00")}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default FinanceCostBreakdown;
