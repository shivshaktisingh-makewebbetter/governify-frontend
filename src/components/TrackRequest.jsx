import { useLocation } from "react-router-dom"
import Hero from "./common/Hero"
import { BreadcrumbComponent } from "./common/BreadcrumbComponent";
import { SearchBox } from "./common/SearchBox";
import { RequestComponent } from "./RequestComponent";
import { useEffect, useState } from "react";
import { fetcher } from "../utils/helper";
import { Radio } from "antd"
import { SortBy } from "./SortBy";
import { FilterBy } from "./FilterBy";
import { ExportBy } from "./ExportBy";



export const TrackRequest = () =>{
    const [data , setData] = useState([])
    const [boardId , setBoardId] = useState('')
    const [selectedOrder , setSelectedOrder]= useState(1);
    const [selectedFilter , setSelectedFilter]= useState(1);
    // const [statusItems , setStatusItems] = useState([]);

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
      const statusItems = [
        {
          key: '1',
          label: (
            <Radio.Group onChange={()=>onChangeRadioFilter('all')} value={selectedFilter}>
             <Radio value={1}>All</Radio>
            </Radio.Group>
    
          ),
        },
        {
          key: '2',
          label: (
            <Radio.Group onChange={()=>onChangeRadioFilter('progress')} value={selectedFilter}>
             <Radio value={2}>In Progress</Radio>
            </Radio.Group>
          ),
        },
        {
            key: '3',
            label: (
              <Radio.Group onChange={()=>onChangeRadioFilter('complete')} value={selectedFilter}>
               <Radio value={3}>Done</Radio>
              </Radio.Group>
      
            ),
          },
          {
            key: '4',
            label: (
              <Radio.Group onChange={()=>onChangeRadioFilter('stuck')} value={selectedFilter}>
               <Radio value={4}>Stuck</Radio>
              </Radio.Group>
            ),
          },
        //   {
        //     key: '5',
        //     label: (
        //       <Radio.Group onChange={()=>onChangeRadioFilter('stuck')} value={selectedFilter}>
        //        <Radio value={4}>Cancelled</Radio>
        //       </Radio.Group>
        //     ),
        //   },
        
      ];

      const onChangeRadio = (item) =>{
        if(item === 'ASC'){
         setSelectedOrder(1)
        }
        if(item === 'DESC'){
            setSelectedOrder(2)
        }
      }

      const onChangeRadioFilter = (item) =>{
        if(item === 'all'){
            setSelectedFilter(1)
        }
        if(item === 'progress'){
            setSelectedFilter(2)
        }
        if(item === 'complete'){
            setSelectedFilter(1)
        }
        if(item === 'stuck'){
            setSelectedFilter(2)
        }
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
          <Radio.Group onChange={()=>onChangeRadioFilter('All')} value={selectedFilter}>
           <Radio value={1}>All</Radio>
          </Radio.Group>
  
        ),
      }]
      console.log(listOfStatus.labels , 'updated')

      Object.entries(listOfStatus.labels).forEach(([key, value] , index) => {
        updatedFilterColumn.push( {
                  key: index + 2,
                  label: (
                    <Radio.Group onChange={()=>onChangeRadioFilter(key , value)} value={selectedFilter}>
                     <Radio value={index + 2}>{value}</Radio>
                    </Radio.Group>
            
                  ),
                })
    });

    console.log(updatedFilterColumn , 'updated')

        // setStatusItems(updatedFilterColumn);
    }

    const fetchData = async() =>{
        try{
            let url = 'governify/customer/requestTracking';
            let method = 'POST';
            let payload = JSON.stringify({
                "query_params": {
                    "order_by": [
                        {
                            "direction": selectedOrder === 1 ? 'asc': 'desc',
                            "column_id": "__creation_log__"
                        }
                    ]
                }
            })            
            const response = await fetcher(url , method , payload);
            setData(response.response.data.boards[0].items_page.items)
            setBoardId(response.response.data.boards[0].id);
            getFilterColumns(response.response.data.boards[0].columns)
            
        }catch(err){
            console.log(err , 'error');
        }
    }

    useEffect(()=>{
        fetchData();
    } ,[selectedOrder , selectedFilter])



    return (
        <div style={{paddingLeft:"16px" , paddingRight:"16px"}}>
            <Hero
				heading={"Request Tracking"}
				subheading="Track your onboarding progress effortlessly by using our request-tracking center."
				forHome={false}
			/>
            <BreadcrumbComponent data={breadCrumbData} />
            <SearchBox />
            <div style={{display:'flex' , justifyContent:'left' , paddingTop:'8px' , marginBottom:'32px'}}>
                <SortBy items={items}/>
                <FilterBy items={statusItems}/>
                <ExportBy />
            </div>
            {/* <SortingAndFilterComponent items={items} filterItems={statusItems}/> */}
            <RequestComponent data={data} boardId={boardId}/>
            
        </div>
    )
}