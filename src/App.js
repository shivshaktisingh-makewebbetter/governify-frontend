import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import AuthWrapper from "./components/wrapper/AuthWrapper";
import PanelWrapper from "./components/wrapper/PanelWrapper";
import ErrorPage from "./components/fallbacks/ErrorPage";
import { TrackRequest } from "./components/TrackRequest";
import { Adminhome } from "./components/admin/Adminhome";
import { Category } from "./components/admin/Category";
import { Services } from "./components/admin/Services";
import { Forms } from "./components/admin/Forms";
import AdminPanelWrapper from "./components/admin/AdminPanelWrapper";
import { ConfigProvider } from "antd";
import { settings } from "./utils/tools";

function App() {
	const {	link_btn_bg , 	link_btn_color,link_headtitle,header_bg, notification_bg} = settings;
	const router = createBrowserRouter([
		{
			path: "/*",
			element: <AuthWrapper />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: "*",
					element: <PanelWrapper />,
					children: [
						{
							path: "",
							element: <Home />,
							// element: <Rolewrapper role={['user']}><Home /></Rolewrapper> , 

						},
						{
							path: "track-request",
							element: <TrackRequest />,
						},
						{
							path: "admin",
							element: <AdminPanelWrapper />,
							children: [
								{
									path: "",
									element: <Adminhome />,
								},
								{
									path: "categories",
									element: <Category />,
								},
								{
									path: "services",
									element: <Services />,
								},
								{
									path: "forms",
									element: <Forms />,
								},
								,]
						},

					],
				},
				{
					path: "*",
					element: <>NO PAGE FOUND</>
				}
			],
		},
	]);

	return <ConfigProvider
		theme={{
			components: {
				Table: {
				
					headerBg: link_headtitle ,
					headerColor: link_btn_color
				},
			},
		}}
	>
		<RouterProvider router={router} />
	</ConfigProvider>

}

export default App;
