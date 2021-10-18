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

const listHoldings = gql`
  query listHoldings {
    listHoldings {
      items {
        id
        stock {
          id
          name
        }
      }
    }
  }
`;

const deleteHolding = gql`
  mutation deleteHolding($input: DeleteHoldingInput!) {
    deleteHolding(input: $input) {
      id
    }
  }
`;

exports.handler = async (event) => {
  try {
    let count = 0;
    const { data } = await axios({
      url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
      },
      data: {
        query: print(listHoldings),
      },
    });

    data.data.listHoldings.items.forEach(async (holding) => {
      if (!holding.stock) {
        const { data } = await axios({
          url: process.env.API_OBSIDO_GRAPHQLAPIENDPOINTOUTPUT,
          method: "post",
          headers: {
            "x-api-key": process.env.API_OBSIDO_GRAPHQLAPIKEYOUTPUT,
          },
          data: {
            query: print(deleteHolding),
            variables: {
              input: {
                id: holding.id,
              },
            },
          },
        });
      }
    });

    return "Holdings cleaned"

  } catch (error) {
    console.log("We hit an error cleaning holdings");
  }
};
