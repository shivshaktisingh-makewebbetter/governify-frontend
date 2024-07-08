import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import { Outlet } from "react-router-dom";
import Footer from '../common/Footer';
import { fetcher } from '../../utils/helper';
import { Loader } from '../common/Loader';

const PanelWrapper = () => {

  const [user , setUser] = useState('');
  const token = sessionStorage.getItem('token');


  const getLoginUserDetails = async () =>{
    try {
      const token = sessionStorage.getItem('token');
      const url = `loginUserDetails/${token}`;
      const method = 'GET';
      const response = await fetcher(url , method)
      if(response.success){
        sessionStorage.setItem('userName' , response.data.name );
        sessionStorage.setItem('userEmail' , response.data.email );
        sessionStorage.setItem('userId' , response.data.user_id );
        sessionStorage.setItem('createdAt' , response.data.created_at );
        setUser(response.data.name )
      }
    }catch(err){
      console.log(err , 'error')

    }finally{
    }
 }

 useEffect(()=>{
  getLoginUserDetails();
 } , [token])




  return (
    <>
      <Header user={user}/>
      <div className="container d-flex flex-column h-100 text-center">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Outlet/>
        </div>
      </div>
      <Footer/>
    </> 
  )
}

export default PanelWrapper