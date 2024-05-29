import React from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";

const Home = () => {
	// const [state, setState] = useState(false);

	// const fetchData = async () => {
	// 	var myHeaders = new Headers();
	// 	myHeaders.append("Accept", "application/json");
	// 	myHeaders.append("Content-Type", "application/json");
	// 	myHeaders.append(
	// 		"Authorization",
	// 		"bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDEiLCJpYXQiOjE3MTUwNjQ4NTAsImV4cCI6MTcxNTA2ODQ1MCwibmJmIjoxNzE1MDY0ODUwLCJqdGkiOiJPczZpb0Rid1lEVHhnOHZtIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.eZ27uvzxGpMHvKOkkx-8ntPghrXA5j4_2cd7z0Qn-T0"
	// 	);
	// 	var requestOptions = {
	// 		method: "GET",
	// 		headers: myHeaders,
	// 		redirect: "follow",
	// 	};
	// 	fetch(process.env.REACT_APP_API_PATH + "incorpify", requestOptions)
	// 		.then((response) => response.text())
	// 		.then((result) => {
	// 			setState(JSON.stringify(result));
	// 		})
	// 		.catch((error) => console.log("error", error));
	// };

	// useEffect(() => {
	// 	fetchData();
	// }, []);
	return (
		<>
			<HeadTitle />
			<SearchBox/>
			<InternalTab />
						
		</>
	);
};

export default Home;
