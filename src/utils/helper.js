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
    let role = sessionStorage.getItem('role') || 'superAdmin';
    return role;
}



const getToken = () =>{
    let token = sessionStorage.getItem('token') || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTgxODIxNTIsImV4cCI6MTcxODE4NTc1MiwibmJmIjoxNzE4MTgyMTUyLCJqdGkiOiJiRk5UaVdDRGlMb3J3Z09aIiwic3ViIjoiMTEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ismpg70egW8yP9zEtltSOkcWsSAM9NGJgb7g8uzl2bI";
    return token;
}