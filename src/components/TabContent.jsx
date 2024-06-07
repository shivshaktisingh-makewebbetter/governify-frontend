import { Button,   Modal, Typography } from "antd"
import { useState } from "react";
import { CustomerForm } from "./user/CustomerForm";


export const TabContent = ({details}) =>{
    const [open , setOpen] = useState(false);
    const [ formData , setFormData] = useState();
    const [serciceName , setServiceName] = useState();

    const handleModalForm = (formData  , title) =>{
        setFormData(formData)
        setServiceName(title);
        setOpen(true)
    }   

        return (
            <div>
            <Typography className='service-title font-family-hind'>{details.subtitle}</Typography>
            <Typography className='service-subtitle font-family-hind'>{details.description}</Typography>
            <div className="service-parent-div">
            {details.service_category_request.map((item)=>{
              return (
                <div className="service-repetitive-div" key={item.id}>
                    <div className='service-image-wrapper'> 
                    <img className="service-image" src={item.file_location} alt="No Preview"/>
                </div>
                <Typography className='service-child-title font-family-hind'>{item.title}</Typography>
                <Typography className='service-child-subtitle font-family-hind'>{item.description}</Typography>  
                <Button className='tabcontent-create-request-btn' onClick={()=>handleModalForm(item.form , item.title)}><span  className='tabcontent-create-request-btn-text'>Create a Request</span><span className='tabcontent-create-request-btn-icon'><i className="bi bi-plus-lg"></i></span></Button>
  
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
  
           <CustomerForm formData={formData} serviceTitle={serciceName}/>      

            </Modal>
            
            </div>
        )
   

  
}