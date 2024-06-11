import { fetcher, getRole } from "./helper";



export const userSettingData = async() =>{
	const role = getRole();
	let endpoint = role === 'customer' ? `governify/customer/governifySiteSetting` : `governify/admin/governifySiteSetting`;
	let method = 'GET';
	const response = await fetcher(endpoint , method); 
	if(response.status){
		let uiData = JSON.parse(response.response.ui_settings);
		let data = {image: response.response.logo_location ,...uiData };
	    sessionStorage.setItem('settings' , JSON.stringify(data));
	}
}









































