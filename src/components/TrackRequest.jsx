import { useLocation } from "react-router-dom";
import Hero from "./common/Hero";
import { BreadcrumbComponent } from "./common/BreadcrumbComponent";
import { SearchBox } from "./common/SearchBox";
import { RequestComponent } from "./RequestComponent";
import { useEffect, useState } from "react";
import { fetcher } from "../utils/helper";
import { Radio } from "antd";
import { SortBy } from "./SortBy";
import { FilterBy } from "./FilterBy";
import { ExportBy } from "./ExportBy";
import { Loader } from "./common/Loader";
import { Pagination } from "antd";
import { userSettingData } from "../utils/tools";

let flag = false;

export const TrackRequest = () => {
  const token = sessionStorage.getItem("token");
  const [clonedData, setClonedData] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [data, setData] = useState([]);
  const [boardId, setBoardId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(9);
  const [statusItems, setStatusItems] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLength, setDataLength] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKeyValues, setFilterKeyValus] = useState({
    1: "Done",
    2: "Pending",
    0: "In Progress",
    3: "Canceled",
    5: "Awaiting Action",
  });
const [limit , setLimit] = useState(10);

  const onChange = (pageNumber) => {
   setCurrentPage(pageNumber);
  };

  const items = [
    {
      key: "1",
      label: (
        <Radio.Group
          onChange={() => onChangeRadio("ASC")}
          value={selectedOrder}
        >
          <Radio value={1}>Asc</Radio>
        </Radio.Group>
      ),
    },
    {
      key: "2",
      label: (
        <Radio.Group
          onChange={() => onChangeRadio("DESC")}
          value={selectedOrder}
        >
          <Radio value={2}>Desc</Radio>
        </Radio.Group>
      ),
    },
  ];

  const onChangeRadio = (item) => {
    if (item === "ASC") {
      setSelectedOrder(1);
    }
    if (item === "DESC") {
      setSelectedOrder(2);
    }
  };

  const onChangeRadioFilter = (key, value) => {
    setSelectedFilter(key);
  };

  const location = useLocation();
  const breadCrumbData = location.pathname.split("/");

  const getFilterColumns = (items) => {
    let listOfStatus = {};
    items.forEach((subItem) => {
      if (subItem.title === "Overall Status") {
        listOfStatus = JSON.parse(subItem.settings_str);
      }
    });

    let updatedFilterColumn = [
      {
        key: 1,
        label: (
          <Radio.Group
            onChange={() => onChangeRadioFilter(9, "All")}
            value={selectedFilter}
          >
            <Radio value={9}>All</Radio>
          </Radio.Group>
        ),
      },
    ];

    Object.entries(listOfStatus.labels).forEach(([key, value], index) => {
      updatedFilterColumn.push({
        key: index + 2,
        label: (
          <Radio.Group
            onChange={() => onChangeRadioFilter(key, value)}
            value={selectedFilter}
          >
            <Radio value={key}>{value}</Radio>
          </Radio.Group>
        ),
      });
    });

    setStatusItems(updatedFilterColumn);
  };

  const filterDataBySearchString = (data, searchString) => {
    return data.filter((item) => item.name.includes(searchString));
  };

  const onShowSizeChange = (current , size) =>{
    
    // const tempData = [...originalArray];
    // const from = (pageNumber - 1) * size;
    // const to = dataLength < pageNumber * size ? dataLength : pageNumber * size;
    // const newData = tempData.slice(from, to);
    // setData(newData);
    // setCurrentPage(current);
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
    // setLimit(size);
    setLimit(size)
  }

  const sortData = (data, order) => {
    return order === 1 ? data : data.slice().reverse();
  };

  const handleFilter = (data, filter) => {
    if (filter == 9) {
      return data;
    }
    const tempFilterArray = [];
    data.forEach((item) => {
      item.column_values.forEach((subItem) => {
        if (subItem.id === "status__1") {
          if (subItem.label === filterKeyValues[selectedFilter]) {
            tempFilterArray.push(item);
          }
        }
      });
    });
    return tempFilterArray;
  };

  const getStatusValue = (tempData) => {
    let tempValue = "";
    tempData.forEach((item) => {
      if (item.id === "status__1") {
        tempValue = item.text;
      }
    });
    return tempValue;
  };

  const getFormInformation = (tempData) => {
    let tempValue = "";
    tempData.forEach((item) => {
      if (item.id === "form_infomation__1") {
        tempValue = item.text;
      }
    });

    return tempValue;
  };

  const getCategory = (tempData) => {
    let tempValue = "";
    tempData.forEach((item) => {
      if (item.id === "service_category__1") {
        tempValue = item.text;
      }
    });

    return tempValue;
  };

  const handleExport = () => {
    let tempData = [...data];
    const dataFormatToPrepare = [
      [
        "Name Of Service",
        "Category Of Service",
        "Created Date",
        "Status",
        "Form Information",
      ],
    ];
    tempData.forEach((item) => {
      let createdAt = item.created_at;
      let serviceName = item.name;
      let statusValue = getStatusValue(item.column_values);
      let formInformTion = getFormInformation(item.column_values);
      let categoryName = getCategory(item.column_values);
      dataFormatToPrepare.push([
        serviceName,
        categoryName,
        createdAt,
        statusValue,
        formInformTion,
      ]);
    });

    // Convert data array to CSV string
    const csvContent = dataFormatToPrepare
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");

    // Append the link to the body (necessary for Firefox)
    document.body.appendChild(link);

    // Trigger the download by simulating a click on the link
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  const setStateData = (data, length) => {
    setData(data.slice(0, 10));
    setOriginalArray(data);
    setDataLength(length);
    setCurrentPage(1);
  };

  const onChangeSearchData = () => {
    let tempData = [...clonedData];
    if (searchData.length > 0) {
      tempData = filterDataBySearchString(tempData, searchData);
    }
    tempData = sortData(tempData, selectedOrder);
    tempData = handleFilter(tempData, selectedFilter);
    setStateData(tempData, tempData.length);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "governify/customer/requestTracking";
      let method = "POST";
      const response = await fetcher(url, method);
      setBoardId(response.response.data.boards[0].id);
      getFilterColumns(response.response.data.boards[0].columns);
      setDataLength(response.response.data.boards[0].items_page.items.length);
      setOriginalArray(response.response.data.boards[0].items_page.items);
      setClonedData(response.response.data.boards[0].items_page.items);
      setData(response.response.data.boards[0].items_page.items.slice(0, 10));
    } catch (err) {
      console.log(err, "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (flag) {
      onChangeSearchData();
    }

    setTimeout(() => {
      flag = true;
    }, 2000);
  }, [selectedOrder, selectedFilter, searchData]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    userSettingData();
    return () => {};
  }, [token]);

  useEffect(()=>{
    const tempData = [...originalArray];
    const from = (currentPage - 1) * limit;
    const to = dataLength < currentPage * limit ? dataLength : currentPage * limit;
    const newData = tempData.slice(from, to);
    setData(newData);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } , [currentPage , limit])

  return (
    <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
      {loading && <Loader />}
      <Hero
        heading={"Request Tracking"}
        subheading="Easily monitor, manage, and track the status and progress of all your service requests in real-time."
        forHome={false}
      />
      <BreadcrumbComponent data={breadCrumbData} />
      <SearchBox setSearchData={setSearchData} />
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "8px",
          marginBottom: "32px",
        }}
      >
        <SortBy items={items} />
        <FilterBy items={statusItems} setSelectedFilter={setSelectedFilter} />
        <ExportBy handleExport={handleExport} />
      </div>
      <RequestComponent data={data} boardId={boardId} fetchData={fetchData} />
      <Pagination
        showQuickJumper
        total={dataLength}
        onChange={onChange}
        showTotal={(total) => `Total ${total} items`}
        current={currentPage}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        defaultPageSize={10}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
};
