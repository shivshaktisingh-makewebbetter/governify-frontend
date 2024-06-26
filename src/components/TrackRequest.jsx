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

let flag = false;

export const TrackRequest = () => {
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
  const [currentPage , setCurrentPage] = useState(1);
  const [filterKeyValues, setFilterKeyValus] = useState({
    1: "Done",
    2: "Pending",
    0: "In Progress",
    3: "Canceled",
    5: "Awaiting Action",
  });

  const onChange = (pageNumber) => {
    const tempData = [...originalArray];
    const from = (pageNumber - 1) * 10;
    const to = dataLength < pageNumber * 10 ? dataLength : pageNumber * 10;
    const newData = tempData.slice(from, to);
    setData(newData);
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
      setData(response.response.data.boards[0].items_page.items.slice(0 , 10));
    } catch (err) {
      console.log(err, "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };


  useEffect(() => {
    if(flag){
      onChangeSearchData();

    }

    setTimeout(()=>{
      flag = true;
    } , 2000)
  }, [selectedOrder, selectedFilter, searchData]);

  useEffect(()=>{
   fetchData();
  } ,[])

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
        <FilterBy items={statusItems} setSelectedFilter={setSelectedFilter}/>
        <ExportBy />
      </div>
      <RequestComponent data={data} boardId={boardId} fetchData={fetchData} />
      <Pagination
        showQuickJumper
        total={dataLength}
        onChange={onChange}
        showTotal={(total) => `Total ${total} items`}
        current={currentPage}
      />

    </div>
  );
};
