/* Amplify Params - DO NOT EDIT
	API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT
	API_OBSIDO_GRAPHQLAPIIDOUTPUT
	API_OBSIDO_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const createStock = gql`
  mutation createStock($input: CreateStockInput!) {
    createStock(input: $input) {
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
        last52High
        last52Low
        dma50
        dma200
      }
      createdAt
      updatedAt
    }
  }
`;

const listStocks = gql`
  query listStocks {
    listStocks {
      items {
        id
        ticker
      }
    }
  }
`;

exports.handler = async (event) => {
  try {
    const stockData = await axios({
      method: "get",
      url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${event.arguments.ticker}&apikey=6GUGOE51J9KLH0O2`,
    });

    console.log("hello")
    const current = await axios({
      url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: print(listStocks),
      },
    });

    if (
      current.data.data.listStocks.items.findIndex(
        (i) => i.ticker === event.arguments.ticker
      ) === -1
    ) {
      // Then we need to add this stock
      const create = await axios({
        url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
        method: "post",
        headers: {
          "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
        },
        data: {
          query: print(createStock),
          variables: {
            input: {
              ticker: event.arguments.ticker.toUpperCase(),
              name: stockData.data.Name,
              overview: {
                exchange: stockData.data.Exchange,
                currency: stockData.data.Currency,
                description: stockData.data.Description,
                sector: stockData.data.Sector,
                marketCap: stockData.data.MarketCapitalization,
                dividendYield: stockData.data.DividendYield,
                last52High: stockData.data["52WeekHigh"],
                last52Low: stockData.data["52WeekLow"],
                dma50: stockData.data["50DayMovingAverage"],
                dma200: stockData.data["200DayMovingAverage"],
              },
            },
          },
        },
      });

      return create.data.data.createStock;
    } else {
      throw new Error("We already have this");
    }
  } catch (err) {
    throw new Error(err);
  }
};
