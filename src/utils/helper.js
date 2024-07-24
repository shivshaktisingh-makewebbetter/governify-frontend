import { jwtDecode } from "jwt-decode";

export function isTokenValid(token) {
  if (!token) return { valid: false, error: "Token is empty" };

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return { valid: false, error: "Token is expired" };
    }

    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: "Invalid token" };
  }
}

export const fetcher = async (endpoint, method, payload = null) => {
  const token = getToken();
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `bearer ${token}`);
  let url = `https://onboardify.tasc360.com/${endpoint}`;
  let requestOptions = {
    method,
    headers: myHeaders,
  };
  if (payload) {
    requestOptions.body = payload;
  }
  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    // if(token !==null && token.length > 0 && data.hasOwnProperty('message') && data.message === 'Unauthenticated.'){
    //   sessionStorage.clear();
    //  window.location.href = 'https://governify.tasc360.com/signin';
    // }

    return data;
  } catch (err) {
    console.log(err ,'err');
  }
};

export const getRole = () => {
  let role = sessionStorage.getItem("role");
  return role;
};

export const getToken = () => {
  let token = sessionStorage.getItem("token");

  return token;
};

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
        message += msg.replace("https", "https:");
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

export function appendEmoji(value, emoji) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");

  // Find all <p> tags
  const pTags = doc.querySelectorAll("p");

  // Append emoji to the last <p> tag
  if (pTags.length > 0) {
    let lastPTag = pTags[pTags.length - 1];
    if (lastPTag.innerHTML.trim() === "<br>") lastPTag.innerHTML = "";
    lastPTag.append(emoji);
  }

  // Convert the modified document back to a string
  const modifiedHtmlString = doc.body.innerHTML;
  return value === "" ? emoji : modifiedHtmlString;
}
