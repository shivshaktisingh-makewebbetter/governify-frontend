export const fetcher = async (endpoint , method , payload = null) =>{
    const token = getToken();
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",`bearer ${token}`);
    let url = `http://127.0.0.1:8000/${endpoint}`
    let requestOptions = {
    method,
    headers: myHeaders,
    };
    if(payload){
        requestOptions.body = payload;
    }

    const response = await fetch(url, requestOptions);
    const data = await response.json(); 
    return data;

    
}



export const getRole = () =>{
    let url = window.location.href;
    let flag =  hasAdminKeyword(url);
    if(flag){
       return 'superAdmin';
    }else{
       return 'customer';
    }
    // let role = sessionStorage.getItem('role') || 'customer';
    // return role;
}


function hasAdminKeyword(url) {
    if(url.includes('admin')){
        return true;
    }
    return false;
}



const getToken = () =>{
    let url = window.location.href;
    let user = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTgxODU1OTYsImV4cCI6MTcxODE4OTE5NiwibmJmIjoxNzE4MTg1NTk2LCJqdGkiOiJtbmJ5Zm5NRTRIZzhjRTZrIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.iQhH1auabThb7NdbnqILCiJMO7k6B9GQ-gsKcq54hto';
    let admin = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE4MTgzOTM3LCJleHAiOjE3MTg0NDMxMzcsIm5iZiI6MTcxODE4MzkzNywianRpIjoiMENqOFFJNEdGWWdJUTdLaSIsInN1YiI6IjciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.7QpOSy8JNh1tKHOYSzp1lxb910QHKyFGtKQmUZ59pe4';
    // let token = sessionStorage.getItem('token') || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTgxOTAyNTYsImV4cCI6MTcxODE5Mzg1NiwibmJmIjoxNzE4MTkwMjU2LCJqdGkiOiIxTnA2eEg3NGlGenRwc2QwIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Kt2YXE_9qszcn6kx1YrYRu32QZUGsULLF45LRA79wN4";
   let flag =  hasAdminKeyword(url);

   if(flag){
    return admin;
   }else{
    return user;
   }
// return token;
}