import { useState, useEffect } from "react";
import Link from "next/link";

import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import {
  Amplify,
  API,
  Auth,
  withSSRContext,
  graphqlOperation,
} from "aws-amplify";

import awsExports from "../src/aws-exports";
import Layout from "../src/components/layout";
import PriceRange from "../src/components/price-range";

import {
  PlusIcon,
  XCircleIcon,
  ChevronDoubleRightIcon,
  MinusCircleIcon,
} from "@heroicons/react/outline";

import {
  addStock as AddStock,
  updateStockData as UpdateStockData,
  stockCleanup as StockCleanup,
} from "../src/graphql/mutations";

import { listStocks } from "../src/graphql/queries";

import calcHoldingsTotals from "../src/utilities/calcHoldingsTotals";
import { formatCurrency } from "../src/utilities/textFormatting";

Amplify.configure({ ...awsExports, ssr: true });

export async function getServerSideProps({ req }) {
  const SSR = withSSRContext({ req });
  const response = await SSR.API.graphql({ query: listStocks });

  return {
    props: {
      stocks: response.data.listStocks.items,
    },
  };
}

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [initial, setInitial] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [errors, setErrors] = useState([]);
  const [totals, setTotals] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function getStocks() {
      try {
        const stockData = await API.graphql(graphqlOperation(listStocks));
        setStocks(stockData.data.listStocks.items);
        setInitial(stockData.data.listStocks.items);
      } catch (err) {
        console.log("error: ", err);
        setErrors([...errors, "Issue with API call to get list of stocks"]);
      }
    }

    getStocks();
  }, [errors]);

  useEffect(() => {
    setTotals(calcHoldingsTotals(stocks));
  }, [stocks]);

  async function handleCreateStock(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
      const { data } = await API.graphql(
        graphqlOperation(AddStock, {
          ticker: form.get("ticker"),
        })
      );
      setStocks([...stocks, data.addStock]);
      setShowAdd(false);
    } catch ({ errors }) {
      console.error("Catch error:", errors[0].message);
      if (errors[0].message === "Error: We already have this") {
        setErrors([...errors, errors[0].message]);
      } else {
        // if we get here it isn't an error we planned for.
        throw new Error(errors[0].message);
      }
    }
  }

  async function handleUpdateStock(id) {
    const index = stocks.findIndex((s) => s.id === id);
    const updatedStocks = [...stocks];

    try {
      const { data } = await API.graphql(
        graphqlOperation(UpdateStockData, {
          id: id,
        })
      );

      updatedStocks[index] = data.updateStockData;
      setStocks(updatedStocks);
    } catch (err) {
      console.log("ERRORS UPDATING: ", err);
      if (err.errors) {
        throw new Error(err.errors[0].message);
      } else {
        throw new Error(err);
      }
    }
  }

  // async function handleCleanup() {
  //   try {
  //     const data = await API.graphql(graphqlOperation(StockCleanup));
  //     console.log('function returned: ', data)
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }

  function handleStockFilter(event) {
    const filtered = initial.filter((s) => {
      let compare = s.ticker.toUpperCase();
      if (s.name) {
        compare = compare + s.name.toUpperCase();
      }
      return compare.includes(event.target.value.toUpperCase());
    });

    setStocks(filtered);
  }

  return (
    <Layout headTitle="Obsido | Home">
      <div className="flex flex-col justify-center font-primary">
        {errors.length > 0 && (
          <div className="flex flex-row align-middle justify-between gap-4 p-2 bg-red-600 text-white">
            <div className="h-6 w-6 self-center">
              <ChevronDoubleRightIcon />
            </div>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
            <button
              className="h-8 w-8 self-center"
              onClick={() => setErrors([])}
            >
              <MinusCircleIcon />
            </button>
          </div>
        )}
        {/* <div className="bg-yellow-600">
          <button onClick={() => handleCleanup()}>Update Latest</button>
        </div> */}
        <div className="bg-gray-700 text-yellow-300 flex justify-center w-full">
          {totals.shares > 0 ? (
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? (
                <pre className="">{JSON.stringify(totals, null, 2)}</pre>
              ) : (
                <div className="p-2">
                  <p className="text-3xl">
                    {formatCurrency(totals.currentValue)}
                  </p>
                  <p className="text-2xl">{`${formatCurrency(
                    totals.gainLoss
                  )} (${totals.overallPercent}%)`}</p>
                </div>
              )}
            </button>
          ) : (
            <div>Calculating ...</div>
          )}
        </div>
        <div className="lg:w-2/3 lg:m-auto">
          {!showAdd && (
            <div className="flex flex-row justify-between">
              <form className="relative m-2 md:m-4 w-1/2 md:w-1/3">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
                <input
                  className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-md text-black placeholder-gray-400 border border-green-200 rounded-md py-2 pl-10"
                  type="text"
                  aria-label="Filter stocks"
                  placeholder="Filter stocks"
                  onChange={handleStockFilter}
                />
              </form>
              <button
                onClick={() => setShowAdd(true)}
                className="m-2 w-8 h-8 text-green-600 self-center"
              >
                <PlusIcon />
              </button>
            </div>
          )}
          {showAdd && (
            <div className="flex flex-col justify-center">
              <div className="flex flex-row justify-between p-2">
                <p className="text-center text-xl p-2">Add New Stock</p>
                <button
                  onClick={() => setShowAdd(false)}
                  className="w-10 h-10 text-gray-600"
                >
                  <XCircleIcon />
                </button>
              </div>

              <form
                className="flex flex-row gap-2 align-middle justify-center p-2"
                onSubmit={handleCreateStock}
              >
                <fieldset className="flex flex-row justify-center align-middle">
                  <input
                    className="border-2 rounded-sm p-1 text-xl"
                    placeholder="Enter Ticker Symbol"
                    defaultValue={``}
                    name="ticker"
                  />
                </fieldset>
                <button className="bg-green-700 text-white p-2 rounded-sm">
                  Add Stock
                </button>
              </form>
            </div>
          )}
          {stocks.length > 0 &&
            stocks.map((stock) => (
              <div key={stock.id} className="px-2">
                <Link href={`/stock/${encodeURIComponent(stock.id)}`} passHref>
                  <a>
                    <div className="p-1 text-lg lg:text-xl w-full">
                      <div className="flex flex-row justify-between items-center">
                        <p className="text-xl lg:text-2xl">
                          {stock.ticker} ({stock.quote.price})
                        </p>
                        {stock.calculations ? (
                          <div className="flex flex-col gap-2">
                            {stock.calculations.stockGainLossPercent >= 0 ? (
                              <p className="bg-green-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
                                stock.calculations.stockGainLossPercent * 100
                              ).toFixed(1)}%`}</p>
                            ) : (
                              <p className="bg-red-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
                                stock.calculations.stockGainLossPercent * 100
                              ).toFixed(1)}%`}</p>
                            )}
                            <PriceRange
                              low={stock.overview.last52Low}
                              price={stock.quote.price}
                              high={stock.overview.last52High}
                              id={stock.id}
                            />
                          </div>
                        ) : (
                          <div>No Holdings</div>
                        )}
                      </div>
                      <div className="flex flex-row flex-wrap text-xs justify-start gap-2 p-2">
                        {stock.overview.peRatio > 0 && (
                          <p className="bg-gray-200 p-1 rounded-sm">{`PE: ${stock.overview.peRatio}`}</p>
                        )}
                        {stock.overview.dividendYield > 0 && (
                          <p className="bg-gray-200 p-1 rounded-sm">{`Div: ${(
                            stock.overview.dividendYield * 100
                          ).toFixed(2)}%`}</p>
                        )}
                        {stock.overview.dma50 && (
                          <p className="bg-gray-200 p-1 rounded-sm">{`DMA50: ${(
                            ((stock.quote.price - stock.overview.dma50) /
                              stock.overview.dma50) *
                            100
                          ).toFixed(1)}%`}</p>
                        )}
                        {stock.overview.dma200 && (
                          <p className="bg-gray-200 p-1 rounded-sm">{`DMA200: ${(
                            ((stock.quote.price - stock.overview.dma200) /
                              stock.overview.dma200) *
                            100
                          ).toFixed(1)}%`}</p>
                        )}
                        {stock.calculations.stockCAGR && (
                          <p className="bg-gray-200 p-1 rounded-sm">
                            {`CAGR: ${(
                              stock.calculations.stockCAGR * 100
                            ).toFixed(1)}%`}
                          </p>
                        )}
                        {stock.calculations.stockMAGR && (
                          <p className="bg-gray-200 p-1 rounded-sm">
                            {`MAGR: ${(
                              stock.calculations.stockMAGR * 100
                            ).toFixed(1)}%`}
                          </p>
                        )}
                        {stock.calculations.stockWAGR && (
                          <p className="bg-gray-200 p-1 rounded-sm">
                            {`WAGR: ${(
                              stock.calculations.stockWAGR * 100
                            ).toFixed(1)}%`}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
                <div className="flex flex-row justify-between">
                  <div className="text-xs">{stock.updatedAt}</div>
                  <button onClick={() => handleUpdateStock(stock.id)}>
                    Update
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* <table className="table-auto border-collapse m-2">
          <thead>
            <tr>
              <th className="border">Stock</th>
              <th className="border">Current Status</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td className="border p-2">
                  <div>
                    <Link
                      href={`/stock/${encodeURIComponent(stock.id)}`}
                      passHref
                    >
                      <a>
                        <div className="p-1 bg-green-300 rounded-md text-lg lg:text-xl w-full">
                          <div className="flex flex-row justify-between">
                            <p className="text-lg lg:text-xl w-full">
                              {stock.ticker}
                            </p>
                            <p>{formatCurrency(stock.quote.price)}</p>
                          </div>
                          <div className="text-xs">{stock.updatedAt}</div>
                        </div>
                      </a>
                    </Link>
                    <button onClick={() => handleUpdateStock(stock.id)}>
                      Update
                    </button>
                  </div>
                </td>
                <td className="border p-2">
                  {stock.calculations ? (
                    <div>
                      <span className="flex flex-row gap-2 align-bottom">
                        <div className="text-xl">
                          {formatCurrency(stock.calculations.stockCurrentValue)}
                        </div>
                        <span className="inline-block align-bottom">
                          {formatCurrency(stock.calculations.stockGainLoss)}
                        </span>
                      </span>
                      <div>
                        {`${(
                          stock.calculations.stockGainLossPercent * 100
                        ).toFixed(1)}%`}
                      </div>
                      <div>{`${(
                        (stock.calculations.stockCurrentValue /
                          totals.currentValue) *
                        100
                      ).toFixed(2)}% of Portfolio`}</div>
                    </div>
                  ) : (
                    "No Holding"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </Layout>
  );
}
