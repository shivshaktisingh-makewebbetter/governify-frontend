import { FormOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { settings } from "../../utils/tools";
import { useNavigate } from "react-router-dom";

export const Optionslist = () =>{

    const data = [{
        title:'Category' , 
        description:'Streamline your employee onboarding with TASC Outsourcing. Request here for a hassle-free experience, letting us handle the rest with care and efficiency.' , 
        icon:<i class="bi bi-card-list"></i> ,
        buttonText:'Manage Category'
    } ,
    {
        title:'Services' , 
        description:'Streamline your employee onboarding with TASC Outsourcing. Request here for a hassle-free experience, letting us handle the rest with care and efficiency.' , 
        icon:<i class="bi bi-window-stack"></i> ,
        buttonText:'Manage Services'

    } ,
    {
        title:'Forms' , 
        description:'Streamline your employee onboarding with TASC Outsourcing. Request here for a hassle-free experience, letting us handle the rest with care and efficiency.' , 
        icon:<i class="bi bi-file-earmark"></i>,
        buttonText:'Manage Forms'

    }
];

const navigate = useNavigate();

const { link_btn_color, link_btn_bg ,link_headtitle} = settings;

const handleAdminRoute = (title) =>{

    if(title === 'Category'){
        navigate('categories')

    }
    if(title === 'Services'){
        navigate('services')

    }
    if(title === 'Forms'){
        navigate('forms')

    }
}



    return (
        <div className='governify-option-list mt-100'>
        {data.map((item)=>{
            return (
                <div className='governify-option-list-repetitive'>
                   <div className='governify-option-list-icon' style={{color:link_headtitle}} >{item.icon}</div>
                   <div className='governify-option-list-title font-family-hind fs-28 fw-700 mt-16 mb-16'>{item.title}</div>
                   <div className='governify-option-list-description font-family-hind fs-19 text-color-928f8f mb-16'>{item.description}</div>
                   <div style={{display:'flex' , alignItems:'center' , justifyContent:'center'}}>
                    <Button type='primary' className='border-radius-10 fs-17 fw-600 h-40' style={{background:link_btn_bg , color:link_btn_color , display:'flex'  ,gap:'10px', alignItems:'center'}} onClick={()=>handleAdminRoute(item.title)}><span>{item.buttonText}</span><span className='fs-16'><i class="bi bi-arrow-right-circle-fill"></i></span></Button>
                   </div>
                
                </div>
            )
        })}

        </div>
    )
}