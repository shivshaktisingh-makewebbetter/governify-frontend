import React, { useEffect, useState, useRef } from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";
import { fetcher } from "../utils/helper";

const Home = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardDataFixed, setDashboardDataFixed] = useState([]);
  const [searchData, setSearchData] = useState("");
  const interval = useRef(null);

  const getDashboardData = async () => {
    try {
      const response = await fetcher("governify/customer/dashboard", "GET");
      setDashboardData(response.response); // Assuming response structure is { response: [...] }
      setDashboardDataFixed(response.response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error, show message, etc.
    }
  };

  const getSearchedServices = () => {
    
    const foundData = [];
    const tempDashboardData = [...dashboardDataFixed];
    const uniqueItems = new Set();
  
    tempDashboardData.forEach((item) => {
      item.service_category_request.forEach((subItem) => {
        if (subItem.title.includes(searchData)) {
          if (!uniqueItems.has(item)) {
            foundData.push(item);
            uniqueItems.add(item);
          }
        }
      });
    });
  
    setDashboardData(foundData);
  };
  

  useEffect(() => {
    getDashboardData();

    // Cleanup function
    return () => {
      if (interval.current) {
        clearTimeout(interval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchData.length > 0) {
      if (interval.current) {
        clearTimeout(interval.current);
      }
      interval.current = setTimeout(() => {
        getSearchedServices();
      }, 1000);
    } else {
      setDashboardData(dashboardDataFixed)
    }

    return () => {
      if (interval.current) {
        clearTimeout(interval.current);
      }
    };
  }, [searchData]);

  return (
    <>
      <HeadTitle />
      <SearchBox setSearchData={setSearchData} searchData={searchData} />
      <InternalTab data={dashboardData} />
    </>
  );
};

export default Home;
