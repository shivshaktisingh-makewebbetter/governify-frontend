import { FilterIcon } from "../utils/Icons"
import React from 'react';
import { Button, Dropdown , Space } from 'antd';


export const FilterBy = ({setSelectedFilter}) =>{

  const handleMenuClick = (e) => {
   setSelectedFilter(e.key);
  };
  const items = [
    {
      label: 'All',
      key: '9',
    },
    {
      label: 'In Progress',
      key: '0',
    },
    {
      label: 'Pending',
      key: '2',
      
    },
    {
      label: 'Cancelled',
      key: '3',
    },
    {
      label: 'Awaiting Action',
      key: '5',
    },
    {
      label: 'Done',
      key: '1',
    },
  ];
  const menuProps = {
    items,
    selectable: true,
    defaultSelectedKeys: ['9'],
    onClick: handleMenuClick,
  };

    return (
        
            <Dropdown menu={menuProps}>
            <Button type="text" style={{fontSize:"16px" , color:"#928f8f" , padding:"0px" , marginRight:"14px"}} icon={<FilterIcon/>} iconPosition="start">
              <Space>
                Filter
              </Space>
            </Button>
          </Dropdown>


    )
}