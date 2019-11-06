import React, { Component } from "react";
import { allNews, newsById, getIndices } from "../actions/Home";
import { connect } from "react-redux";
import "../styles/Home.css";
import welcome from "./welcome.svg";

export class Home extends Component {
  componentDidMount() {
    //this function calls the get News function which is defined in the actions which will retrive all the data from the news table.
    this.props.allNews();
    this.props.newsById(1);
    this.props.getIndices();
  }

  render() {
    console.log(this.props.singleNews);
    var change;
    return (
      <body>
        <div id="homecontainer">
          {/* <Navbar> */}
          <div id="homeleftsidecontainer">
            <h1>News</h1>
            <div>
              <div id="recent-news"></div>
              {/* recent news */}
              {this.props.news.map((news, index) => (
                <div className="div-newspage">
                  <div id="news-list">
                    <p
                      id={"recent-news-title" + index}
                      onClick={() => this.props.newsById(news.new_id)}
                    >
                      {news.headline}
                    </p>
                    <p id="newsdivider">
                      <hr />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div id="homemiddlecontainer">
            <div>
              <h3 id="headline">{this.props.singleNews.headline}</h3>
              <img
                id="image"
                src={
                  // "data:image/jpeg;base64," + this.props.singleNews.news_image
                  welcome
                }
              />
              <p id="headlineDescription">
                {this.props.singleNews.description}
              </p>
            </div>
          </div>
          <div id="homerightsidecontainer">
            <h1>Indices</h1>
            <div>
              <table id="homeIndicesTable">
                <th>Indices</th>
                <th>Last</th>
                <th>Chng %</th>
                {this.props.indices.map((indices, index) => (
                  <tr>
                    <td
                      id="indicesName"
                      onClick={() =>
                        this.props.history.push(
                          "/indexProfile/" + indices.name,
                          {
                            indices
                          }
                        )
                      }
                    >
                      {indices.name}
                    </td>
                    <td>{indices.last}</td>
                    <td
                      id={
                        String(indices.change).charAt(0) == "-"
                          ? "negativeIndex"
                          : "positiveIndex"
                      }
                    >
                      {String(indices.change).charAt(0) == "-"
                        ? indices.change
                        : "+" + indices.change}
                    </td>{" "}
                  </tr>
                ))}{" "}
              </table>
            </div>
          </div>
        </div>
      </body>
    );
  }
}

const mapStateToProps = state => ({
  news: state.homeReducer.news,
  singleNews: state.homeReducer.singleNews,
  indices: state.homeReducer.indices
});
export default connect(
  mapStateToProps,
  {
    allNews,
    newsById,
    getIndices
  }
)(Home);