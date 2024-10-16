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
  toolTipData,
  previousData,
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
        enabled: false,
        external: function externalTooltipHandler(context) {
          if (previousData.length === 0) {
            return;
          }
          // Tooltip Element
          let tooltipEl = document.getElementById("chartjs-tooltip");

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.transform = "translate(-50%, 0)";
            tooltipEl.style.transition = "opacity 0.3s ease";
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
              if (!isNaN(finalValue)) {
                if (finalValue > 0) {
                  innerHtml += `<svg width="136" height="90" viewBox="0 0 136 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_dd_1042_2090)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M69.3672 63.9919C68.1734 65.4272 66.2379 65.4272 65.044 63.9919L63.2896 61.9857C62.4099 60.9797 61.9701 60.4768 61.4384 60.1157C60.9672 59.7957 60.4449 59.5586 59.8938 59.4146C59.272 59.252 58.6039 59.252 57.2675 59.252H28.0078C23.8324 59.252 22.3183 58.8471 20.7919 58.0867C19.2654 57.3264 18.0675 56.2105 17.2511 54.7888C16.4347 53.367 16 51.9568 16 48.0677V19.2527C16 15.3636 16.4347 13.9534 17.2511 12.5316C18.0675 11.1098 19.2654 9.99403 20.7919 9.23366C22.3183 8.47329 23.8324 8.06836 28.0078 8.06836H107.028C111.203 8.06836 112.717 8.47329 114.244 9.23366C115.77 9.99403 116.968 11.1098 117.785 12.5316C118.601 13.9534 119.036 15.3636 119.036 19.2527V48.0677C119.036 51.9568 118.601 53.367 117.785 54.7888C116.968 56.2105 115.77 57.3264 114.244 58.0867C112.717 58.8471 111.203 59.252 107.028 59.252H79.8088C78.0862 59.252 77.2249 59.252 76.4095 59.3878C74.6822 59.6753 73.0607 60.4114 71.7072 61.5223C71.0682 62.0468 70.5012 62.6952 69.3672 63.9919Z" fill="white"/>
                  </g>
                  <defs>
                  <filter id="filter0_dd_1042_2090" x="0" y="0.0683594" width="135.036" height="89" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="8"/>
                  <feGaussianBlur stdDeviation="8"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.196487 0 0 0 0 0.196487 0 0 0 0 0.279476 0 0 0 0.06 0"/>
                  <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_1042_2090"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="8"/>
                  <feGaussianBlur stdDeviation="4"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.196487 0 0 0 0 0.196487 0 0 0 0 0.279476 0 0 0 0.08 0"/>
                  <feBlend mode="multiply" in2="effect1_dropShadow_1042_2090" result="effect2_dropShadow_1042_2090"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1042_2090" result="shape"/>
                  </filter>
                  </defs>
                  </svg>
                  `;
                  innerHtml += `<div style="position:absolute;transform:translate(55%, -190%)"><div style="width:80%;margin:auto;display:flex;justify-content:space-between;gap:10px;align-items:center;"><strong>${finalValue}</strong><span><svg viewBox="64 64 896 896" focusable="false" data-icon="rise" width="1em" height="1em" fill="#22c55e" aria-hidden="true"><path d="M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 000 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0013.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"></path></svg></span></div><div style="font-family:Graphie-Thin ; text-align:center;font-size: 12px ; font-weight: 400;">${"vs last time"}</div></div>`;
                } else {
                  innerHtml += `<svg width="136" height="90" viewBox="0 0 136 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_dd_1042_2090)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M69.3672 63.9919C68.1734 65.4272 66.2379 65.4272 65.044 63.9919L63.2896 61.9857C62.4099 60.9797 61.9701 60.4768 61.4384 60.1157C60.9672 59.7957 60.4449 59.5586 59.8938 59.4146C59.272 59.252 58.6039 59.252 57.2675 59.252H28.0078C23.8324 59.252 22.3183 58.8471 20.7919 58.0867C19.2654 57.3264 18.0675 56.2105 17.2511 54.7888C16.4347 53.367 16 51.9568 16 48.0677V19.2527C16 15.3636 16.4347 13.9534 17.2511 12.5316C18.0675 11.1098 19.2654 9.99403 20.7919 9.23366C22.3183 8.47329 23.8324 8.06836 28.0078 8.06836H107.028C111.203 8.06836 112.717 8.47329 114.244 9.23366C115.77 9.99403 116.968 11.1098 117.785 12.5316C118.601 13.9534 119.036 15.3636 119.036 19.2527V48.0677C119.036 51.9568 118.601 53.367 117.785 54.7888C116.968 56.2105 115.77 57.3264 114.244 58.0867C112.717 58.8471 111.203 59.252 107.028 59.252H79.8088C78.0862 59.252 77.2249 59.252 76.4095 59.3878C74.6822 59.6753 73.0607 60.4114 71.7072 61.5223C71.0682 62.0468 70.5012 62.6952 69.3672 63.9919Z" fill="white"/>
                  </g>
                  <defs>
                  <filter id="filter0_dd_1042_2090" x="0" y="0.0683594" width="135.036" height="89" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="8"/>
                  <feGaussianBlur stdDeviation="8"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.196487 0 0 0 0 0.196487 0 0 0 0 0.279476 0 0 0 0.06 0"/>
                  <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_1042_2090"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="8"/>
                  <feGaussianBlur stdDeviation="4"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.196487 0 0 0 0 0.196487 0 0 0 0 0.279476 0 0 0 0.08 0"/>
                  <feBlend mode="multiply" in2="effect1_dropShadow_1042_2090" result="effect2_dropShadow_1042_2090"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1042_2090" result="shape"/>
                  </filter>
                  </defs>
                  </svg>
                  `;
                  innerHtml += `<div style="position:absolute;transform:translate(55%, -190%)"><div style="width:80%;margin:auto;display:flex;justify-content:space-between;gap:10px;align-items:center;"><strong>${Math.abs(
                    finalValue
                  )}</strong><span><svg viewBox="64 64 896 896" focusable="false" data-icon="fall" width="1em" height="1em" fill="red" aria-hidden="true"><path d="M925.9 804l-24-199.2c-.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3a8.03 8.03 0 00-11.3 0l-45 45.2a8.03 8.03 0 000 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3a8.01 8.01 0 004.7 13.6l199.2 24c5.1.7 9.5-3.7 8.8-8.9z"></path></svg></span></div><div style="font-family:Graphie-Thin ; font-size: 12px ; text-align:center;font-weight: 400;">${"vs last time"}</div></div>`;
                }
              }
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
          title: function (tooltipItems) {
            if (tooltipItems.length > 0) {
              const datasetLabel = tooltipItems[0].dataset.label || "";
              const label = tooltipItems[0].label || "";
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
        beginAtZero: true,
        max: max,
        ticks: {
          stepSize: stepsize,
          font: {
            family: "Graphie-Thin",
            size: 12,
            weight: "400",
            color: "#6d7175",
          },
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
            top: "16px",
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
        <div
          style={{
            width: "100%",
            height: "80%",
            position: "absolute",
            top: "40px",
          }}
        >
          <Bar data={data} options={options} />
        </div>
        <div
          style={{
            display: "flex",
            margin: "auto",
            marginTop: "20px",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            bottom: "0px",
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
    </div>
  );
};
