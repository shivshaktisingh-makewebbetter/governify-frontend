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
  mobileView,
}) => {
  const total = dataset.reduce((acc, value) => acc + Number(value), 0); // Calculate total

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
        display: false,
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
            return `${value}`; // Show value and percentage
          },
        },
        bodyAlign: "center",
        titleAlign: "center",
      },
      datalabels: {
        color: "white", // Set the text color here
        formatter: (value, context) => {
          const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
          return `${percentage}%`; // Show percentage
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
      {mobileView ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "20px", // Removed absolute positioning for mobile
              padding: "0 16px", // Added padding for mobile view
            }}
          >
            <span
              style={{
                fontSize: "20px", // Adjusted for mobile
                fontWeight: "700",
                lineHeight: "30px",
                color: "#202223",
                textAlign: "left",
                fontFamily: "Graphie-SemiBold",
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
          <div style={{ marginTop: "20px", padding: "0 16px", width: "100%" }}>
            <Pie data={data} options={options} />
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "center",
                flexWrap: "wrap", // Allow labels to wrap for smaller screens
                gap: "8px", // Add gap for mobile layout
              }}
            >
              {pieChartLabel.map((item, index) => {
                const truncatedLabel =
                  item.length > 12 ? `${item.substring(0, 13)}...` : item;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      // justifyContent: "center",
                      width: "80%", // Responsive width
                      textAlign: "center", // Center the label text
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <div
                        style={{
                          background: bgSet[index],
                          width: "12px",
                          height: "12px",
                          borderRadius: "3px",
                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#6d7175",
                          fontFamily: "Graphie-Thin",
                        }}
                        title={item}
                      >
                        {truncatedLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
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
                fontFamily: "Graphie-SemiBold",
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
          <div>
            <Pie data={data} options={options} />
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "center",
              }}
            >
              {pieChartLabel.map((item, index) => {
                const truncatedLabel =
                  item.length > 12 ? `${item.substring(0, 13)}...` : item;
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
                        background: bgSet[index],
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6d7175",
                        fontFamily: "Graphie-Thin",
                      }}
                      title={item}
                    >
                      {truncatedLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
