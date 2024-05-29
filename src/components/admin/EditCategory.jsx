import { Button, Input } from "antd"
import { settings } from "../../utils/tools";
import {  memo, useState } from "react";
import { fetcher } from "../../utils/helper";

 const EditCategory = ({data , setShowSkeleton , setEditModalOpen , loading , setLoading}) =>{
    const {	link_btn_bg , 	link_btn_color} = settings;
   
    const [categoryData , setCategoryData] = useState({
        title: data.title || '' , 
        subtitle: data.subtitle || '' , 
        description: data.description ||'' , 
        icon: data.icon || ''
    })

    const handleEditCategory = async() =>{
        setLoading(true)
        let method = "PUT";
        let url =  `http://127.0.0.1:8000/governify/admin/serviceCategories/${data.id}`;
        let payload =  JSON.stringify(categoryData);
      try{
        const response = await fetcher( url , method , payload);     
          if(response.status){
            setShowSkeleton(true);
            setEditModalOpen(false);
          }
      }catch(err){
        console.log(err , 'error')

      }finally{
        setLoading(false)
      }
    }




    return (
        <div className='mt-30' key={data.id}>
            <div><Input    placeholder="Category Title" value={categoryData.title} onChange={(e)=> setCategoryData({...categoryData , title:e.target.value})}/></div>
            <div><Input placeholder="Category Subtitle" className="mt-16" value={categoryData.subtitle} onChange={(e)=> setCategoryData({...categoryData , subtitle:e.target.value})}/></div>
            <div><Input placeholder="Category Icon" className="mt-16" value={categoryData.icon} onChange={(e)=> setCategoryData({...categoryData , icon:e.target.value})}/></div>
            <div><Input placeholder="Category Description" className="mt-16" value={categoryData.description} onChange={(e)=> setCategoryData({...categoryData , description:e.target.value})}/></div>
            <div className="mt-16" style={{display:'flex' , justifyContent:"center"}}><Button style={{background:link_btn_bg , color:link_btn_color}} className='fw-700' onClick={handleEditCategory} loading={loading}>Submit</Button></div>
        </div>

    )
}

export default memo(EditCategory)