import { Button, Upload } from 'antd';
import { useState } from 'react';
import { settings } from '../../utils/tools';



export const ImageUpload = ({ onFileSelect , image}) => {
  const [selectedFile, setSelectedFile] = useState(image);
  const {link_btn_bg , link_btn_color } = settings;

  const [fileList, setFileList] = useState([]);


  const handleFileChange = (event) => {

    console.log(event.target.files[0] ,'werwe')


    if(event.target.files.length === 1){

      console.log(event.target.files[0] ,'werwe')
      var file = event.target.files[0];
     onFileSelect(file);
    }
    // console.log(event.target.files.length >0)
    
    // var reader = new FileReader();

    // reader.onload = (function(theFile) {
    //   return function(e) {
    //     var img = document.createElement('img');
    //     img.src = e.target.result;
    //     setSelectedFile(e.target.result);
    //     // onFileSelect(e.target.result);

    //   };
    // })(file);

    // reader.readAsDataURL(file);
  
  };


  return (
    <div>

<div>


{selectedFile ? (        
          <img id="previewImage" src={selectedFile} alt="Preview" style={{borderRadius:'50%' , width:'100px' , height:'100px' , border:'2px solid gray'}}/>
      ): <img src='https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg' alt='preview' style={{borderRadius:'50%' , width:'100px'}}/>}
      <input
        accept="image/*"
        style={{display:'none'}}
        id="contained-button-file"
        type="file"
        onChange={handleFileChange}
      />
      </div>
      <div style={{display:'flex', justifyContent:'center' , marginTop:'5px'}}>
      <label htmlFor="contained-button-file">
        <span>
                  Upload

        </span>
      </label>
      </div>
        <div style={{display:'flex', justifyContent:'center' , borderRadius:'50%'}}>
       

   
     
      </div>
     
    </div>
  );
};