import { useNavigate } from "react-router-dom";

export const Rolewrapper = ({children , role}) =>{
    const sessionRole = 'user';
    const navigate = useNavigate();

    if(role.includes(sessionRole)){
        return (
            <>
              {children}
            </>
        )
    }else{
       navigate('/admin-home')
    }

    

    


   
}