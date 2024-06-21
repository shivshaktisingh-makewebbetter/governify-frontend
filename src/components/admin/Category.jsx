

import React, {  useEffect, useState } from 'react';
import { Button, Modal , Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { CreateCategory } from './CreateCategory';
import EditCategory from './EditCategory';
import { fetcher } from '../../utils/helper';
import { LeftOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';






export const Category = () => {
    const data = JSON.parse(sessionStorage.getItem('settings'));
    const [modalOpen , setModalOpen] = useState(false);
    const [editModalOpen , setEditModalOpen] = useState(false);
    const [deleteModalOpen , setDeleteModalOpen] = useState(false);
    const [showSkeleton , setShowSkeleton] = useState(true);
    const [loading , setLoading] = useState(false);
    const [dataSource , setDataSource] = useState([]);
    const [editData , setEditData] = useState({});
    const [deleteCategoryData , setDeleteCategoryData] = useState({});
    const navigate = useNavigate();

  
   


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
      let url = `governify/admin/serviceCategories/${deleteCategoryData.id}`;
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


   const getCategories  = async() =>{
    let url = 'governify/admin/serviceCategories';
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

    const styles = {
      headerParent:{
        backgroundColor: "#5AC063" ,  
      } ,

      header: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd' ,
        color:"white" ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
      },
      title: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd' ,
        color:"white" ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
        borderTopLeftRadius:"5px" ,
        width:'20%'
      },
      subtitle: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd' ,
        color:"white" ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
        width:'25%'
      },
      description: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd' ,
        color:"white" ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
        width:'35%'
      },
     
      headerLast: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd' ,
        color:"white" ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
        borderTopRightRadius:"5px"
      } ,
      row: {
        backgroundColor: '#ffffff',
        transition: 'background-color 0.3s ease'
      },
      cell: {
        padding: '8px',
        borderBottom: '1px solid #ddd' ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
        textAlign:"left"
      } ,
      iconcell: {
        padding: '8px',
        paddingLeft:'16px' ,
        borderBottom: '1px solid #ddd' ,
        paddingTop:"15px" , 
        paddingBottom:"15px" ,
        textAlign:"left"
      } ,
      spanPadding :{
        paddingRight:"10px"
      }
    };

    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, item) => {
      setDraggedItem(item);
      e.dataTransfer.effectAllowed = 'move';
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };
  
    const handleDrop = async(e, targetItem) => {
      e.preventDefault();
      let payloadData = [];
      let url = 'governify/admin/serviceCategories/swap';
      let method = 'POST';
  
      const updatedData = [...dataSource];
      const fromIndex = updatedData.findIndex(i => i.id === draggedItem.id);
      const toIndex = updatedData.findIndex(i => i.id === targetItem.id);
  
      if (fromIndex !== toIndex) {
        const [removed] = updatedData.splice(fromIndex, 1);
        updatedData.splice(toIndex, 0, removed);
        dataSource.forEach((item , index)=>{
          payloadData.push({from : updatedData[index].id , to: index + 1})
       })

        setDataSource(updatedData);
      }

      let payload = {
        service_categorie: payloadData
      }

      const response = await fetcher(url ,method , JSON.stringify(payload));
      if(response.status){

      }
  
      setDraggedItem(null);
    };
  


    useEffect(()=>{
      if(showSkeleton){
        getCategories();
        setShowSkeleton(false);
      }

   } , [showSkeleton])


   

    return (
        <div className='mt-100'>
            <div style={{display:'flex' , justifyContent:'space-between' , marginBottom:'10px'}}><Button icon={<LeftOutlined  style={{color:data.button_bg , borderColor:data.button_bg}}/> } onClick={handleBackNavigation}></Button><Button style={{borderColor:data.button_bg , color:data.button_bg}} onClick={handleCreateCategory}>+ Create Category</Button></div>
           
         <table style={{ width: "100%", borderCollapse: "collapse" ,   maxWidth: "1264px" , overflowX:'auto'}}>
      <thead>
        <tr style={styles.headerParent}>
          <th style={styles.title}>Title</th>
          <th style={styles.header}><span style={styles.spanPadding}>|</span>Icon Class</th>
          <th style={styles.subtitle}><span style={styles.spanPadding}>|</span>Subtitle</th>
          <th style={styles.description}><span style={styles.spanPadding}>|</span>Description</th>
          <th style={styles.headerLast}><span style={styles.spanPadding}>|</span>Action</th>
        </tr>
      </thead>
      <tbody>
          {dataSource.map((item)=>{
            return (
               <tr style={styles.row} key={item.id}  onDragStart={(e) => handleDragStart(e, item)}
               onDragOver={handleDragOver}
               onDrop={(e) => handleDrop(e, item)}
               draggable>
                  <td style={styles.cell}>{item.title}</td>
                  <td style={styles.iconcell}><i className={item.icon}></i></td>
                  <td style={styles.cell}>{item.subtitle}</td>
                  <td style={styles.cell}>{item.description}</td>
                  <td style={styles.cell}> 
                    <div style={{display:'flex' , gap:'10px' }} >
                      <Button className='governify-edit-icon' type='plain' icon={<EditOutlined />} onClick={()=>handleEditCategory(item)}></Button>
                      <Button className='governify-delete-icon' type='plain' icon={<DeleteOutlined />} onClick={()=>handleDeleteCategory(item)}></Button>
                    </div>
                  </td>
                </tr>
            )
          })}
       
      </tbody>
    </table>
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
              <Button style={{background:data.button_bg , color:'#fff' , border:'none'}} onClick={deleteCategory}>Delete</Button>
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

