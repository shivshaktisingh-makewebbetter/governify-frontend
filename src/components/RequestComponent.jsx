import { Button, Card, Typography } from 'antd';
import { fetcher } from '../utils/helper';
import { useState } from 'react';
import { Loader } from './common/Loader';



export const RequestComponent = ({data , boardId}) =>{

    const [loading , setLoading] = useState(false);
    

    const getBgColor = (item) =>{
        let status = null;
        item.column_values.forEach((subItem)=>{
            if(subItem.id === 'status__1'){
             status = subItem.label;
            }
        })
        if(status === null){
          return "#e7e7e8";
        }
        if(status === 'Awaiting Action'){
            return "#e7e7e8";
          }
        if(status === 'Done'){
           return '#83f19c4a';
        }
        if(status === 'In Progress'){
           return '#f4c71f4a';
        }
        if(status === 'Pending'){
           return '#e118184a';
        }
        if(status === "Cancelled"){
           return "#757575";
        }
    }

    const getStatusColor = (item) =>{
        let status = null;
        item.column_values.forEach((subItem)=>{
            if(subItem.id === 'status__1'){
             status = subItem.label;
            }
        })
        if(status === null){
          return "#939498";
        }
        if(status === 'Awaiting Action'){
            return "#939498";
          }
        if(status === 'Done'){
           return '#29CF10';
        }
        if(status === 'In Progress'){
           return '#F4981F';
        }
        if(status === 'Pending'){
           return '#E14014';
        }
        if(status === "Cancelled"){
           return "#757575";
        }
    }

    const getStatusText = (item) =>{
        let status = null;
        item.column_values.forEach((subItem)=>{
            if(subItem.id === 'status__1'){
             status = subItem.label;
            }
        })
        if(status === null){
          return " ";
        }
        if(status === 'Done'){
           return 'COMPLETED';
        }
        if(status === 'In Progress'){
           return 'IN PROGRESS';
        }
        if(status === 'Pending'){
           return 'PENDING';
        }
        if(status === "Cancelled"){
           return "CANCELLED";
        }
        if(status === "Awaiting Action"){
            return "AWAIT";
        }

    }

    const getCreatedDate = (dateStr) =>{
        const date = new Date(dateStr);

        // Define options for formatting the date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Format the date
        const formattedDate = date.toLocaleDateString('en-US', options);

        // Create the final string
        const result = `Created at ${formattedDate}`;

        return result;
    }

    const cancelRequest = async(item) =>{

        let endpoint = 'governify/customer/cancelRequest';
        let method = 'POST';
        let payload = JSON.stringify({
            "request_id": item.id,
            "board_id": boardId,
            "column_id": "status__1",
            "value": "Stuck"
        })
     setLoading(true);

      try{
        const response = await fetcher(endpoint , method , payload);
      console.log(response , 'response')

    }catch(err){

    }finally{
        setLoading(false)
    }
    }



    const revokeCancelRequest = async(item) =>{
        let endpoint = 'governify/customer/reverseCancelRequest';
        let method = 'POST';
        let payload = JSON.stringify({
            "board_id": boardId,
            "pulse_id": item.id,
            "column_id": "status__1",
        })

        try{
            const response = await fetcher(endpoint , method , payload);
            console.log(response , 'response')

        }catch(err){

        }
    }

    if(loading){
        return <Loader/>
    }

    return (
        <div >
        {data.map((item , index)=>{
            const bgColor = getBgColor(item);
            const statusColor = getStatusColor(item);
            const statusText = getStatusText(item);
            const createdDate = getCreatedDate(item.created_at);
            console.log(statusText)
            return (
                <Card style={{background: bgColor , marginBottom:'24px'}} key={index}>
                <Typography style={{textAlign:'left'}}><span className='text-color-928f8f fs-15'>{item.subHeading}</span> <span style={{color:'#212529bf'}}>|</span> <span className='text-color-928f8f fs-15'>{createdDate}</span></Typography>
                    <Typography className='mt-8 mb-8 fs-26 text-color-434343 fw-700 font-family-hind' style={{textAlign:'left'}}>{item.name}</Typography>
                    <Typography className='mt-16 mb-8 fs-17 fw-800 font-family-hind' style={{textAlign:'left' , color:statusColor , visibility: statusText==='AWAIT' ? 'hidden':'visible'}}>{statusText}</Typography>
                    <div className='mt-24' style={{display:'flex'  , justifyContent:'start'  , gap:'10px' }}>
                   {statusText === 'AWAIT' &&  <div><Button style={{ background:statusColor , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>Updates</span> <span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button></div>} 
                   {statusText === 'COMPLETED' &&  <div><Button style={{ background:statusColor , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>Updates</span> <span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button></div>} 
                   {statusText === 'IN PROGRESS' &&  <div style={{display:"flex" , gap:"20px"}}><Button style={{ background:statusColor , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>Updates</span> <span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button><Button style={{color:statusColor , display:'flex', background:"transparent", borderColor:statusColor , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse' onClick={()=>cancelRequest(item)}>Cancel Request</span> </Button></div>} 
                   {statusText === 'PENDING' &&  <div style={{display:"flex" , gap:"20px"}}><Button style={{ background:statusColor , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse'>Updates</span> <span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button><Button style={{  color:statusColor , display:'flex' , background:"transparent", borderColor:statusColor , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' }} className='border-radius-10'><span className='fs-12 fw-700 font-family-montse' onClick={()=>cancelRequest(item)}>Cancel Request</span> </Button></div>} 
                   {statusText === 'CANCELLED' &&  <div><Button style={{ background:statusColor , color:'#fff' , display:'flex' , alignItems:'center' , justifyContent:'center' , gap:'10px' , height:'40px' , borderRadius:'10px' , border:'none'}} className='border-radius-10' onClick={()=>revokeCancelRequest(item)}><span className='fs-12 fw-700 font-family-montse'>Revoke</span> <span className='fs-16'><i className="bi bi-arrow-right-circle-fill"></i></span></Button></div>} 

                    </div>
                </Card>
            )
        })}
        </div>
    )
}