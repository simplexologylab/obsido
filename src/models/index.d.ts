import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum ClassificationType {
  CORE = "Core",
  SMALL = "Small",
  BIG = "Big"
}

export enum StatusType {
  WATCH = "Watch",
  TRIM = "Trim",
  HOLD = "Hold",
  GROW = "Grow"
}

export enum StockType {
  STOCK = "Stock",
  FUND = "Fund"
}

export declare class Overview {
  readonly exchange?: string;
  readonly currency?: string;
  readonly description?: string;
  readonly sector?: string;
  readonly marketCap?: string;
  readonly dividendYield?: string;
  readonly peRatio?: string;
  readonly last52High?: string;
  readonly last52Low?: string;
  readonly dma50?: string;
  readonly dma200?: string;
  constructor(init: ModelInit<Overview>);
}

export declare class Quote {
  readonly open?: string;
  readonly high?: string;
  readonly low?: string;
  readonly price?: string;
  readonly volume?: string;
  readonly prevClose?: string;
  readonly change?: string;
  readonly changePercent?: string;
  constructor(init: ModelInit<Quote>);
}

export declare class Calculation {
  readonly stockTotalShares?: number;
  readonly stockCostBasis?: number;
  readonly stockGainLoss?: number;
  readonly stockCurrentValue?: number;
  readonly stockAvgPerShare?: number;
  readonly stockGainLossPercent?: number;
  readonly stockCAGR?: number;
  readonly stockMAGR?: number;
  readonly stockWAGR?: number;
  constructor(init: ModelInit<Calculation>);
}

type StockMetaData = {
  readOnlyFields;
}

type HoldingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Stock {
  readonly id: string;
  readonly name?: string;
  readonly ticker: string;
  readonly classification?: ClassificationType | keyof typeof ClassificationType;
  readonly status?: StatusType | keyof typeof StatusType;
  readonly overview?: Overview;
  readonly quote?: Quote;
  readonly type?: StockType | keyof typeof StockType;
  readonly holdings?: (Holding | null)[];
  readonly calculations?: Calculation;
  readonly createdAt: string;
  readonly updatedAt: string;
  constructor(init: ModelInit<Stock>);
  static copyOf(source: Stock, mutator: (draft: MutableModel<Stock>) => MutableModel<Stock> | void): Stock;
}

export declare class Holding {
  readonly id: string;
  readonly shares: number;
  readonly costBasis: number;
  readonly purchaseDate: string;
  readonly brokerage: string;
  readonly soldDate?: string;
  readonly notes?: string;
  readonly stock?: Stock;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Holding, HoldingMetaData>);
  static copyOf(source: Holding, mutator: (draft: MutableModel<Holding, HoldingMetaData>) => MutableModel<Holding, HoldingMetaData> | void): Holding;
}