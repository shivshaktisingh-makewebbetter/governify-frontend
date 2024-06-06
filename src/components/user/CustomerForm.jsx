import React, { useState } from 'react';
import { Button } from "antd"


export const CustomerForm = ({ formData , serviceTitle }) => {
  const data = JSON.parse(sessionStorage.getItem('settings'));
  const [formDetails , setFormDetails] = useState(formData.form_data);
  const [imageData , setImageData] = useState([]); 

  const handleFileChange = (e) => {
    let files = e.target.files;
    console.log(files, 'files');
    const updatedImageData = [...imageData];
    
    if (files.length > 0) {
      Array.from(files).forEach((file , index) => {
        let reader = new FileReader();
        
        reader.onload = (function(theFile) {
          return function(e) {
            imageData.push({
              "file_name" : file.name,
              "file_image" : e.target.result})
            // Process the file content here (e.g., update state, send to server, etc.)
          };
        })(file);
        
        reader.readAsDataURL(file);
      });
    }
  };
  
  const getUploadLabel = (item) =>{
    let newItem = item.split('\n')
    const data = newItem.map((subItem , index)=>{
        return <p key={index}>{subItem}</p>
    })
    return <div >{data}</div>;
  }

  const handleSubmit = async() =>{
    let tempFormData = []; 
    formDetails.forEach((item , index)=>{
      if(item.type !== 'image'){
        tempFormData.push({[item.label] : item.value})
      }
    });
    let payload = {form_data:tempFormData , file_data:imageData , service_request:serviceTitle};
    // const response = await fetcher()



  }

  const handleChangeValue = (e , index) =>{
    const updatedData = [...formDetails];
    updatedData[index].value = e.target.value;
    setFormDetails(updatedData)

  }

  return (
    <div className="customer-form-container" style={{ maxWidth: '550px', width: '100%', marginTop: '25px' }}>
      <div className="form-header" style={{ backgroundColor: data.button_bg, padding: '10px' }}>
        <strong style={{ fontSize: '1.2rem' }}>Form</strong>
      </div>
      <div className="form-body">
        {formData.form_data.map((item, index) => (
          <div className="form-item" key={index}>
            {item.type === 'textArea' ? (
              <div className="form-field">
                <label htmlFor={`textarea-${index}`} className="form-label">{item.label || 'Text Area'}</label>
                <textarea id={`textarea-${index}`} className="user-textarea" placeholder={"sdfsdfdsfds"} onChange={(e)=>handleChangeValue(e , index)}> </textarea>
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
      
      <div style={{display:"flex" , justifyContent:"center" , marginBottom:"10px"}}><Button style={{background:data.button_bg  , color:"#fff" , border:"none"}} onClick={handleSubmit}>Submit</Button></div>
    </div>
  );
};
