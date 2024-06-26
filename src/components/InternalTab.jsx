import React, { useEffect, useState } from 'react';
import {  Tabs } from 'antd';
import { TabContent } from './TabContent';
export const InternalTab = ({data}) => {

  const [tabPosition, setTabPosition] = useState('left');

  const settingsData =
    JSON.parse(sessionStorage.getItem("settings")) ||
    {
      image:
        "https://onboardify.tasc360.com/uploads/governify/1717570622_Products Logo (1).png",
      site_bg: "#ffffff",
      button_bg: "#5ac063",
      banner_bg: "#5ac063",
      banner_content:
        "Hire an attitude, not just experience and qualification. Greg Savage.",
      header_bg: "#f7f7f7",
      head_title_color: "#5ac063"
    };


  function checkScreenWidth() {
    if (window.innerWidth < 700) {
      setTabPosition('top');
    }else{
      setTabPosition('left')
    }
  }


  useEffect(()=>{

    window.addEventListener('resize', checkScreenWidth);
  } , [])

  
return (
    <div className='mt-50'>   
   {data.length > 0 &&  <Tabs
   tabPosition={tabPosition}
  
        items={data.map((item)=>{
    
            return {
              label:  <div style={{padding: '2px 6px' , display:'flex' , justifyContent:'left' , gap:'20px' , alignItems:"center" }} className='governify-tab-headers'><span className="governify-category-icon-parent" ><i className={item.category.icon} style={{color:settingsData.button_bg , fontSize:'18px'}}></i></span><span className='fs-15'>{item.category.title}</span></div>,
              key: item.category.title , 
              children: <TabContent details={item.service_requests} categoryName={item.category.title} key={item.category.id}/> 
          }
      
        })}
      /> }
      
    </div>
  );
};

{/* */}
