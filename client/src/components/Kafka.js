/*piyush*/

import React, { Component } from "react";
import "../styles/Kafka.css";
import axios from "axios";
var stompClient = null;
const Stomp = require("stompjs");

var SockJS = require("sockjs-client");

export default class Kafka extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    axios.get("https://kafkaproducerbhavana.herokuapp.com");
    //here we did the connection with consumer with the help of stockjs
    SockJS = new SockJS("https://kafkaconsumerbhavana.herokuapp.com//ws");

    stompClient = Stomp.over(SockJS);

    stompClient.connect({}, this.onConnected, this.onError);
  }

  onConnected = () => {
    this.setState({
      data: []
    });

    console.log("connected");

    // Subscribing to the public topic
    stompClient.subscribe("/topic/public", this.onMessageReceived);
  };

  onError = error => {
    console.log("error");
    // if there is any error while connecting then with the help  of this function we will get the know th error
    this.setState({
      error:
        "Could not connect you to the Chat Room Server. Please refresh this page and try again!"
    });
  };

  onMessageReceived = msg => {
    var body = JSON.parse(msg.body);
    this.setState({
      data: body
    });
  };

  render() {
    return (
      <div id="kafkamainContainer">
        {this.state.data.map(i => (
          <div id="kafka">
            <div
              id="kafka_indices"
              className="w3-container w3-center w3-animate-top"
            >
              {i.tickerName}
            </div>

            <div
              id="kafka_index_price"
              className="w3-container w3-center w3-animate-top"
            >
              {" "}
              {/*here we are checking for first character in closing on that below condition will work */}
              {Number(i.closing).toFixed(2)}{" "}
              <span
                id={
                  String(i.changePercentage).charAt(0) == "-"
                    ? "change-ve"
                    : "changepositive"
                }
              >
                ({Number(i.changePercentage).toFixed(2)}%)
              </span>
              {/*here we are checking for first character in change percentge on that below condition will work */}
              {String(i.changePercentage).charAt(0) == "-" ? (
                <span
                  className="fa fa-caret-down"
                  style={{ color: "#ff4d4d", margin: "5px" }}
                ></span>
              ) : (
                <span
                  className="fa fa-caret-up"
                  style={{ color: "#27ae60", margin: "5px" }}
                ></span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
