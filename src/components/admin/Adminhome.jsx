import { useNavigate } from "react-router-dom";
import { Optionslist } from "./Optionslist"
import { useEffect } from "react";
import { getRole } from "../../utils/helper";

export const Adminhome = () =>{

    const navigate = useNavigate();
    const role = getRole();
  
    useEffect(() => {

        console.log(role , 'role')
       
      if(role === undefined  || role === null || role === ''){
      
        navigate('/signin')
      }
      if (role  === 'customer') {
    
     
        navigate('/');
      }
    }, [role, navigate]);
  

    return (
            <>
                <Optionslist/>
            </>
            )
}