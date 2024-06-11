import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"

export const SearchBox = ({onChangeSearchData , searchData}) =>{

  const handleChange = (e) =>{
    onChangeSearchData(e.target.value)
  }
    return (
        <Input
          className="governify-search-box"
          placeholder="Start typing to search for services"
          onChange={handleChange}
          value = {searchData}
      suffix={
          <SearchOutlined
            style={{
              color: '#434343',
              fontSize: '20px'
            }}
          />
      }
    />
    )
}