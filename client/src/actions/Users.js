import {
  CREATE_USER,
  LOGIN,
  RESET_PASSWORD,
  SEND_OTP,
  VERIFY_OTP,
  ERROR_TYPE,
  USER_HISTORY,
  BUY_STOCKS,
  WALLET,
  ALL_STOCKS_BOUGHT,
  SELL_STOCKS
} from "./Types";
import axios from "axios";
const url = "https://headstocksbhavana.herokuapp.com/api/users/";

// Create a new user - Bhavana
export const createUser = user => dispatch => {
  return axios
    .post(url + "signup", user)
    .then(res => {
      dispatch({
        type: CREATE_USER,
        payload: res.data.data
      });
    })
    .catch(err => {
      dispatch({
        type: ERROR_TYPE,
        payload: err.response.data.message
      });
    });
};

// Login - Bhavana
export const login = (user, history) => dispatch => {
  return axios
    .post(url + "login", user)
    .then(res => {
      localStorage.setItem("token", res.data.data);
      history.push("/");
      dispatch({
        type: LOGIN,
        payload: res.data.data
      });
    })
    .catch(err => {
      dispatch({
        type: ERROR_TYPE,
        payload: err.response.data.message
      });
    });
};

// Reset Password - Bhavana
export const resetPassword = user => dispatch => {
  return axios
    .put(url + "reset_password", user)
    .then(res => {
      dispatch({
        type: RESET_PASSWORD,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Send OTP to verify email - Bhavana
export const sendOtp = user => dispatch => {
  return axios
    .post(url + "send_otp", user)
    .then(res => {
      dispatch({
        type: SEND_OTP,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Verify Otp - Bhavana
export const verifyOtp = user => dispatch => {
  return axios
    .post(url + "verify_otp", user)
    .then(res => {
      dispatch({
        type: VERIFY_OTP,
        payload: res.data.data
      });
    })
    .catch(err => {
      dispatch({
        type: ERROR_TYPE,
        payload: err.response.data.message
      });
      console.log(err.response.data.message);
    });
};

//for  users stock history detail [piyush]
export const userHistory = email => dispatch => {
  return axios
    .get(url + "history/" + email)
    .then(res => {
      dispatch({
        type: USER_HISTORY,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//buy Stocks for users - Bhavama
export const buyStocks = stocks => dispatch => {
  console.log(stocks);
  return axios
    .put(url + "buy", stocks)
    .then(res => {
      dispatch({
        type: BUY_STOCKS,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//Get Wallet Balance
export const getWallet = email => dispatch => {
  return axios
    .post(url + "wallet", email)
    .then(res => {
      dispatch({
        type: WALLET,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//Get All Stocks Bought by a user
export const getAllStocks = email => dispatch => {
  return axios
    .post(url + "myStocks", email)
    .then(res => {
      dispatch({
        type: ALL_STOCKS_BOUGHT,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};
// Sell Stocks
export const sellStocks = email => dispatch => {
  console.log(email);
  return axios
    .put(url + "sell", email)
    .then(res => {
      dispatch({
        type: SELL_STOCKS,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};
