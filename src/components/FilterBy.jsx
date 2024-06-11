import { Button , Dropdown  } from "antd"
import { FilterIcon } from "../utils/Icons"


export const FilterBy = ({items}) =>{
   
    return (
        
            <Dropdown
                menu={{
                items,
                }}
                placement="bottomRight"
                key='filter'

            >
              <Button style={{display:'flex' , alignItems:'center' , gap:'5px'}} type='text' className="governify-sortby-button"> <span> <FilterIcon/></span><span className='fs-16 text-color-928f8f'>Filter</span> </Button>
            </Dropdown>


    )
}