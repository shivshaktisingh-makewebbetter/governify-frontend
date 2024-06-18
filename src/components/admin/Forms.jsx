

import React, {  useEffect, useState } from 'react';
import { Button, Modal, Table, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { CreateForms } from './CreateForms';
import { EditForms } from './EditForm';
import { fetcher } from '../../utils/helper';
import { LeftOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';




export const Forms = () => {
  const data = JSON.parse(sessionStorage.getItem('settings'));
  const [modalOpen , setModalOpen] = useState(false);
    const [editModalOpen , setEditModalOpen] = useState(false);
    const [deleteModalOpen , setDeleteModalOpen] = useState(false);
    const [showSkeleton , setShowSkeleton] = useState(true);
    const [loading , setLoading] = useState(false);
    const [dataSource , setDataSource] = useState([]);
    const [editData , setEditData] = useState({});
    const [deleteFormData , setDeleteFormData] = useState({});
    const navigate = useNavigate();
  
    const columns = [
     
      {
         title: 'Form Category',
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
      let url = `governify/admin/serviceRequestForms/${deleteFormData.id}`;
      let method = "DELETE";
      setLoading(true);
      
        try{
          const response = await fetcher(url , method);

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
    let url = 'governify/admin/serviceRequestForms';
    let method = 'GET';
        try{
          const response = await fetcher(url , method);
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
   



    useEffect(()=>{
      if(showSkeleton){
        getForms();
      }
   } , [showSkeleton])

   

    return (
        <div className='mt-100'>
            <div style={{display:'flex' , justifyContent:'space-between' , marginBottom:'10px'}}><Button icon={<LeftOutlined  style={{color:data.button_bg , borderColor:data.button_bg}}/> } onClick={handleBackNavigation}></Button><Button style={{borderColor:data.button_bg , color:data.button_bg}} onClick={handleCreateCategory}>+ Create Forms</Button></div>
            <Table
            style={{width: "100%", borderCollapse: "collapse" ,   maxWidth: "1264px" , overflowX:'auto'}}
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
               <CreateForms  setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setModalOpen={setModalOpen}/>

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
              <Button style={{background:data.button_bg  , color:'#fff' , border:'none'}} onClick={deleteCategory}>Delete</Button>
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

