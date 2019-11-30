import {
  GET_ALL_COMPANY,
  GET_ALL_SECTORS,
  GET_ALL_INDUSTRIES,
  GAINERS_LOSERS,
  SCREENER_SEARCH
} from "./Types";
import { startLoading, stopLoading } from "./LoadingAction";
import axios from "axios";
const url = "https://headstocksbhavana.herokuapp.com/api/sector/";

// GET companies by sector and industry
export const getCompany = (filter, type) => dispatch => {
  dispatch(startLoading());
  return axios
    .post(url + "allcompanies/" + filter + "/" + type)
    .then(res => {
      dispatch(stopLoading());
      dispatch({
        type: GET_ALL_COMPANY,
        payload: res.data.data
      });
      console.log(res.data.data);
    })
    .catch(err => {
      dispatch(startLoading());
      console.log(err);
    });
};

// GET all sectors
export const getSectors = () => dispatch => {
  return axios
    .get(url + "companysectors")
    .then(res => {
      dispatch({
        type: GET_ALL_SECTORS,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//getting industries by sector
export const getIndustries = sector => dispatch => {
  console.log("get industries by sector from actions:", sector);
  return axios
    .get(url + "industries/" + sector)
    .then(res => {
      dispatch({
        type: GET_ALL_INDUSTRIES,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// GET Gainers and Losers by Sector
export const getGainersLosers = sector => dispatch => {
  return axios
    .get(url + "gainers-and-losers/" + sector)
    .then(res => {
      dispatch({
        type: GAINERS_LOSERS,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};
// [Nikhil]  get screener search
export const getScreenerSearch = (
  ebit1,
  ebit2,
  market_cap_value1,
  market_cap_value2,
  share_price1,
  share_price2,
  total_assests1,
  total_assests2,
  revenue1,
  revenue2,
  net_profit1,
  net_profit2,
  sector,
  industry
) => dispatch => {
  let values = {
    ebit1: ebit1,
    ebit2: ebit2,
    market_cap_value1: market_cap_value1,
    market_cap_value2: market_cap_value2,
    share_price1: share_price1,
    share_price2: share_price2,
    total_assests1: total_assests1,
    total_assests2: total_assests2,
    revenue1: revenue1,
    revenue2: revenue2,
    net_profit1: net_profit1,
    net_profit2: net_profit2,
    sector: sector,
    industry: industry
  };
  console.log("from screener search actions", values);
  return axios
    .post(
      "https://headstocksbhavana.herokuapp.com/api/screener/screener",
      values
    )
    .then(res => {
      dispatch({
        type: SCREENER_SEARCH,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};
