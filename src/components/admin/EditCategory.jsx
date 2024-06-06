import { Button, Input } from "antd"
import {  memo, useState } from "react";
import { fetcher } from "../../utils/helper";

 const EditCategory = ({data , setShowSkeleton , setEditModalOpen , loading , setLoading}) =>{
  const settingsData = JSON.parse(sessionStorage.getItem('settings'));
   
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
      <div title="status visibility manage" style={{ maxWidth: '550px', width: '100%' , marginTop:'25px'}}>    
      <div>
      <div class="text-white" style={{ backgroundColor: settingsData.head_title_color }}>
          <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Edit Category</strong><span style={{display:"flex" , alignItems:"center" ,}}><a className="fs_14" style={{textDecoration:"none"}} target="_blank" href="https://icons.getbootstrap.com/">Go to Icon's library </a></span></p>
      </div>
      <div class="form_wrapper border border-success p-4 primary-shadow" style={{overflowY:'auto'}}>
            <div><Input    placeholder="Category Title" value={categoryData.title} onChange={(e)=> setCategoryData({...categoryData , title:e.target.value})} addonBefore="Title" /></div>
            <div><Input placeholder="Category Subtitle" className="mt-16" value={categoryData.subtitle} onChange={(e)=> setCategoryData({...categoryData , subtitle:e.target.value})} addonBefore="Subtitle" /></div>
            <div><Input placeholder="Category Icon" className="mt-16" value={categoryData.icon} onChange={(e)=> setCategoryData({...categoryData , icon:e.target.value})} addonBefore="Icon"/></div>
            <div><Input placeholder="Category Description" className="mt-16" value={categoryData.description} onChange={(e)=> setCategoryData({...categoryData , description:e.target.value})} addonBefore="Description"/></div>
            <div className="mt-16" style={{display:'flex' , justifyContent:"center"}}><Button style={{background:settingsData.button_bg , color:'#fff' , border:"none"}} className='fw-700' onClick={handleEditCategory} loading={loading}>Update</Button></div>
        </div>
        </div>
        </div>
        

    )
}

export default memo(EditCategory)