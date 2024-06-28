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
    
    let role = sessionStorage.getItem('role') ;
    return role;
}






const getToken = () =>{
    let token = sessionStorage.getItem('token') ;

return token;
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