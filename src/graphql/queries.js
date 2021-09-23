/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const hello = /* GraphQL */ `
  query Hello {
    hello
  }
`;
export const getDetail = /* GraphQL */ `
  query GetDetail($ticker: String) {
    getDetail(ticker: $ticker)
  }
`;
export const getStock = /* GraphQL */ `
  query GetStock($id: ID!) {
    getStock(id: $id) {
      id
      name
      ticker
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
export const listStocks = /* GraphQL */ `
  query ListStocks(
    $filter: ModelStockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        ticker
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
      nextToken
    }
  }
`;
