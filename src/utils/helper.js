export const fetcher = async (url , method , payload = null) =>{
    const token = getToken();
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",`bearer ${token}`);

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
    let token = sessionStorage.getItem('token');
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTc0MTIyOTgsImV4cCI6MTcxNzQxNTg5OCwibmJmIjoxNzE3NDEyMjk4LCJqdGkiOiJFWmNJVXNLcnFqMXlQeTM5Iiwic3ViIjoiMTEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.7kOjNdsqbtiyX8wuzv_u5OzZ8nMtAMOQ13HhFg1cpL0';
}