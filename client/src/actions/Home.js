import { ALL_NEWS, NEWS_BY_ID, GET_ALL_INDICES } from "./Types";
import { startLoading, stopLoading } from "./LoadingAction";
import axios from "axios";
const url = "https://head-stocks-nodejs.herokuapp.com/api/home/";

// get all news - piyush
export const allNews = () => dispatch => {
  return axios
    .get(url + "allnews")
    .then(res => {
      dispatch({
        type: ALL_NEWS,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// get all news - piyush
export const newsById = news_id => dispatch => {
  console.log(news_id);
  return axios
    .get(url + "singleNews/" + news_id)
    .then(res => {
      dispatch({
        type: NEWS_BY_ID,
        payload: res.data.data
      });
      console.log(res.data.data);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get all Indices -piyush
export const getIndices = () => dispatch => {
  dispatch(startLoading());
  return axios
    .get(url + "index")
    .then(res => {
      dispatch(stopLoading());
      dispatch({
        type: GET_ALL_INDICES,
        payload: res.data.data
      });
    })
    .catch(err => {
      dispatch(startLoading());
      console.log(err);
    });
};
