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
  const [complianceReportFilterData, setComplianceReportFilterData] = useState(
    {}
  );

  const [serviceReportViewData, setServiceReportViewData] = useState([]);
  const [serviceReportSettingData, setServiceReportSettingData] = useState({});
  const [monthFilterData, setMonthFilterData] = useState([]);
  const [nameValue, setNameValue] = useState({
    currentName: "",
    previousName: "",
  });
  const [finalData, setFinalData] = useState({});
  const [selectedComplianceMonth, setSelectedComplianceMonth] = useState(null);
  const [noDataComplianceList, setNoDataComplianceList] = useState(false);
  const [noDataComplianceChart, setNoDataComplianceChart] = useState(false);
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

  const getLatestItem = (arr, dateFilter) => {
    return arr.reduce((latest, current) => {
      // Find the date in the current item's column_values array
      const currentDate = current.column_values.find(
        (col) => col.id === dateFilter
      )?.text;
      // Find the date in the latest item's column_values array
      const latestDate = latest.column_values.find(
        (col) => col.id === dateFilter
      )?.text;

      // Compare the two dates
      return new Date(currentDate) > new Date(latestDate) ? current : latest;
    });
  };

  const getDateFromLatestItem = (latestItem, dateFilter) => {
    let dateString = "";
    latestItem.column_values.forEach((item) => {
      if (item.id === dateFilter) {
        dateString = item.text;
      }
    });

    return dateString;
  };

  const getPreviousItem = (arr, dateFilter, currentData) => {
    // Helper function to get the text value from the subItem based on dateFilter
    const getTextFromColumnValues = (item) => {
      const subItem = item.column_values.find((col) => col.id === dateFilter);
      return subItem ? subItem.text : null;
    };

    // Sort the array by the date value extracted from subItem.text
    const sortedArr = arr.slice().sort((a, b) => {
      const dateA = new Date(getTextFromColumnValues(a));
      const dateB = new Date(getTextFromColumnValues(b));

      // Handle cases where date is null
      if (!dateA || !dateB) {
        return 0;
      }
      return dateA - dateB;
    });

    // Find the index of the currentData based on subItem.text === currentData.created_at
    const currentIndex = sortedArr.findIndex(
      (item) => getTextFromColumnValues(item) === currentData.created_at
    );
    // Return the previous item if it exists
    return currentIndex > 0 ? sortedArr[currentIndex - 1] : null;
  };

  const getDateFormatForReportDate = (dateString) => {
    const inputDate = new Date(dateString);
    const formattedDate = inputDate.toLocaleDateString("en-US", {
      month: "short", // Abbreviated month name
      day: "numeric", // Numeric day of the month
      year: "numeric", // Numeric year
    });

    return formattedDate;
  };

  const getMonthDateYearFormat = (input) => {
    const dateObj = new Date(input);

    // Format the date
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  function reorderByDate(arr, key) {
    return arr.sort((a, b) => {
      // Extract date strings and parse them into Date objects
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);

      // Compare dates in descending order (new to old)
      return dateB - dateA; // Newest first, oldest last
    });
  }

  function createGroupedItems(dataArray) {
    // Helper function to get the month and year from a date string
    function getMonthYear(dateStr) {
      const date = new Date(dateStr);
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      return `${month} ${year}`;
    }

    // Group the data by month and year
    const groupedItems = dataArray.reduce((acc, item) => {
      const groupLabel = getMonthYear(item.value);

      // Check if the group for this month and year exists
      const existingGroup = acc.find((group) => group.label === groupLabel);

      const child = {
        key: item.value, // Use the value as the key
        label: item.label,
        data: item.data,
        name: item.name,
      };

      if (existingGroup) {
        // If the group exists, add the child to the group's children
        existingGroup.children.push(child);
      } else {
        // If the group doesn't exist, create a new group
        acc.push({
          key: `${acc.length + 1}`, // Generate a unique key for the group
          type: "group",
          label: groupLabel,
          children: [child],
        });
      }

      return acc;
    }, []);

    return groupedItems;
  }

  const fetchData = async () => {
    setLoading(true);
    let noDataTempServiceChart = false;
    let noDataTempComplianceChart = false;
    let noDataTempComplianceList = false;
    const tempData = [];
    const tempDataIfFilterIsNotName = [];
    const tempDataService = [];
    const tempComplianceTableComlumns = [];
    const complianceTableDataSource = [];
    const tempMonthFilter = [];
    const tempMonthFilterData = [];
    const complianceTempNameValue = {
      currentName: "",
      previousName: "",
    };
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

      const complianceTableData = JSON.parse(
        response.response[0].governify_table_settings
      );
      const complianceChartData = JSON.parse(
        response.response[0].governify_compliance_report_view
      );

      const complianceFilterKeyData = JSON.parse(
        response.response[0].governify_compliance_filter_key
      );

      const serviceFilterKeyData = JSON.parse(
        response.response[0].governify_service_filter_key
      );

      const serviceChartData = JSON.parse(
        response.response[0].governify_service_report_view
      );

      if (!complianceResponse.status) {
        noDataTempComplianceChart = true;
        noDataTempComplianceList = true;

        // setNoDataComplianceChart(true);
      }

      if (!serviceResponse.status) {
        noDataTempServiceChart = true;

        // setNoDataService(true);
      }

      if (complianceTableData === null) {
        noDataTempComplianceList = true;
        // setNoDataComplianceList(true);
      }

      if (complianceChartData === null) {
        noDataTempComplianceChart = true;
        // setNoDataComplianceChart(true);
      }

      if (serviceChartData === null) {
        noDataTempServiceChart = true;
        // setNoDataService(true);
      }

      if (
        complianceFilterKeyData.key === null ||
        complianceFilterKeyData.value === null ||
        complianceFilterKeyData.date_key === null
      ) {
        noDataTempComplianceChart = true;
        noDataTempComplianceList = true;
      }

      //////compliance table data preparation
      if (complianceResponse.status && complianceTableData !== null) {
        ///building compliance table Headers
        JSON.parse(response.response[0].governify_table_settings).forEach(
          (item, index) => {
            complianceResponse.response.data.boards[0].columns.forEach(
              (subItem) => {
                if (item === subItem.id) {
                  tempComplianceTableComlumns.push({
                    title: (
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          fontFamily: "Graphie-SemiBold",
                        }}
                      >
                        {subItem.title}
                      </span>
                    ),
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

        ///building table dataSource
        const filterKey = complianceFilterKeyData.key;
        const filterValue = complianceFilterKeyData.value.toLowerCase();

        if (filterKey !== null && filterValue !== null) {
          if (filterKey === "name") {
            complianceResponse.response.data.boards[0].items_page.items.forEach(
              (item, index) => {
                if (item.name.toLowerCase() === filterValue) {
                  let obj = { key: index };
                  item.column_values.forEach((subItem) => {
                    if (
                      JSON.parse(
                        response.response[0].governify_table_settings
                      ).includes(subItem.id)
                    ) {
                      if (subItem.type === "date") {
                        obj[subItem.id] = getDateFormatForReportDate(
                          subItem.text
                        );
                      } else {
                        obj[subItem.id] = subItem.text;
                      }
                    }
                  });

                  complianceTableDataSource.push(obj);
                }
              }
            );
          } else {
            const tableParentColumn = [];
            // const complianceFilterKey = JSON.parse(
            //   response.response[0].governify_compliance_filter_key
            // );
            const tableSettings = JSON.parse(
              response.response[0].governify_table_settings
            );
            const boards =
              complianceResponse.response.data.boards[0].items_page.items;

            boards.forEach((item, index) => {
              item.column_values.forEach((subItem) => {
                if (subItem.text) {
                  // Ensure subItem.text is not null or undefined
                  const isMatchingKey = subItem.id === filterKey;
                  const isMatchingValue =
                    subItem.text.toLowerCase() === filterValue;
                  if (isMatchingKey && isMatchingValue) {
                    tableParentColumn.push(item);
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
                complianceTableDataSource.push(obj);
              });
            }
          }
        } else {
          complianceResponse.response.data.boards[0].items_page.items.forEach(
            (item, index) => {
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

              complianceTableDataSource.push(obj);
            }
          );
        }
        if (complianceTableDataSource.length === 0) {
          noDataTempComplianceList = true;
        }

        setAllTableColumns(tempComplianceTableComlumns);
        setDataSource(complianceTableDataSource);
      }

      ////compliance Chart DataPreparation
      if (complianceResponse.status && complianceChartData !== null) {
        setComplianceReportFilterData(complianceFilterKeyData);
        setComplianceReportViewData(complianceChartData);
        setComplianceReportSettingData(
          JSON.parse(response.response[0].governify_service_report)
        );
        setAllColumnTitle(complianceResponse.response.data.boards[0].columns);
        const filterKey = complianceFilterKeyData.key;
        const filterValue = complianceFilterKeyData.value.toLowerCase();
        const dateFilter = complianceFilterKeyData.date_key;

        if (filterKey !== null && filterValue !== null && dateFilter !== null) {
          if (filterKey === "name") {
            complianceResponse.response.data.boards[0].items_page.items.forEach(
              (item) => {
                if (item.name.toLowerCase() === filterValue) {
                  item.column_values.forEach((subItem) => {
                    if (subItem.id === dateFilter) {
                      let tempMonthName = getMonthDateYearFormat(subItem.text);
                      tempData.push({
                        label: tempMonthName,
                        value: tempMonthName,
                        data: item.column_values,
                        name: item.name,
                      });
                    }
                  });
                }
              }
            );

            if (tempData.length === 0) {
              noDataTempComplianceChart = true;
            } else {
              let newMonthDataFinalOrdered = reorderByDate(tempData, "value");
              let tempName = {
                currentName: newMonthDataFinalOrdered[0].name,
                previousName: "",
              };
              setFinalData(newMonthDataFinalOrdered);
              setCurrentData(newMonthDataFinalOrdered[0].data);
              if (newMonthDataFinalOrdered.length > 1) {
                tempName.previousName = newMonthDataFinalOrdered[1].name;
                setPreviousData(newMonthDataFinalOrdered[1].data);
              }
              setNameValue(tempName);
              setSelectedComplianceMonth(newMonthDataFinalOrdered[0]);
            }
          } else {
            complianceResponse.response.data.boards[0].items_page.items.forEach(
              (item) => {
                item.column_values.forEach((subItem) => {
                  if (subItem.text !== null) {
                    if (
                      subItem.id === filterKey &&
                      subItem.text === filterValue
                    ) {
                      tempDataIfFilterIsNotName.push(item);
                    }
                  }
                });
              }
            );

            if (tempDataIfFilterIsNotName.length === 0) {
              noDataTempComplianceChart = true;
            } else {
              let tempNewData = [];
              tempDataIfFilterIsNotName.forEach((item) => {
                item.column_values.forEach((subItem) => {
                  if (subItem.id === dateFilter) {
                    let tempMonthName = getMonthDateYearFormat(subItem.text);
                    tempNewData.push({
                      label: tempMonthName,
                      value: tempMonthName,
                      data: item.column_values,
                      name: item.name,
                    });
                  }
                });
              });

              let newMonthDataFinalOrdered = reorderByDate(
                tempNewData,
                "value"
              );
              let tempName = {
                currentName: newMonthDataFinalOrdered[0].name,
                previousName: "",
              };

              setFinalData(newMonthDataFinalOrdered);
              setCurrentData(newMonthDataFinalOrdered[0].data);
              if (newMonthDataFinalOrdered.length > 1) {
                setPreviousData(newMonthDataFinalOrdered[1].data);
                tempName.previousName = newMonthDataFinalOrdered[1].name;
              }
              setNameValue(tempName);
              setSelectedComplianceMonth(newMonthDataFinalOrdered[0]);
            }
          }
        }
      }

      ////compliance Month Filter Data Preparation
      if (complianceResponse.status && complianceChartData !== null) {
        const tempCollectionOfMontFilter = [];
        const filterKey = complianceFilterKeyData.key;
        const filterValue = complianceFilterKeyData.value.toLowerCase();
        const dateFilter = complianceFilterKeyData.date_key;
        if (filterKey !== null && filterValue !== null) {
          if (filterKey === "name") {
            complianceResponse.response.data.boards[0].items_page.items.forEach(
              (item) => {
                if (item.name.toLowerCase() === filterValue) {
                  tempCollectionOfMontFilter.push(item);
                }
              }
            );
          } else {
            complianceResponse.response.data.boards[0].items_page.items.forEach(
              (item) => {
                item.column_values.forEach((subItem) => {
                  if (subItem.text !== null) {
                    if (
                      subItem.id === filterKey &&
                      subItem.text === filterValue
                    ) {
                      tempCollectionOfMontFilter.push(item);
                    }
                  }
                });
              }
            );
          }

          if (tempCollectionOfMontFilter.length > 0) {
            tempCollectionOfMontFilter.forEach((item) => {
              item.column_values.forEach((subItem) => {
                if (subItem.id === dateFilter) {
                  let tempMonthName = getMonthDateYearFormat(subItem.text);
                  tempMonthFilterData.push({
                    label: tempMonthName,
                    value: tempMonthName,
                    data: item.column_values,
                    name: item.name,
                  });
                }
              });
            });
          }
        } else {
          noDataTempComplianceChart = true;
        }

        let newMonthDataFinalOrdered = reorderByDate(
          tempMonthFilterData,
          "value"
        );
        let monthDropDownData = createGroupedItems(newMonthDataFinalOrdered);
        setMonthFilterData(monthDropDownData);
      }

      /////Service Chart Data Preparation
      if (serviceResponse.status && serviceChartData !== null) {
        setServiceReportSettingData(
          JSON.parse(response.response[0].governify_service_report)
        );
        setServiceReportViewData(serviceChartData);
        const serviceFilterKey = serviceFilterKeyData.key;
        const serviceFilterValue = serviceFilterKeyData.value.toLowerCase();
        const serviceDateFilter = serviceFilterKeyData.date_key;
        setAllColumnTitleService(
          serviceResponse.response.data.boards[0].columns
        );

        if (serviceFilterKey !== null && serviceFilterValue !== null) {
          if (serviceFilterKey === "name") {
            serviceResponse.response.data.boards[0].items_page.items.forEach(
              (item) => {
                if (item.name.toLowerCase() === serviceFilterValue) {
                  tempDataService.push(item);
                }
              }
            );
          } else {
            serviceResponse.response.data.boards[0].items_page.items.forEach(
              (item) => {
                item.column_values.forEach((subItem, subIndex) => {
                  if (subItem.text) {
                    if (
                      subItem.id === serviceFilterKey &&
                      subItem.text.toLowerCase() === serviceFilterValue
                    ) {
                      tempDataService.push(item);
                    }
                  }
                });
              }
            );
          }

          if (tempDataService.length > 0) {
            const latestItem = getLatestItem(
              tempDataService,
              serviceDateFilter
            );
            setCurrentDataService(latestItem.column_values);
            setNameValueService(latestItem.name);
          } else {
            noDataTempServiceChart = true;
          }
        } else {
          noDataTempServiceChart = true;
        }
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      if (noDataTempServiceChart) {
        setNoDataService(true);
      }
      if (noDataTempComplianceChart) {
        setNoDataComplianceChart(true);
      }
      if (noDataTempComplianceList) {
        setNoDataComplianceList(true);
        setActiveView("chart");
      }
      setLoading(false);
    }
  };

  const handleMenuClick = (e) => {

    finalData.forEach((item , index) =>{
      if(e.key === item.value){
        setSelectedComplianceMonth(item);
        setCurrentData(item.data)
        let tempName = {currentName: item.name , previousName:''};
        if (index === finalData.length - 1) {
          setPreviousData([]);
          setNameValue(tempName);
        } else {
          tempName.previousName = finalData[index + 1].name;
          setPreviousData(finalData[index + 1].data);
          setNameValue(tempName);
        }
      }
    })
   
    // for (const group of monthFilterData) {
    //   const selectedChild = group.children.find((child) => child.key === e.key);
    //   if (selectedChild) {
    //     setSelectedComplianceMonth(selectedChild);
    //     setCurrentData(selectedChild.data)
    //     break;
    //   }
    // }
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

  const getDataSetForVerticalBarChart = (subItem) => {
    let tempData = [];
    subItem.selectedColumns.forEach((item) => {
      tempData.push({
        label: getColumnTitleForTextChart(item),
        data: [getColumnValueForTextChart(item)],
        backgroundColor: getBgColorForBarChart(subItem, item),
        borderColor: "transparent",
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
        borderColor: "transparent",
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

    const getItemDate = (columns) => {
      const tempDateFilter = complianceReportFilterData.date_key;
      let tempDate;
      columns.column_values.forEach((subItem) => {
        if (subItem.id === tempDateFilter) {
          tempDate = subItem.text;
        }
      });
      return tempDate;
    };

    if (monthIndex === -1) {
      // Return an empty array if monthName is invalid
      return [];
    }

    // Filter items that match the given month
    return arr.filter((item) => {
      const itemDate = new Date(getItemDate(item));
      return itemDate.getUTCMonth() === monthIndex;
    });
  };

  const getPreviousDate = (tempData, dateFilter) => {
    let tempPreviousDate;
    tempData[0].column_values.forEach((item) => {
      if (item.id === dateFilter) {
        tempPreviousDate = item.text;
      }
    });
    return tempPreviousDate;
  };

  const getKeyFromAllColumn = (key) => {
    let tempValue;
    allColumnTitle.forEach((item) => {
      if (item.id === key) {
        tempValue = item.title;
      }
    });
    return tempValue;
  };

  const getTooltipData = (tempData) => {
    let tempCurrentArr = [];
    let tempPreviousArr = [];

    currentData.forEach((item) => {
      if (tempData.selectedColumns.includes(item.id)) {
        tempCurrentArr.push({
          key: getKeyFromAllColumn(item.id),
          value: item.text,
        });
      }
    });

    previousData.forEach((item) => {
      if (tempData.selectedColumns.includes(item.id)) {
        tempPreviousArr.push({
          key: getKeyFromAllColumn(item.id),
          value: item.text,
        });
      }
    });
    return { tempCurrentArr, tempPreviousArr };
  };

  const handleMonthChange = (e) => {
    let newCurrentData = getItemsByMonth(finalData, e);

    let newPreviousDate = getPreviousDate(
      newCurrentData,
      complianceReportFilterData.date_key
    );

    let previousMonthData = getPreviousItem(
      finalData,
      complianceReportFilterData.date_key,
      {
        created_at: newPreviousDate,
      }
    );

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
            fontFamily: "Graphie-SemiBold",
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
            <span style={{ fontFamily: "Graphie-SemiBold" }}>
              {" "}
              Service Reports
            </span>
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
              // fontFamily: "Graphie-Regular",
              fontFamily: "Graphie-Bold",
            }}
            onClick={() => handleButtonClick("compliance")}
            icon={<ComplianceReportIcon activeReport={activeReport} />}
            iconPosition="start"
          >
            <span style={{ fontFamily: "Graphie-SemiBold" }}>
              {" "}
              Compliance Reports
            </span>
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
                fontFamily: "Graphie-SemiBold",
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
              {!(noDataComplianceList || noDataComplianceChart) && (
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
                  <span
                    style={{
                      fontFamily: "Graphie-SemiBold",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    List View
                  </span>
                </Button>
              )}
              {!(noDataComplianceList || noDataComplianceChart) && (
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

        {activeReport === "compliance" && !noDataComplianceList && (
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
          </div>
        )}

        {activeReport === "compliance" && !noDataComplianceChart && (
          <div>
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
                getTooltipData={getTooltipData}
                handleMenuClick={handleMenuClick}
              />
            )}
          </div>
        )}
        {noDataComplianceChart &&
          noDataComplianceList &&
          activeReport === "compliance" && (
            <EmptyReports activeReport={activeReport} />
          )}
        {noDataService && activeReport === "service" && (
          <EmptyReports activeReport={activeReport} />
        )}

        {activeReport === "service" && !noDataService && (
          <ServiceReportViewChart
            activeReport={activeReport}
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
            getTooltipData={getTooltipData}
            previousData={previousData}
            getPreviousMonthChange={getPreviousMonthChange}
            getBgSquareColor={getBgSquareColor}
            getColumnPercentage={getColumnPercentage}
            getDescriptionForColumn={getDescriptionForColumn}
          />
        )}
      </div>
    </div>
  );
};
