// export const Category = () =>{


//     return (
//         <>
//         <p>Category</p>
//         </>
//     )

// }


import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { settings } from '../../utils/tools';
import { CreateCategory } from './CreateCategory';


export const Category = () => {
    const {link_btn_bg , link_btn_color} = settings;
    const [modalOpen , setModalOpen] = useState(false);


    const columns = [
      {
         title: 'Index', 
         dataIndex: 'index',
         key: 'index',
      },
      {
         title: 'Title',
         dataIndex: 'title',
         key: 'title',
      },
      {
         title: 'Icon',
         dataIndex: 'icon',
         key: 'icon',
      },
      {
          title: 'Subtitle',
          dataIndex: 'subtitle',
          key: 'subtitle',
      },
      {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
      },
      {
         title: 'Action',
         key: 'action',
         render: (_, record) => (
           <div style={{display:'flex' , gap:'10px' }} >
          <Button className='governify-edit-icon' type='plain' icon={<EditOutlined />} onClick={()=>handleEditCategory(record)}></Button>
          <Button className='governify-delete-icon' type='plain' icon={<DeleteOutlined />} onClick={()=>handleDeleteCategory(record)}></Button>
         </div>
         ),
      },
  ];
  const data = [
    {
      key: '1',
      index:1 ,
      title:'MISA License Management' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '2',
      index:2 ,
      title:'SBC COMPLIANCE' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '3',
      index:3 ,
      title:'CR Administration' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '4',
      index:4 ,
      title:'MHRDS Delegate & Oversight' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '5',
      index:5 ,
      title:'QIWA Platform Operations' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '6',
      index:6 ,
      title:'Hadaf HRDF Employment' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '7',
      index:7 ,
      title:'GOSI Management' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
    {
      key: '8',
      index:8 ,
      title:'Mudad Financial Compliance' ,
      icon: <i class="bi bi-app-indicator"></i> ,
      subtitle: 'This is category subtitle' ,
      description: 'This is category description'
    },
  ];



    const handleCreateCategory = () =>{
       setModalOpen(true);
    }

    const handleDeleteCategory = async(item) =>{

      let myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
      "Authorization",
       "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTY3ODI3MTksImV4cCI6MTcxNjc4NjMxOSwibmJmIjoxNzE2NzgyNzE5LCJqdGkiOiJFUW1ETG1Ra1U1YjU1S25TIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ofnxvElZmpFyitC5P4gft34PkA2CQJ2uokVnEg-u7dU"
      );
  let requestOptions = {
    method: "DELETE",
    headers: myHeaders,
  };

        try{
          const response = await fetch('http://127.0.0.1:8000/governify/serviceCategories/2', 
            requestOptions,
            );

            console.log(response)
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json(); // Parse the JSON from the response
            console.log(data); // 
        }catch(e){

        }
      setModalOpen(true);

    }

    const handleEditCategory = async (item) =>{
      console.log(item);

      let myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
      "Authorization",
       "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTY3ODI3MTksImV4cCI6MTcxNjc4NjMxOSwibmJmIjoxNzE2NzgyNzE5LCJqdGkiOiJFUW1ETG1Ra1U1YjU1S25TIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ofnxvElZmpFyitC5P4gft34PkA2CQJ2uokVnEg-u7dU"
      );
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

        try{
          const response = await fetch('http://127.0.0.1:8000/governify/serviceCategories/2', 
            requestOptions,
            );

            console.log(response)
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json(); // Parse the JSON from the response
            console.log(data); // 
        }catch(e){

        }
      setModalOpen(true);
   }
    return (
        <div className='mt-100'>
            <div style={{display:'flex' , justifyContent:'end' , marginBottom:'10px'}}><Button style={{borderColor:link_btn_bg , color:link_btn_bg}} onClick={handleCreateCategory}>+ Create Category</Button></div>
            <Table
            columns={columns} 
            dataSource={data} 
            pagination={{
                showTotal:(total) => `Total ${total} items`,
                defaultPageSize:5,
                showQuickJumper:true,
                showSizeChanger:true,
                pageSizeOptions:[5 , 10 , 15, 20],
                defaultCurrent:1
      
              }}
            />
            <Modal 
            open={modalOpen}
            title='Create category'
            centered
            footer={ (_) => (
              <></>
            )}
            onCancel={() => setModalOpen(false)}
          
            >
                <CreateCategory/>

            </Modal>
        </div>
    )
}

