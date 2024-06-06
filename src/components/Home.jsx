import React, { useEffect, useState } from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";
import { fetcher } from "../utils/helper";

const Home = () => {
  const [dashboardData, setDashboardData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await fetcher(
        "http://127.0.0.1:8000/governify/customer/dashboard",
        "GET"
      );
      setDashboardData(response.response); // Assuming response structure is { response: [...] }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error, show message, etc.
    }
  };

  useEffect(() => {
    getDashboardData();

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, []);

  return (
    <>
      <HeadTitle />
      <SearchBox />
      <InternalTab data={dashboardData} />
    </>
  );
};

export default Home;
