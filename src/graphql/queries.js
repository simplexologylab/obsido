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
      nextToken
    }
  }
`;
export const getHolding = /* GraphQL */ `
  query GetHolding($id: ID!) {
    getHolding(id: $id) {
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
export const listHoldings = /* GraphQL */ `
  query ListHoldings(
    $filter: ModelHoldingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          type
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const stocksByUpdatedAt = /* GraphQL */ `
  query StocksByUpdatedAt(
    $type: StockType
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    stocksByUpdatedAt(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
    }
  }
`;
