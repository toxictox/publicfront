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
    for (let key in chart.topRejectCodes.daily) {
      arr.push(key);
    }

    return arr;
  };

  const getDataByCode = (code) => {
    let data = [];
    for (let key in chart.topRejectCodes.daily) {
      if (code in chart.topRejectCodes.daily[key]) {
        data.push(chart.topRejectCodes.daily[key][code]);
      } else {
        data.push(0);
      }
    }

    return data;
  };

  const getDataFromResponse = () => {
    let arr = [];
    if (chart.topRejectCodes === undefined) return [];
    chart.topRejectCodes.codes.map((code) => {
      arr.push({
        name: code,
        data: getDataByCode(code),
      });
    });

    return arr;
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

  const chartSeries = [...getDataFromResponse()];

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
