import React from 'react'
import Header from '../common/Header'
import { Outlet } from "react-router-dom";
import Footer from '../common/Footer';

const PanelWrapper = () => {


  return (
    <>
      <Header />
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