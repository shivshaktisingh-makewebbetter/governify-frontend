import React, { useEffect, useState } from 'react';
import {  Tabs } from 'antd';
import { dummyData } from '../utils/data';
import { TabContent } from './TabContent';
import { AppstoreAddOutlined } from '@ant-design/icons';
export const InternalTab = () => {

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
   
      <Tabs
   tabPosition={tabPosition}
  
        items={dummyData.map((item)=>{
            return {
                label:  <div style={{padding: '2px 6px' , display:'flex' , justifyContent:'left' , gap:'20px' }} className='governify-tab-headers'><span><AppstoreAddOutlined /></span><span className='fs-15'>{item.dept_title}</span></div>,
                key: item.dept_title , 
                children: <TabContent details={item.dept_details} />
            }
        })}
      />
    </div>
  );
};
