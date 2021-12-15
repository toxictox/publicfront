import Chart from "react-apexcharts";
import {
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";

const StackedChart = (props) => {
  const theme = useTheme();
  const { title } = props;

  const [chart, setChart] = useState({});

  useEffect(async () => {
    await axios
      .get(`${app.api}/board/trx/chart/7`)
      .then((response) => setChart(response.data));
  }, []);

  const getDates = () => {
    let arr = [];
    for (let key in chart.topRejectCodes) {
      arr.push(key);
    }

    return arr;
  };

  const getDataFromResponse = () => {
    let dirtyData = [];
    // for (let date in chart.topRejectCodes) {
    //   for(let code in chart.topRejectCodes[date]){
    //     if(code)
    //   }
    // }
    //
    // return {
    //   category,
    //   success,
    //   fail,
    // };
  };

  const chartOptions = {
    chart: {
      background: "transparent",

      stacked: true,
      stackType: "100%",
      toolbar: {
        show: true,
      },
      type: "bar",
    },

    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    // legend: {
    //   horizontalAlign: "left",
    //   offsetX: -20,
    //   offsetY: 5,
    //   position: "bottom",
    // },
    fill: {
      opacity: 1,
    },

    markers: {
      strokeColors: theme.palette.background.paper,
      size: 0,
    },

    xaxis: {
      categories: [...getDates()],
    },
  };

  const chartSeries = [
    {
      name: "2000",
      data: [44, 55, 41, 67, 22, 43],
    },
    {
      name: "2500",
      data: [13, 23, 20, 8, 13, 0],
    },
    {
      name: "3000",
      data: [11, 17, 15, 15, 21, 14],
    },
    {
      name: "4000",
      data: [21, 7, 25, 13, 22, 8],
    },
  ];

  return (
    <Card {...props}>
      <CardHeader sx={{ marginX: 2, marginTop: 1 }} title={title} />
      <CardContent>
        <Chart
          height="360"
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </CardContent>
    </Card>
  );
};

export default StackedChart;
