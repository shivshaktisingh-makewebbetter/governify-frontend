import { PieChart } from "../common/PieChart";
import { BarChartHorizontal } from "../common/BarChartHorizontal";
import { BarChartVertical } from "../common/BarChartVertical";
import { ExportReportViewIcon } from "../../assets/image";
import { Button } from "antd";
import { usePDF } from "react-to-pdf";

export const ServiceReportViewChart = ({
  noDataService,
  activeReport,
  getPieChartDataSet,
  getPieChartBg,
  getPieChartLabel,
  getPieChartBorder,
  getDataSetForVerticalBarChart,
  getStepSizeForVerticalBarChart,
  getMaxForVerticalBarChart,
  hexToRgba,
  serviceReportViewData,
  getColumnTitleForTextChart,
  getColumnValueForTextChart,
}) => {
  const { toPDF, targetRef } = usePDF({ filename: "service.pdf" });


  return (
    <div style={{ marginTop: "20px" }}>
      {activeReport === "service" && (
        <div
          style={{
            marginTop: "12px",
            padding: "24px",
            background: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #858b932E",
            borderRadius: "8px",
            marginLeft:"20px" ,
            marginRight:"20px" , 
          }}
        >
          <span
            style={{
              fontWeight: "600",
              fontSize: "24px",
              lineHeight: "33.6px",
              color: "#202223",
              fontFamily: "Graphie-Regular",
            }}
          >
            Service Reports
          </span>{" "}
          {!noDataService && (
            <Button
              style={{
                background: "#5ac063",
                color: "white",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                height: "35px",
              }}
              icon={<ExportReportViewIcon />}
              iconPosition="end"
              onClick={() => toPDF()}
            >
              <span style={{ fontFamily: "Graphie-SemiBold" , fontWeight:"600" , fontSize:"14px" }}>
            Download Report
            </span>
            </Button>
          )}
        </div>
      )}

      <div ref={targetRef} style={{paddingLeft:"20px" , paddingRight:"20px"}}>
        {serviceReportViewData.map((item) => {
          return (
            <div style={{ height: item.height, marginTop: "20px" }}>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#818181",
                  textAlign: "left",
                  marginBottom: "0px",
                     fontFamily:"Graphie-SemiBold"
                }}
              >
                {item.title}
              </p>
              <div style={{ position: "relative" }}>
                {item.boxes.map((subItem) => {
                  if (subItem.type === "Text Chart") {
                    return (
                      <div
                        style={{
                          width: subItem.size.width,
                          height: subItem.size.height,
                          position: "absolute",
                          left: subItem.position.x,
                          top: subItem.position.y,
                          background: "white",
                          border: "1px solid #E3E3E3",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                width: "100%",
                                textAlign: "left",
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#6d7175",
                                marginBottom: "6px",
                                fontFamily: "Graphie-Thin",
                              }}
                            >
                              {getColumnTitleForTextChart(subItem.column1)}
                            </p>
                            <p
                              style={{
                                width: "100%",
                                textAlign: "left",
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#202223",
                                marginBottom: "6px",
                                fontFamily: "Graphie-SemiBold",
                              }}
                            >
                              {getColumnValueForTextChart(subItem.column1)}
                            </p>
                          </div>
                          <div>
                            <p
                              style={{
                                width: "100%",
                                textAlign: "right",
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "6px",
                                borderRadius: "100px",
                                background: hexToRgba(subItem.color, "0.2"),
                                padding: "6px 12px",
                                color: subItem.color,
                                fontFamily: "Graphie-Light",
                              }}
                            >
                              {getColumnValueForTextChart(subItem.column2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (subItem.type === "Bar Chart") {
                    return (
                      <div
                        style={{
                          width: subItem.size.width,
                          height: subItem.size.height,
                          position: "absolute",
                          left: subItem.position.x,
                          top: subItem.position.y,
                          background: "white",
                          border: "1px solid #E3E3E3",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        {subItem.horizontal ? (
                          <BarChartHorizontal
                            dataset={getDataSetForVerticalBarChart(subItem)}
                            stepsize={getStepSizeForVerticalBarChart(subItem)}
                            max={getMaxForVerticalBarChart(subItem)}
                            title={subItem.heading}
                            description={subItem.description}
                          />
                        ) : (
                          <BarChartVertical
                            dataset={getDataSetForVerticalBarChart(subItem)}
                            stepsize={getStepSizeForVerticalBarChart(subItem)}
                            max={getMaxForVerticalBarChart(subItem)}
                            title={subItem.heading}
                            description={subItem.description}
                          />
                        )}
                      </div>
                    );
                  }

                  if (subItem.type === "Pie Chart") {
                    const title = subItem.heading;
                    const dataset = getPieChartDataSet(subItem);
                    const bgSet = getPieChartBg(subItem);
                    const pieChartLabel = getPieChartLabel(subItem);
                    const borderColorSetPie = getPieChartBorder(subItem);
                    const description = subItem.description;

                    return (
                      <div
                        style={{
                          width: subItem.size.width,
                          height: subItem.size.height,
                          position: "absolute",
                          left: subItem.position.x,
                          top: subItem.position.y,
                          background: "white",
                          border: "1px solid #E3E3E3",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <PieChart
                          title={title}
                          dataset={dataset}
                          bgSet={bgSet}
                          pieChartLabel={pieChartLabel}
                          borderColorSetPie={borderColorSetPie}
                          description={description}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
