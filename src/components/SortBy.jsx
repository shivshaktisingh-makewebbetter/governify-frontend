import { Button , Dropdown  } from "antd"


export const SortBy = ({items}) =>{
   
    return (
            <Dropdown
                menu={{
                items,
                }}
                placement="bottomRight"
                key='order'
            >
              <Button style={{display:'flex' , alignItems:'center' , gap:'5px'}} type='text' className="governify-sortby-button"> <span><i className="bi bi-sort-down"></i></span><span className='fs-16 text-color-928f8f'>Sort By</span> </Button>
            </Dropdown>
    )
}