import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CustomTooltip } from "./CustomTooltip";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({
  title,
  dataset,
  bgSet,
  pieChartLabel,
  borderColorSetPie,
  description,
}) => {
  const data = {
    labels: pieChartLabel,
    datasets: [
      {
        label: "",
        data: dataset,
        backgroundColor: bgSet,
        borderColor: borderColorSetPie,
        borderWidth: 1,
        hoverBackgroundColor: bgSet,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true, // Ensure the legend is displayed
        position: "bottom",
        labels: {
          generateLabels: (chart) => {
            const { data } = chart;
            return data.labels.map((label, i) => ({
              text: label,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].borderColor[i],
              lineWidth: 1,
              hidden: chart.getDatasetMeta(0).data[i].hidden,
              index: i,
              boxWidth: 5, // Size of the legend box
              boxHeight: 5,
              borderRadius: 5, // Adding border-radius for rounded edges
            }));
          },
        },
      },
    },
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "33.6px",
            color: "#202223",
            textAlign: "left",
          }}
        >
          {title}
        </span>
        <span>
          {description.length > 0 && (
            <CustomTooltip description={description} />
          )}
        </span>
      </div>
      <Pie data={data} options={options} />
    </div>
  );
};
