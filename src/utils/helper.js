export const fetcher = async (endpoint , method , payload = null) =>{
    const token = getToken();
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",`bearer ${token}`);
    let url = `https://onboardify.tasc360.com/${endpoint}`
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
    let user = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE4MTgzODgxLCJleHAiOjE3MTg0NDMwODEsIm5iZiI6MTcxODE4Mzg4MSwianRpIjoia1ZHSWE2anJ0dWN3eGN0VSIsInN1YiI6IjM0IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.Gu9flNwjyVUtYkUvAs8FLxG2iw5thl5CMjRcShc0NxI';
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