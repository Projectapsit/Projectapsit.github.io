import { SEARCH_CONTENT } from "./Types";

import axios from "axios";

//getting Search results

export const searchContent = searchInput => dispatch => {
  return axios
    .post(
      "https://headstocksbhavana.herokuapp.com/api/navbar/search",
      searchInput
    )
    .then(res => {
      dispatch({
        type: SEARCH_CONTENT,
        payload: res.data.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};
