import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"

export const SearchBox = () =>{
    return (
        <Input
          className="governify-search-box"
          placeholder="Start typing to search for services"
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