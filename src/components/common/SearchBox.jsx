import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"

export const SearchBox = ({searchData , setSearchData}) =>{

  const handleChange = (e) =>{
    setSearchData(e.target.value)
  }
    return (
        <Input
          className="governify-search-box"
          placeholder="Start typing to search for services"
          onChange={handleChange}
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