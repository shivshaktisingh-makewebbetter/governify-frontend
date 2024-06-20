

import React, {  useEffect, useState } from 'react';
import { Button, Modal, Table, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { CreateServices } from './CreateServices';
import { fetcher } from '../../utils/helper';
import { EditServices } from './EditServices';
import { LeftOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';
import { SwitchServices } from './SwitchServices';




export const Services = () => {
  const settingsData = JSON.parse(sessionStorage.getItem('settings'));
    const [modalOpen , setModalOpen] = useState(false);
    const [editModalOpen , setEditModalOpen] = useState(false);
    const [deleteModalOpen , setDeleteModalOpen] = useState(false);
    const [showSkeleton , setShowSkeleton] = useState(true);
    const [loading , setLoading] = useState(false);
    const [dataSource , setDataSource] = useState([]);
    const [editData , setEditData] = useState({});
    const [deleteFormData , setDeleteFormData] = useState({});
    const [swapModal , setSwapModal] = useState(false);

   const navigate = useNavigate();
  
    const columns = [
     
      {
         title: 'Title',
         dataIndex: 'title',
         key: 'title',
         width: '10%',
      },
   
      {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '35%',

         
      },
     
      {
         title: <div style={{display:'flex' , justifyContent:'center'}}>Action</div>,
         key: 'action',
         render: (_, record) => (
           <div style={{display:'flex' , gap:'10px' ,justifyContent:'center' }} >
          <Button className='governify-edit-icon' type='plain' icon={<EditOutlined />} onClick={()=>handleEditCategory(record)}></Button>
          <Button className='governify-delete-icon' type='plain' icon={<DeleteOutlined />} onClick={()=>handleDeleteCategory(record)}></Button>
         </div>
         ),
         width: '10%',
      },
  ];
  


    const handleCreateCategory = () =>{
       setModalOpen(true);
       setShowSkeleton(true);
    }

    const handleDeleteCategory = async(item) =>{
      setDeleteFormData(item);
      setDeleteModalOpen(true);
    }

    const handleCancelDelete = () =>{
      setDeleteFormData({});
      setDeleteModalOpen(false);
    }

    const deleteCategory = async() =>{
      setLoading(true);
      let method = "DELETE";
      let url = `governify/admin/serviceRequests/${deleteFormData.id}`;
      
        try{
          const response = await fetcher(url, method);

            if(response.status){
              setShowSkeleton(true);
              setDeleteModalOpen(false);
              setDeleteFormData({});

            }
        }catch(err){
          console.log(err , 'error')

        }
        finally{
          setLoading(false);
        }
    }

    const handleEditCategory = async (item) =>{
      const data = {...item};
      setEditData(data);
      setEditModalOpen(true);
   }
 

   const getForms  = async() =>{
    
    let url = 'governify/admin/serviceRequests';
    let method = 'GET';
        const response = await fetcher(url , method);
        try{
            if(response.status){
              setDataSource(response.response);
              setShowSkeleton(false);
            }      
        }catch(err){
          throw new Error('Network response was not ok '  , err);
        }finally{
        }
   }

   const handleBackNavigation = () =>{
    navigate(-1);
    }

    const handleSwitchCategory = () =>{
      setSwapModal(!swapModal);
    }

    const updateDataSource = tempData => {
      setDataSource(tempData)
    }
    
 
   



    useEffect(()=>{
      if(showSkeleton){
        getForms();
      }
   } , [showSkeleton])

   

    return (
        <div className='mt-100'>
            <div style={{display:'flex' , justifyContent:'space-between' , marginBottom:'10px'}}><div><Button icon={<LeftOutlined  style={{color:settingsData.button_bg , borderColor:settingsData.button_bg}}/> } onClick={handleBackNavigation}></Button></div><div><Button style={{borderColor:settingsData.button_bg , color:settingsData.button_bg}} onClick={handleSwitchCategory} className="mr-10">Switch Services</Button><Button style={{borderColor:settingsData.button_bg , color:settingsData.button_bg}} onClick={handleCreateCategory}>+ Create Services</Button></div></div>
            <Table
            style={{maxWidth:'1264px' , overflowX:'auto'}}
            columns={columns} 
            dataSource={dataSource} 
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
            centered
            footer={ (_) => (
              <></>
            )}
            onCancel={() => setModalOpen(false)}
            className='width-80'
          
            >
               <CreateServices  setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setModalOpen={setModalOpen}/>

            </Modal>
            <Modal 
            open={editModalOpen}
            centered
            footer={ (_) => (
              <></>
            )}
            onCancel={() => setEditModalOpen(false)}
            >          
               <EditServices  data ={editData} key={editData.id} setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setEditModalOpen={setEditModalOpen}/>

            </Modal>

            <Modal 
            open={swapModal}
            centered
            footer={ (_) => (
              <></>
            )}
            onCancel={() => setSwapModal(false)}
            >   
               <SwitchServices data={dataSource} setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setSwapModal={setSwapModal} updateDataSource={updateDataSource}/>
    
            </Modal>

            <Modal 
            open={deleteModalOpen}
            title='Delete Form'
            centered
            footer={ (_ , record) => (
              <>
              <Button style={{background:settingsData.button_bg  , color:'#fff' , border:'none'}} onClick={deleteCategory}>Delete</Button>
              <Button style={{border:'none'}} onClick={handleCancelDelete}>Cancel</Button>

              </>
            )}
            onCancel={() => setDeleteModalOpen(false)}
            >  
  
            <Typography>
              Are you sure you want to delete this Service?
              </Typography>        

            </Modal>

        </div>
    )
}

