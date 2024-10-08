import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js"; // Import Chart and registerables
import { CustomTooltip } from "./CustomTooltip";

// Register all components (including scales)
Chart.register(...registerables);

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
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Set indexAxis to 'y' for horizontal bars
    plugins: {
      
      legend: {
        display: false,
        labels: {
          font: {
            size: "14px",
            weight: "400",
            color: "#6d7175",
          },
          padding: 20,
          boxWidth: 10,
          boxHeight: 10,
        },
        position: "bottom",
      },
      title: {
        display: false,
        text: title,
        font: {
          size: 24,
          family: "Arial, sans-serif",
          weight: "700",
        },
        align: "start",
      },
      tooltip: {
        yAlign: "center",
        xAlign: "left", // Align tooltip to the right
        displayColors: false,
        backgroundColor: "#ffffff",
        titleFont: {
          size: 12,
          weight: "400",
        },
        titleColor: "#6d7175",
        bodyFont: {
          size: 16,
          weight: "400",
          color: "#202223",
        },
        bodyColor: "#000000",
        padding: {
          top: 12,
          bottom: 12,
          left: 20,
          right: 20,
        },
        cornerRadius: 8,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",

        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw || 0;
            return [`${label}`, `${value}`];
          },
        },
        bodyAlign: "center",
        titleAlign: "center",
        borderColor: "#ccc",
        borderWidth: 0.3,
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value,
        color: "#202223",
        font: {
          weight: "bold",
          size: 14,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: max,
        ticks: {
          stepSize: stepsize,
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      y: {
        display: false, // Display y-axis for labels
        categoryPercentage: 0.8, // Adjust space taken by bars
        barPercentage: 0.6, // Adjust bar width within category
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "80%",
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
      <div style={{ width: "100%", height: "80%" , position:"absolute" , top:"30px" }}>
        <Bar data={data} options={options} />
      </div>
      <div
        style={{
          display: "flex",
          margin: "auto",
          marginTop: "20px",
          justifyContent: "center",
          width: "100%",
          position:"absolute" ,
          bottom:"10px"
        }}
      >
        {dataset.map((item, index) => {
          const truncatedLabel =
            item.label.length > 12
              ? `${item.label.substring(0, 13)}...`
              : item.label;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  background: item.backgroundColor,
                  width: "15px",
                  height: "15px",
                  borderRadius: "3px",
                }}
              ></div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#6d7175",
                }}
                title={item.label}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
};





















