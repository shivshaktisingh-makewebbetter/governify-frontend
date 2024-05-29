import { Button, Input } from "antd"
import { settings } from "../../utils/tools";
import {   useState } from "react";
import { fetcher } from "../../utils/helper";


export const CreateCategory = ({setShowSkeleton , setLoading , loading , setModalOpen}) =>{

  const {link_btn_bg , link_btn_color ,link_headtitle } = settings;

    const [categoryData , setCategoryData] = useState({
        title: '' , 
        subtitle: '' , 
        description: '' , 
        icon: ''
    })



    const handleCreateCategory = async() =>{
      setLoading(true);
      let method = 'POST';
      let url = 'http://127.0.0.1:8000/governify/admin/serviceCategories/create';
      let payload =  JSON.stringify(categoryData);
          try{
            const response = await fetcher(url , method , payload);
            if(response.status){
              setShowSkeleton(true);
              setModalOpen(false);
            }
          }catch(err){
             console.log(err , 'error')
          }
          setLoading(false);
    }

    return (
      <div title="status visibility manage" style={{ maxWidth: '550px', width: '100%' , marginTop:'25px'}}>    
      <div>
      <div class="text-white" style={{ backgroundColor: link_headtitle }}>
          <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Create Category</strong><span style={{display:"flex" , alignItems:"center" ,}}><a className="fs_14" style={{textDecoration:"none"}} target="_blank" href="https://icons.getbootstrap.com/">Go to Icon's library </a></span></p>
      </div>
      <div class="form_wrapper border border-success p-4 primary-shadow" style={{overflowY:'auto'}}>
            <div><Input placeholder="Category Title" value={categoryData.title} onChange={(e)=> setCategoryData({...categoryData , title:e.target.value})} addonBefore="Title"/></div>
            <div><Input placeholder="Category Subtitle" className="mt-16" value={categoryData.subtitle} onChange={(e)=> setCategoryData({...categoryData , subtitle:e.target.value})} addonBefore="Subtitle"/></div>
            <div><Input placeholder="Category Icon" className="mt-16" value={categoryData.icon} onChange={(e)=> setCategoryData({...categoryData , icon:e.target.value})} addonBefore="Icon"/></div>
            <div><Input placeholder="Category Description" className="mt-16" value={categoryData.description} onChange={(e)=> setCategoryData({...categoryData , description:e.target.value})} addonBefore="Description"/></div>
            <div className="mt-16" style={{display:'flex' , justifyContent:"center"}}><Button style={{background:link_btn_bg , color:link_btn_color , border:"none"}} className='fw-700' onClick={handleCreateCategory} loading={loading}>Submit</Button></div>
        </div>
        </div>
        </div>

    )
}