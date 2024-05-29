

import React, {  useEffect, useState } from 'react';
import { Button, Modal, Table, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { settings } from '../../utils/tools';
import { CreateCategory } from './CreateCategory';
import EditCategory from './EditCategory';
import { fetcher } from '../../utils/helper';
import { LeftOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';





export const Category = () => {
    const {link_btn_bg , link_btn_color } = settings;
    const [modalOpen , setModalOpen] = useState(false);
    const [editModalOpen , setEditModalOpen] = useState(false);
    const [deleteModalOpen , setDeleteModalOpen] = useState(false);
    const [showSkeleton , setShowSkeleton] = useState(true);
    const [loading , setLoading] = useState(false);
    const [dataSource , setDataSource] = useState([]);
    const [editData , setEditData] = useState({});
    const [deleteCategoryData , setDeleteCategoryData] = useState({});
    const navigate = useNavigate();

  
    const columns = [
      {
         title: 'Index', 
         dataIndex: 'id',
         key: 'id',
      },
      {
         title: 'Title',
         dataIndex: 'title',
         key: 'title',
      },
      {
         title: 'Icon Class',
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
  


    const handleCreateCategory = () =>{
       setModalOpen(true);
       setShowSkeleton(true);
    }

    const handleDeleteCategory = async(item) =>{
      setDeleteCategoryData(item);
      setDeleteModalOpen(true);
    }

    const handleCancelDelete = () =>{
      setDeleteCategoryData({});
      setDeleteModalOpen(false);
    }

    const deleteCategory = async() =>{
      let url = `http://127.0.0.1:8000/governify/admin/serviceCategories/${deleteCategoryData.id}`;
      let method = 'DELETE';
      setLoading(true);
        try{
          const response = await fetcher(url , method);
            if(response.status){
              setShowSkeleton(true);
              setDeleteModalOpen(false);
              setDeleteCategoryData({});
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

  //  const getIcon = (icon) =>{
  //   const iconElement = document.createElement('i');
  //   iconElement.classList.add(icon);
  //   return iconElement;
  //  }


 

   const getCategories  = async() =>{
    let url = 'http://127.0.0.1:8000/governify/admin/serviceCategories';
    let method = 'GET';
        try{
          const response = await fetcher(url, method);
            if(response.status){
              setDataSource(response.response);
              setShowSkeleton(false);
            }      
            
        }catch(err){
          throw new Error('Network response was not ok '  , err);
        }
   }

   const handleBackNavigation = () =>{
    navigate(-1);
    }
    
 
   



    useEffect(()=>{
      if(showSkeleton){
        getCategories();
        setShowSkeleton(false);
      }
   } , [showSkeleton])

   

    return (
        <div className='mt-100'>
            <div style={{display:'flex' , justifyContent:'space-between' , marginBottom:'10px'}}><Button icon={<LeftOutlined  style={{color:link_btn_bg , borderColor:link_btn_bg}}/> } onClick={handleBackNavigation}></Button><Button style={{borderColor:link_btn_bg , color:link_btn_bg}} onClick={handleCreateCategory}>+ Create Category</Button></div>
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
            className='w-40'
            onCancel={() => setModalOpen(false)}
          
            >
               <CreateCategory  setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setModalOpen={setModalOpen}/>

            </Modal>
            <Modal 
            open={editModalOpen}
            centered
            footer={ (_) => (
              <></>
            )}
            onCancel={() => setEditModalOpen(false)}
            >          
               <EditCategory  data ={editData} key={editData.id} setShowSkeleton={setShowSkeleton} setLoading={setLoading} loading={loading} setEditModalOpen={setEditModalOpen}/>

            </Modal>

            <Modal 
            open={deleteModalOpen}
            title='Delete category'
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
              Are you sure you want to delete this Category?
              </Typography>        

            </Modal>

        </div>
    )
}

