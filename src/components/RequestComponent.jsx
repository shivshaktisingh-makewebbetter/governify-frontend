import { Button, Card, Typography } from 'antd';
import { trackRequestData } from '../utils/data';


export const RequestComponent = () =>{
    const bgcolor ={
        'COMPLETED':'#83f19c4a' ,
        'STUCK':'#e118184a' ,
        'IN PROGRESS':'#f4c71f4a' ,
        'CANCELLED':'#e7e7e8'
    }

    const statusTextColor = {
        'IN PROGRESS':'#F4981F' ,
        'COMPLETED':'#29CF10' ,
        'STUCK':'#E14014' ,
        'CANCELLED':'#939498'
    }

    return (
        <div >
        {trackRequestData.map((item , index)=>{
            return (
                <Card style={{background: bgcolor[item.status] , marginBottom:'24px'}} key={index}>
                <Typography style={{textAlign:'left'}}><span className='text-color-928f8f fs-15'>{item.subHeading}</span> <span style={{color:'#212529bf'}}>|</span> <span className='text-color-928f8f fs-15'>{item.created}</span></Typography>
                    <Typography className='mt-8 mb-8 fs-26 text-color-434343 fw-700 font-family-hind' style={{textAlign:'left'}}>{item.heading}</Typography>
                    <Typography className='mt-16 mb-8 fs-17 fw-800 font-family-hind' style={{textAlign:'left' , color:statusTextColor[item.status]}}>{item.status}</Typography>
                    <div className='mt-24' style={{display:'flex'  , justifyContent:'start'  , gap:'10px' }}>
                    <Button style={{ background:'#5AC063' , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>Updates</span> <span className='fs-16'><i class="bi bi-arrow-right-circle-fill"></i></span></Button>
                   {item.status !== 'COMPLETED' && <Button style={{display:'flex' , alignItems:'center' , justifyContent:'center' , background: 'transparent' ,border: '1px solid #5AC063', gap:'10px' , height:'40px' ,borderRadius:'10px'}} className='border-radius-10'><span className='fs-12 fw-700 text-color-5AC063 font-family-montse'>Cancel Request</span><span className='fs-16'><i class="bi bi-trash3-fill"></i></span></Button> }
                    </div>

                </Card>
            )
        })}
    
        </div>
    )
}