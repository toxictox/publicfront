import Chart from "react-apexcharts";
import {
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";

const PieStat = (props) => {
  const theme = useTheme();
  const { title, data } = props;

  const [chart, setChart] = useState({});

  useEffect(async () => {
    await axios
      .get(`${app.api}/board/trx/chart/7`)
      .then((response) => setChart(response.data));
  }, []);

  const chartOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Visa", "Mastercard"],
    legend: {
      position: "bottom",
      height: 50,
    },
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 200,
    //       },
    //       legend: {
    //         position: "bottom",
    //       },
    //     },
    //   },
    // ],
  };

  return (
    <Card {...props} sx={{ height: "100%" }}>
      <CardHeader sx={{ marginX: 2, marginTop: 1 }} title={title} />
      <CardContent>
        <Chart
          options={chartOptions}
          series={[data.countVisa, data.countMaster]}
          type="pie"
        />
      </CardContent>
    </Card>
  );
};

export default PieStat;
