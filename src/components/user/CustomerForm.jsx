import React, { useState } from 'react';
import { Button } from "antd"
import { fetcher } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../common/Loader';
import { Submit } from '../../assets/image';
import { UploadOutlined } from '@ant-design/icons';


export const CustomerForm = ({ formData , serviceTitle , loading ,  setLoading , categoryName }) => {
  const data = JSON.parse(sessionStorage.getItem('settings'));
  const [formDetails , setFormDetails] = useState(formData.form_data);
  const [imageData , setImageData] = useState([]); 
  const navigate = useNavigate();


  const [isFocused, setIsFocused] = useState(null);

  const handleFocus = (index) => setIsFocused(index);
  const handleBlur = () => setIsFocused(null);

  const inputFocusedStyle = {
    border: '2px solid',
    borderColor: '#3b99fc', // Change color based on focus
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const inputUnfocusedStyle = {
    border: '2px solid',
    borderColor: '#fff', // Change color based on focus
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

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
        return <li style={{color:"#2c2e38" , fontSize:"18px"}} key={index}>{subItem}</li>
    })
    return <ul>{data}</ul>;
  }

 

  const triggerFileInputClick = () => {
    document.getElementById('hiddenFileInput').click();
  };

  const handleSubmit = async() =>{
    let complete = false;
    let tempFormData = []; 
    formDetails.forEach((item , index)=>{
      if(item.type !== 'image'){
        if(item.required && (item.value === '' || item.value === undefined)){
        complete = true;
        }else{
          tempFormData.push({[item.label] : item.value})
        }
      }
    });

    if(complete){
      return;
    }
    let method = 'POST';
    let url = 'governify/customer/createRequestDashboard';
    let payload = JSON.stringify({form_data:tempFormData , file_data:imageData , service_request:serviceTitle , service_category:categoryName});
    setLoading(true);
    try{
      const response = await fetcher(url , method , payload);
      if(response.status){
        navigate('track-request')
      }
    }catch(err){
      console.log(err , 'err')
    }finally{
      setTimeout(()=>{
        setLoading(true);
      } , 2000)
    }
   

  }

  const handleChangeValue = (e , index) =>{
    let updatedData = [...formDetails];
    updatedData[index].value = e.target.value;
    setFormDetails(updatedData)

  }


  return (
    <div className="customer-form-container" style={{ maxWidth: '550px', width: '100%', marginTop: '25px' }}>
      {loading && <Loader />}
   
        <div className="form-header">{serviceTitle}</div>
        <div className="w-divider-component-wrapper divider-component-wrapper_XE2" style={{display:"flex" , justifyContent:"center"}}><svg xmlns="http://www.w3.org/2000/svg" width="3000px" height="33" style={{width:"12%"}}><path d="M0 16.5 L3000 16.5" style={{fill:"none" ,stroke :data.button_bg ,strokeWidth:"3px"}}></path></svg></div>
        <div className="form-header-description">Please fill out the form to proceed with the needed action to provide you with this service</div>

     
      <div className="form-body">
        {formData.form_data.map((item, index) => (
          <div className="form-item" key={index}>
            {item.type === 'textArea' ? (
              <div className="form-field" style={{display:"flex"}}>
                <input type="text" id={`textarea-${index}`} style={isFocused === index ? inputFocusedStyle: inputUnfocusedStyle} className="user-textarea" placeholder={item.label} onChange={(e)=>handleChangeValue(e , index)} onFocus={()=>handleFocus(index)} onBlur={handleBlur}/>
                {item.required && <span style={{ color: 'red' }}>*</span>}
              </div>
            ) : (
              <div className="form-field" style={{background:'#f3f4f8cc' , padding:"10px" , borderRadius:"10px" , color:"#2c2e38"}}>
              <label htmlFor={`upload-${index}`} style={{color:"#2c2e38" , fontSize:"18px"}}>{item.label || 'Upload the following documents'}</label>
              <div>{getUploadLabel(item.subLabel)}</div>
              <input
                id="hiddenFileInput"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden-file-input"
              />
    
      <Button className="custom-button" style={{height:"40px" , background:"#f3f4f8cc"}} icon={<UploadOutlined  />} onClick={triggerFileInputClick}>Choose File</Button>
      {imageData.length > 0 && <span key={imageData.length}>{imageData.length} document uploaded.</span>}

            </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{display:"flex" , justifyContent:"center" , marginBottom:"10px", paddingLeft:'20px' , paddingRight:'20px'}}><Button style={{background:data.button_bg  , color:"#fff" , border:"none" , width:"100%" , height:"40px" , fontSize:"16px" , fontWeight:"600" , borderRadius:"10px"}} icon={<Submit/>} iconPosition='start' onClick={handleSubmit}>Submit</Button></div>
    </div>
  );
};
