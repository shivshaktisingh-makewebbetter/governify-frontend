import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js"; // Import Chart and registerables
import { CustomTooltip } from "./CustomTooltip";
import { RiseOutlined } from "@ant-design/icons";

// Register all components (including scales)
Chart.register(...registerables);

export const BarChartVertical = ({
  dataset,
  stepsize,
  max,
  title,
  description,
  toolTipData,
}) => {
  const data = {
    labels: [""],
    datasets: dataset,
  };

  const options = {
    responsive: true,

    plugins: {
      beforeDraw: function (chart) {
        const ctx = chart.ctx;
        ctx.save();

        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, index) => {
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color
            ctx.shadowBlur = 10; // Blur effect
            ctx.shadowOffsetX = 5; // Horizontal offset
            ctx.shadowOffsetY = 5; // Vertical offset

            // Draw the shadowed bar
            ctx.fillStyle = dataset.backgroundColor; // Use the dataset color
            ctx.fillRect(
              bar.x - bar.width / 2,
              bar.y,
              bar.width,
              chart.chartArea.bottom - bar.y
            );
          });
        });

        ctx.restore();
      },
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
        enabled: false,
        // position: 'nearest',
        external: function externalTooltipHandler(context) {
          // Tooltip Element
          let tooltipEl = document.getElementById("chartjs-tooltip");

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.style.background = "white";
            tooltipEl.style.color = "black";
            tooltipEl.style.borderRadius = "3px";
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.transform = "translate(-50%, 0)";
            tooltipEl.style.transition = "opacity 0.3s ease";
            tooltipEl.style.padding = "5px";
            tooltipEl.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.1)";
            document.body.appendChild(tooltipEl);
          }

          const { chart, tooltip } = context;

          // Hide if no tooltip
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set Text
          if (tooltip.body) {
            const title = tooltip.title || [];
            const bodyLines = tooltip.body.map((item) => item.lines);

            let innerHtml = "<div>";

            title.forEach(function (title) {
              let cleanedStr = title.replace(":", "").trim();
              let previousValue;
              let currentValue;
              toolTipData.tempCurrentArr.forEach((item) => {
                if (item.key === cleanedStr) {
                  currentValue = Number(item.value);
                }
              });
              toolTipData.tempPreviousArr.forEach((item) => {
                if (item.key === cleanedStr) {
                  previousValue = Number(item.value);
                }
              });


              let finalValue = currentValue - previousValue;
              if(!isNaN(finalValue)){
              if (finalValue > 0) {
                innerHtml += `<div style="width:80%;margin:auto;display:flex;justify-content:space-between;align-items:center;"><strong>${finalValue}</strong><span><svg viewBox="64 64 896 896" focusable="false" data-icon="rise" width="1em" height="1em" fill="#22c55e" aria-hidden="true"><path d="M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 000 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0013.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"></path></svg></span></div>`;
              } else {
                innerHtml += `<div style="width:80%;margin:auto;display:flex;justify-content:space-between;align-items:center;"><strong>${finalValue}</strong><span><svg viewBox="64 64 896 896" focusable="false" data-icon="fall" width="1em" height="1em" fill="red" aria-hidden="true"><path d="M925.9 804l-24-199.2c-.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3a8.03 8.03 0 00-11.3 0l-45 45.2a8.03 8.03 0 000 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3a8.01 8.01 0 004.7 13.6l199.2 24c5.1.7 9.5-3.7 8.8-8.9z"></path></svg></span></div>`;
              }
              }
            });

            bodyLines.forEach(function (body) {
              console.log(body, "body");
              innerHtml += `<div style="font-family:Graphie-Thin ; font-size: 12px ; font-weight: 400;">${"vs last month"}</div>`;
            });

            innerHtml += "</div>";

            tooltipEl.innerHTML = innerHtml;
          }

          const position = chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;

          // Adjust positioning to be above the bar
          const tooltipHeight = tooltipEl.offsetHeight; // Get tooltip height to offset positioning
          const offsetY = 10; // Additional padding above the bar

          tooltipEl.style.left =
            position.left + window.pageXOffset + tooltip.caretX + "px";
          tooltipEl.style.top =
            position.top +
            window.pageYOffset +
            tooltip.caretY -
            tooltipHeight -
            offsetY +
            "px"; // Position above the bar
          tooltipEl.style.font = tooltip.options.bodyFont.string;
          tooltipEl.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`;
        },
        callbacks: {
          // Custom title callback to ensure the tooltip title is populated
          title: function (tooltipItems) {
            // Assuming each tooltipItem corresponds to a point on the chart
            if (tooltipItems.length > 0) {
              const datasetLabel = tooltipItems[0].dataset.label || ""; // Get dataset label
              const label = tooltipItems[0].label || ""; // Get the label for this point
              return datasetLabel ? `${datasetLabel}: ${label}` : label;
            }
            return "";
          },
        },

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
        display: false,
        categoryPercentage: 1,
        barPercentage: 20,
      },
      y: {
        beginAtZero: true,
        max: max,
        ticks: {
          stepSize: stepsize,
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
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
            fontFamily: "Graphie-Regular",
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
      <div
        style={{
          display: "flex",
          margin: "auto",
          marginTop: "20px",
          justifyContent: "center",
          width: "65%",
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
                  fontWeight: "600",
                  color: "#6d7175",
                  fontFamily: "Graphie-Thin",
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
  );
};
