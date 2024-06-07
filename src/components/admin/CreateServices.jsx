import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { fetcher } from "../../utils/helper";

export const CreateServices = ({setShowSkeleton , setLoading , loading  , setModalOpen}) =>{
  const settingsData = JSON.parse(sessionStorage.getItem('settings'));
    const [formListing , setFormListing] = useState([]);    
    const [categoryListig , setCategoryListing] = useState([]);    
    const [serviceData , setServiceData] = useState({
        title:'' ,
        description:'' ,
        image:'' ,
        image_name:'' ,
        form:'' ,
        service_categorie_id:'' ,
    })



    const handleCategoryChange = (e) =>{
       setServiceData({...serviceData , service_categorie_id:e})
    }



    const handleFormChange = (e) =>{
        setServiceData({...serviceData , form:e})
    }


   const handleCreateServices = async() =>{
    let method = "POST";
    let url = 'governify/admin/serviceRequests/create';
    let payload = JSON.stringify(serviceData);
    
    try{
        const response = await fetcher(url , method , payload);
        if(response.status){
          setShowSkeleton(true);
          setModalOpen(false);
        }
      }catch(err){
         console.log(err , 'error')
      }
   }




    const getAllForms  = async() =>{
      let method = "GET";
      let url = 'governify/admin/serviceRequestForms';
       
        try{
          const response = await fetcher(url , method);
            if(response.status){
                setFormListing(response.response.map((item)=>{
                return {label: item.name , value: item.id}
              }));
              setShowSkeleton(false);
            }      
            
        }catch(err){
          throw new Error('Network response was not ok '  , err);
        }finally{
        }
   }

   const getAllCategories  = async() =>{
    let method = 'GET';
    let url = 'governify/admin/serviceCategories';
    

    try{
      const response = await fetcher(url , method);
        if(response.status){
          setCategoryListing(response.response.map((item)=>{
            return {label: item.title , value: item.id}
          }));
          setShowSkeleton(false);
        }      
        
    }catch(err){
      throw new Error('Network response was not ok '  , err);
    }
}

  const handleTitleChange = (e) =>{
    setServiceData({...serviceData , title:e.target.value});
  }


  const handleDescriptionChange = (e) =>{
    setServiceData({...serviceData , description:e.target.value});
  }

  const handleFileSelect = (data , imageName) =>{
    setServiceData({...serviceData , image:data , image_name: imageName});
  }


   useEffect(()=>{
    getAllForms();
    getAllCategories();
  } ,[])


    return (
        <>

        <div title="status visibility manage" style={{ maxWidth: '550px', width: '100%' , marginTop:'25px'}}>    
            <div>
            <div class="text-white" style={{ backgroundColor: settingsData.button_bg }}>
                <p class="p-2 m-0 fs-5"><strong>Create Services</strong></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <div>
                    
                <ImageUpload onFileSelect={handleFileSelect} imageName={""} imageUrl={""} />
                </div>
                <Input placeholder="Service Title" className="mt-30" onChange={handleTitleChange} addonBefore="Title"/>
                <Input placeholder="Service description" className="mt-10" onChange={handleDescriptionChange} addonBefore="Description"/>
                <div className="mt-10">
              <Select
              showSearch
                placeholder='Select Forms'
                style={{width:"100%"}}
                popupMatchSelectWidth={false}
                placement='bottomLeft'
                onChange={handleFormChange}
                options={formListing}
              />
              </div>
              <div className="mt-10">
              <Select
                showSearch
                placeholder='Select Category'
                style={{width:"100%"}}
                popupMatchSelectWidth={false}
                placement='bottomLeft'
                onChange={handleCategoryChange}
                options={categoryListig}
              />
              </div>

             
               
                 <div style={{display:'flex' , justifyContent:'center'}} className="mt-60">
                 <Button className="mt-10" style={{background:settingsData.button_bg , color:'#fff' , border:'none'}} onClick={handleCreateServices}>Create</Button>

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}