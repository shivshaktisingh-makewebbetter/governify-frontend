import { useEffect, useState } from "react";
import { Loader } from "../common/Loader";
import { userSettingData } from "../../utils/tools";
import Hero from "../common/Hero";
import { fetcher } from "../../utils/helper";
import { Button, Select } from "antd";
import { usePDF } from "react-to-pdf";
import { EmptyReports } from "../common/EmptyReports";
import {
  ChartViewIcon,
  ComplianceReportIcon,
  ExportReportViewIcon,
  ListReportIcon,
  ServiceReportIcon,
} from "../../assets/image";
import { ComplianceReportViewList } from "./ComplianceReportViewList";
import { ComplianceReportViewChart } from "./ComplianceReportViewChart";
import { ServiceReportViewChart } from "./ServiceReportViewChart";
import { useLocation } from "react-router-dom";

export const Report = () => {
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const settingData = sessionStorage.getItem("settings");
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("compliance"); // Track the active button
  const [activeView, setActiveView] = useState("list"); // Track the active view, default to 'list'
  const [noData, setNoData] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [currentDataService, setCurrentDataService] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [allColumnTitle, setAllColumnTitle] = useState([]);
  const [allColumnTitleService, setAllColumnTitleService] = useState([]);
  const [tableColumns, setAllTableColumns] = useState([]);
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
  const [finalData, setFinalData] = useState({});
  const [selectedComplianceMonth, setSelectedComplianceMonth] = useState("");
  const [noDataCompliance, setNoDataCompliance] = useState(false);
  const [noDataService, setNoDataService] = useState(false);

  const [nameValueService, setNameValueService] = useState("");

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

    return { label: `${monthName} ${year}`, value: monthName }; // Return in "Month Year" format
  };

  const getCurrentMonthName = () => {
    const date = new Date();
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
    const monthIndex = date.getMonth(); // getMonth() returns 0-11
    return monthNames[monthIndex];
  };

  const getLatestItem = (arr) => {
    return arr.reduce((latest, current) => {
      return new Date(current.created_at) > new Date(latest.created_at)
        ? current
        : latest;
    });
  };

  const getPreviousItem = (arr, currentData) => {
    // Sort the array by created_at in ascending order
    const sortedArr = arr
      .slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Find the index of the currentData
    const currentIndex = sortedArr.findIndex(
      (item) => item.created_at === currentData.created_at
    );

    // Return the previous item if it exists
    return currentIndex > 0 ? sortedArr[currentIndex - 1] : null;
  };

  // const currentData = { created_at: '2024-09-26T10:20:00Z' };
  // const previousItem = getPreviousItem(items, currentData);
  // console.log(previousItem); // Output: { created_at: '2024-09-25T15:30:20Z' }

  const fetchData = async () => {
    setLoading(true);
    const tempData = [];
    try {
      const response = await fetcher(
        `newonboardify/customer/allProfileWithServicesByUser`
      );

      const complianceResponse = await fetcher(
        `governify/customer/getAllComplianceReportForCustomer`
      );
      const serviceResponse = await fetcher(
        `governify/customer/getServiceReport`
      );

      if (!complianceResponse.status) {
        setNoData(true);
        setNoDataCompliance(true);
        setNoDataService(true);
      }

      if (
        JSON.parse(response.response[0].governify_compliance_report) === null ||
        JSON.parse(response.response[0].governify_compliance_report_view) ===
          null
      ) {
        setNoDataCompliance(true);
      }

      if (
        JSON.parse(response.response[0].governify_service_report) === null ||
        JSON.parse(response.response[0].governify_service_report_view) === null
      ) {
        setNoDataService(true);
      }

      if (complianceResponse.status) {
        setAllColumnTitle(complianceResponse.response.data.boards[0].columns);

        complianceResponse.response.data.boards[0].items_page.items.forEach(
          (item) => {
            if (
              JSON.parse(response.response[0].governify_compliance_filter_key)
                .key === "name"
            ) {
              if (
                item.name.toLowerCase() ===
                JSON.parse(
                  response.response[0].governify_compliance_filter_key
                ).value.toLowerCase()
              ) {
                tempData.push(item);
              }
            } else {
              item.column_values.forEach((subItem) => {
                if (
                  subItem.id ===
                    JSON.parse(
                      response.response[0].governify_compliance_filter_key
                    ).key &&
                  subItem.text.toLowerCase() ===
                    JSON.parse(
                      response.response[0].governify_compliance_filter_key
                    ).value.toLowerCase()
                ) {
                  tempData.push(item);
                }
              });
            }
          }
        );

        const latestItem = getLatestItem(tempData);
        let latestMonthData = getMonthNameWithYear(latestItem.created_at);
        let previousMonthData = getPreviousItem(tempData, {
          created_at: latestItem.created_at,
        });
        setFinalData(tempData);
        setSelectedComplianceMonth(latestMonthData.value);
        setCurrentData(latestItem.column_values);
        if (previousMonthData === null) {
          setPreviousData([]);
        } else {
          setPreviousData(previousMonthData.column_values);
        }
      }

      if (serviceResponse.status) {
        if (
          JSON.parse(response.response[0].governify_service_filter_key).key ===
          "name"
        ) {
          serviceResponse.response.data.boards[0].items_page.items.forEach(
            (item) => {
              if (
                item.name.toLowerCase() ===
                JSON.parse(
                  response.response[0].governify_service_filter_key
                ).value.toLowerCase()
              ) {
                setCurrentDataService(item.column_values);
                setNameValueService(item.name);
              }
            }
          );
        } else {
          serviceResponse.response.data.boards[0].items_page.items.forEach(
            (item) => {
              item.column_values.forEach((subItem, subIndex) => {
                if (subItem.text) {
                  if (
                    subItem.id ===
                      JSON.parse(
                        response.response[0].governify_service_filter_key
                      ).key &&
                    subItem.text.toLowerCase() ===
                      JSON.parse(
                        response.response[0].governify_service_filter_key
                      ).value.toLowerCase()
                  ) {
                    setCurrentDataService(item.column_values);
                    setNameValueService(item.name);
                  }
                }
              });
            }
          );
        }

        setAllColumnTitleService(
          serviceResponse.response.data.boards[0].columns
        );
      }

      if (response.status) {
        if (response.response.length === 0) {
          setNoData(false);
        } else {
          let tempDataSource = [];
          let tempTableColumns = [];
          let tempMonthFilterData = [];
          let tempMonthFilter = [];

          // Building table columns
          JSON.parse(response.response[0].governify_table_settings).forEach(
            (item, index) => {
              complianceResponse.response.data.boards[0].columns.forEach(
                (subItem) => {
                  if (item === subItem.id) {
                    tempTableColumns.push({
                      title: subItem.title,
                      dataIndex: subItem.id,
                      key: subItem.id,
                      width: 150,
                      ...(index === 0 && { fixed: "left" }), // conditionally apply fixed: 'right' if index is 0
                    });
                  }
                }
              );
            }
          );

          const filterKey = JSON.parse(
            response.response[0].governify_compliance_filter_key
          ).value.toLowerCase();

          if (
            JSON.parse(response.response[0].governify_compliance_filter_key)
              .key === "name"
          ) {
            complianceResponse.response.data.boards[0].items_page.items.forEach(
              (item, index) => {
                if (
                  item.name.toLowerCase() ===
                  JSON.parse(
                    response.response[0].governify_compliance_filter_key
                  ).value.toLowerCase()
                ) {
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
          } else {
            const tableParentColumn = [];
            const complianceFilterKey = JSON.parse(
              response.response[0].governify_compliance_filter_key
            );
            const tableSettings = JSON.parse(
              response.response[0].governify_table_settings
            );
            const boards =
              complianceResponse.response.data.boards[0].items_page.items;

            boards.forEach((item, index) => {
              let obj = { key: index };

              item.column_values.forEach((subItem) => {
                if (subItem.text) {
                  // Ensure subItem.text is not null or undefined
                  const isMatchingKey = subItem.id === complianceFilterKey.key;
                  const isMatchingValue =
                    subItem.text.toLowerCase() ===
                    complianceFilterKey.value.toLowerCase();
                  if (isMatchingKey && isMatchingValue) {
                    tableParentColumn.push(item);
                    // obj[subItem.id] = subItem.text;
                  }
                }
              });
            });

            if (tableParentColumn.length > 0) {
              tableParentColumn.forEach((item, index) => {
                let obj = { key: index };
                item.column_values.forEach((subItem) => {
                  if (tableSettings.includes(subItem.id)) {
                    obj[subItem.id] = subItem.text;
                  }
                });
                tempDataSource.push(obj);
              });
            }
          }

          complianceResponse.response.data.boards[0].items_page.items.forEach(
            (item) => {
              if (item.name.toLowerCase() === filterKey) {
                let monthData = getMonthNameWithYear(item.created_at);
                if (!tempMonthFilter.includes(monthData.value)) {
                  tempMonthFilter.push(monthData.value);
                  tempMonthFilterData.push({
                    label: monthData.label,
                    value: monthData.value,
                  });
                }
              }
            }
          );

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
    if (activeReport === "service") {
      if (id === "name") {
        tempValue = nameValueService;
      } else {
        currentDataService.forEach((item) => {
          if (item.id === id) {
            tempValue = item.text;
          }
        });
      }
    } else {
      if (id === "name") {
        tempValue = nameValue.currentName;
      } else {
        currentData.forEach((item) => {
          if (item.id === id) {
            tempValue = item.text;
          }
        });
      }
    }

    return tempValue;
  };

  const getPreviousMonthChange = (id) => {
    if (id === undefined) {
      return "1 %";
    }
    if (previousData.length === 0 || currentData.length === 0) {
      return "";
    }

    const currentResult = currentData.find((item) => item.id === id);
    const previousResult = previousData.find((item) => item.id === id);
    if (currentResult === undefined || previousResult === undefined) {
      return "";
    }
    const percentageChange =
      ((Number(currentResult.text) - Number(previousResult.text)) /
        Number(previousResult.text)) *
      100;
    return percentageChange.toFixed(1);
  };

  const getColumnTitleForTextChart = (id) => {
    let tempValue = "";

    if (activeReport === "service") {
      allColumnTitleService.forEach((item) => {
        if (item.id === id) {
          tempValue = item.title;
        }
      });
    } else {
      allColumnTitle.forEach((item) => {
        if (item.id === id) {
          tempValue = item.title;
        }
      });
    }

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

  function getRandomColor() {
    // Generate a random integer between 0 and 255
    return Math.floor(Math.random() * 256);
  }

  function hexToRgba(hex, opacity = 1) {
    // Check if hex is undefined or invalid
    if (!hex || typeof hex !== "string" || hex.length !== 7 || hex[0] !== "#") {
      // Return a random RGBA color
      return `rgba(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()}, ${opacity})`;
    }

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
        borderRadius: {
          topLeft: 5, // Set the top-left corner radius
          topRight: 5, // Set the top-right corner radius
          bottomLeft: 0, // No radius for the bottom-left corner
          bottomRight: 0, // No radius for the bottom-right corner
        },
        borderSkipped: false,
        borderWidth: 1,
        // barThickness: 1
      });
    });

    return tempData;
  };

  const getDataSetForHorizontalBarChart = (subItem) => {
    let tempData = [];
    subItem.selectedColumns.forEach((item) => {
      tempData.push({
        label: getColumnTitleForTextChart(item),
        data: [getColumnValueForTextChart(item)],
        backgroundColor: getBgColorForBarChart(subItem, item),
        borderColor: getBorderColorForBarChart(subItem, item),
        borderRadius: {
          topLeft: 0, // Set the top-left corner radius
          topRight: 5, // Set the top-right corner radius
          bottomLeft: 0, // No radius for the bottom-left corner
          bottomRight: 5, // No radius for the bottom-right corner
        },
        borderSkipped: false,
        borderWidth: 1,
        // barThickness: 1
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
        if (item.hasOwnProperty("description") && item.description !== null) {
          description = item.description;
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

  const convertToCSV = (array) => {
    const header =
      Object.keys(array[0])
        .map((item) => getColumnTitleForTextChart(item))
        .join(",") + "\n";
    const rows = array.map((obj) => Object.values(obj).join(",")).join("\n");
    return header + rows;
  };

  const handleExport = () => {
    const filteredData = dataSource
      .filter((item) => selectedRowKeys.includes(item.key))
      .map(({ key, ...rest }) => rest);
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getItemsByMonth = (arr, monthName) => {
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

    // Convert monthName to its corresponding month index
    const monthIndex = monthNames.indexOf(monthName);

    if (monthIndex === -1) {
      // Return an empty array if monthName is invalid
      return [];
    }

    // Filter items that match the given month
    return arr.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate.getUTCMonth() === monthIndex;
    });
  };

  const handleMonthChange = (e) => {
    let newCurrentData = getItemsByMonth(finalData, e);
    let previousMonthData = getPreviousItem(finalData, {
      created_at: newCurrentData[0].created_at,
    });

    setCurrentData(newCurrentData[0].column_values);
    if (previousMonthData === null) {
      setPreviousData([]);
    } else {
      setPreviousData(previousMonthData.column_values);
    }
    setSelectedComplianceMonth(e);
  };

  useEffect(() => {
    if (location.pathname === "/report") {
      document.body.style.backgroundColor = "#F6F6FB"; // Change to red
    }

    return () => {
      document.body.style.backgroundColor = "white"; // Reset to default
    };
  }, []);

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
        subheading="Stay Informed and in control of the overall status of your requests"
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
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          Reports
        </div>
        <div
          style={{
            textAlign: "left",
            marginTop: "12px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Button
            style={{
              fontWeight: "600",
              color: activeReport === "service" ? "white" : "#202223",
              backgroundColor: activeReport === "service" ? "#00bf63" : "white",
              fontSize: "16px",
              border: "none",
              lineHeight: "22.4px",
              height: "40px",
              fontFamily: "Graphie-Regular",
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
              fontFamily: "Graphie-Regular",
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
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              marginLeft: "20px",
              marginRight: "20px",
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
              Compliance Report
            </span>
            <span
              style={{
                background: "#f6f6f7",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              {!noDataCompliance && (
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
              {!noDataCompliance && (
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

        {activeReport === "compliance" && !noDataCompliance && (
          <div>
            {activeView === "list" && (
              <ComplianceReportViewList
                activeReport={activeReport}
                activeView={activeView}
                noData={noData}
                selectedRowKeys={selectedRowKeys}
                handleExport={handleExport}
                dataSource={dataSource}
                tableColumns={tableColumns}
                rowSelection={rowSelection}
              />
            )}

            {activeView === "chart" && (
              <ComplianceReportViewChart
                activeView={activeView}
                activeReport={activeReport}
                noData={noData}
                monthFilterData={monthFilterData}
                hexToRgba={hexToRgba}
                getDataSetForVerticalBarChart={getDataSetForVerticalBarChart}
                getStepSizeForVerticalBarChart={getStepSizeForVerticalBarChart}
                getMaxForVerticalBarChart={getMaxForVerticalBarChart}
                complianceReportSettingData={complianceReportSettingData}
                complianceReportViewData={complianceReportViewData}
                getDescriptionForColumn={getDescriptionForColumn}
                getPreviousMonthChange={getPreviousMonthChange}
                getColumnValueForTextChart={getColumnValueForTextChart}
                getColumnTitleForTextChart={getColumnTitleForTextChart}
                getBgSquareColor={getBgSquareColor}
                getColumnPercentage={getColumnPercentage}
                getDataSetForHorizontalBarChart={
                  getDataSetForHorizontalBarChart
                }
                handleMonthChange={handleMonthChange}
                selectedComplianceMonth={selectedComplianceMonth}
                previousData={previousData}
              />
            )}
          </div>
        )}

        {noDataCompliance && activeReport === "compliance" && (
          <EmptyReports activeReport={activeReport} />
        )}
        {noDataService && activeReport === "service" && (
          <EmptyReports activeReport={activeReport} />
        )}

        {activeReport === "service" && !noDataService && (
          <ServiceReportViewChart
            activeReport={activeReport}
            noData={noData}
            noDataService={noDataService}
            loading={loading}
            setLoading={setLoading}
            getPieChartDataSet={getPieChartDataSet}
            getPieChartBg={getPieChartBg}
            getPieChartLabel={getPieChartLabel}
            getPieChartBorder={getPieChartBorder}
            getDataSetForVerticalBarChart={getDataSetForVerticalBarChart}
            getStepSizeForVerticalBarChart={getStepSizeForVerticalBarChart}
            getMaxForVerticalBarChart={getMaxForVerticalBarChart}
            hexToRgba={hexToRgba}
            serviceReportViewData={serviceReportViewData}
            getColumnTitleForTextChart={getColumnTitleForTextChart}
            getColumnValueForTextChart={getColumnValueForTextChart}
          />
        )}
      </div>
    </div>
  );
};
