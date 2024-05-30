import { useState } from "react"
import { fetcher } from "../../utils/helper";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { settings } from "../../utils/tools";

export const AdminSettings = () =>{
    const [uiData , setUiData] = useState({site_bg:"" , button_bg:"" , banner_bg:"" , banner_content:"" , header_bg:"" , head_title_color:""});
    const [logoData  , setLogoData] = useState({logo_name:"" , logo_image:""});
    const {link_btn_bg  } = settings;
    const navigate = useNavigate();

  const handleChangeBg = (e) =>{
    setUiData({...uiData ,  site_bg:e.target.value })
  }

  const handleChangeBgBtn = (e) =>{
    setUiData({...uiData ,  button_bg:e.target.value })
  }

  const handleChangeLogo = async(e) =>{

    let file = e.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let blobUrl = URL.createObjectURL(file);
            setLogoData({...logoData , logo_image:blobUrl});
            setLogoData({...logoData , logo_name:e.target.files[0].name});

        };
        reader.readAsDataURL(file);
    }

  }

  const handleChangeBgBanner = (e) =>{
    setUiData({...uiData ,  banner_bg:e.target.value })
  }


  const handleChangeHeaderBg = (e) =>{
    setUiData({...uiData ,  header_bg:e.target.value })
  }


  const handleChangeHeadTitleColor = (e) =>{
    setUiData({...uiData ,  head_title_color:e.target.value })
  }


  const handleChangeBannerText = (e) =>{
    setUiData({...uiData ,  banner_content:e.target.value })
  }

  const handleSubmit = async() =>{
   let url = '';
   let method = 'POST';
   let payload =  JSON.stringify({
    ui_settings:uiData ,
    logo_name: logoData.logo_name ,
    logo_image:logoData.logo_image
   });

    try{
        let response = await fetcher(url , method , payload);
        console.log(response , 'response')

    }catch(err){

    }
  }

  const handleBackNavigation = () =>{
    navigate(-1);
  }
    return (
        <>
         <div class="w-100 d-flex flex-column align-items-center p-2">
        <div class="col-md-7 col-lg-8 text-start">
            <h4 class="mb-3"><Button icon={<LeftOutlined  style={{color:link_btn_bg , borderColor:link_btn_bg}}/> } onClick={handleBackNavigation}></Button><span class="mt-1 ms-2">General Settings</span></h4>
            <hr/>
                <div class="row g-3">
                    <div class="col-sm-6">
                        <div class="col-sm-12 mb-5">
                            <label for="site_bg" class="form-label">Background-color<i
                                    class="bi bi-pen"></i></label><br/>
                            <input type="color" class="w-100" name="site_bg" id="site_bg"
                                value={uiData.site_bg} required onChange={handleChangeBg}/>
                          
                                <small class="text-danger text-start ms-2"></small>
                          
                        </div>
                        <div class="col-sm-12">
                            <label for="button_bg" class="form-label">Button background-color&nbsp;<i
                                    class="bi bi-pen"></i></label><br/>
                            <input type="color" class="w-100" id="button_bg" name="button_bg"
                                value={uiData.button_bg} required onChange={handleChangeBgBtn}/>
                            
                                <small class="text-danger text-start ms-2"></small>
                         
                        </div>
                    </div>

                    <div class="col-sm-6 ">
                        <div class="">
                            <label for="logo_image" class="form-label">Choose Logo Image&nbsp;<i
                                    class="bi bi-pen"></i></label>
                            <input class="form-control" name="logo_image" type="file" id="logo_image"
                               onChange={handleChangeLogo}/>
                         
                                <small class="text-danger text-start ms-2"></small>
                          
                            <div id="imageContainer" class="card  mt-2"
                                style={{maxWidth:"200px" , maxHeight:"200px" , width:"150px" , minHeight:"90px"}}>
                                    {logoData.logo_image === "" ? <></> : <img src={logoData.logo_image} />}
                            </div>
                        </div>
                    </div>

                    <div class="col-12 row mt-3">
                        <div class="col-sm-6">
                            <label for="banner_bg" class="form-label">Banner background color&nbsp;<i
                                    class="bi bi-pen"></i></label><br />
                            <input type="color" class="w-100" id="banner_bg" name="banner_bg"
                                value={uiData.banner_bg} required onChange={handleChangeBgBanner}/>
                            
                                <small class="text-danger text-start ms-2"></small>
                        </div>
                        <div class="col-sm-6">
                            <label for="header_bg" class="form-label">Header Background Color&nbsp;<i
                                    class="bi bi-pen"></i></label><br />
                            <input type="color" class="w-100" id="header_bg" name="header_bg"
                                value={uiData.header_bg} required onChange={handleChangeHeaderBg}/>
                
                                <small class="text-danger text-start ms-2"></small>
                
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="col-sm-12">
                            <label for="head_title_color" class="form-label">Heading Title Color&nbsp;<i
                                    class="bi bi-pen"></i></label><br />
                            <input type="color" class="w-100" id="head_title_color" name="head_title_color"
                                value={uiData.head_title_color} required onChange={handleChangeHeadTitleColor}/>
                            
                                <small class="text-danger text-start ms-2"></small>
                
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="banner_content" class="form-label">Banner <span
                                class="text-muted"></span></label>
                        <textarea type="text" class="form-control" name="banner_content" id="banner_content"
                            placeholder="Enter the banner text content ." onChange={handleChangeBannerText} value={uiData.banner_content}></textarea>
                    
                            <small class="text-danger text-start ms-2"></small>
                        
                    </div>
                    <hr class="my-4"/>

                    <Button  style={{background:'#5AC063' , color:'white' , border:"none"}} onClick={handleSubmit}>SAVE SETTINGS</Button>
                    </div>
        </div>
    </div>
  
        </>
    )
}