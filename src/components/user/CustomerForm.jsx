import React, { useState } from 'react';
import { Button } from "antd"
import { fetcher } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';


export const CustomerForm = ({ formData , serviceTitle }) => {
  const data = JSON.parse(sessionStorage.getItem('settings'));
  const [formDetails , setFormDetails] = useState(formData.form_data);
  const [imageData , setImageData] = useState([]); 
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    let files = e.target.files;
    const updatedImageData = [...imageData];
    
    if (files.length > 0) {
      Array.from(files).forEach((file , index) => {
        let reader = new FileReader();
        
        reader.onload = (function(theFile) {
          return function(e) {
            updatedImageData.push({
              "file_name" : file.name,
              "file_image" : e.target.result})
            // Process the file content here (e.g., update state, send to server, etc.)
          };
        })(file);
        
        reader.readAsDataURL(file);
      });
    }
    setImageData(updatedImageData);
  };
  
  const getUploadLabel = (item) =>{
    let newItem = item.split('\n')
    const data = newItem.map((subItem , index)=>{
        return <li key={index}>{subItem}</li>
    })
    return <ul >{data}</ul>;
  }

  const handleSubmit = async() =>{
    let tempFormData = []; 
    formDetails.forEach((item , index)=>{
      if(item.type !== 'image'){
        tempFormData.push({[item.label] : item.value})
      }
    });
    let method = 'POST';
    let url = 'governify/customer/createRequestDashboard';
    let payload = JSON.stringify({form_data:tempFormData , file_data:imageData , service_request:serviceTitle});
    try{
      const response = await fetcher(url , method , payload);
      console.log(response)
      if(response.status){
        navigate('track-request')
      }
    }catch(err){
      console.log(err , 'err')
    }
   

  }

  const handleChangeValue = (e , index) =>{
    const updatedData = [...formDetails];
    updatedData[index].value = e.target.value;
    setFormDetails(updatedData)

  }

  console.log(formData , 'formData')

  return (
    <div className="customer-form-container" style={{ maxWidth: '550px', width: '100%', marginTop: '25px' }}>
   
        <div className="form-header">{serviceTitle}</div>
        <div className="w-divider-component-wrapper divider-component-wrapper_XE2" style={{display:"flex" , justifyContent:"center"}}><svg xmlns="http://www.w3.org/2000/svg" width="3000px" height="33" style={{width:"12%"}}><path d="M0 16.5 L3000 16.5" style={{fill:"none" ,stroke :data.button_bg ,strokeWidth:"3px"}}></path></svg></div>
        <div className="form-header-description">{formData.description}</div>

     
      <div className="form-body">
        {formData.form_data.map((item, index) => (
          <div className="form-item" key={index}>
            {item.type === 'textArea' ? (
              <div className="form-field">
                <input type="text" id={`textarea-${index}`} className="user-textarea" placeholder={item.label} onChange={(e)=>handleChangeValue(e , index)} />
              </div>
            ) : (
              <div className="form-field" style={{background:'#eeeeee' , padding:"10px"}}>
              <label htmlFor={`upload-${index}`} className="form-label">{item.label || 'Text Area'}</label>
              <div>{getUploadLabel(item.subLabel)}</div>
              <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
              />
            </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{display:"flex" , justifyContent:"center" , marginBottom:"10px", paddingLeft:'20px' , paddingRight:'20px'}}><Button style={{background:data.button_bg  , color:"#fff" , border:"none" , width:"100%" , height:"40px" , fontSize:"16px" , fontWeight:"600" , borderRadius:"10px"}} onClick={handleSubmit}>Submit</Button></div>
    </div>
  );
};
