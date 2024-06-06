import { Button, Card,  Input, Switch } from "antd";
import { useState } from "react";
import { fetcher } from "../../utils/helper";

export const EditForms = ({setShowSkeleton , setLoading , loading  , setEditModalOpen , data}) =>{
    const settingsData = JSON.parse(sessionStorage.getItem('settings'));
    const [field , setField] = useState(data.form_data);
    const [formDetail , setFormDetail] = useState({formName:data.name , formDescription:data.description});

   
    const getDocumentEnabledValue = () =>{
        let flag = false;
        data.form_data.forEach((item)=>{
            if(item.type === 'image'){
               flag = item.enabled;  
            }
            })
        
        return flag;
    }

    const getDocumentEnabledLabel = () =>{
        let temp = '';
        data.form_data.forEach((item)=>{
            if(item.type === 'image'){
                temp = item.label;  
            }
            })
        
        return temp;
    }

    const [documentSettings , setDocumentSettings] = useState(getDocumentEnabledValue());
    const [documentLabel , setDocumentLabel] = useState(getDocumentEnabledLabel());


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
            label: documentLabel,
            type: "image",
            enabled: documentSettings ,
            })

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

    const onChangeUploadSettingsEnabled = () =>{
        setDocumentSettings(!documentSettings);
    }

    const handleChangeLabelOfDocuments = (e) =>{
      setDocumentLabel(e.target.value)
    }

    return (
        <>
        <div title="status visibility manage" style={{ maxWidth: '550px', width: '100%' , marginTop:'25px'}}>
            
            <div>
            <div class="text-white" style={{ backgroundColor: settingsData.button_bg }}>
                <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Edit Form</strong><Button onClick={addField}>+ Add Field</Button></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <Input placeholder="Form name" className="mt-10" onChange={(e)=>handleChangeFormName(e)} value={formDetail.formName} addonBefore="Form Name"/>
                <Input placeholder="Form description" className="mt-10" onChange={(e)=>handleChangeFormDescription(e)} value={formDetail.formDescription} addonBefore="Form Description"/>
             
                <div className="mt-10">
                    <div>
                    <span>Enable Documents Upload</span>
                    <Switch className="ml-10" onChange={onChangeUploadSettingsEnabled} value={documentSettings} />
                    </div>
                </div>
                <div className='mt-10'>
                    {documentSettings &&         
                        <textarea
                            style={{width:"100%"}}
                            value={documentLabel}
                            onChange={handleChangeLabelOfDocuments}
                            placeholder="Enter points (one per line)"
                            rows={5}
                            cols={50}
                        />
                        }
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
                 {field.length > 0 &&  <Button className="mt-10" style={{background:settingsData.button_bg , color:'#fff' , border:'none'}} onClick={publishForm}>Update</Button>}

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}