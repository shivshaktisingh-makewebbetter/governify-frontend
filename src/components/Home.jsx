import React, { useEffect } from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";
import { fetcher } from "../utils/helper";

const Home = () => {

	useEffect(async()=>{

		const response = await fetcher('http://127.0.0.1:8000/governify/customer/dashboard' , 'GET');
		console.log(response);

	} ,[])
	
	return (
		<>
			<HeadTitle />
			<SearchBox/>
			<InternalTab />
						
		</>
	);
};

export default Home;
