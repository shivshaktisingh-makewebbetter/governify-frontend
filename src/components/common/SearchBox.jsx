import { SearchOutlined } from "@ant-design/icons"
import { CloseOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { useState } from "react"


export const SearchBox = ({onChangeSearchData , searchData}) =>{
	const settingsData = JSON.parse(sessionStorage.getItem('settings')) || {"image":"https://onboardify.tasc360.com/uploads/governify/1717570622_Products Logo (1).png","site_bg":"#ffffff","button_bg":"#5ac063","banner_bg":"#5ac063","banner_content":"Hire an attitude, not just experience and qualification. Greg Savage.","header_bg":"#f7f7f7","head_title_color":"#5ac063"};

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