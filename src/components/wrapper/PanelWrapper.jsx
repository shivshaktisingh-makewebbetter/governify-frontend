import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import { Outlet } from "react-router-dom";
import Footer from '../common/Footer';
import { fetcher } from '../../utils/helper';
import { Loader } from '../common/Loader';

const PanelWrapper = () => {

  const [user , setUser] = useState('');

  const getLoginUserDetails = async () =>{
    try {
      const token = sessionStorage.getItem('token') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE4ODcyMTcyLCJleHAiOjE3MTkxMzEzNzIsIm5iZiI6MTcxODg3MjE3MiwianRpIjoicUxzdnRwWnZwSHpwdEhycyIsInN1YiI6IjM0IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.id8UF9U-8UtsG_eirc1u_SBH7bQwYJp5czn_qMKzZ2M';
      const url = `loginUserDetails/${token}`;
      const method = 'GET';
      const response = await fetcher(url , method)
      if(response.success){
        sessionStorage.setItem('userName' , response.data.name );
        sessionStorage.setItem('userEmail' , response.data.email );
        setUser(response.data.name )
      }
    }catch(err){
      console.log(err , 'error')

    }finally{
    }
 }

 useEffect(()=>{
  getLoginUserDetails();
 } , [])




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