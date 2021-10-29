// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ClassificationType = {
  "CORE": "Core",
  "SMALL": "Small",
  "BIG": "Big"
};

const StatusType = {
  "WATCH": "Watch",
  "TRIM": "Trim",
  "HOLD": "Hold",
  "GROW": "Grow"
};

const StockType = {
  "STOCK": "Stock",
  "FUND": "Fund"
};

const { Stock, Holding, Overview, Quote, Calculation } = initSchema(schema);

export {
  Stock,
  Holding,
  ClassificationType,
  StatusType,
  StockType,
  Overview,
  Quote,
  Calculation
};