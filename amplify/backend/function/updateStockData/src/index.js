/* Amplify Params - DO NOT EDIT
	API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT
	API_OBSIDO_GRAPHQLAPIIDOUTPUT
	API_OBSIDO_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/* This function runs on scheduled basis
  CloudWatch runs this on schedule: cron(10,20,30,40,50 13-23 ? * MON-SAT *)
  10/20/30/40/50 minutes past the hour MON-SAT between 8AM and 10 PM

  It runs without an ID so that it updates the oldest thing.

  Runs through Saturday to pickup anything lingering.
*/

const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const updateStock = gql`
  mutation updateStock($input: UpdateStockInput!) {
    updateStock(input: $input) {
      id
      ticker
      name
      overview {
        exchange
        currency
        description
        sector
        marketCap
        dividendYield
        peRatio
        last52High
        last52Low
        dma50
        dma200
      }
      quote {
        open
        high
        low
        price
        volume
        prevClose
        change
        changePercent
      }
      calculations {
        stockTotalShares
        stockCostBasis
        stockGainLoss
        stockCurrentValue
        stockAvgPerShare
        stockGainLossPercent
        stockCAGR
        stockMAGR
        stockWAGR
      }
      createdAt
      updatedAt
    }
  }
`;

const getStock = gql`
  query getStock($id: ID!) {
    getStock(id: $id) {
      ticker
      quote {
        price
      }
      holdings {
        items {
          costBasis
          shares
          purchaseDate
        }
      }
    }
  }
`;

const listStocks = gql`
  query listStocks {
    listStocks {
      items {
        id
        ticker
        updatedAt
        holdings {
          items {
            id
            purchaseDate
            shares
            costBasis
          }
        }
      }
    }
  }
`;

// const sortedStocks = gql`
//   query stocksByUpdatedAt(
//     $type: StockType!
//     $sortDirection: ModelSortDirection!
//   ) {
//     stocksByUpdatedAt(type: $type, sortDirection: $sortDirection) {
//       items {
//         id
//         ticker
//         holdings {
//           items {
//             id
//             purchaseDate
//             shares
//             costBasis
//           }
//         }
//         updatedAt
//       }
//     }
//   }
// `;

function calcStockTotals(holdings, price) {
  // const currency = new Intl.NumberFormat("en-US", {
  //   style: "currency",
  //   currency: "USD",
  // });

  let total = {
    shares: 0,
    costBasis: 0,
    gainLoss: 0,
    gainLossPercent: 0,
    years: 0,
    months: 0,
    weeks: 0,
  };

  let currentDate = new Date();

  holdings.forEach(({ shares, costBasis, purchaseDate }) => {
    const compareDate = new Date(purchaseDate);
    const differenceYears = Math.abs(currentDate - compareDate) / 31556952000;
    const differenceMonths = Math.abs(currentDate - compareDate) / 2629746000;
    const differenceWeeks = Math.abs(currentDate - compareDate) / 604800000;

    total.costBasis = total.costBasis + shares * costBasis;
    total.shares = total.shares + shares;
    total.gainLoss = total.gainLoss + (price - costBasis) * shares;

    if (differenceYears > total.years) {
      total.years = differenceYears;
    }

    if (differenceMonths > total.months) {
      total.months = differenceMonths;
    }
    if (differenceWeeks > total.weeks) {
      total.weeks = differenceWeeks;
    }
  });

  // total.basisDifference = (
  //   ((total.shares * price - total.costBasis) / total.costBasis) *
  //   100
  // ).toFixed(3);
  total.gainLossPercent = (total.gainLoss / total.costBasis).toFixed(3);
  total.average = total.costBasis / total.shares;
  total.costBasis = total.costBasis;
  total.gainLoss = total.gainLoss;
  total.currentValue = total.shares * price;

  if (total.years > 1) {
    total.CAGR =
      (total.currentValue / total.costBasis) ** (1 / total.years) - 1;
  } else {
    total.CAGR = (total.currentValue / total.costBasis) ** 1 - 1;
  }

  if (total.months > 1) {
    total.MAGR =
      (total.currentValue / total.costBasis) ** (1 / total.months) - 1;
  } else {
    total.MAGR = (total.currentValue / total.costBasis) ** 1 - 1;
  }

  if (total.weeks > 1) {
    total.WAGR =
      (total.currentValue / total.costBasis) ** (1 / total.weeks) - 1;
  } else {
    total.WAGR = (total.currentValue / total.costBasis) ** 1 - 1;
  }

  return total;
}

function removeSpaceFromApiKeys(apiKeyValue) {
  return Object.entries(apiKeyValue)
    .map(([key, value]) => [key.replace(/\s+/g, ""), value])
    .reduce((result, [normalizedKey, value]) => {
      result[normalizedKey] =
        value && typeof value === "object"
          ? removeSpaceFromApiKeys(value)
          : value;
      return result;
    }, {});
}

// const { Parameters } = await (new aws.SSM())
//   .getParameters({
//     Names: ["alphaApiKey"].map(secretName => process.env[secretName]),
//     WithDecryption: true,
//   })
//   .promise();

exports.handler = async (event) => {
  try {
    let ticker = "";
    let id = "";
    if (event.arguments) {
      id = event.arguments.id;
    }
    let holdings = [];

    if (id) {
      const currentStock = await axios({
        url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
        method: "post",
        headers: {
          "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
        },
        data: {
          query: print(getStock),
          variables: {
            id: event.arguments.id,
          },
        },
      });

      ticker = currentStock.data.data.getStock.ticker;
      holdings = currentStock.data.data.getStock.holdings;
    } else {
      const { data } = await axios({
        url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
        method: "post",
        headers: {
          "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
        },
        data: {
          query: print(listStocks),
        },
      });

      const oldest = data.data.listStocks.items.reduce((a, b) => {
        return Date.parse(a.updatedAt) < Date.parse(b.updatedAt) ? a : b;
      });

      id = oldest.id;
      ticker = oldest.ticker;
      holdings = oldest.holdings;
    }

    const stockData = await axios({
      method: "get",
      url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=6GUGOE51J9KLH0O2`,
    });

    const quoteData = await axios({
      method: "get",
      url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=6GUGOE51J9KLH0O2`,
    });

    const formattedQuoteData = removeSpaceFromApiKeys(quoteData.data);

    const calculatedStockData = calcStockTotals(
      holdings.items,
      formattedQuoteData.GlobalQuote["05.price"]
    );

    const update = await axios({
      url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: print(updateStock),
        variables: {
          input: {
            id: id,
            overview: {
              exchange: stockData.data.Exchange,
              currency: stockData.data.Currency,
              description: stockData.data.Description,
              sector: stockData.data.Sector,
              marketCap: stockData.data.MarketCapitalization,
              dividendYield: stockData.data.DividendYield,
              peRatio: stockData.data.PERatio,
              last52High: stockData.data["52WeekHigh"],
              last52Low: stockData.data["52WeekLow"],
              dma50: stockData.data["50DayMovingAverage"],
              dma200: stockData.data["200DayMovingAverage"],
            },
            quote: {
              open: formattedQuoteData.GlobalQuote["02.open"],
              high: formattedQuoteData.GlobalQuote["03.high"],
              low: formattedQuoteData.GlobalQuote["04.low"],
              price: formattedQuoteData.GlobalQuote["05.price"],
              volume: formattedQuoteData.GlobalQuote["06.volume"],
              prevClose: formattedQuoteData.GlobalQuote["08.previousclose"],
              change: formattedQuoteData.GlobalQuote["09.change"],
              changePercent: formattedQuoteData.GlobalQuote["10.changepercent"],
            },
            calculations: {
              stockTotalShares: calculatedStockData.shares,
              stockCostBasis: calculatedStockData.costBasis,
              stockGainLoss: calculatedStockData.gainLoss,
              stockCurrentValue: calculatedStockData.currentValue,
              stockAvgPerShare: calculatedStockData.average,
              stockGainLossPercent: calculatedStockData.gainLossPercent,
              stockCAGR: calculatedStockData.CAGR,
              stockMAGR: calculatedStockData.MAGR,
              stockWAGR: calculatedStockData.WAGR,
            },
          },
        },
      },
    });
    return update.data.data.updateStock;
  } catch (err) {
    console.log(">>> Error in updateStockData", err);
    throw new Error(err);
  }
};
