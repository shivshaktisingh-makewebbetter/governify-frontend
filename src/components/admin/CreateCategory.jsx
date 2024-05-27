import { Button, Input } from "antd"
import { settings } from "../../utils/tools";
import { useState } from "react";

export const CreateCategory = () =>{

    const {	link_btn_bg , 	link_btn_color,link_headtitle,header_bg, notification_bg} = settings;
    const [categoryData , setCategoryData] = useState({
        title:'' , 
        subtitle:'' , 
        description:'' , 
        icon:''
    })

    const handleCreateCategory = async() =>{

      let myHeaders = new Headers();
	    	myHeaders.append("Accept", "application/json");
	    	myHeaders.append("Content-Type", "application/json");
	    	myHeaders.append(
		  	"Authorization",
		   	"bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTY3ODI3MTksImV4cCI6MTcxNjc4NjMxOSwibmJmIjoxNzE2NzgyNzE5LCJqdGkiOiJFUW1ETG1Ra1U1YjU1S25TIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ofnxvElZmpFyitC5P4gft34PkA2CQJ2uokVnEg-u7dU"
	    	);
		let requestOptions = {
			method: "POST",
			headers: myHeaders,
      body: JSON.stringify(categoryData)
		};

          try{
            const response = await fetch('http://127.0.0.1:8000/governify/serviceCategories/create', 
              requestOptions,
              );

              console.log(response)
              if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
              }
              const data = await response.json(); // Parse the JSON from the response
              console.log(data); // 
          }catch(e){

          }
    }



    return (
        <div className='mt-30'>
            <div><Input placeholder="Category Title" value={categoryData.title} onChange={(e)=> setCategoryData({...categoryData , title:e.target.value})}/></div>
            <div><Input placeholder="Category Subtitle" className="mt-16" value={categoryData.subtitle} onChange={(e)=> setCategoryData({...categoryData , subtitle:e.target.value})}/></div>
            <div><Input placeholder="Category Icon" className="mt-16" value={categoryData.icon} onChange={(e)=> setCategoryData({...categoryData , icon:e.target.value})}/></div>
            <div><Input placeholder="Category Description" className="mt-16" value={categoryData.description} onChange={(e)=> setCategoryData({...categoryData , description:e.target.value})}/></div>
            <div className="mt-16" style={{display:'flex' , justifyContent:"center"}}><Button style={{background:link_btn_bg , color:link_btn_color}} className='fw-700' onClick={handleCreateCategory}>Submit</Button></div>
        </div>

    )
}