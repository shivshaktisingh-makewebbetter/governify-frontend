import React from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";

const Home = () => {
	
	return (
		<>
			<HeadTitle />
			<SearchBox/>
			<InternalTab />
						
		</>
	);
};

export default Home;
