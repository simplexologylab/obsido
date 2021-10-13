/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStock = /* GraphQL */ `
  subscription OnCreateStock {
    onCreateStock {
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
export const onUpdateStock = /* GraphQL */ `
  subscription OnUpdateStock {
    onUpdateStock {
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
export const onDeleteStock = /* GraphQL */ `
  subscription OnDeleteStock {
    onDeleteStock {
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
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding {
    onCreateHolding {
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
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding {
    onUpdateHolding {
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
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding {
    onDeleteHolding {
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
