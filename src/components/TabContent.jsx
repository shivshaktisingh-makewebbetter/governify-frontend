import { Button,  Image, Typography } from "antd"
// import getSymbolFromCurrency from "currency-symbol-map"

export const TabContent = ({details}) =>{

    return (
        <>
        <Typography className='service-title font-family-hind'>{details.title}</Typography>
        <Typography className='service-subtitle font-family-hind'>{details.subtitle}</Typography>
        <div className="service-parent-div">
        {details.service_data.map((item , index) =>{
            return (<div className="service-repetitive-div" key={index}>
                <div className='service-image-wrapper'> 
                <Image className="service-image" src={item.img} />
        </div>
        <Typography className='service-child-title font-family-hind'>{item.description}</Typography>
        <Typography className='service-child-subtitle font-family-hind'>{item.subdescription}</Typography>    
            </div>)
        })}
        </div>
        
        <Button className='tabcontent-create-request-btn'><span  className='tabcontent-create-request-btn-text'>Create a Request</span><span className='tabcontent-create-request-btn-icon'><i class="bi bi-plus-lg"></i></span></Button>
        </>
    )
}