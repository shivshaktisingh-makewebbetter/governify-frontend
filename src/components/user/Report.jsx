import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "../common/Loader";
import { userSettingData } from "../../utils/tools";
import Hero from "../common/Hero";
import { fetcher } from "../../utils/helper";
import { Button, Select, Table, Tooltip } from "antd";
import { BarChartHorizontal } from "../common/BarChartHorizontal";
import { BarChartVertical } from "../common/BarChartVertical";
import {
  FallOutlined,
  InfoCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { EmptyReports } from "../common/EmptyReports";
import { PieChart } from "../common/PieChart";
import {
  ChartViewIcon,
  ComplianceReportIcon,
  ExportReportViewIcon,
  ListReportIcon,
  ServiceReport,
  ServiceReportIcon,
} from "../../assets/image";

export const Report = () => {
  const token = sessionStorage.getItem("token");
  const settingData = sessionStorage.getItem("settings");
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("compliance"); // Track the active button
  const [activeView, setActiveView] = useState("list"); // Track the active view, default to 'list'
  const [noData, setNoData] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [allColumnTitle, setAllColumnTitle] = useState([]);
  const [tableColumns, setAllTableColumns] = useState([]);
  const [governifyFilterData, setGovernifyFilterData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [complianceReportSettingData, setComplianceReportSettingData] =
    useState({});
  const [complianceReportViewData, setComplianceReportViewData] = useState([]);
  const [serviceReportViewData, setServiceReportViewData] = useState([]);
  const [serviceReportSettingData, setServiceReportSettingData] = useState({});
  const [monthFilterData, setMonthFilterData] = useState([]);
  const [nameValue, setNameValue] = useState({
    currentName: "",
    previousName: "",
  });

  const handleViewClick = (viewType) => {
    setActiveView(viewType); // Update active view on click
  };

  const getMonthNameWithYear = (dateString) => {
    const date = new Date(dateString); // Convert the string into a Date object
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[date.getUTCMonth()]; // Get the month name
    const year = date.getUTCFullYear(); // Get the year

    return `${monthName} ${year}`; // Return in "Month Year" format
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetcher(
        `newonboardify/customer/allProfileWithServicesByUser`
      );

      const response1 = await fetcher(`governify/customer/getComplianceReport`);
      const response2 = await fetcher(
        `governify/customer/getAllComplianceReportForCustomer`
      );

      if (!response1.status) {
        setNoData(true);
      }

      if (response1.status) {
        setAllColumnTitle(response1.response.data.boards[0].columns);
      }

      if (response.status) {
        if (response.response.length === 0) {
          setNoData(false);
        } else {
          let tempDataSource = [];
          let tempTableColumns = [];
          let tempSelectedCurrentData = [];
          let tempSelectedPreviousData = [];
          let tempNamevalue = { currentName: "", previousName: "" };
          let tempMonthFilterData = [];

          // Building table columns
          JSON.parse(response.response[0].governify_table_settings).forEach(
            (item) => {
              response1.response.data.boards[0].columns.forEach((subItem) => {
                if (item === subItem.id) {
                  tempTableColumns.push({
                    title: subItem.title,
                    dataIndex: subItem.id,
                    key: subItem.id,
                  });
                }
              });
            }
          );

          const filterKey = JSON.parse(
            response.response[0].governify_compliance_filter_key
          ).value.toLowerCase();

          // Handling current data
          response1.response.data.boards[0].items_page.items.forEach((item) => {
            if (item.name.toLowerCase() === filterKey) {
              tempSelectedCurrentData = item.column_values;
              setCurrentData(item.column_values);
              tempNamevalue.currentName = item.name;
            }
          });

          // Handling previous data
          response1.response.data.boards[0].items_page.previous_month_items.forEach(
            (item) => {
              if (item.name.toLowerCase() === filterKey) {
                tempSelectedPreviousData = item.column_values;
                setPreviousData(item.column_values);
                tempNamevalue.previousName = item.name;
              }
            }
          );

          response2.response.data.boards[0].items_page.items.forEach(
            (item, index) => {
              if (item.name.toLowerCase() === filterKey) {
                let obj = { key: index };
                item.column_values.forEach((subItem) => {
                  if (
                    JSON.parse(
                      response.response[0].governify_table_settings
                    ).includes(subItem.id)
                  ) {
                    obj[subItem.id] = subItem.text;
                  }
                });

                tempDataSource.push(obj);
              }
            }
          );

          response2.response.data.boards[0].items_page.items.forEach((item) => {
            if (item.name.toLowerCase() === filterKey) {
              let month = getMonthNameWithYear(item.created_at);
              if (!tempMonthFilterData.includes(month))
                tempMonthFilterData.push({ label: month, value: month });
            }
          });

          setMonthFilterData(tempMonthFilterData);
          setDataSource(tempDataSource);
          setComplianceReportSettingData(
            JSON.parse(response.response[0].governify_compliance_report)
          );
          setComplianceReportViewData(
            JSON.parse(response.response[0].governify_compliance_report_view)
          );
          setServiceReportSettingData(
            JSON.parse(response.response[0].governify_service_report)
          );
          setServiceReportViewData(
            JSON.parse(response.response[0].governify_service_report_view)
          );
          setAllTableColumns(tempTableColumns);
        }
      } else {
        setNoData(false);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    userSettingData();
    return () => {};
  }, [token]);

  const handleButtonClick = (reportType) => {
    setActiveReport(reportType); // Update active button on click
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getColumnValueForTextChart = (id) => {
    let tempValue = "";
    if (id === "name") {
      tempValue = nameValue.currentName;
    } else {
      currentData.forEach((item) => {
        if (item.id === id) {
          tempValue = item.text;
        }
      });
    }

    return tempValue;
  };

  const getPreviousMonthChange = (id) => {
    const currentResult = currentData.find((item) => item.id === id);
    const previousResult = previousData.find((item) => item.id === id);
    const percentageChange =
      ((Number(currentResult.text) - Number(previousResult.text)) /
        Number(previousResult.text)) *
      100;
    return percentageChange.toFixed(1);
  };

  const getColumnTitleForTextChart = (id) => {
    let tempValue = "";
    allColumnTitle.forEach((item) => {
      if (item.id === id) {
        tempValue = item.title;
      }
    });
    return tempValue;
  };

  const getBgSquareColor = (id, data) => {
    let tempColor = "#000000";
    data.forEach((item) => {
      if (item.key === id) {
        tempColor = item.value;
      }
    });
    return tempColor;
  };

  function hexToRgba(hex, opacity) {
    // Remove the '#' if it's there
    hex = hex.replace("#", "");

    // Parse the hex color
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Return the RGBA string with opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  const getBgColorForBarChart = (subItem, item) => {
    let hexColor = "#d20e0e";
    subItem.selectedColor.forEach((detail) => {
      if (detail.key === item) {
        hexColor = detail.value;
      }
    });
    hexColor = hexToRgba(hexColor, "1");
    return hexColor;
  };

  const getBorderColorForBarChart = (subItem, item) => {
    let hexColor = "#d20e0e";
    subItem.selectedColor.forEach((detail) => {
      if (detail.key === item) {
        hexColor = detail.value;
      }
    });
    hexColor = hexToRgba(hexColor, "1");
    return hexColor;
  };

  const getDataSetForVerticalBarChart = (subItem) => {
    let tempData = [];
    subItem.selectedColumns.forEach((item) => {
      tempData.push({
        label: getColumnTitleForTextChart(item),
        data: [getColumnValueForTextChart(item)],
        backgroundColor: getBgColorForBarChart(subItem, item),
        borderColor: getBorderColorForBarChart(subItem, item),
        borderWidth: 1,
      });
    });

    return tempData;
  };

  function calculateStepSize(data) {
    // Convert string data to numbers
    const numericData = data.map(Number);

    // Find min and max values in the data
    const minValue = Math.min(...numericData);
    const maxValue = Math.max(...numericData);

    // Calculate the range
    const range = maxValue - minValue;

    // Determine a reasonable number of steps (e.g., 5 or 10 steps)
    const numberOfSteps = 2; // You can adjust this for more/less granularity

    // Calculate the raw stepSize by dividing the range by number of steps
    let stepSize = range / numberOfSteps;

    // Round stepSize up to the nearest multiple of 50
    stepSize = Math.ceil(stepSize / 50) * 50;

    return stepSize;
  }

  function calculateChartMax(data) {
    const numericData = data.map(Number);

    // Find the maximum value in the data
    const maxValue = Math.max(...numericData);

    // Calculate the stepSize
    const stepSize = calculateStepSize(data);

    // Calculate the chart max value, which is one stepSize above the max value
    const chartMax = Math.ceil(maxValue / stepSize) * stepSize + stepSize;

    return chartMax;
  }

  const getStepSizeForVerticalBarChart = (subItem) => {
    let tempData = [];
    subItem.selectedColumns.forEach((item) => {
      tempData.push(getColumnValueForTextChart(item));
    });

    let stepSize = calculateStepSize(tempData);

    return stepSize;
  };

  const getMaxForVerticalBarChart = (subItem) => {
    let tempData = [];

    subItem.selectedColumns.forEach((item) => {
      tempData.push(getColumnValueForTextChart(item));
    });

    let chartMax = calculateChartMax(tempData);

    return chartMax;
  };

  const getColumnPercentage = (column, data) => {
    let tempData = 0;
    const valueOfSelected = getColumnValueForTextChart(column);

    // Calculate total from the data
    data.forEach((item) => {
      tempData += Number(getColumnValueForTextChart(item));
    });

    // Calculate the percentage
    const percentage = tempData > 0 ? (valueOfSelected / tempData) * 100 : 0; // Avoid division by zero

    return parseFloat(percentage.toFixed(2)) + " %";
  };

  const getDescriptionForColumn = (column) => {
    let description = "";
    allColumnTitle.forEach((item) => {
      if (item.id === column) {
        if (item.hasOwnProperty("description") && item.desc !== null) {
          description = item.desc;
        } else {
          description = "";
        }
        // description = item.desc;
      }
    });

    if (description === undefined) {
      description = "";
    }
    return description;
  };

  const getPieChartDataSet = (subItem) => {
    let tempData = [];
    subItem.selectedColumns.forEach((item) => {
      tempData.push(getColumnValueForTextChart(item));
    });
    return tempData;
  };

  const getPieChartBg = (subItem) => {
    let tempData = [];

    subItem.selectedColumns.forEach((item) => {
      tempData.push(getBgColorForBarChart(subItem, item));
    });
    return tempData;
  };

  const getPieChartBorder = (subItem) => {
    let tempData = [];

    subItem.selectedColumns.forEach((item) => {
      tempData.push("#fff");
    });
    return tempData;
  };

  const getPieChartLabel = (subItem) => {
    let tempData = [];
    subItem.selectedColumns.forEach((item) => {
      tempData.push(getColumnTitleForTextChart(item));
    });

    return tempData;
  };

  const handleExport = () => {
    console.log(selectedRowKeys, "selectedRowKeys");
  };

  return (
    <div
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
        background: "#F6F6FB",
      }}
    >
      <Hero
        heading={"Performance Reports"}
        subheading="Easily monitor, manage, and track the status and progress of all your service requests in real-time."
        forHome={false}
      />

      {loading && <Loader />}

      <div
        style={{
          paddingTop: "8px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "#818181",
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          Reports
        </div>
        <div style={{ textAlign: "left", marginTop: "12px" }}>
          <Button
            style={{
              fontWeight: "600",
              color: activeReport === "service" ? "white" : "#202223",
              backgroundColor: activeReport === "service" ? "#00bf63" : "white",
              fontSize: "16px",
              border: "none",
              lineHeight: "22.4px",
              height: "40px",
            }}
            onClick={() => handleButtonClick("service")}
            icon={<ServiceReportIcon activeReport={activeReport} />}
            iconPosition="start"
          >
            Service Reports
          </Button>
          <Button
            style={{
              marginLeft: "20px",
              fontWeight: "600",
              color: activeReport === "compliance" ? "white" : "#202223",
              backgroundColor:
                activeReport === "compliance" ? "#00bf63" : "white",
              fontSize: "16px",
              border: "none",
              lineHeight: "22.4px",
              height: "40px",
            }}
            onClick={() => handleButtonClick("compliance")}
            icon={<ComplianceReportIcon activeReport={activeReport} />}
            iconPosition="start"
          >
            Compliance Reports
          </Button>
        </div>

        {activeReport === "compliance" && (
          <div
            style={{
              marginTop: "12px",
              padding: "24px",
              background: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #858b932E",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "24px",
                lineHeight: "33.6px",
                color: "#202223",
              }}
            >
              Compliance Report
            </span>
            <span
              style={{
                background: "#f6f6f7",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              {!noData && (
                <Button
                  style={{
                    marginRight: "16px",
                    border: "none",
                    background: activeView === "list" ? "white" : "transparent",
                    color: activeView === "list" ? "#00bf63" : "#202223",
                    fontSize: "14px",
                    fontWeight: "600",
                    lineHeight: "19.6px",
                    boxShadow:
                      activeView === "list"
                        ? "0px 4px 12px rgba(0, 0, 0, 0.2)" // Darker shadow when active
                        : "none", // No shadow when inactive
                  }}
                  onClick={() => handleViewClick("list")}
                  icon={
                    <ListReportIcon
                      activeReport={activeReport}
                      activeView={activeView}
                    />
                  }
                >
                  List View
                </Button>
              )}
              {!noData && (
                <Button
                  style={{
                    border: "none",
                    background:
                      activeView === "chart" ? "white" : "transparent",
                    color: activeView === "chart" ? "#00bf63" : "#202223",
                    fontSize: "14px",
                    fontWeight: "600",
                    lineHeight: "19.6px",
                    boxShadow:
                      activeView === "chart"
                        ? "0px 4px 12px rgba(0, 0, 0, 0.2)" // Darker shadow when active
                        : "none", // No shadow when inactive
                  }}
                  onClick={() => handleViewClick("chart")}
                  icon={
                    <ChartViewIcon
                      activeReport={activeReport}
                      activeView={activeView}
                    />
                  }
                >
                  Chart View
                </Button>
              )}
            </span>
          </div>
        )}

        {activeReport === "compliance" &&
          !noData &&
          activeView === "list" &&
          selectedRowKeys.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "white",
                padding: "16px",
              }}
            >
              <span
                style={{
                  color: "#5ac063",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {selectedRowKeys.length} items selected
              </span>
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
                iconPosition="start"
                disabled={true}
                onClick={handleExport}
              >
                Export{" "}
              </Button>
            </div>
          )}

        {activeReport === "compliance" && !noData && activeView === "chart" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              padding: "16px",
            }}
          >
            <Select
              showSearch
              placeholder="Select Month"
              popupMatchSelectWidth={false}
              placement="bottomLeft"
              disabled={true}
              // onChange={handleCategoryChange}
              options={monthFilterData}
              style={{ border: "none" }}
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
              disabled={true}
            >
              Download Report
            </Button>
          </div>
        )}

        {activeReport === "compliance" && !noData && (
          <div>
            {activeView === "list" && (
              <Table
                className="governify-report-table"
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={dataSource}
              />
            )}

            {activeView === "chart" && (
              <div style={{ marginTop: "20px" }}>
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
                            const description = getDescriptionForColumn(
                              subItem.column
                            );
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
                                      {getColumnTitleForTextChart(
                                        subItem.column
                                      )}
                                      <span>
                                        {description.length > 0 && (
                                          <Tooltip
                                            placement="top"
                                            title={description}
                                          >
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
                                      {getColumnValueForTextChart(
                                        subItem.column
                                      )}
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
                                        <span>
                                          {" "}
                                          {changePreviousMonth + " %"}{" "}
                                        </span>
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
                                      {getColumnTitleForTextChart(
                                        subItem.column1
                                      )}
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
                                      {getColumnValueForTextChart(
                                        subItem.column1
                                      )}
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
                                        background: hexToRgba(
                                          subItem.color,
                                          "0.2"
                                        ),
                                        padding: "6px 12px",
                                        color: subItem.color,
                                      }}
                                    >
                                      {getColumnValueForTextChart(
                                        subItem.column2
                                      )}
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
                                  padding: "28px",
                                  marginBottom: "10px",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "44px",
                                }}
                              >
                                <div
                                  style={{
                                    borderBottom:
                                      "1px solid rgba(201, 204, 207, 0.7)",
                                  }}
                                >
                                  <p
                                    style={{
                                      textAlign: "center",
                                      fontSize: "24px",
                                      fontWeight: "700",
                                      color: "#202223",
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
                                  }}
                                >
                                  {subItem.selectedColumns.map(
                                    (column, index) => (
                                      <div
                                        key={index}
                                        style={{ marginBottom: "10px" }}
                                      >
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
                                        {subItem.selectedColumns.length - 1 >
                                          index && (
                                          <div
                                            style={{
                                              marginTop: "15px",
                                              marginBottom: "15px",
                                              border:
                                                "1px solid rgba(201, 204, 207, 0.7)",
                                            }}
                                          ></div>
                                        )}
                                      </div>
                                    )
                                  )}
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
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {subItem.horizontal ? (
                                  <BarChartHorizontal
                                    dataset={getDataSetForVerticalBarChart(
                                      subItem
                                    )}
                                    stepsize={getStepSizeForVerticalBarChart(
                                      subItem
                                    )}
                                    max={getMaxForVerticalBarChart(subItem)}
                                    title={subItem.heading}
                                    description={subItem.description}
                                  />
                                ) : (
                                  <BarChartVertical
                                    dataset={getDataSetForVerticalBarChart(
                                      subItem
                                    )}
                                    stepsize={getStepSizeForVerticalBarChart(
                                      subItem
                                    )}
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
                    {complianceReportSettingData.recommendation_text.title}
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
                      complianceReportSettingData.recommendation_text.column
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "24px",
                lineHeight: "33.6px",
                color: "#202223",
              }}
            >
              Service Reports
            </span>{" "}
            {!noData && (
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
                disabled={true}
              >
                Download Report
              </Button>
            )}
          </div>
        )}

        {noData && <EmptyReports activeReport={activeReport} />}

        {activeReport === "service" && !noData && (
          <div style={{ marginTop: "20px" }}>
            {serviceReportViewData.map((item) => {
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
                        const description = getDescriptionForColumn(
                          subItem.column
                        );
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
                                      <Tooltip
                                        placement="top"
                                        title={description}
                                      >
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
                              padding: "28px",
                              marginBottom: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "44px",
                            }}
                          >
                            <div
                              style={{
                                borderBottom:
                                  "1px solid rgba(201, 204, 207, 0.7)",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "center",
                                  fontSize: "24px",
                                  fontWeight: "700",
                                  color: "#202223",
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
                              }}
                            >
                              {subItem.selectedColumns.map((column, index) => (
                                <div
                                  key={index}
                                  style={{ marginBottom: "10px" }}
                                >
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
                                  {subItem.selectedColumns.length - 1 >
                                    index && (
                                    <div
                                      style={{
                                        marginTop: "15px",
                                        marginBottom: "15px",
                                        border:
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
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {subItem.horizontal ? (
                              <BarChartHorizontal
                                dataset={getDataSetForVerticalBarChart(subItem)}
                                stepsize={getStepSizeForVerticalBarChart(
                                  subItem
                                )}
                                max={getMaxForVerticalBarChart(subItem)}
                                title={subItem.heading}
                                description={subItem.description}
                              />
                            ) : (
                              <BarChartVertical
                                dataset={getDataSetForVerticalBarChart(subItem)}
                                stepsize={getStepSizeForVerticalBarChart(
                                  subItem
                                )}
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
                              justifyContent: "center",
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
        )}
      </div>
    </div>
  );
};
