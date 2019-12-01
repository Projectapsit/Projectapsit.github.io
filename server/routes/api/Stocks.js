const express = require("express");
const router = express.Router();
const stocksData = require("../../model/stocksModel");

//get all the companies by sectors or industries
router.post("/allcompanies/:filter/:type", async (req, res, next) => {
  console.log("companies by sector called");
  // try {
  //   let result = await stocksData
  //     .find(
  //       {
  //         [req.params.filter]: req.params.type
  //         // "ticker_dates.Share Price": { $exists: true }
  //       },
  //       {
  //         ticker_id: 1,
  //         ticker_name: 1,
  //         ticker_dates: 1,
  //         ticker_logo: 1
  //       }
  //     )
  //     .limit(1);
  //   console.log("printing result", result);
  //   var data = [];
  //   result.forEach(function(elem) {
  //     let name = {};
  //     var ticker_dates = elem._doc.ticker_dates;
  //     var ticker_id = elem._doc.ticker_id;
  //     var ticker_name = elem._doc.ticker_name;
  //     var ticker_logo = elem._doc.ticker_logo;
  //     var last_date = ticker_dates.slice(-1)[0];
  //     // var last_date_shareprice = last_date["Share Price"];
  //     name["ticker_id"] = ticker_id;
  //     name["ticker_name"] = ticker_name;
  //     name["ticker_logo"] = ticker_logo;
  //     // name["Share Price"] = last_date_shareprice;
  //     data.push(name);
  //   });
  //   if (result.length == 0) {
  //     res.status(400).json({
  //       status: 400,
  //       data: data,
  //       message: "No Company Found"
  //     });
  //   } else {
  //     // If successfully executes then sends this response to the search action
  //     res.status(200).json({
  //       status: 200,
  //       data: data,
  //       message: "Retrieved all Companies Successfully"
  //     });
  //   }
  try {
    let filter = req.params.filter;
    let type = req.params.type;
    console.log(filter);
    console.log(type);
    let temporaryCompany = [];
    let abc = await stocksData.aggregate(
      [
        {
          $match: {
            isIndex: false,
            "ticker_dates.1": { $exists: true },
            sector: "Basic Materials"
          }
        },
        {
          $project: {
            ticker_id: 1,
            ticker_name: 1,
            last: { $slice: ["$ticker_dates", -1] }
          }
        }
      ],

      (err, docs) => {
        if (err) {
          console.log(err);
        }
        if (!docs) {
          res.status(404).json({
            message: "Cannot find any stock"
          });
        } else {
          for (const each_ticker of docs) {
            let last_change_value;
            each_ticker.last[0].hasOwnProperty("Share Price")
              ? (last_change_value = each_ticker.last[0]["Share Price"])
              : (last_change_value = 0);
            let market_cap;
            each_ticker.last[0].hasOwnProperty("Market Capitalisation")
              ? (market_cap = each_ticker.last[0]["Market Capitalisation"])
              : (market_cap = 0);

            market_cap = market_cap.toFixed(2).toString();
            temporaryCompany.push({
              ticker_name: each_ticker.ticker_name,
              ticker_id: each_ticker.ticker_id,
              shareprice: last_change_value,
              market_cap: market_cap
            });
          }
        }
      }
    );
    console.log(temporaryCompany);
    res.status(200).json({
      status: 200,
      data: temporaryCompany,
      message:
        "Retrieved top gainers and top losers of " +
        req.params.filter +
        " sector"
    });
  } catch (err) {
    next(err);
  }
});

//getting all the company sectors
router.get("/companysectors", async (req, res) => {
  let result = await stocksData.distinct("sector", {
    sector: { $exists: true }
  });
  // If successfully executes then sends this response to the search action
  res.status(200).json({
    status: 200,
    data: result,
    message: "Retrieved All Sectors Successfully"
  });
});

//getting all the industries based on a sector
router.get("/industries/:sector", async (req, res, next) => {
  try {
    let sector = req.params.sector;
    let result = await stocksData
      .find({ sector: sector }, "industry")
      .distinct("industry");
    if (result.length == 0) {
      res.status(400).json({
        status: 400,
        data: result,
        message: "No Industry Found"
      });
    } else {
      res.status(200).json({
        status: 200,
        data: result,
        message: "Retrieved all Industries Successfully"
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/gainers-and-losers/:sector", async (req, res, next) => {
  try {
    let sector = req.params.sector;
    console.log(sector);
    let temporaryCompany = [];
    let Companies = [];
    let topGainers = [];
    let topLosers = [];
    let abc = await stocksData.aggregate(
      [
        {
          $match: {
            isIndex: false,
            "ticker_dates.1": { $exists: true },
            sector: `${sector}`
          }
        },
        {
          $project: {
            ticker_id: 1,
            ticker_name: 1,
            last: { $slice: ["$ticker_dates", -1] },
            secondlast: { $slice: ["$ticker_dates", -2] }
          }
        }
      ],

      (err, docs) => {
        if (err) {
          console.log(err);
        }
        if (!docs) {
          res.status(404).json({
            message: "Cannot find any stock"
          });
        } else {
          for (const each_ticker of docs) {
            let last_change_value;
            let second_last_change_value;
            // [Yatin] 25/11/2019 CREATED - Getting Last Dates Share Price Values
            // If value does not exist then 0 will be set asdefault value
            each_ticker.last[0].hasOwnProperty("Share Price")
              ? (last_change_value = each_ticker.last[0]["Share Price"])
              : (last_change_value = 0);
            // [Yatin] 25/11/2019 CREATED - Getting Second last Dates Share Price Values
            // If value does not exist then 0 will be set asdefault value
            each_ticker.secondlast[0].hasOwnProperty("Share Price")
              ? (second_last_change_value =
                  each_ticker.secondlast[0]["Share Price"])
              : (second_last_change_value = 0);
            // [Yatin] 25/11/2019 CREATED - Dividing the second last and last day
            // share price value and converting it to String
            let large_cap_change = (
              second_last_change_value - last_change_value
            )
              .toFixed(2)
              .toString();

            // [Yatin] 25/11/2019 CREATED - Calcluating the percentage change price and
            // then converting it to a string
            // [Yatin] 26/11/2019 MODIFIED - Added a condition to check last change to be greated then 0
            let large_cap_change_percent;
            last_change_value > 0
              ? (large_cap_change_percent = (
                  Math.round(
                    (large_cap_change / last_change_value) * 100 * 10000
                  ) / 10000
                )
                  .toFixed(2)
                  .toString())
              : (large_cap_change_percent = (0).toFixed(2).toString());

            // [Yatin] 25/11/2019 CREATED - Adding + symbol at the start for postive value as it is expected
            //  in the font end.
            large_cap_change.charAt(0) == "-"
              ? null
              : (large_cap_change = "+".concat(large_cap_change));

            // [Yatin] 25/11/2019 CREATED - Adding + symbol at the start for postive value as it is expected
            //  in the font end.
            large_cap_change_percent.charAt(0) == "-"
              ? null
              : (large_cap_change_percent = "+".concat(
                  large_cap_change_percent
                ));

            let market_cap;
            each_ticker.last[0].hasOwnProperty("Market Capitalisation")
              ? (market_cap = each_ticker.last[0]["Market Capitalisation"])
              : (market_cap = 0);

            market_cap = market_cap.toFixed(2).toString();

            // [Yatin] 25/11/2019 CREATED - Pushing all the values as per the reusable
            // format
            temporaryCompany.push({
              ticker_name: each_ticker.ticker_name,
              ticker_id: each_ticker.ticker_id,
              tickerValues: {
                change: large_cap_change,
                change_percent: large_cap_change_percent,
                market_cap: market_cap
              }
            });
          }
          // [Yatin] 14/11/2019 CREATED - Sorting the data based on the change_percent for
          // volatile
          temporaryCompany.sort(function(obj1, obj2) {
            // Ascending: first cap less than the previous
            return (
              obj2.tickerValues.change_percent -
              obj1.tickerValues.change_percent
            );
          });

          for (i = 0; i < 11; i++) {
            topGainers.push(temporaryCompany[i]);
          }
          for (
            i = temporaryCompany.length - 1;
            i >= temporaryCompany.length - 11;
            i--
          ) {
            topLosers.push(temporaryCompany[i]);
          }
          Companies.push({
            isIndex: false,
            gainers: topGainers,
            losers: topLosers
          });
        }
      }
    );
    res.status(200).json({
      status: 200,
      data: Companies,
      message:
        "Retrieved top gainers and top losers of " + `${sector}` + " sector"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
