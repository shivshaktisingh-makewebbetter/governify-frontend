export const fetcher = async (endpoint , method , payload = null) =>{
    const token = getToken();
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",`bearer ${token}`);
    let url = `http://127.0.0.1:8000/${endpoint}`
    // http://127.0.0.1:8000
    // https://onboardify.tasc360.com/
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
    let role = sessionStorage.getItem('role') || 'customer';
    return role;
}



const getToken = () =>{
    let token = sessionStorage.getItem('token') || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTgwOTUxNDMsImV4cCI6MTcxODA5ODc0MywibmJmIjoxNzE4MDk1MTQzLCJqdGkiOiJQdVFuV1E1bktCTVNnclN2Iiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.9lh2yFMhX56B90gLezHm9sLHCckb7voSDauBBLJ0_0s";
    return token;
}