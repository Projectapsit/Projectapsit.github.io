import {
  GET_INDICES_BYID,
  OHLC_CHART_INDEX,
  OHLC_INDICES_DATA,
  DOWNLOAD
} from "./Types";
import axios from "axios";
const url = "https://headstocksbhavana.herokuapp.com/api/indicesprofile/";

// GET all companies- Bhavana
export const getIndicesById = index => dispatch => {
  return axios
    .get(url + "singleindex/" + index)
    .then(res => {
      dispatch({
        type: GET_INDICES_BYID,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Get Ohlc Indices BY ID
export const getOhlcIndicesById = (index, range) => dispatch => {
  console.log(range);
  return axios
    .post(url + "ohlcdata/" + index, range)
    .then(res => {
      dispatch({
        type: OHLC_INDICES_DATA,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Fetching OHLC Chart for company
export const getOhlcChartIndex = id => dispatch => {
  try {
    return axios.get("http://localhost:5000/ohlcindices/" + id).then(res => {
      dispatch({
        type: OHLC_CHART_INDEX,
        payload: res.data
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// Download Report for Indices
export const download = report => dispatch => {
  return axios
    .post("http://localhost:2001/api/download/report", report)
    .then(res => {
      dispatch({
        type: DOWNLOAD
      });
    })
    .catch(err => {
      console.log(err);
    });
};
