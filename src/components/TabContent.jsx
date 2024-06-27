import { Button,   Modal, Typography } from "antd"
import { useState } from "react";
import { CustomerForm } from "./user/CustomerForm";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';


export const TabContent = ({details , categoryName}) =>{
    const [open , setOpen] = useState(false);
    const [formData , setFormData] = useState();
    const [loading , setLoading] = useState(false);
    const [serviceTitle , setServiceTitle] = useState('');

    const handleModalForm = (formData , title) =>{
        const formDetails = Object.entries(formData)[0][1]; 
        setFormData(formDetails);
        setServiceTitle(title);
        setOpen(true)
    }  
    

        return (
            <div key={uuidv4()}>
            <div className="service-parent-div">
            {details.map((item)=>{
               
                const description = item.service_request.description.length > 85 ? item.service_request.description.substring(0, 85) + '...' : item.service_request.description;
                const imageLink = item.service_request.file_location;
                const title = item.service_request.title;
               return (
                <div className="service-repetitive-div" key={uuidv4()}>
                    <div className='service-image-wrapper'> 
                    <img className="service-image" src={imageLink} alt="No Preview"/>
                </div>
                <Typography className='service-child-title font-family-hind'>{title}</Typography>
                <Typography className='service-child-subtitle font-family-hind'>{description}</Typography>  
                <Button className='tabcontent-create-request-btn' style={{borderRadius:"10px"}} icon = {<PlusOutlined />} iconPosition={'end'} onClick={()=>handleModalForm(item.service_forms , item.service_request.title)} disabled={Object.keys(item.service_forms).length === 0}>Create a Request</Button>
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
  
           <CustomerForm formData={formData}  loading = {loading} setLoading={setLoading} serviceTitle={serviceTitle} categoryName={categoryName} key={uuidv4()}/>      

            </Modal>
            
            
            </div>
        )
   

  
}