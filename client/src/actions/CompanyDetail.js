import {
  COMPANY_DETAIL,
  COMPANY_DETAIL_BY_ID,
  COMPANY_DATES_BY_ID,
  OHLC_CHART,
  GET_SIMILAR_TABLE,
  GET_DROP_DOWN,
  GET_GAUGE_COMPANY1,
  VOLATILITY,
  GET_GAUGE_COMPANY2,
  MONTECARLO_COMPANY1,
  MONTECARLO_COMPANY2,
  ASSETS_COMPANY1,
  ASSETS_COMPANY2,
  SHARE_PRICE_COMPARISON
} from "./Types";
import { startLoading, stopLoading } from "./LoadingAction";
import axios from "axios";

// getting company details[NIKHIL]
export const getCompanyDetail = () => dispatch => {
  try {
    return axios
      .get("https://head-stocks-nodejs.herokuapp.com/api/companydetail/all")
      .then(res => {
        dispatch({
          type: COMPANY_DETAIL,
          payload: res.data.data
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// getting company details by id [NIKHIL]
export const getCompanyDetailById = id => dispatch => {
  console.log("get companydetails by id from actions", id);
  try {
    return axios
      .get("https://head-stocks-nodejs.herokuapp.com/api/companydetail/" + id)
      .then(res => {
        dispatch({
          type: COMPANY_DETAIL_BY_ID,
          payload: res.data.data
        });
        let sector = {
          sector: res.data.data["0"].sector
        };
        console.log("obj sector from action", sector);

        //To call another action within the action we call the function in the dipatch.
        // calling another action
        dispatch(getSimilarTable(sector));

        console.log("from then");
      });
  } catch (err) {
    console.log(err);
  }
};

//GETTING DATA FOR DROPDOWN
export const getDropDownData = sector => dispatch => {
  console.log("actions of dropdown", sector);
  try {
    return axios
      .post("https://head-stocks-nodejs.herokuapp.com/api/dropdown", sector)
      .then(res => {
        dispatch({
          type: GET_DROP_DOWN,
          payload: res.data.data
        });
        console.log("from then of drop down action");
      });
  } catch (err) {
    console.log(err);
  }
};

//getting analysis
export const getSimilarTable = sector => dispatch => {
  // const sector = requset.body.sector;
  console.log("get analysis by id from actions", sector);
  try {
    return axios
      .post(
        "https://head-stocks-nodejs.herokuapp.com/api/analysis/analysis",
        sector
      )
      .then(res => {
        dispatch({
          type: GET_SIMILAR_TABLE,

          payload: res.data.data
        });
        console.log("from then of similar table");
        dispatch(getDropDownData(sector));
      });
  } catch (err) {
    console.log(err);
  }
};

// Fetching OHLC Chart for company [Bhavana]
export const getOhlcChart = id => dispatch => {
  console.log(id);
  dispatch(startLoading());
  try {
    return axios
      .get("https://pythonserverbhavana.herokuapp.com/companyindices/" + id)
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: OHLC_CHART,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
    console.log(err);
  }
};

// downloading ohlc data for company[piyush]

export const downloadOhlcDataCompany = ohlc => {
  try {
    return axios.get(
      "https://head-stocks-nodejs.herokuapp.com/api/companydetail/downloadohlc/" +
        ohlc
    );
  } catch (err) {
    console.log(err);
  }
};

// getting company dates by id
export const getCompanyDatesById = (id, yearSelected) => dispatch => {
  // console.log("get companydetails by id from actions", id);
  try {
    // console.log(yearSelected.yearInput);
    if (yearSelected.yearInput !== "All") {
      return axios
        .post(
          "https://head-stocks-nodejs.herokuapp.com/api/companydetail/financial/" +
            id,
          yearSelected
        )
        .then(res => {
          dispatch({
            type: COMPANY_DATES_BY_ID,
            payload: res.data.data
          });
        });
    } else {
      return axios
        .post(
          "https://head-stocks-nodejs.herokuapp.com/api/companydetail/financial/" +
            id
        )
        .then(res => {
          dispatch({
            type: COMPANY_DATES_BY_ID,
            payload: res.data.data
          });
        });
    }
  } catch (err) {
    console.log(err);
  }
};

// Gauge for Company1
export const getGaugeCompany1 = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get("https://pythonserverbhavana.herokuapp.com/gaugeCompany1/" + ticker)
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: GET_GAUGE_COMPANY1,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
    console.log(err);
  }
};

// gauge fro company2
export const getGaugeCompany2 = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get("https://pythonserverbhavana.herokuapp.com/gaugeCompany2/" + ticker)
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: GET_GAUGE_COMPANY2,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
    console.log(err);
  }
};

// Montre Carlo Prediction for Company1
export const getmonteCarloCompany1 = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get(
        "https://pythonserverbhavana.herokuapp.com/monteCarloCompany1/" + ticker
      )
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: MONTECARLO_COMPANY1,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
    console.log(err);
  }
};

// Monte Carlo Prediction for Company2
export const getmonteCarloCompany2 = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get(
        "https://pythonserverbhavana.herokuapp.com/monteCarloCompany2/" + ticker
      )
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: MONTECARLO_COMPANY2,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
  }
};

// Assets and Liabilities Graph for Company1
export const getAssetsCompany1 = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get("https://pythonserverbhavana.herokuapp.com/assetsCompany1/" + ticker)
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: ASSETS_COMPANY1,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
  }
};

// Assets and Liabilities Graph for Company1
export const getAssetsCompany2 = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get("https://pythonserverbhavana.herokuapp.com/assetsCompany2/" + ticker)
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: ASSETS_COMPANY2,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
  }
};

// Get Volatility
export const getVolatility = ticker => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get("https://pythonserverbhavana.herokuapp.com/voltality/" + ticker)
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: VOLATILITY,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
  }
};

// Share Price Comparison
export const sharePriceComparison = (ticker1, ticker2) => dispatch => {
  dispatch(startLoading());
  try {
    return axios
      .get(
        "https://pythonserverbhavana.herokuapp.com/shareprice/" +
          ticker1 +
          "/" +
          ticker2
      )
      .then(res => {
        dispatch(stopLoading());
        dispatch({
          type: SHARE_PRICE_COMPARISON,

          payload: res.data
        });
      });
  } catch (err) {
    dispatch(startLoading());
  }
};
