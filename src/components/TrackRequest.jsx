import { useLocation } from "react-router-dom"
import Hero from "./common/Hero"
import { BreadcrumbComponent } from "./common/BreadcrumbComponent";
import { SearchBox } from "./common/SearchBox";
import { RequestComponent } from "./RequestComponent";
import { useEffect, useState  } from "react";
import { fetcher } from "../utils/helper";
import { Radio } from "antd"
import { SortBy } from "./SortBy";
import { FilterBy } from "./FilterBy";
import { ExportBy } from "./ExportBy";
import { Loader } from "./common/Loader";



export const TrackRequest = () =>{
    const [data , setData] = useState([])
    const [boardId , setBoardId] = useState('')
    const [selectedOrder , setSelectedOrder]= useState(1);
    const [selectedFilter , setSelectedFilter]= useState(9);
    const [statusItems , setStatusItems] = useState([]);
    const [searchData , setSearchData]= useState('');
    const [loading , setLoading] = useState(false);

    const items = [
        {
          key: '1',
          label: (
            <Radio.Group onChange={()=>onChangeRadio('ASC')} value={selectedOrder}>
             <Radio value={1}>Asc</Radio>
            </Radio.Group>
    
          ),
        },
        {
          key: '2',
          label: (
            <Radio.Group onChange={()=>onChangeRadio('DESC')} value={selectedOrder}>
             <Radio value={2}>Desc</Radio>
            </Radio.Group>
          ),
        },
        
      ];
      

      const onChangeRadio = (item) =>{
        if(item === 'ASC'){
         setSelectedOrder(1)
        }
        if(item === 'DESC'){
            setSelectedOrder(2)
        }
      }

      const onChangeRadioFilter = (key , value) =>{
        setSelectedFilter(key);
      }

    const location = useLocation();
    const breadCrumbData = location.pathname.split('/'); 

    const getFilterColumns = (items) =>{
        let listOfStatus = {};
     items.forEach((subItem)=>{
        if (subItem.title === 'Overall Status'){
        listOfStatus = JSON.parse(subItem.settings_str)
        }
      })

      let updatedFilterColumn = [{
        key: 1,
        label: (
          <Radio.Group onChange={()=>onChangeRadioFilter(9 ,'All')} value={selectedFilter}>
           <Radio value={9}>All</Radio>
          </Radio.Group>
  
        ),
      }]

      Object.entries(listOfStatus.labels).forEach(([key, value] , index) => {
        updatedFilterColumn.push( {
                  key: index + 2,
                  label: (
                    <Radio.Group onChange={()=>onChangeRadioFilter(key , value)} value={selectedFilter}>
                     <Radio value={key}>{value}</Radio>
                    </Radio.Group>
            
                  ),
                })
    });

        setStatusItems(updatedFilterColumn);
    }

    const onChangeSearchData = (str) =>{
      setSearchData(str);
    }
    console.log(searchData , 'searc')

    const fetchData = async() =>{
      setLoading(true);
        try{
            let url = 'governify/customer/requestTracking';
            let method = 'POST';
            let payload = JSON.stringify({
              "query_params": {
                  "order_by": [
                      {
                          "direction": selectedOrder === 1 ? 'asc' : 'desc',
                          "column_id": "__creation_log__"
                      }
                  ],
                  "rules": [
                      ...(searchData.length > 0 ? [{
                          "column_id": "name",
                          "compare_value": [searchData],
                          "operator": "contains_text"
                      }] : []),
                      ...(selectedFilter !== 9 ? [{
                          "column_id": "status__1",
                          "compare_value": [+selectedFilter]
                      }] : [])
                  ]
              }
          });
                     
            const response = await fetcher(url , method , payload);
            setData(response.response.data.boards[0].items_page.items)
            setBoardId(response.response.data.boards[0].id);
            getFilterColumns(response.response.data.boards[0].columns)
            
        }catch(err){
            console.log(err , 'error');
        }finally{
          setTimeout(()=>{
            setLoading(false);
          } , 2000)

        }
    }

    const getLoginUserDetails = async () =>{
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE4MTgzODgxLCJleHAiOjE3MTg0NDMwODEsIm5iZiI6MTcxODE4Mzg4MSwianRpIjoia1ZHSWE2anJ0dWN3eGN0VSIsInN1YiI6IjM0IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.Gu9flNwjyVUtYkUvAs8FLxG2iw5thl5CMjRcShc0NxI';
        const url = `loginUserDetails/${token}`;
        const method = 'GET';
        const response = await fetcher(url , method)
        if(response.success){
          console.log(response)
          sessionStorage.setItem('userName' , response.data.name );
          sessionStorage.setItem('userEmail' , response.data.email );
        }
      }catch(err){
        console.log(err , 'error')

      }finally{
        setLoading(false);

      }
   }

   useEffect(()=>{
    getLoginUserDetails();
   } , [])

    useEffect(()=>{
     
        fetchData();
    
    } ,[selectedOrder , selectedFilter , searchData])

    if(loading){
      return (
        <Loader/>
      )
    }



    return (
        <div style={{paddingLeft:"16px" , paddingRight:"16px"}}>
            <Hero
				heading={"Request Tracking"}
				subheading="Track your onboarding progress effortlessly by using our request-tracking center."
				forHome={false}
			/>
            <BreadcrumbComponent data={breadCrumbData} />
            <SearchBox onChangeSearchData={onChangeSearchData} searchData={searchData}/>
            <div style={{display:'flex' , justifyContent:'left' , paddingTop:'8px' , marginBottom:'32px'}}>
                <SortBy items={items}/>
                <FilterBy items={statusItems}/>
                <ExportBy />
            </div>
            <RequestComponent data={data} boardId={boardId}/>
            
        </div>
    )
}