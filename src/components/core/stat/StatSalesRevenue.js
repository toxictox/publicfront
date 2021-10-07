import Chart from "react-apexcharts";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";

const FinanceSalesRevenue = (props) => {
  const theme = useTheme();
  const { title } = props;

  const [chart, setChart] = useState({});

  useEffect(async () => {
    await axios
      .get(`${app.api}/board/trx/chart/30`)
      .then((response) => setChart(response.data));
  }, []);

  const getDataFromResponse = () => {
    let category = [];
    let success = [];
    let fail = [];
    for (let key in chart.trxHistory) {
      category.push(key);
      success.push(chart.trxHistory[key].successSum);
      fail.push(chart.trxHistory[key].failSum);
    }

    return {
      category,
      success,
      fail,
    };
  };

  const chartOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: true,
      },
    },
    colors: ["green", "red"],
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    markers: {
      strokeColors: theme.palette.background.paper,
      size: 6,
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: getDataFromResponse().category,
    },
  };

  const chartSeries = [
    {
      name: "Сумма успешные транзакций",
      data: getDataFromResponse().success,
    },
    {
      name: "Сумма отказных транзакций",
      data: getDataFromResponse().fail,
    },
  ];

  return (
    <Card {...props}>
      <CardHeader title={title} />
      <CardContent>
        <Chart
          height="360"
          options={chartOptions}
          series={chartSeries}
          type="area"
        />
      </CardContent>
    </Card>
  );
};

export default FinanceSalesRevenue;
