// src/apis/index.js
//parse means convert Takes a JSON-formatted string and parses it back into the corresponding JavaScript value (object, array, number, etc.)
// Takes a JavaScript value (object, array, number, etc.) and returns a JSON-formatted string
// 1. Define your key as a string constant
import axios from 'axios';
const API_BASE = 'http://localhost:5000/users';  
// In frontend/src/apis/index.js
// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/users';
const TOKEN_KEY = 'AUTH_TOKEN';  
const USER = "USER_DATA"; 


// Mark number as spam
export const markNumberAsSpam = async (phoneNumber) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_BASE}/markspam`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to mark as spam");
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error("Error marking as spam:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getGlobalContacts = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY); // Or however you store your token

    const response = await fetch(`${API_BASE}/global`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch global contacts");
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching global contacts:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
//sendotp
export async function resendotpfrontend({ email }) {
  try {
    const resp = await axios.post(`${API_BASE}/sendotp`, {
      email,
    });

    return {
      success: true,
      message: resp.data.message || "OTP sent successfully",
    };
  } catch (err) {
    console.error("Error in resend OTP:", err);
    const errorData = err.response?.data || {};
    return {
      success: false,
      message: errorData.message || "Failed to resend OTP",
    };
  }
}

export async function verifybutton({ email, otp, user }) {
  try {
    const response = await axios.post(`${API_BASE}/verifyotp`, {
      email,
      otp,
    });

    const data = response.data; // Access .data from axios response
    const token = data.token;

    // Store token in localStorage
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER, JSON.stringify(user));
    }

    return {
      success: true,
      message: data.message,
      token: token,
    };
  } catch (err) {
    const errorData = err.response?.data || {};
    return {
      success: false,
      message: errorData.message || "OTP verification failed",
    };
  }
}

//to add form data
// Add contact
export async function addcontact({ name, phonenumber }) {

  try {
    const token = localStorage.getItem(TOKEN_KEY); // Get actual token value
    const resp = await axios.post(
      `${API_BASE}/addcontact`,
      {
        name,
        phonenumber,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
console.log(resp)
    return {
      success: true,
      message: resp.data.message,
      contact: resp.data.contact,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || "Failed to add contact",
    };
  }
}

// Delete contact
// API function for deleting a contact
export async function deletecontact(contactId) {
  try {
    console.log(contactId);
    console.log("inside try")
    const token = localStorage.getItem(TOKEN_KEY);
    const resp = await axios.delete(`${API_BASE}/deletecontact/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(resp)

    return {
      success: true,
      message: resp.data.message || "Contact deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to delete contact",
    };
  }
}

export async function getcontacts() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const resp = await axios.get(`${API_BASE}/getcontacts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: resp.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to get contacts",
    };
  }
}
// Signup API
export async function userSignup({
  username,
  PHnumber,
  email,
  password,
  city,
  country,
}) {
  try {
    const resp = await axios.post(`${API_BASE}/`, {
      username,
      PHnumber,
      email,
      password,
      city,
      country,
    });

    const { user, message } = resp.data;

    // Send OTP after successful signup
    try {
      await axios.post(`${API_BASE}/sendotp`, { email });
    } catch (otpError) {
      console.error("OTP send failed:", otpError);
      // Continue anyway - user is created
    }

    return { success: true, user, message };
  } catch (err) {
    const errorData = err.response?.data || {};
    return {
      success: false,
      message: errorData.message,
      errors: errorData.errors || {},
    };
  }
}


// Login API
export async function userLogin({ email, password }) {
  try {
    const resp = await axios.post(`${API_BASE}/login`, {
      email,
      password,
    });

    const { user, message } = resp.data;
    console.log("Login successful:", user);

    // Send OTP after successful login
    try {
      await axios.post(`${API_BASE}/sendotp`, { email });
    } catch (otpError) {
      console.error("OTP send failed:", otpError);
      // Continue anyway - login is successful
    }

    return {
      success: true,
      user,
      message,
    };
  } catch (err) {
    console.error("Login failed:", err.response?.data || err);

    if (err.response?.data) {
      const { message, errors } = err.response.data;

      return {
        success: false,
        message: message || "Login failed",
        errors: errors || {},
        status: err.response.status,
      };
    }

    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}
// 3️⃣ Logout clears the token
export function userLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER);
}

// 4️⃣ checkLogin returns the token (or null)
export function checkLogin() {
  const token   = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER); // make sure this matches exactly where you .setItem()

  let user = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch (e) {
      console.warn('Couldn’t parse USER from localStorage:', rawUser, e);
      // fallback: leave user === null
    }
  }

  return { token, user };
}
