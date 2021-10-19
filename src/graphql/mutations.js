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
      type
      holdings {
        items {
          id
          shares
          costBasis
          purchaseDate
          brokerage
          soldDate
          notes
          createdAt
          updatedAt
        }
        nextToken
      }
      calculations {
        stockTotalShares
        stockCostBasis
        stockGainLoss
        stockCurrentValue
        stockAvgPerShare
        stockGainLossPercent
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateStockData = /* GraphQL */ `
  mutation UpdateStockData($id: String) {
    updateStockData(id: $id) {
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
      type
      holdings {
        items {
          id
          shares
          costBasis
          purchaseDate
          brokerage
          soldDate
          notes
          createdAt
          updatedAt
        }
        nextToken
      }
      calculations {
        stockTotalShares
        stockCostBasis
        stockGainLoss
        stockCurrentValue
        stockAvgPerShare
        stockGainLossPercent
      }
      createdAt
      updatedAt
    }
  }
`;
export const stockCleanup = /* GraphQL */ `
  mutation StockCleanup {
    stockCleanup
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
      type
      holdings {
        items {
          id
          shares
          costBasis
          purchaseDate
          brokerage
          soldDate
          notes
          createdAt
          updatedAt
        }
        nextToken
      }
      calculations {
        stockTotalShares
        stockCostBasis
        stockGainLoss
        stockCurrentValue
        stockAvgPerShare
        stockGainLossPercent
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
      type
      holdings {
        items {
          id
          shares
          costBasis
          purchaseDate
          brokerage
          soldDate
          notes
          createdAt
          updatedAt
        }
        nextToken
      }
      calculations {
        stockTotalShares
        stockCostBasis
        stockGainLoss
        stockCurrentValue
        stockAvgPerShare
        stockGainLossPercent
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
      type
      holdings {
        items {
          id
          shares
          costBasis
          purchaseDate
          brokerage
          soldDate
          notes
          createdAt
          updatedAt
        }
        nextToken
      }
      calculations {
        stockTotalShares
        stockCostBasis
        stockGainLoss
        stockCurrentValue
        stockAvgPerShare
        stockGainLossPercent
      }
      createdAt
      updatedAt
    }
  }
`;
export const createHolding = /* GraphQL */ `
  mutation CreateHolding(
    $input: CreateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    createHolding(input: $input, condition: $condition) {
      id
      shares
      costBasis
      purchaseDate
      brokerage
      soldDate
      notes
      stock {
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
        type
        holdings {
          nextToken
        }
        calculations {
          stockTotalShares
          stockCostBasis
          stockGainLoss
          stockCurrentValue
          stockAvgPerShare
          stockGainLossPercent
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateHolding = /* GraphQL */ `
  mutation UpdateHolding(
    $input: UpdateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    updateHolding(input: $input, condition: $condition) {
      id
      shares
      costBasis
      purchaseDate
      brokerage
      soldDate
      notes
      stock {
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
        type
        holdings {
          nextToken
        }
        calculations {
          stockTotalShares
          stockCostBasis
          stockGainLoss
          stockCurrentValue
          stockAvgPerShare
          stockGainLossPercent
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteHolding = /* GraphQL */ `
  mutation DeleteHolding(
    $input: DeleteHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    deleteHolding(input: $input, condition: $condition) {
      id
      shares
      costBasis
      purchaseDate
      brokerage
      soldDate
      notes
      stock {
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
        type
        holdings {
          nextToken
        }
        calculations {
          stockTotalShares
          stockCostBasis
          stockGainLoss
          stockCurrentValue
          stockAvgPerShare
          stockGainLossPercent
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
