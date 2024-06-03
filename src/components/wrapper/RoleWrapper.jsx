import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { getRole } from '../../utils/helper';

const RoleWrapper = ({children}) => {
const navigate = useNavigate()
const role = getRole();

const navigateToHome = () =>{
   
}



const navigateToAdmin = () =>{
    navigate('admin')

}
useEffect(()=>{
    if(role === 'customer'){
     navigateToHome();
    }else{
        navigateToAdmin();

    }

} , [role])


return (
    <>
    {children}
    </>
)

}

export default RoleWrapper;