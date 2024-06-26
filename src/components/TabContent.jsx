import { Button,   Modal, Typography } from "antd"
import { useState } from "react";
import { CustomerForm } from "./user/CustomerForm";
import { PlusOutlined } from "@ant-design/icons";


export const TabContent = ({details , categoryName}) =>{
    const [open , setOpen] = useState(false);
    const [ formData , setFormData] = useState();
    const [serciceName , setServiceName] = useState();
    const [loading , setLoading] = useState(false);

    const handleModalForm = (formData  , title) =>{
        setFormData(formData)
        setServiceName(title);
        setOpen(true)
    }  
    

        return (
            <div>
            <div className="service-parent-div">
            {details.map((item)=>{
       
               return (
                <div className="service-repetitive-div" key={item.id}>
                    <div className='service-image-wrapper'> 
                    <img className="service-image" src={item.service_request.file_location} alt="No Preview"/>
                </div>
                <Typography className='service-child-title font-family-hind'>{item.service_request.title}</Typography>
                <Typography className='service-child-subtitle font-family-hind'>{item.service_request.description}</Typography>  
                <Button className='tabcontent-create-request-btn' style={{borderRadius:"10px"}} icon = {<PlusOutlined />} iconPosition={'end'} onClick={()=>handleModalForm(item.service_forms.form_data , item.service_forms.name )} disabled={Object.keys(item.service_forms).length === 0}>Create a Request</Button>
                </div>
            )
            })}
            </div>

            <Modal 
            open={open}
            centered
            footer={ (_ , record) => (
              <></>
            )}
            onCancel={() => setOpen(false)}
            >  
  
           <CustomerForm formData={formData} serviceTitle={serciceName} loading = {loading} setLoading={setLoading} categoryName={categoryName}/>      

            </Modal>
            
            
            </div>
        )
   

  
}