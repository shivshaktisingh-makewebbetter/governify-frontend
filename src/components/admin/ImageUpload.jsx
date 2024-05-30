import { useState } from 'react';



export const ImageUpload = ({ onFileSelect , image}) => {
  const [selectedFile, setSelectedFile] = useState(image);



  
    const handleFileChange = (event) => {
      var file = event.target.files[0];
      var reader = new FileReader();

  
      reader.onload = (function(theFile) {
        return function(e) {
          var img = document.createElement('img');
          img.src = e.target.result;
         
        console.log(e.target.result)
     
          setSelectedFile(e.target.result);
          onFileSelect(e.target.result , file.name);
  
        };
      })(file);
      reader.readAsDataURL(file);
      
    
    };
  

  return (
    <div>



      
        <div style={{display:'flex', justifyContent:'center' , borderRadius:'50%'}}>
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
        <span >
          Upload
        </span>
      </label>
      </div>
    </div>
  );
};