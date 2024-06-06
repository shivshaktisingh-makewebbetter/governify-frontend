import { Button } from "antd"
import { ExportIcon, FilterIcon } from "../../utils/Icons"

export const SortingAndFilterComponent = () =>{
    return (
        <div style={{display:'flex' , justifyContent:'left' , paddingTop:'8px' , marginBottom:'32px'}}>
            <Button style={{display:'flex' , alignItems:'center' , gap:'5px'}} type='text' className="governify-sortby-button"> <span><i className="bi bi-sort-down"></i></span><span className='fs-16 text-color-928f8f'>Sort By</span> </Button>
            <Button style={{display:'flex' , alignItems:'center' , gap:'5px'}} type='text' className="governify-sortby-button"> <span> <FilterIcon/></span><span className='fs-16 text-color-928f8f'>Filter</span> </Button>
            <Button  style={{display:'flex' , alignItems:'center' , gap:'5px'}}  type='text' className="governify-sortby-button"> <span><ExportIcon/></span><span className='fs-16 text-color-928f8f'>Export</span> </Button>

        </div>
    )
}