import { Button, Card,  Input, Switch } from "antd";
import { settings } from "../../utils/tools";
import { useState } from "react";
import { fetcher } from "../../utils/helper";

export const EditForms = ({setShowSkeleton , setLoading , loading  , setEditModalOpen , data}) =>{
    const {link_btn_bg , link_btn_color ,link_headtitle } = settings;
    const [field , setField] = useState(data.form_data);
    const [formDetail , setFormDetail] = useState({formName:data.name , formDescription:data.description});
    const getImageEnabledValue = () =>{
        let flag = false;
        data.form_data.forEach((item)=>{
            if(item.type === 'image'){
               flag = item.enabled;  
            }
            })
        
        return flag;
    }

    const getImageRequiredValue = () =>{
        let flag = false;
        data.form_data.forEach((item)=>{
            if(item.type === 'image'){
               flag = item.required;  
            }
            })
        
        return flag;
    }
    const [imageSettings , setImageSettings] = useState({image_enabled:getImageEnabledValue() , image_required: getImageRequiredValue()});


    const handleDeleteField = (subItem) =>{
     let tempField = field.filter((item) => item.key !== subItem.key);
     setField(tempField)
    }


    
    const addField = () =>{
       let newField = {
         key: field.length,
         label: '',
         type: "textArea",
         required: false , 
         defaultValue:''
        }

        let fields = [...field];
        fields.push(newField);
        setField(fields);
    }

    const handleChangeLabel = (event , index) =>{
    const tempField = [...field];
    tempField[index].label = event.target.value;
    setField(tempField)
    
    }

    const publishForm = async() =>{
        let url = `http://127.0.0.1:8000/governify/admin/serviceRequestForms/${data.id}`;
        let method = 'PUT';
        let categoryData = {
            name: formDetail.formName ,
            description: formDetail.formDescription ,
            form_data: field
        };

        categoryData.form_data.push({ key: field.length,
            label: '',
            type: "image",
            required: imageSettings.image_required , 
            enabled: imageSettings.image_enabled ,
            defaultValue:''})

        let payload = JSON.stringify(categoryData);   

    try{
        const response = await fetcher(url, method , payload); 
  
        if(response.status){
          setShowSkeleton(true);
          setEditModalOpen(false);
        }
      }catch(err){
         console.log(err , 'error')
      }
    }

    const handleChangeFormName = (event) =>{
        setFormDetail({...formDetail , formName:event.target.value});
    }


    const handleChangeFormDescription = (event) =>{
        setFormDetail({...formDetail , formDescription:event.target.value});

    }

    const onChangeImageSettingsRequired = () =>{
        setImageSettings({...imageSettings , image_required: !imageSettings.image_required});
     }
 
     const onChangeImageSettingsEnabled = () =>{
         setImageSettings({...imageSettings , image_enabled: !imageSettings.image_enabled});
     }

    return (
        <>
        <div title="status visibility manage" style={{ maxWidth: '550px', width: '100%' , marginTop:'25px'}}>
            
            <div>
            <div class="text-white" style={{ backgroundColor: link_headtitle }}>
                <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Edit Form</strong><Button onClick={addField}>+ Add Field</Button></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <Input placeholder="Form name" className="mt-10" onChange={(e)=>handleChangeFormName(e)} value={formDetail.formName} addonBefore="Form Name"/>
                <Input placeholder="Form description" className="mt-10" onChange={(e)=>handleChangeFormDescription(e)} value={formDetail.formDescription} addonBefore="Form Description"/>
             
                <div className="mt-10" style={{display:"flex" , gap:"10px"}}>
                    <div>
                    <span>Enable Image</span>
                    <Switch className="ml-10" onChange={onChangeImageSettingsEnabled} value={imageSettings.image_enabled} />
                    </div>
                   {imageSettings.image_enabled && <div>
                    <span>Image Required</span>
                    <Switch className="ml-10" onChange={onChangeImageSettingsRequired} value={imageSettings.image_required} />
                    </div>} 
                </div>
                            


                <div className="mt-10">
                    {field.map((item , index) =>{
                        if(item.type !== 'image'){
                            return (
                                <Card className="mt-10">
                                    <textarea disabled style={{width:'100%'}}></textarea>
                                    <Input className="mt-10" placeholder="Label" value={item.label} onChange={(event)=>handleChangeLabel(event ,index)} addonBefore="Label"/>
                                    <Button className="mt-10" onClick={()=>handleDeleteField(item)}>Delete</Button>
                                </Card>
                            )
                        }
                        
                    })}
                    
                 </div>
                 <div style={{display:'flex' , justifyContent:'end'}}>
                 {field.length > 0 &&  <Button className="mt-10" style={{background:link_btn_bg , color:link_btn_color , border:'none'}} onClick={publishForm}>Update</Button>}

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}