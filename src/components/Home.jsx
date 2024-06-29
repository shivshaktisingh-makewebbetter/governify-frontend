import React, { useEffect, useState, useRef } from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";
import { fetcher } from "../utils/helper";
import { Loader } from "./common/Loader";
import { userSettingData } from "../utils/tools";

const Home = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardDataFixed, setDashboardDataFixed] = useState([]);
  const [searchData, setSearchData] = useState("");
  const interval = useRef(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetcher("governify/customer/dashboardata", "GET");
      setDashboardData(response.response); // Assuming response structure is { response: [...] }
      setDashboardDataFixed(response.response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error, show message, etc.
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const getSearchedServices = () => {
    const foundData = [];
    const tempDashboardData = [...dashboardDataFixed];
    const uniqueItems = new Set();


    tempDashboardData.forEach((item) => {
      if(item.service_requests.length > 0){

      
      item.service_requests.forEach((subItem) => {
        if (subItem.service_request.title.includes(searchData)) {
         
          if (!uniqueItems.has(item)) {
            foundData.push(item);
            uniqueItems.add(item);
          }
        }
      });
    }});

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
  }, [token]);

  useEffect(() => {
    if (searchData.length > 0) {
      if (interval.current) {
        clearTimeout(interval.current);
      }
      interval.current = setTimeout(() => {
        getSearchedServices();
      }, 1000);
    } else {
      setDashboardData(dashboardDataFixed);
    }

    return () => {
      if (interval.current) {
        clearTimeout(interval.current);
      }
    };
  }, [searchData]);

  useEffect(() => {
    userSettingData();
    return () => {};
  }, [token]);

  useEffect(() => {
    // Your function to call on reload
    const handleReload = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(true);
      }, 2000);
    };

    handleReload();
  }, []); //

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <HeadTitle />

      <SearchBox setSearchData={setSearchData} />
      <InternalTab data={dashboardData} />
    </>
  );
};

export default Home;
