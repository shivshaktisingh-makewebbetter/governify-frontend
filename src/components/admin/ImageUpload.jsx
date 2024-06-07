import { useState } from 'react';



export const ImageUpload = ({ onFileSelect , imageName , imageUrl}) => {
  const [logoData  , setLogoData] = useState({logo_name:imageName , logo_image:imageUrl});


  const handleFileChange = async(e) =>{

    let file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
        reader.onload = (function(theFile) {
            return function(e) {
              setLogoData({logo_image:e.target.result , logo_name:file.name})
              onFileSelect(e.target.result , file.name)
            };
          })(file);
          reader.readAsDataURL(file);
    }
  }
  

  return (
    <div className="">
                            
                            <input class="form-control" name="logo_image" type="file" id="logo_image"
                               onChange={handleFileChange}/>
                                <small class="text-danger text-start ms-2"></small>
                            <div id="imageContainer" class="card  mt-2"
                                style={{maxWidth:"200px" , maxHeight:"200px" , width:"150px" , minHeight:"90px"}}>
                                    {logoData.logo_image === "" ? <></> : <img src={logoData.logo_image} />}
                            </div>
    </div>
  );
};