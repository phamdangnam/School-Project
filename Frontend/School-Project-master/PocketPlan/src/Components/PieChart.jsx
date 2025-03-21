import { Chart } from "react-google-charts";
import { AppContext } from "../AppProvider";
import { useContext } from "react";

const PieChart = () => {
  const { categories, amount } = useContext(AppContext);
  const categoryData = categories.map((e) => [
    e.category,
    Number((e.percentage * amount) / 100),
  ]);

  const data = [["Category", "Percentage"], ...categoryData];

  const options = {
    is3D: true, // Enables 3D view
    pieStartAngle: 100, // Rotates the chart
    legend: {
      position: "bottom left",
      alignment: "center",
      textStyle: {
        color: "#1E293B",
        fontSize: 18,
        fontName: "Arial",
        bold: true,
      },
    },
    backgroundColor: "none",
    chartArea: { width: "100%", height: "90%" },
    fontSize: 14,
  };
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"40vw"}
      height={"300px"}
    />
  );
};

export default PieChart;
