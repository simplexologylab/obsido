/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addStock = /* GraphQL */ `
  mutation AddStock($ticker: String) {
    addStock(ticker: $ticker) {
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
export const createStock = /* GraphQL */ `
  mutation CreateStock(
    $input: CreateStockInput!
    $condition: ModelStockConditionInput
  ) {
    createStock(input: $input, condition: $condition) {
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
export const updateStock = /* GraphQL */ `
  mutation UpdateStock(
    $input: UpdateStockInput!
    $condition: ModelStockConditionInput
  ) {
    updateStock(input: $input, condition: $condition) {
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
export const deleteStock = /* GraphQL */ `
  mutation DeleteStock(
    $input: DeleteStockInput!
    $condition: ModelStockConditionInput
  ) {
    deleteStock(input: $input, condition: $condition) {
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
