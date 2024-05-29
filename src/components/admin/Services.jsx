

import React, {  useEffect, useState } from 'react';
import { Button, Modal, Table, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { settings } from '../../utils/tools';
import { EditForms } from './EditForm';
import { CreateServices } from './CreateServices';
import { fetcher } from '../../utils/helper';




export const Services = () => {
    const {link_btn_bg , link_btn_color } = settings;
    const [modalOpen , setModalOpen] = useState(false);
    const [editModalOpen , setEditModalOpen] = useState(false);
    const [deleteModalOpen , setDeleteModalOpen] = useState(false);
    const [showSkeleton , setShowSkeleton] = useState(true);
    const [loading , setLoading] = useState(false);
    const [dataSource , setDataSource] = useState([]);
    const [editData , setEditData] = useState({});
    const [deleteFormData , setDeleteFormData] = useState({});

  
    const columns = [
      {
         title: 'Index', 
         dataIndex: 'id',
         key: 'id',
      },
      {
         title: 'Title',
         dataIndex: 'name',
         key: 'name',
      },
   
      {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
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
      let url = `http://127.0.0.1:8000/governify/admin/serviceRequestForms/${deleteFormData.id}`;
      
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
    let url = 'http://127.0.0.1:8000/governify/admin/serviceRequests';
    let method = 'GET';
        const response = fetcher(url , method);
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
   



    useEffect(()=>{
      if(showSkeleton){
        getForms();
      }
   } , [showSkeleton])

   

    return (
        <div className='mt-100'>
            <div style={{display:'flex' , justifyContent:'end' , marginBottom:'10px'}}><Button style={{borderColor:link_btn_bg , color:link_btn_bg}} onClick={handleCreateCategory}>+ Create Services</Button></div>
            <Table
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
               <EditForms  data ={editData} key={editData.id} setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setEditModalOpen={setEditModalOpen}/>

            </Modal>

            <Modal 
            open={deleteModalOpen}
            title='Delete Form'
            centered
            footer={ (_ , record) => (
              <>
              <Button style={{background:link_btn_bg  , color:link_btn_color , border:'none'}} onClick={deleteCategory}>Delete</Button>
              <Button style={{border:'none'}} onClick={handleCancelDelete}>Cancel</Button>

              </>
            )}
            onCancel={() => setDeleteModalOpen(false)}
            >  
  
            <Typography>
              Are you sure you want to delete this Form?
              </Typography>        

            </Modal>

        </div>
    )
}

