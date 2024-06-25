import { Button } from "antd"
import { ExportIcon } from "../utils/Icons"
import { fetcher } from "../utils/helper";
import { useState } from "react";
import { Loader } from "./common/Loader";



export const ExportBy = () =>{
    const [loading , setLoading] = useState(false)

    const handleExport = async() =>{
        let url = 'governify/customer/exportGovernifyData';
        let method = 'GET';
        setLoading(true)
        try{
            const response = await fetcher(url , method)
        }catch(err){

        }finally{
        setLoading(false)
        }
    }

    if(loading){
        return <Loader/>
    }
   
    return (
        <>
        {loading && <Loader/>}
                <Button  style={{display:'flex' , alignItems:'center' , gap:'5px'}}  type='text' className="governify-sortby-button" onClick={handleExport}> <span><ExportIcon/></span><span className='fs-16 text-color-928f8f'>Export</span> </Button> 

        </>
    )
}