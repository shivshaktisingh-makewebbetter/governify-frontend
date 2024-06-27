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
    let user = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE5NDYzOTE4LCJleHAiOjE3MTk3MjMxMTgsIm5iZiI6MTcxOTQ2MzkxOCwianRpIjoiR0ZvNnp3ZHFjOW1yUnRMcCIsInN1YiI6IjM0IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.LxgEKrpXDnlLODpu9bqrRAl_H9-PZXYIzhrYNF7UBu8';
    let admin= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29uYm9hcmRpZnkudGFzYzM2MC5jb20vY29tbW9tLWxvZ2luIiwiaWF0IjoxNzE5NDYzODk0LCJleHAiOjE3MTk3MjMwOTQsIm5iZiI6MTcxOTQ2Mzg5NCwianRpIjoiV1BZOXNlTGN0dXBLUFdiTSIsInN1YiI6IjciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.kYqscKLNXapd2DA61NHG3E_G5onrlqGeOLMxMYOKufU';
    // let token = sessionStorage.getItem('token') || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3MTgxOTAyNTYsImV4cCI6MTcxODE5Mzg1NiwibmJmIjoxNzE4MTkwMjU2LCJqdGkiOiIxTnA2eEg3NGlGenRwc2QwIiwic3ViIjoiMTMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Kt2YXE_9qszcn6kx1YrYRu32QZUGsULLF45LRA79wN4";
   let flag =  hasAdminKeyword(url);

   if(flag){
    return admin;
   }else{
    return user;
   }
// return token;
}



export function getDateAndTime(time) {
    let date = new Date(time);
    let day = date.getDate();
    let month = date.toLocaleString("default", { month: "long" });
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
  
    let newDate = `${day} ${month.slice(0, 3)} ${year} at ${hour}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
    return newDate;
  }

  export function getFirstLettersOfName(value) {
    let name = value.split(" ");
    let firstLetters = "";
    name.forEach((item) => {
      firstLetters += item[0].toUpperCase();
    });
  
    return firstLetters;
  }

export function extractUsernameFromMessage(value) {
    let message = "";
    let newValue = value.split(":");
    if (value.includes(sessionStorage.getItem("userEmail"))) {
      newValue.forEach((msg, i) => {
        if (i !== 0) {
          message += msg;
        }
      });
    } else {
      message = value;
    }

    return message;
  }

export function showUserName(value) {
    let userName = "";
    if (value.includes(sessionStorage.getItem("userEmail"))) {
      userName = sessionStorage.getItem("userName");
    } else {
      userName = "Governify Team";
    }

    return userName;
  }