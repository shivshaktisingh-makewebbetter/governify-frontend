import { SearchOutlined } from "@ant-design/icons"
import { CloseOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { useState } from "react"


export const SearchBox = ({onChangeSearchData , searchData}) =>{
  const settingsData = JSON.parse(sessionStorage.getItem('settings'));

  const [data , setData] = useState('');

  const handleChange = (e) =>{
    setData(e.target.value);
  }

  const handleEnterPressed = (event) =>{
    if (event.keyCode === 13) { 
      onChangeSearchData(data)
    } 
  }

  const handleEraseData = () =>{
    const tempData = '';
    setData(tempData);
    onChangeSearchData(tempData);
  }

    return (
        <Input
          className="governify-search-box"
          placeholder="Start typing to search for services"
          onChange={handleChange}
          onKeyUp={handleEnterPressed}
          value = {data}
          suffix={data.length > 0 ? <CloseOutlined
          onClick={handleEraseData}
            style={{
              cursor:"pointer" ,
              color: '#ffffff',
              fontSize: '14px',
              background:settingsData.button_bg , 
              padding:'4px' ,
              borderRadius:'5px'

            }}
          /> : <SearchOutlined
          style={{
            cursor:"pointer" ,
            color: settingsData.button_bg,
            fontSize: '18px' ,
          }}
        />    
          }    
    />
    )
}