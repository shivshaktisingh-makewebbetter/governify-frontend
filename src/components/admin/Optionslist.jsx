import { Button } from "antd"
import { useNavigate } from "react-router-dom";


export const Optionslist = () =>{


    const data = [{
        title:'Category' , 
        description:'Create and manage service categories. Organize your services into logical groups for easy navigation and assignment.' , 
        icon:<i className="bi bi-card-list" style={{fontSize:"60px"}}></i> ,
        buttonText:'Manage Category' ,
        navigateKey:'categories'
    } ,
    {
        title:'Services' , 
        description:'Define and update the names and descriptions of your services. Ensure each service is clearly described for better understanding and management.' , 
        icon:<i className="bi bi-window-stack"></i> ,
        buttonText:'Manage Services' ,
        navigateKey:'services'

    } ,
    {
        title:'Forms' , 
        description:'Create, edit, and customize forms to collect necessary information from users. Once built, assign these forms to specific services to ensure accurate data managment' , 
        icon:<i className="bi bi-file-earmark"></i>,
        buttonText:'Manage Forms' ,
        navigateKey:'forms'

    }
];

const navigate = useNavigate();

const settingData = JSON.parse(sessionStorage.getItem('settings')) || {"image":"https://onboardify.tasc360.com/uploads/governify/1718271730_1718195689_Products%20Logo%20(1).png","site_bg":"#ffffff","button_bg":"#5ac063","banner_bg":"#5ac063","banner_content":"Hire an attitude, not just experience and qualification. Greg Savage.","header_bg":"#f7f7f7","head_title_color":"#5ac063"};

const handleAdminRoute = (title) =>{
        navigate(title)
}

    return (
        <div className='governify-option-list'>
        {data.map((item)=>{
            return (
                <div className='governify-option-list-repetitive' style={{position:'relative' ,paddingBottom:"40px"}}>
                   <div className='governify-option-list-icon' style={{color:settingData.button_bg}} >{item.icon}</div>
                   <div className='governify-option-list-title font-family-hind fs-28 fw-700 mt-16 mb-16'>{item.title}</div>
                   <div className='governify-option-list-description font-family-hind fs-19 text-color-928f8f mb-16' style={{minHeight:"114px" , paddingBottom:"20px"}}>{item.description}</div>
                   <div style={{display:'flex' , alignItems:'center' , justifyContent:'center'}}>
                    <Button type='primary' className='border-radius-10 fs-17 fw-600 h-40' style={{background:settingData.button_bg , color:'#fff' , display:'flex'  ,gap:'10px', alignItems:'center' ,position:'absolute' , bottom:'0px'}} onClick={()=>handleAdminRoute(item.navigateKey)}><span>{item.buttonText}</span><span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button>
                   </div>
                
                </div>
            )
        })}
        </div>
    )
}