import { UPDATE_COMPANY } from "./Types";

import axios from "axios";

//updating a company
export const updateCompany = (data, id) => dispatch => {
  try {
    return axios
      .post(
        "https://headstocksbhavana.herokuapp.com/api/upload/updateCompany/" +
          id,
        data
      )
      .then(res => {
        dispatch({
          type: UPDATE_COMPANY,
          payload: res.data.data
        });
      });
  } catch (err) {
    console.log(err);
  }
};
