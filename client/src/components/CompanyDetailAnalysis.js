import React, { Component } from "react";
import CompanyDetailSecondaryNavbar from "./Common/CompanyDetailSecondaryNavbar";
import {
  getCompanyDetailById,
  getSimilarTable,
  getDropDownData,
  getGaugeCompany1,
  getGaugeCompany2,
  getmonteCarloCompany1,
  getmonteCarloCompany2,
  getAssetsCompany1,
  getAssetsCompany2,
  sharePriceComparison
} from "../actions/CompanyDetail";
import { connect } from "react-redux";
import "../styles/CompanyDetailAnalysis.css";
import gauge from "./Common/gauge.png";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Table from "./Common/TickerTable";
import { Link } from "react-router-dom";

export class CompanyDetailAnalysis extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getCompanyDetailById(id);
    this.props.getGaugeCompany1(this.props.match.params.id);
    this.props.getGaugeCompany2("ACN");
    this.props.getAssetsCompany1(this.props.match.params.id);
    this.props.getAssetsCompany2("ACN");
    this.props.getmonteCarloCompany1("AAPL");
    this.props.getmonteCarloCompany2("ACN");
    this.props.sharePriceComparison(this.props.match.params.id, "ACN");
  }

  //function that would change the state value with the value selected and inside which the action function will be called and that ticker name will passed
  // this action is to plot the graph
  OnSelectTicker = e => {
    this.setState({
      ticker_name: e.target.value
    });
    this.props.getGaugeCompany2(e.target.value);
    this.props.getAssetsCompany2(e.target.value);
    this.props.getmonteCarloCompany2(e.target.value);
    this.props.sharePriceComparison("AAPL", e.target.value);
  };

  render() {
    console.log(this.props);
    return (
      <div>
        {/* checking whether the data has been loaded into the reducer and if it is then getSimilarTabl which will have a parameter sector from the data loaded in the reducer  */}
        <CompanyDetailSecondaryNavbar selected="analysis" />
        <div
          id={
            localStorage.getItem("token")
              ? "analysis_main_container"
              : "analysis_main_container_blur"
          }
        >
          <div id="company_analaysis_table">
            {this.props.similar_company["0"] ? (
              <>
                {console.log(
                  this.props.similar_company["0"].similar_sector_data
                )}
                <Table
                  tableHeaders={[
                    "Ticker",
                    "Dividends",
                    "Market Cap",
                    "Net Profit",
                    "P/E ratio",
                    "Share Price",
                    "ROCE%"
                  ]}
                  tableData={this.props.similar_company["0"]}
                />
              </>
            ) : (
              <p>Loading </p>
            )}
          </div>
          {/* DROPDOWN FOR SIMILAR COMPANIES  */}

          <div id="company-analysis-similar-cimpany-dropdown">
            <div id="compare_analysis">
              <p>Detailed Comparision with: </p>
              <select
                type="text"
                className="stocks_dropdown"
                name="sector"
                onChange={this.OnSelectTicker}
              >
                {this.props.drop_down_data.map(companies => (
                  <>
                    <option name="choice">{companies.ticker_name}</option>
                  </>
                ))}
              </select>
            </div>
          </div>
          {!this.props.isLoading ? (
            <div>
              <div id="analysis-financial-positional-grid-container">
                <div id="analysis-financial-positional-1">
                  <div id="stocks_assests">
                    <iframe
                      id="assets1"
                      src="https://plot.ly/~nikhile/432.embed"
                      style={{
                        width: "650px",
                        height: "500px",
                        outline: "none",
                        border: "none"
                      }}
                    />
                  </div>
                </div>
                <div id="analysis-financial-positional-2">
                  <iframe
                    src="https://plot.ly/~nikhile/434.embed"
                    style={{
                      width: "650px",
                      height: "500px",
                      outline: "none",
                      border: "none"
                    }}
                  />
                </div>
              </div>
              <p id="analysis_graph_title">Recommendation</p>
              <div id="analysis-recommendation-grid-container">
                <div id="analysis-recommendation-1">
                  <img
                    id="analysis-gauge-1"
                    src={
                      this.props.gauge1
                        ? "data:image/jpeg;base64," + this.props.gauge1
                        : gauge
                    }
                  />
                </div>
                <div id="analysis-recommendation-2">
                  <img
                    id="analysis-gauge-2"
                    src={
                      this.props.gauge2
                        ? "data:image/jpeg;base64," + this.props.gauge2
                        : gauge
                    }
                  />
                </div>
              </div>
              <div id="analysis-financial-positional-grid-container">
                <div id="analysis-financial-positional-1">
                  <div id="stocks_assests">
                    <iframe
                      id="assets1"
                      src="https://plot.ly/~nikhile/428.embed"
                      style={{
                        width: "650px",
                        height: "500px",
                        outline: "none",
                        border: "none"
                      }}
                    />
                  </div>
                </div>
                <div id="analysis-financial-positional-2">
                  <iframe
                    src="https://plot.ly/~nikhile/430.embed"
                    style={{
                      width: "650px",
                      height: "500px",
                      outline: "none",
                      border: "none"
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ margin: "200px 550px" }}>
              <Loader type={Loader} color="#2c3e50" height="100" width="400" />
            </div>
          )}
        </div>
        <div id={localStorage.getItem("token") ? "bg-no-text" : "bg-text"}>
          <p>Please login to enable this feature</p>
          <Link to="/login">
            <button id="button_for_blur">Login</button>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  company: state.CompanyDetailReducer.company,
  similar_company: state.CompanyDetailReducer.similar_company,
  drop_down_data: state.CompanyDetailReducer.drop_down_data,
  gauge1: state.CompanyDetailReducer.gauge1,
  gauge2: state.CompanyDetailReducer.gauge2,
  monteCarlo1: state.CompanyDetailReducer.monteCarlo1,
  monteCarlo2: state.CompanyDetailReducer.monteCarlo2,
  assets1: state.CompanyDetailReducer.assets1,
  assets2: state.CompanyDetailReducer.assets2,
  priceComparison: state.CompanyDetailReducer.priceComparison,

  isLoading: state.LoadingReducer.isLoading
});
export default connect(mapStateToProps, {
  getCompanyDetailById,
  getSimilarTable,
  getDropDownData,
  getGaugeCompany1,
  getGaugeCompany2,
  getmonteCarloCompany1,
  getmonteCarloCompany2,
  getAssetsCompany1,
  getAssetsCompany2,
  sharePriceComparison
})(CompanyDetailAnalysis);
