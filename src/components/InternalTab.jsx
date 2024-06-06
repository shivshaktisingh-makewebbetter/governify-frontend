import React, { useEffect, useState } from 'react';
import {  Tabs } from 'antd';
import { TabContent } from './TabContent';
export const InternalTab = ({data}) => {

  const [tabPosition, setTabPosition] = useState('left');


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
              label:  <div style={{padding: '2px 6px' , display:'flex' , justifyContent:'left' , gap:'20px' }} className='governify-tab-headers'><span><i className={item.icon} ></i></span><span className='fs-15'>{item.title}</span></div>,
              key: item.title , 
              children: <TabContent details={item} />
          }
      
        })}
      /> }
      
    </div>
  );
};
