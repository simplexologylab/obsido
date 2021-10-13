/* Amplify Params - DO NOT EDIT
	API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT
	API_OBSIDO_GRAPHQLAPIIDOUTPUT
	API_OBSIDO_GRAPHQLAPIKEYOUTPUT
	ENV
	FUNCTION_UPDATESTOCKDATA_NAME
	REGION
Amplify Params - DO NOT EDIT */

const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const updateStockData = gql`
  mutation updateStockData($id: String!) {
    updateStockData(id: $id) {
      id
      ticker
      name
      updatedAt
    }
  }
`;

const sortedStocks = gql`
  query stocksByUpdatedAt(
    $type: StockType!
    $sortDirection: ModelSortDirection!
  ) {
    stocksByUpdatedAt(type: $type, sortDirection: $sortDirection) {
      items {
        id
        ticker
        updatedAt
      }
    }
  }
`;

exports.handler = async (event) => {
  try {
    // get the stock we want to updated
    const { data } = await axios({
      url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: print(sortedStocks),
        variables: {
          type: "Stock",
          sortDirection: "ASC",
        },
      },
    });

    const update = await axios({
      url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: print(updateStockData),
        variables: {
          id: data.data.stocksByUpdatedAt.items[0].id,
        },
      },
    });

    return update.data
  } catch (err) {
    console.log(">>> ERROR >>> ", err);
    throw new Error(err);
  }
};
