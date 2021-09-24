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
      createdAt
      updatedAt
    }
  }
`;

const getStock = gql`
  query getStock($id: ID!) {
    getStock(id: $id) {
      ticker
    }
  }
`;

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
          }
        },
      });        

    const stockData = await axios({
      method: "get",
      url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${currentStock.data.data.getStock.ticker}&apikey=6GUGOE51J9KLH0O2`,
    });

    const quoteData = await axios({
      method: "get",
      url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${currentStock.data.data.getStock.ticker}&apikey=6GUGOE51J9KLH0O2`,
    });

    const formattedQuoteData = removeSpaceFromApiKeys(quoteData.data);

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
            id: event.arguments.id,
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
          },
        },
      },
    });
    return update.data.data.updateStock;
  } catch (err) {
    throw new Error(err);
  }
};
