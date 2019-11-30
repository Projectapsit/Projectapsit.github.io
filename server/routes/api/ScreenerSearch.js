const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017";

const dbName = "stocks";
const stocksData = require("../../model/stocksModel");
screener_data = [];

router.post("/screener", async (req, res, next) => {
  console.log("body", req.body);

  const market_cap_value1 = req.body.market_cap_value1;

  const market_cap_value2 = req.body.market_cap_value2;
  const revenue1 = req.body.revenue1;
  const revenue2 = req.body.revenue2;
  const share_price1 = req.body.share_price1;
  const share_price2 = req.body.share_price2;
  const sector = req.body.sector;
  const industry = req.body.industry;
  const net_profit1 = req.body.net_profit1;
  const net_profit2 = req.body.net_profit2;
  const total_assests1 = req.body.total_assests1;
  const total_assests2 = req.body.total_assests2;
  const ebit1 = req.body.ebit1;
  console.log("ebit1", ebit1);
  const ebit2 = req.body.ebit2;
  console.log("ebit2", ebit2);
  try {
    let result = await stocksData.find({
      "ticker_dates.date": {
        $gte: new Date("2008-12-29")
      },
      sector: sector,
      industry: industry,

      "ticker_dates.Share Price": {
        $lte: share_price2,
        $gte: share_price1
      },
      "ticker_dates.Market Capitalisation": {
        $lte: market_cap_value2,
        $gte: market_cap_value1
      },
      "ticker_dates.EV / EBITDA": {
        $lte: ebit2,
        $gte: ebit1
      },
      "ticker_dates.Total Assets": {
        $lte: +total_assests2,
        $gte: +total_assests1
      },
      "ticker_dates.Revenues": {
        $lte: +revenue2,
        $gte: +revenue1
      },
      "ticker_dates.Net Profit": {
        $lte: +net_profit2,
        $gte: +net_profit1
      }
    });
    result.forEach(function(elem) {
      let compare = {};
      ticker_dates = elem._doc.ticker_dates;

      last_date = ticker_dates.slice(-1)[0];
      var i = -1;

      // getting ticker name
      let ticker_name = elem._doc.ticker_name;
      compare["ticker_name"] = ticker_name;
      if (last_date["Market Capitalisation"] == undefined) {
        Market_cap = "0";
      } else {
        Market_cap = last_date["Market Capitalisation"];
      }
      compare["marketcap"] = Market_cap.toString();

      while (last_date["Net Profit"] == undefined) {
        last_date = ticker_dates.slice(i)[0];
        i--;
      }
      if (last_date["Net Profit"] == undefined) {
        net_profit = "0";
      } else {
        net_profit = last_date["Net Profit"];
      }

      compare["net_profit"] = net_profit.toString();

      // for market cap
      if (last_date["Share Price"] == undefined) {
        Share_Price = "0";
      } else {
        Share_Price = last_date["Share Price"];
      }
      compare["share_price"] = Share_Price.toString();

      while (last_date["Revenues"] == undefined) {
        last_date = ticker_dates.slice(i)[0];
        i--;
      }
      revenue = last_date["Revenues"];
      compare["revenue"] = revenue.toString();

      while (last_date["Total Assets"] == undefined) {
        last_date = ticker_dates.slice(i)[0];
        i--;
      }
      total_assets = last_date["Total Assets"];
      compare["total_assets"] = total_assets.toString();

      while (last_date["EV / EBITDA"] == undefined) {
        last_date = ticker_dates.slice(i)[0];
        i--;
      }
      ebit = last_date["EV / EBITDA"];

      compare["ebit"] = ebit.toString();
      // console.log("compare", compare);
      compare["id"] = elem._doc.ticker_id;

      screener_data.push(compare);
      // console.log("scsd", screener_data);
    });

    if (screener_data.length == 0) {
      res.status(400).json({
        status: 400,
        data: screener_data,
        message: "No result"
      });
    } else {
      res.status(200).json({
        status: 200,
        data: screener_data,
        message: "Retrieved screener result successfully"
      });
    }
  } catch {
    console.log("from catch of screener");
  }
});
module.exports = router;
