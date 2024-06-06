import React from 'react';
import { Button } from "antd"


export const CustomerForm = ({ formData }) => {
  const data = JSON.parse(sessionStorage.getItem('settings'));

  const handleFileChange = (e) =>{

    let file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
        reader.onload = (function(theFile) {
            return function(e) {
            //   setLogoData({logo_image:e.target.result , logo_name:file.name})
            //   onFileSelect(e.target.result , file.name)
            };
          })(file);
          reader.readAsDataURL(file);
    }
  }

  const getUploadLabel = (item) =>{
    let newItem = item.split('\n')
    const data = newItem.map((subItem , index)=>{
        return <p key={index}>{subItem}</p>
    })
    return <div >{data}</div>;
  }

  return (
    <div className="customer-form-container" style={{ maxWidth: '550px', width: '100%', marginTop: '25px' }}>
      <div className="form-header" style={{ backgroundColor: data.button_bg, padding: '10px' }}>
        <strong style={{ fontSize: '1.2rem' }}>Form</strong>
      </div>
      <div className="form-body">
        {formData.form_data.map((item, index) => (
          <div className="form-item" key={index}>
            {item.type === 'textArea' && (
              <div className="form-field">
                <label htmlFor={`textarea-${index}`} className="form-label">{item.label || 'Text Area'}</label>
                <textarea id={`textarea-${index}`} className="user-textarea"></textarea>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="form-body">
        {formData.form_data.map((item, index) => (
          <div className="form-item" key={index}>
            {item.type === 'image' && item.enabled && (
              <div className="form-field" style={{background:'#eeeeee' , padding:"10px"}}>
                <label htmlFor={`upload-${index}`} className="form-label">{getUploadLabel(item.label) || 'Text Area'}</label>
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
      <div style={{display:"flex" , justifyContent:"center" , marginBottom:"10px"}}><Button style={{background:data.button_bg  , color:"#fff" , border:"none"}}>Submit</Button></div>
    </div>
  );
};
