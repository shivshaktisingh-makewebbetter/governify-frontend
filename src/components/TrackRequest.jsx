import { useLocation } from "react-router-dom"
import Hero from "./common/Hero"
import { BreadcrumbComponent } from "./common/BreadcrumbComponent";
import { SearchBox } from "./common/SearchBox";
import { RequestComponent } from "./RequestComponent";
import { SortingAndFilterComponent } from "./common/SortingAndFilterComponent";

export const TrackRequest = () =>{

    const location = useLocation();
    const breadCrumbData = location.pathname.split('/'); 


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