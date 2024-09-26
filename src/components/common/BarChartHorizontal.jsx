import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CustomTooltip } from "./CustomTooltip";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChartHorizontal = ({
  dataset,
  stepsize,
  max,
  title,
  description,
}) => {
  const data = {
    labels: [""],
    datasets: dataset,
  };

  const options = {
    indexAxis: "y", // This makes the chart horizontal
    responsive: true,
    plugins: {
      beforeDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        ctx.save();

        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, index) => {
            // Apply shadow properties
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            // Draw the shadow effect
            const model = bar.getProps(["x", "y", "width", "height"]);
            ctx.fillRect(
              model.x - model.width / 2,
              model.y,
              model.width,
              chart.chartArea.bottom - model.y
            );
          });
        });

        ctx.restore();
      },
      legend: {
        position: "top",
        labels: {
          boxWidth: 15, // Width of the square dot
          boxHeight: 15,
        },
      },
      title: {
        display: false,
        text: title,
        font: {
          size: 24, // Set the font size for the title
          family: "Arial, sans-serif", // Font family for the title
          weight: "700", // Font weight for the title
        },
        align: "start",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: max, // Set maximum value for x-axis (horizontal)
        ticks: {
          stepSize: stepsize, // Define the step size for x-axis
        },
        grid: {
          drawBorder: false, // Hide border lines
          display: false,
        },
        categoryPercentage: 1, // Adjusts space between categories (bars)
        barPercentage: 20,
      },
      y: {
        display: false, // Show y-axis labels
        grid: {
          display: false, // Hide grid lines
        },
      },
    },
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          marginTop: "20px",
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
      <Bar data={data} options={options} />
    </>
  );
};
