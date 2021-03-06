import { useState, useEffect, useMemo } from "react";
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
import DisplayData from "../src/components/display-data";

import {
  PlusIcon,
  XCircleIcon,
  ChevronDoubleRightIcon,
  MinusCircleIcon,
  AdjustmentsIcon,
  SearchIcon,
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
  const [addStock, setAddStock] = useState("");

  const [showAdjust, setShowAdjust] = useState(false);

  const [errors, setErrors] = useState([]);
  const [totals, setTotals] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  const [display, setDisplay] = useState("stockGainLossPercent");
  const [displaySort, setDisplaySort] = useState("ASC");

  useEffect(() => {
    async function getStocks() {
      try {
        const stockData = await API.graphql(graphqlOperation(listStocks));
        console.log("Stock data: ", stockData);
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

  const sortedStocks = useMemo(() => {
    switch (displaySort) {
      case "ASC":
        return [...stocks].sort((a, b) => {
          if (a.calculations && b.calculations) {
            return a.calculations[display] - b.calculations[display];
          } else {
            return -2;
          }
        });
      case "DESC":
        return [...stocks].sort((a, b) => {
          if (a.calculations && b.calculations) {
            return b.calculations[display] - a.calculations[display];
          } else {
            return -2;
          }
        });
      case "ALPHA":
        return [...stocks].sort((a, b) => {
          if (a.ticker < b.ticker) {
            return -1;
          } else {
            return 1;
          }
        });
      default:
        console.log("Not valid sort");
        return [...stocks];
    }
  }, [stocks, displaySort, display]);

  async function handleCreateStock() {
    console.log("Tryign to create stock: ", addStock);
    try {
      const { data } = await API.graphql(
        graphqlOperation(AddStock, {
          ticker: addStock,
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

  function handleDisplayChange(change) {
    setDisplay(change);
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
          <div className="flex flex-row justify-between">
            <button
              onClick={() => setShowAdd(true)}
              className="bg-green-500 text-white uppercase text-3xl font-bold px-4 m-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              +
            </button>
            <form className="relative m-2 md:m-4 w-1/2 md:w-1/3 hover:w-2/3">
              <SearchIcon className="absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="focus:border-light-blue-500 focus:ring-1 focus:ring-green-400 focus:outline-none w-full shadow text-md text-black placeholder-gray-400 rounded-md py-2 pl-10"
                type="text"
                aria-label="Filter stocks"
                placeholder="Filter stocks"
                onChange={handleStockFilter}
              />
            </form>
            <button
              onClick={() => setShowAdjust(true)}
              // className="m-2 w-8 h-8 text-green-600 self-center"
              className="text-gray-500 px-2 m-3 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <AdjustmentsIcon className="w-8 h-8" />
            </button>
          </div>

          {showAdd && (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-2 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex flex-row justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-2xl font-semibold">Add Stock</h3>
                      <button
                        className="p-1 ml-auto border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowAdd(false)}
                      >
                        x
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                      <div className="flex flex-col justify-center gap-6">
                        <input
                          className="border-2 rounded-sm p-1 text-xl"
                          placeholder="Enter Ticker Symbol"
                          defaultValue={``}
                          name="ticker"
                          value={addStock}
                          onChange={(e) =>
                            setAddStock(e.target.value.toUpperCase())
                          }
                        />
                        <button
                          className="bg-green-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => handleCreateStock()}
                        >
                          Add Stock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </>
          )}
          {showAdjust && (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-2 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex flex-row justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-2xl font-semibold">
                        Adjust Settings
                      </h3>
                      <button
                        className="p-1 ml-auto border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowAdjust(false)}
                      >
                        x
                      </button>
                    </div>
                    {/*change display*/}
                    <div className="relative p-6 flex-auto">
                      <p className="text-xl text-center">Display Value</p>
                      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:gap-10 justify-center">
                        <button
                          className="bg-green-300 hover:bg-green-500 hover:font-bold hover:text-white px-6 py-3 rounded shadow hover:shadow-lg outline-none"
                          onClick={() =>
                            handleDisplayChange("stockGainLossPercent")
                          }
                        >
                          Gain/Loss Percent
                        </button>
                        <button
                          className="bg-green-300 hover:bg-green-500 hover:font-bold hover:text-white px-6 py-3 rounded shadow hover:shadow-lg outline-none"
                          onClick={() => handleDisplayChange("stockCAGR")}
                        >
                          CAGR
                        </button>
                        <button
                          className="bg-green-300 hover:bg-green-500 hover:font-bold hover:text-white px-6 py-3 rounded shadow hover:shadow-lg outline-none"
                          onClick={() => handleDisplayChange("stockMAGR")}
                        >
                          MAGR
                        </button>
                        <button
                          className="bg-green-300 hover:bg-green-500 hover:font-bold hover:text-white px-6 py-3 rounded shadow hover:shadow-lg outline-none"
                          onClick={() => handleDisplayChange("stockWAGR")}
                        >
                          WAGR
                        </button>
                      </div>
                    </div>
                    {/*change order*/}
                    <div className="p-4">
                      <p className="text-xl text-center">Sort Order</p>
                      <div className="flex flex-row justify-center gap-10 p-5">
                        <button
                          className="hover:border-green-300 border px-5 py-2 rounded shadow hover:shadow-lg"
                          onClick={() => setDisplaySort("ASC")}
                        >
                          ASC
                        </button>
                        <button
                          className="hover:border-green-400 border px-5 py-2 rounded shadow hover:shadow-lg"
                          onClick={() => setDisplaySort("DESC")}
                        >
                          DESC
                        </button>
                        <button
                          className="hover:border-green-500 border px-5 py-2 rounded shadow hover:shadow-lg"
                          onClick={() => setDisplaySort("ALPHA")}
                        >
                          ALPHA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </>
          )}
          {stocks.length > 0 &&
            sortedStocks.map((stock) => (
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
                            {/* {stock.calculations.stockGainLossPercent >= 0 ? (
                              <p className="bg-green-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
                                stock.calculations.stockGainLossPercent * 100
                              ).toFixed(1)}%`}</p>
                            ) : (
                              <p className="bg-red-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
                                stock.calculations.stockGainLossPercent * 100
                              ).toFixed(1)}%`}</p>
                            )} */}
                            <DisplayData
                              calculations={stock.calculations}
                              setting={display}
                            />
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
                        {stock.calculations && (
                          <p className="bg-gray-200 p-1 rounded-sm">
                            {`CAGR: ${(
                              stock.calculations.stockCAGR * 100
                            ).toFixed(1)}%`}
                          </p>
                        )}
                        {stock.calculations && (
                          <p className="bg-gray-200 p-1 rounded-sm">
                            {`MAGR: ${(
                              stock.calculations.stockMAGR * 100
                            ).toFixed(1)}%`}
                          </p>
                        )}
                        {stock.calculations && (
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
