import {
  FallOutlined,
  InfoCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Button, Select, Tooltip } from "antd";
import { BarChartHorizontal } from "../common/BarChartHorizontal";
import { BarChartVertical } from "../common/BarChartVertical";
import { usePDF } from "react-to-pdf";
import { ExportReportViewIcon } from "../../assets/image";
import { useEffect, useState } from "react";

export const ComplianceReportViewChart = ({
  activeView,
  activeReport,
  noData,
  monthFilterData,
  hexToRgba,
  getDataSetForVerticalBarChart,
  getDataSetForHorizontalBarChart,
  getStepSizeForVerticalBarChart,
  getMaxForVerticalBarChart,
  complianceReportSettingData,
  complianceReportViewData,
  getDescriptionForColumn,
  getPreviousMonthChange,
  getColumnValueForTextChart,
  getColumnTitleForTextChart,
  getBgSquareColor,
  getColumnPercentage,
  handleMonthChange ,
  selectedComplianceMonth
}) => {
  const { toPDF, targetRef } = usePDF({ filename: "compliance.pdf" });
  const [recommendationObject , setRecommendationObject] = useState({});

  

  useEffect(()=>{
    complianceReportSettingData.forEach((item)=>{
      if(item.hasOwnProperty('type') && item.type === "Recommendation"){
        setRecommendationObject(item);
      }
    })
  },[complianceReportSettingData])

  return (
    <div>
      {activeReport === "compliance" && !noData && activeView === "chart" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "white",
            padding: "24px",
            marginBottom: "20px",
            borderBottomRightRadius: "8px",
            borderBottomLeftRadius: "8px",
          }}
        >
          <Select
            showSearch
            placeholder="Select Month"
            popupMatchSelectWidth={false}
            placement="bottomLeft"
            onChange={handleMonthChange}
            options={monthFilterData}
            style={{ border: "none" }}
            value={selectedComplianceMonth}
          />
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
            Download Report
          </Button>
        </div>
      )}
      <div ref={targetRef} style={{paddingLeft:"20px" , paddingRight:"20px"}}>
        {complianceReportViewData.map((item) => {
          return (
            <div style={{ height: item.height }}>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#818181",
                  textAlign: "left",
                  marginBottom: "0px",
                }}
              >
                {item.title}
              </p>
              <div style={{ position: "relative" }}>
                {item.boxes.map((subItem) => {
                  if (subItem.type === "Value Chart") {
                    const description = getDescriptionForColumn(subItem.column);
                    const changePreviousMonth = getPreviousMonthChange(
                      subItem.column
                    );
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
                              }}
                            >
                              {getColumnTitleForTextChart(subItem.column)}
                              <span>
                                {description.length > 0 && (
                                  <Tooltip placement="top" title={description}>
                                    {" "}
                                    <InfoCircleOutlined
                                      style={{ fontSize: "14px" }}
                                    />{" "}
                                  </Tooltip>
                                )}
                              </span>
                            </p>
                            <p
                              style={{
                                width: "100%",
                                textAlign: "left",
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#202223",
                                marginBottom: "6px",
                              }}
                            >
                              {getColumnValueForTextChart(subItem.column)}
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
                                padding: "6px 12px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  textAlign: "right",
                                  color:
                                    changePreviousMonth > 0
                                      ? "#22c55e"
                                      : "#EF4444",
                                  fontSize: "12px",
                                  fotWeight: "600",
                                  lineHeight: "16.8px",
                                }}
                              >
                                <span>
                                  {changePreviousMonth > 0 ? (
                                    <RiseOutlined color={"#22c55e"} />
                                  ) : (
                                    <FallOutlined color={"#ef4444"} />
                                  )}
                                </span>{" "}
                                <span> {changePreviousMonth + " %"} </span>
                              </span>
                              <span
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  color: "#6d7175",
                                  lineHeight: "16.8px",
                                }}
                              >
                                vs last Month
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
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
                              }}
                            >
                              {getColumnValueForTextChart(subItem.column2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (subItem.type === "Multi Value Chart") {
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
                          gap: "44px",
                        }}
                      >
                        <div
                          style={{
                            width:"70%" ,
                            borderBottom: "1px solid rgba(201, 204, 207, 0.7)",
                          }}
                        >
                          <p
                            style={{
                              textAlign: "center",
                              fontSize: "24px",
                              fontWeight: "700",
                              color: "#202223",
                              position: "absolute",
                              top: "20px",
                              left: "20px",
                              width: "90%",
                            }}
                          >
                            {subItem.heading}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "26px",
                            flexDirection: "column",
                            width:"70%"
                          }}
                        >
                          {subItem.selectedColumns.map((column, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "24px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    background: getBgSquareColor(
                                      column,
                                      subItem.selectedColor
                                    ),
                                    borderRadius: "4px",
                                  }}
                                ></div>
                                <div
                                  style={{
                                    color: "#202223",
                                    fontSize: "20px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {getColumnTitleForTextChart(column)}
                                </div>
                              </div>
                              <p
                                style={{
                                  fontSize: "45px",
                                  fontWeight: "700",
                                  color: "#202223",
                                }}
                              >
                                {getColumnPercentage(
                                  column,
                                  subItem.selectedColumns
                                )}
                              </p>
                              {subItem.selectedColumns.length - 1 > index && (
                                <div
                                  style={{
                                    marginTop: "15px",
                                    marginBottom: "15px",
                                    borderBottom:
                                      "1px solid rgba(201, 204, 207, 0.7)",
                                  }}
                                ></div>
                              )}
                            </div>
                          ))}
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
                            dataset={getDataSetForHorizontalBarChart(subItem)}
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
                })}
              </div>
            </div>
          );
        })}
        <div>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#818181",
              textAlign: "left",
              marginBottom: "0px",
            }}
          >
            {recommendationObject.title}
          </p>
          <div
            style={{
              background: "white",
              border: "1px solid #E3E3E3",
              borderRadius: "8px",
              textAlign: "left",
              fontWeight: 400,
              fontSize: "16px",
              color: "#202223",
              minHeight: "69px",
              padding: "8px",
              marginTop: "10px",
            }}
          >
            {getColumnValueForTextChart(
              recommendationObject.column
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
