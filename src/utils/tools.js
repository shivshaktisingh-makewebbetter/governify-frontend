import { fetcher, getRole } from "./helper";



export const userSettingData = async() =>{
	const role = getRole();
	let endpoint = role === 'customer' ? `governify/customer/governifySiteSetting` : `governify/admin/governifySiteSetting`;
	let method = 'GET';
  try{
    const response = await fetcher(endpoint , method); 
    if(response.status){
      let uiData = JSON.parse(response.response.ui_settings);
      let data = {image: response.response.logo_location ,...uiData };
        sessionStorage.setItem('settings' , JSON.stringify(data));
    }
  }catch(err){
   console.log(err , 'err');
  }
	
}

export const getLoginUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = `loginUserDetails/${token}`;
      const method = "GET";
      const response = await fetcher(url, method);
      if (response.success) {
        sessionStorage.setItem("userName", response.data.name);
        sessionStorage.setItem("userEmail", response.data.email);
        sessionStorage.setItem("userId", response.data.user_id);
        sessionStorage.setItem("createdAt", response.data.created_at);
      }
    } catch (err) {
      console.log(err, "error");
    } finally {
    }
  };









































