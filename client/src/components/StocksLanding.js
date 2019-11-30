import React, { Component } from "react";
//[Nikhil] imports for range slider
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "../styles/AdvanceFilter.css";
import Slider from "rc-slider";
import { RadarGraph } from "./Common/RadarGraph";
import { Link } from "react-router-dom";

// import RadarSlider from "../charts/graph";

import {
  getCompany,
  getSectors,
  getIndustries,
  getGainersLosers,
  //[NIKHIL] SCREENER ACTIONS
  getScreenerSearch
} from "../actions/Stocks";
import "../styles/StocksLanding.css";
import "../styles/Admin.css";
import companylogo from "./Common/stockslogo.PNG";
import editlogo from "./Common/edit.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import Table from "../components/Common/TickerTable";

// Harshal
import UpdateCompany from "./UpdateCompany";
import jwt_decode from "jwt-decode";

var decode;

//[Nikhil] rc-slider
//package documentation link
//https://www.npmjs.com/package/rc-slider

//source code http://react-component.github.io/slider/examples/handle.html
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export class StocksLanding extends Component {
  state = {
    data: [],
    items: 20,
    loadingstate: false,
    height: 800,
    pageStocks: [],
    loading: false,
    sector: "Basic Materials",
    industry: "Building Materials",
    gainersClick: true,

    //[Nikhil] default slider value
    ebit1: -50,
    ebit2: 1000,
    market_cap_value1: 0,
    market_cap_value2: 1000,
    share_price1: 0,
    share_price2: 1000,
    total_assests1: 0,
    total_assests2: 1000,
    revenue1: 0,
    revenue2: 1000,
    net_profit1: 0,
    net_profit2: 1000,
    filter: false,
    normal: true,

    //[NIKHIL] radar graph

    marksData: {
      labels: [
        "Market Cap",
        "Dividend",
        "PE Ratio",
        "Debt to Equity Ratio",
        "Share Price"
      ],
      datasets: [
        {
          // label: "Student A",
          backgroundColor: "rgba(57,139,247,0.3)",
          borderColor: "rgb(44,62,80)",
          fill: true,
          radius: 3,
          pointRadius: 3,
          pointBorderWidth: 3,
          pointBackgroundColor: "#39abf7",
          pointBorderColor: "#2c3e50",
          pointHoverRadius: 10,
          //values coming from the database

          data: []
        }
      ]
    }
  };

  //for slider handle cange
  onSliderChange = e => {
    console.log(e);
    //changing the state with the  value selected
    this.setState({ ebit1: e[0] });
    this.setState({ ebit2: e[1] });
  };
  onSliderChange2 = e => {
    this.setState({ market_cap_value1: e[0] });
    this.setState({ market_cap_value2: e[1] });
  };
  onSliderChange3 = e => {
    this.setState({ share_price1: e[0] });
    this.setState({ share_price2: e[1] });
  };

  onSliderChange4 = e => {
    this.setState({ total_assests1: e[0] });
    this.setState({ total_assests2: e[1] });
  };
  onSliderChange5 = e => {
    this.setState({ revenue1: e[0] });
    this.setState({ revenue2: e[1] });
  };
  onSliderChange6 = e => {
    this.setState({ net_profit1: e[0] });
    this.setState({ net_profit2: e[1] });
  };
  morefilter = e => {
    this.setState({ filter: false });
    console.log("more filter");
  };

  onSearchClick = e => {
    this.state.filter = true;
    console.log("after clicked", this.state.filter);

    console.log("Button Clciked", this.state.industry);
    this.props.getScreenerSearch(
      this.state.ebit1,
      this.state.ebit2,
      this.state.market_cap_value1,
      this.state.market_cap_value2,
      this.state.share_price1,
      this.state.share_price2,
      this.state.total_assests1,
      this.state.total_assests2,
      this.state.revenue1,
      this.state.revenue2,
      this.state.net_profit1,
      this.state.net_profit2,

      this.state.sector,
      this.state.industry
    );
  };

  componentDidMount() {
    //for loading graph.js
    console.log("filter", this.state.filter);
    // this.props.getSectorCompany(this.state.sector); //getting all the companies based on a sector selected
    const script = document.createElement("script");
    script.src = "C:Users\nikhiDesktopgraphgraph.js";
    script.async = true;
    script.onload = () => this.scriptLoaded();

    document.body.appendChild(script);

    // this.props.getSectorCompany(this.state.sector); //getting all the companies based on a sector selected
    this.props.getCompany("sector", this.state.sector);
    this.props.getSectors(); //getting all the sectors
    this.props.getIndustries(this.state.sector); //getting all the industries based on a sector selected
    this.props.getGainersLosers(this.state.sector); //getting all the gainers and losers based on a sector selected
  }

  componentWillReceiveProps(nextProps) {
    nextProps.stocks.length > 0
      ? this.displayCompanies(nextProps.stocks)
      : console.log(0, " Stocks");
    // if (nextProps.industries.length > 0) {
    //   this.setState({ industry: nextProps.industries[0] });
    // this.props.getCompany("industry", nextProps.industries[0]);
    // }
  }

  OnSelectSector = e => {
    this.setState({
      sector: e.target.value //setting state for the sector
    });
    this.props.getCompany("sector", e.target.value);
    this.props.getIndustries(e.target.value); //getting all the industries based on a sector selected
    this.props.getGainersLosers(e.target.value); //getting all the gainers and losers based on a sector selected
  };

  OnSelectIndustry = e => {
    this.setState({
      industry: e.target.value //setting state for the industry
    });
    this.props.getCompany("industry", e.target.value); //getting all the companies based on an industry selected
  };

  displayCompanies = Stocks => {
    console.log(Stocks);
    const { items } = this.state;

    if (Stocks.length === 0) return;
    let pageStocks = [];
    for (let i = 0; i < items; i++) {
      pageStocks.push(Stocks[i]);
    }
    this.setState({ pageStocks });
    console.log("PageStocks array", this.state.pageStocks.length);
  };

  loadMoreItems = () => {
    setTimeout(() => {
      this.setState({
        items: this.state.items + 10
      });
      this.displayCompanies(this.props.stocks);
    }, 1000);
  };
  // chartOptions = {
  //   scale: {
  //     ticks: {
  //       beginAtZero: true,
  //       min: 0,
  //       max: 100,
  //       stepSize: 20,
  //     },
  //     pointLabels: {
  //       fontSize: 18,
  //     },
  //   },
  //   legend: {
  //     position: "left",
  //   },

  render() {
    if (localStorage.getItem("token")) {
      decode = jwt_decode(localStorage.getItem("token"));
      // console.log(decode.isAdmin);
    }
    return (
      <div>
        <div id="graph"></div>
        {/* SEARCH BUTTON */}

        {/* ends */}
        {this.props.gainersLosers["0"] ? (
          <div id="stocks_main_container">
            {/* <p>STOCKS</p> */}
            <div id="stocks_filter">
              <select
                type="text"
                id="stocks_dropdown_sectors"
                className="stocks_dropdown"
                name="sector"
                value={this.state.sector}
                onChange={this.OnSelectSector}
              >
                {this.props.sectors.map((sectors, index) => (
                  <>
                    <option name="choice" id={"sector" + index}>
                      {sectors}
                    </option>
                    {/*mapping all the sectors to select from the dropdown*/}
                  </>
                ))}
              </select>
              <select
                type="text"
                className="stocks_dropdown"
                id="stocks_dropdown_industries"
                name="industries"
                value={this.state.industry} //changing the value of industry when selected
                onChange={this.OnSelectIndustry} //on change perform this function
              >
                <option name="choice">Select an Industry</option>
                {this.props.industries.map((industries, index) => (
                  <>
                    <option name="choice" id={"industry" + index}>
                      {industries}
                    </option>
                    {/* mapping all the industries in the dropdown based on the selected sector*/}
                  </>
                ))}
              </select>
              {localStorage.getItem("token") ? (
                <>
                  <label
                    id="advance-label"
                    for="toggle-1"
                    onClick={this.morefilter}
                  >
                    <i class="fa fa-filter" id="filter_icon"></i>
                    <span id="more_filters_title">More Filters</span>
                  </label>
                  <input type="checkbox" id="toggle-1" />{" "}
                </>
              ) : (
                <>
                  <label id="advance-label" for="toggle-1">
                    <i class="fa fa-filter" id="filter_icon"></i>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <span id="more_filters_title">More Filters</span>
                    </Link>
                  </label>
                  <input type="checkbox" id="toggle-1" />{" "}
                </>
              )}

              <div
                id="div_filter_main_container"
                className="w3-container w3-center w3-animate-opacity"
              >
                {/* <label href="id" className="fa fa-close" id="close_filter" /> */}
                <label href="id" id="close_filter" />
                <div id="filter_main_container">
                  <div id="stocks-advance-filter-grid-main-container">
                    <div id="advance-fliter-dividend">
                      <div id="advance-filter-title">
                        <p id="advance-filter-dividend-p">EBIT </p>
                      </div>
                      {/* FOR DIVIDEND  */}
                      <div id="stocks-landing-page-slider">
                        {/* CLLING THE COMPONENT WITH THE RS SLIDER PACKAGE  */}
                        <Range
                          // SETTING THE MINIMUM VALUE
                          min={-50}
                          // SETTING THE MAXIMUM VALUE
                          max={1000}
                          //SETTING THE DEFAULT VALUE WHICH IS DEFINED IN THE STATE OF THE COMPONENT
                          defaultValue={[this.state.ebit1, this.state.ebit1]}
                          //ON CHANGING CALLING THE SLIDERCHANGE
                          onChange={this.onSliderChange}
                        />
                      </div>

                      <div id="advance-filter-debt-to-equity-ratio-value">
                        <p id="advance-filter-value">-50</p>
                        <p id="advance-filter-value2">1000</p>
                      </div>
                    </div>
                    {/* FOR MARKET CAP  */}
                    <div id="advance-filter-market-cap">
                      <div id="advance-filter-title">
                        <p id="advance-filter-market-cap-p">Market Cap</p>
                      </div>
                      <div id="stocks-landing-page-slider">
                        {/* CLLING THE COMPONENT WITH THE RS SLIDER PACKAGE  */}
                        <Range
                          // SETTING THE MINIMUM VALUE
                          min={0}
                          // SETTING THE MAXIMUM VALUE
                          max={1000}
                          //SETTING THE DEFAULT VALUE WHICH IS DEFINED IN THE STATE OF THE COMPONENT
                          defaultValue={[
                            this.state.market_cap_value1,
                            this.state.market_cap_value2
                          ]}
                          //ON CHANGING CALLING THE SLIDERCHANGE
                          onChange={this.onSliderChange2}
                          name={"slider1"}
                        />
                      </div>
                      <div id="advance-filter-debt-to-equity-ratio-value">
                        <p id="advance-filter-value">0</p>
                        <p id="advance-filter-value2">100</p>
                      </div>
                    </div>
                    {/* FOR SHARE Price  */}
                    <div id="advance-filter-share-price">
                      <div id="advance-filter-title">
                        <p id="advance-filter-share-price-p">Share Price </p>
                      </div>
                      <div id="stocks-landing-page-slide">
                        {/* CLLING THE COMPONENT WITH THE RS SLIDER PACKAGE  */}
                        <Range
                          // SETTING THE MINIMUM VALUE
                          min={0}
                          // SETTING THE MAXIMUM VALUE
                          max={1000}
                          //SETTING THE DEFAULT VALUE WHICH IS DEFINED IN THE STATE OF THE COMPONENT
                          defaultValue={[
                            this.state.share_price1,
                            this.state.share_price2
                          ]}
                          //ON CHANGING CALLING THE SLIDERCHANGE
                          onChange={this.onSliderChange3}
                        />
                      </div>
                      <div id="advance-filter-debt-to-equity-ratio-value">
                        <p id="advance-filter-value">0</p>
                        <p id="advance-filter-value2">100</p>
                      </div>
                    </div>
                    {/* for PE RATIO */}
                    <div id="advance-filter-price-to-equity">
                      <div id="advance-filter-title">
                        <p id="advance-filter-price-to-equity-p">
                          Total Assests
                        </p>
                      </div>
                      <div id="stocks-landing-page-slider">
                        {/* CLLING THE COMPONENT WITH THE RS SLIDER PACKAGE  */}
                        <Range
                          // SETTING THE MINIMUM VALUE
                          min={0}
                          // SETTING THE MAXIMUM VALUE
                          max={1000}
                          //SETTING THE DEFAULT VALUE WHICH IS DEFINED IN THE STATE OF THE COMPONENT
                          defaultValue={[
                            this.state.total_assests1,
                            this.state.total_assests2
                          ]}
                          //ON CHANGING CALLING THE SLIDERCHANGE
                          onChange={this.onSliderChange4}
                        />
                      </div>
                      <div id="advance-filter-debt-to-equity-ratio-value">
                        <p id="advance-filter-value">0</p>
                        <p id="advance-filter-value2">100</p>
                      </div>
                    </div>
                    {/* net profit  */}
                    <div id="advance-filter-net-profit">
                      <div id="advance-filter-title">
                        <p id="advance-filter-debt-to-equity-p">Net Profit</p>
                      </div>
                      <div id="stocks-landing-page-slider">
                        {/* CLLING THE COMPONENT WITH THE RS SLIDER PACKAGE  */}
                        <Range
                          // SETTING THE MINIMUM VALUE
                          min={0}
                          // SETTING THE MAXIMUM VALUE
                          max={1000}
                          //SETTING THE DEFAULT VALUE WHICH IS DEFINED IN THE STATE OF THE COMPONENT
                          defaultValue={[
                            this.state.net_profit1,
                            this.state.net_profit2
                          ]}
                          //ON CHANGING CALLING THE SLIDERCHANGE
                          onChange={this.onSliderChange6}
                        />
                      </div>
                      <div id="advance-filter-debt-to-equity-ratio-value">
                        <p id="advance-filter-value">0</p>
                        <p id="advance-filter-value2">100</p>
                      </div>
                    </div>
                    {/* Revenues*/}
                    <div id="advance-filter-revenues">
                      <div id="advance-filter-title">
                        <p id="advance-filter-debt-to-equity-p">Revenues</p>
                      </div>
                      <div id="stocks-landing-page-slider">
                        {/* CLLING THE COMPONENT WITH THE RS SLIDER PACKAGE  */}
                        <Range
                          // SETTING THE MINIMUM VALUE
                          min={0}
                          // SETTING THE MAXIMUM VALUE
                          max={1000}
                          //SETTING THE DEFAULT VALUE WHICH IS DEFINED IN THE STATE OF THE COMPONENT
                          defaultValue={[
                            this.state.revenue1,
                            this.state.revenue2
                          ]}
                          //ON CHANGING CALLING THE SLIDERCHANGE
                          onChange={this.onSliderChange5}
                        />
                      </div>
                      <div id="advance-filter-debt-to-equity-ratio-value">
                        <p id="advance-filter-value">0</p>
                        <p id="advance-filter-value2">100</p>
                      </div>
                    </div>

                    {/* for net profit */}
                    {/*  */}
                  </div>
                  {/* main grid container  */}
                  <button
                    id="advance-filter-button"
                    type="submit"
                    onClick={this.onSearchClick}
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
            <div id="stocks_main_grid_container">
              {this.props.isLoading ? (
                <div id="stocks_loader">
                  <Loader type={Loader} color="#2c3e50" textAlign="center" />
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={this.state.pageStocks.length} //This is important field to render the next data
                  next={this.loadMoreItems}
                  hasMore={true}
                  height={600}
                  loader={
                    <div id="stocks_loader">
                      <Loader
                        type={Loader}
                        color="#2c3e50"
                        textAlign="center"
                      />
                    </div>
                  }
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen all the stocks</b>
                    </p>
                  }
                >
                  <div
                    id={
                      this.state.filter == true
                        ? "stocks_grid_container_filter_screener"
                        : "stocks_grid_container"
                    }
                  >
                    {this.state.filter == true ? (
                      <>
                        {this.props.screener_search.length != 0 ? (
                          <>
                            {this.props.screener_search.map(screener_search => (
                              // <h3>{screener_search.dividend}</h3>
                              <div>
                                <div
                                  id="stocks_grid_details_filter_screener"
                                  onClick={() => {
                                    this.props.history.push(
                                      "/companydetail/" + screener_search.id, //pushing to the company details page with ticker id of a stock when that particular stock card is clicked
                                      { screener_search }
                                    );
                                  }}
                                >
                                  <RadarGraph
                                    data={[
                                      screener_search.marketcap != NaN
                                        ? Math.floor(
                                            Number(screener_search.marketcap)
                                          )
                                        : 0,
                                      screener_search.net_profit != NaN
                                        ? Math.floor(
                                            Number(screener_search.net_profit)
                                          )
                                        : 0,
                                      screener_search.share_price != NaN
                                        ? Math.floor(
                                            Number(screener_search.share_price)
                                          )
                                        : 0,
                                      screener_search.revenue != NaN
                                        ? Math.floor(
                                            Number(screener_search.revenue)
                                          )
                                        : 0,
                                      screener_search.total_assets != NaN
                                        ? Math.floor(
                                            Number(screener_search.total_assets)
                                          )
                                        : 0,
                                      screener_search.ebit != NaN
                                        ? Math.floor(
                                            Number(screener_search.ebit)
                                          )
                                        : 0
                                    ]}
                                  />
                                  <div id="stocks_ticker">
                                    {screener_search["ticker_name"]}
                                  </div>
                                  {/* mapping the ticker name from the api*/}
                                  {/* <div id="stocks_name">{}</div> */}
                                  {/* <div id="stocks_flex_details_one"> */}
                                  {/* <div
                                  id="stocks_closed_price"
                                  className="stocks_details_title"
                                >
                                  Closed Price:
                                </div> */}
                                  {/* <div id="stocks_details">
                                  {screener_search["Share Price"]}USD
                                </div> */}
                                  {/* mapping the share price from the api */}
                                  {/* </div> */}
                                  {/* <div id="stocks_flex_details_two">
                                <div
                                  id="stocks_market_cap"
                                  className="stocks_details_title"
                                >
                                  Market Cap:
                                </div> */}
                                  {/* <div id="stocks_details">
                                  {screener_search["MarketCap"]}M
                                </div> */}
                                  {/* mapping the market cap from the api */}
                                  {/* </div> */}
                                </div>
                              </div>

                              // end of nikhils mapping
                            ))}
                          </>
                        ) : (
                          <>
                            <h1>No Companies Found</h1>
                            {console.log("No data")}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {this.state.pageStocks.map((stocks, index) =>
                          stocks ? (
                            <div id="stocks_main_grid_details">
                              {localStorage.getItem("token") ? (
                                <>
                                  {decode.isAdmin ? (
                                    <>
                                      <a
                                        href={"#editpopup" + stocks.ticker_name}
                                      >
                                        <img
                                          id="stocks_edit"
                                          alt="edit"
                                          src={editlogo}
                                        />
                                      </a>
                                      <div
                                        id={"editpopup" + stocks.ticker_name}
                                        class="admin_overlay"
                                      >
                                        <div class="admin_popup">
                                          <h2>Update {stocks.ticker_name}</h2>
                                          <UpdateCompany
                                            id={stocks.ticker_id}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                              <div
                                id="stocks_grid_details"
                                className={"stock_details" + index}
                                onClick={() => {
                                  this.props.history.push(
                                    "/companydetail/" + stocks.ticker_id, //pushing to the company details page with ticker id of a stock when that particular stock card is clicked
                                    { stocks }
                                  );
                                }}
                              >
                                <img
                                  id="stocks_img"
                                  alt="logo"
                                  src={
                                    stocks.ticker_logo == null
                                      ? companylogo
                                      : "data:image/jpeg;base64," +
                                        stocks.ticker_logo
                                  }
                                />
                                <div
                                  id="stocks_ticker"
                                  className={"stocks_ticker" + index}
                                >
                                  {stocks["ticker_name"]}
                                </div>
                                {/* mapping the ticker name from the api*/}
                                <div id="stocks_name">{}</div>
                                {/* <div id="stocks_flex_details_one">
                                  <div id={"stocks_closed_price" + index}>
                                    Closed Price:
                                  </div>
                                  <div id="stocks_details">
                                    {stocks["Share Price"]}USD
                                  </div> */}
                                {/* mapping the share price from the api */}
                                {/* </div> */}
                                {/* <div id="stocks_flex_details_two">
                                  <div
                                    id={"stocks_market_cap" + index}
                                    className="stocks_details_title"
                                  >
                                    Market Cap:
                                  </div>
                                  <div id="stocks_details">
                                    {stocks["MarketCap"]}M
                                  </div> */}
                                {/* mapping the market cap from the api */}
                                {/* </div> */}
                              </div>
                            </div>
                          ) : null
                        )}
                      </>
                    )}
                  </div>
                </InfiniteScroll>
              )}
            </div>
            <div id="stocks_table">
              <div id="stocks_div_buttons">
                <button
                  id="button_stocks_gainers"
                  className={
                    this.state.gainersClick === true //changing the color of gainers button when clicked on it
                      ? "stocks_gainers"
                      : "stocks_losers"
                  }
                  onClick={() => this.setState({ gainersClick: true })} //on clicking the gainers button, the state of gainersClick is set true
                >
                  Gainers
                </button>
                <button
                  id="button_stocks_losers"
                  className={
                    this.state.gainersClick === false //changing the color of losers button when clicked on it
                      ? "stocks_gainers"
                      : "stocks_losers"
                  }
                  onClick={() => this.setState({ gainersClick: false })} //on clicking the losers button, the state of gainersClick is set false
                >
                  Losers
                </button>
              </div>
              <Table
                tableHeaders={[
                  "Ticker",
                  "Chng (%)",
                  "Market Cap",
                  "Share Price"
                ]}
                tableData={
                  this.state.gainersClick === true //displaying the gainers data in the table if state of gainersClick is true that is when gainers button is clicked else losers data is displayed
                    ? this.props.gainersLosers["0"].gainers
                    : this.props.gainersLosers["0"].losers
                }
              />
            </div>
          </div>
        ) : (
          <div id="stocks_main_loader">
            <Loader type={Loader} color="#2c3e50" textAlign="center" />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stocks: state.stocksReducer.stocks,
  sectors: state.stocksReducer.sectors,
  industries: state.stocksReducer.industries,
  gainersLosers: state.stocksReducer.gainersLosers,
  isLoading: state.LoadingReducer.isLoading,
  screener_search: state.stocksReducer.screener_search
});

export default connect(mapStateToProps, {
  getCompany,
  getSectors,
  getIndustries,
  getGainersLosers,
  getScreenerSearch
})(StocksLanding);
