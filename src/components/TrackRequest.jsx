import { useLocation } from "react-router-dom"
import Hero from "./common/Hero"
import { BreadcrumbComponent } from "./common/BreadcrumbComponent";
import { SearchBox } from "./common/SearchBox";
import { RequestComponent } from "./RequestComponent";
import { SortingAndFilterComponent } from "./common/SortingAndFilterComponent";
import { useEffect } from "react";
import { fetcher } from "../utils/helper";

export const TrackRequest = () =>{

    const location = useLocation();
    const breadCrumbData = location.pathname.split('/'); 

    const fetchData = async() =>{
        try{
            let url = 'governify/customer/requestTracking';
            let method = 'GET';
            const response = await fetcher(url , method);
            console.log(response)
        }catch(err){
            console.log(err , 'error');
        }
    }

    useEffect(()=>{
        fetchData();
    } ,[])


    return (
        <div style={{paddingLeft:"16px" , paddingRight:"16px"}}>
            <Hero
				heading={"Request Tracking"}
				subheading="Track your onboarding progress effortlessly by using our request-tracking center."
				forHome={false}
			/>
            <BreadcrumbComponent data={breadCrumbData} />
            <SearchBox />
            <SortingAndFilterComponent />
            <RequestComponent />
            
        </div>
    )
}