import { RightOutlined } from "@ant-design/icons"

export const BreadcrumbComponent = ({data}) =>{

  const breadcrumbObject = {
    'track-request':'Track Request'
  }

    return (
        <div className='breadcrumb-major-component'>
        <span className='text-decoration-underline governify-breadcumb-home governify-cursor-pointer'>Home</span>
        <ol class="breadcrumb">
        {data.map((item , index) =>{
            if(item.length > 0){
                return <span key={index}>
                <li class="breadcrumb-item"><RightOutlined className="fs-12 text-color-928f8f pl-8"/> <span className='fs-16 text-color-0d6efd governify-cursor-pointer'>{breadcrumbObject[item]}</span></li>
                    </span>
            }
            
        })}
          </ol>
        </div>
    )
}