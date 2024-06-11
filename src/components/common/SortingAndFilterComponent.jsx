import { Button , Dropdown  } from "antd"
import { ExportIcon, FilterIcon } from "../../utils/Icons"


export const SortingAndFilterComponent = ({items , filterItems}) =>{
   
    return (
        <div style={{display:'flex' , justifyContent:'left' , paddingTop:'8px' , marginBottom:'32px'}}>
            <Dropdown
                menu={{
                items,
                }}
                placement="bottomRight"
                key='order'
            >
              <Button style={{display:'flex' , alignItems:'center' , gap:'5px'}} type='text' className="governify-sortby-button"> <span><i className="bi bi-sort-down"></i></span><span className='fs-16 text-color-928f8f'>Sort By</span> </Button>
            </Dropdown>

            <Dropdown
                menu={{
                filterItems,
                }}
                placement="bottomRight"
                key='filter'

            >
              <Button style={{display:'flex' , alignItems:'center' , gap:'5px'}} type='text' className="governify-sortby-button"> <span> <FilterIcon/></span><span className='fs-16 text-color-928f8f'>Filter</span> </Button>
            </Dropdown>

            <Button  style={{display:'flex' , alignItems:'center' , gap:'5px'}}  type='text' className="governify-sortby-button"> <span><ExportIcon/></span><span className='fs-16 text-color-928f8f'>Export</span> </Button>

        </div>
    )
}