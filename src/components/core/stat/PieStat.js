import Chart from "react-apexcharts";
import { Card, CardContent, CardHeader } from "@material-ui/core";

const PieStat = (props) => {
  const { title, data } = props;

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
