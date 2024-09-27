import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the data labels plugin
import { CustomTooltip } from "./CustomTooltip";


// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 20,
          font: {
            size: "14px",
            weight: "400",
            color: "#6d7175",
          },
        },
      },
      tooltip: {
        xAlign: "center",
        yAlign: "bottom",
        displayColors: false,
        backgroundColor: "#ffffff",
        titleFont: {
          size: 12,
          weight: "400",
        },
        titleColor: "#6d7175",
        bodyFont: {
          size: 16,
          weight: "700",
          color: "#202223",
        },
        bodyColor: "#000000",
        padding: {
          top: 10,
          bottom: 10,
          left: 15,
          right: 15,
        },
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw || 0;
            return value;
          },
        },
        bodyAlign: "center",
        titleAlign: "center",
      },
      datalabels: {
        color: "white", // Set the text color here
        formatter: (value, context) => {
          return value + "%"; // Show the label name
        },
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
          value: {
            color: "white",
          },
        },
        anchor: "center",
        align: "end",
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
          position: "absolute",
          top: "20px",
          left: "20px",
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
      <div style={{}}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
