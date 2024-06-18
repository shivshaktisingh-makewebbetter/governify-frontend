import { Button, Card,  Input, Switch } from "antd";
import { useState } from "react";
import { fetcher } from "../../utils/helper";

export const CreateForms = ({setShowSkeleton , setLoading , loading  , setModalOpen}) =>{
    const data = JSON.parse(sessionStorage.getItem('settings'));
    const [field , setField] = useState([]);
    const [formDetail , setFormDetail] = useState({formName:''});
 

    const handleDeleteField = (subItem) =>{
     let tempField = field.filter((item) => item.key !== subItem.key);
     setField(tempField)
     
    }

    const addField = () =>{
       let newField = {
         key: field.length,
         label: '',
         subLabel:'',
         type: "textArea",
         defaultValue:'' ,
         enabled: false ,
         required: false
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
        let method = 'POST';
        let url = 'governify/admin/serviceRequestForms';
        let categoryData = {
            name: formDetail.formName ,
            form_data: field ,          
        };

            
        let payload = JSON.stringify(categoryData);
        

    try{
        const response = await fetcher( url , method , payload);
        if(response.status){
          setShowSkeleton(true);
          setModalOpen(false);
        }
      }catch(err){
         console.log(err , 'error')
      }
    }

    const handleChangeFormName = (event) =>{
        setFormDetail({...formDetail , formName:event.target.value});
    }


    const onChangeUploadSettingsEnabled = (index) =>{
        const updatedFields = field.map((item, idx) => {
            if (idx === index) {
                if(item.enabled){
                    return { ...item, type: 'textArea', enabled: false };

                }else{
                    return { ...item, type: 'image', enabled: true };

                }
            } else {
              return { ...item, type: 'textArea', enabled: false };
            }
          });
          setField(updatedFields)
    }

    const onChangeRequiredSettingsEnabled = (index) =>{
      const updatedField = [...field];
      updatedField[index].required = true;
      setField(updatedField)
    }

    const handleChangeLabelOfDocuments = (event , index) =>{
        let tempField = [...field];
        tempField[index].subLabel = event.target.value;
        setField(tempField);
    }



    return (
        <>
        <div title="status visibility manage" style={{  width: '100%' , marginTop:'25px'}}>    
            <div>
            <div class="text-white" style={{ backgroundColor: data.head_title_color }}>
                <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Create Form</strong><Button onClick={addField} style={{border:"none"}}>+ Add Field</Button></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <Input placeholder="Form name" className="mt-10" onChange={(e)=>handleChangeFormName(e)} addonBefore="Form Name"/>

           
                <div className="mt-10">
                    {field.map((item , index) =>{
                        return (
                            <Card className="mt-10">
                                <Input className="mt-10" placeholder="Label" value={item.label} onChange={(event)=>handleChangeLabel(event ,index)} addonBefore="Label"/>
                                <div className="mt-10">
                                <span>Enable Documents Upload</span>
                                <Switch className="ml-10" onChange={()=>onChangeUploadSettingsEnabled(index)} value={item.enabled} />
                                </div>
                                <div className="mt-10">
                                <span>Make Field Required</span>
                                <Switch className="ml-10" onChange={()=>onChangeRequiredSettingsEnabled(index)} value={item.required} />
                                </div>
                                <div className="mt-10">
                                    {item.enabled && <textarea
                                    style={{width:"100%"}}
                                    value={item.subLabel}
                                    onChange={(event)=>handleChangeLabelOfDocuments(event , index)}
                                    placeholder="Enter points (one per line)"
                                    rows={5}
                                    cols={50}
                                    />
                                    }
                                    </div>
                                <Button className="mt-10" onClick={()=>handleDeleteField(item)}>Delete</Button>
                            </Card>
                        )
                    })}
                    
                 </div>
                 <div style={{display:'flex' , justifyContent:'end'}}>
                 {field.length > 0 &&  <Button className="mt-10" style={{background:data.button_bg , color:'#fff' , border:'none'}} onClick={publishForm}>Publish</Button>}

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}