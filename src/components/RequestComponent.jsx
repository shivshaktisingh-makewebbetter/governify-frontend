import { Button, Card, Typography } from 'antd';
import { trackRequestData } from '../utils/data';
import { useEffect, useState } from 'react';
import { fetcher } from '../utils/helper';


export const RequestComponent = () =>{
    const [data , setData] = useState([]);

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

    const fetchData = async() =>{
    let url = 'http://127.0.0.1:8000/governify/customer/requestTracking';
    let method = 'GET';
     const response = await fetcher(url , method);
     console.log(response , 'response');
    }

    useEffect(()=>{
       fetchData()
    } ,[])

    return (
        <div >
        {trackRequestData.map((item , index)=>{
            return (
                <Card style={{background: bgcolor[item.status] , marginBottom:'24px'}} key={index}>
                <Typography style={{textAlign:'left'}}><span className='text-color-928f8f fs-15'>{item.subHeading}</span> <span style={{color:'#212529bf'}}>|</span> <span className='text-color-928f8f fs-15'>{item.created}</span></Typography>
                    <Typography className='mt-8 mb-8 fs-26 text-color-434343 fw-700 font-family-hind' style={{textAlign:'left'}}>{item.heading}</Typography>
                    <Typography className='mt-16 mb-8 fs-17 fw-800 font-family-hind' style={{textAlign:'left' , color:statusTextColor[item.status]}}>{item.status}</Typography>
                    <div className='mt-24' style={{display:'flex'  , justifyContent:'start'  , gap:'10px' }}>
                    <Button style={{ background:statusTextColor[item.status] , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>Updates</span> <span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button>
                   {item.status !== 'COMPLETED' && <Button style={{display:'flex' , alignItems:'center' , justifyContent:'center' , background: 'transparent' ,border: `1px solid ${statusTextColor[item.status]}` ,color:statusTextColor[item.status], gap:'10px' , height:'40px' ,borderRadius:'10px' , width:'130px'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>{item.status === 'CANCELLED' ? 'REVOKE' : 'Cancel Request'}</span></Button> }
                    </div>

                </Card>
            )
        })}
    
        </div>
    )
}