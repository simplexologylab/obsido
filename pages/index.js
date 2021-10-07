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

import {
  PlusCircleIcon,
  XCircleIcon,
  ChevronDoubleRightIcon,
  MinusCircleIcon,
} from "@heroicons/react/outline";

import {
  addStock as AddStock,
  deleteStock as DeleteStock,
  updateStockData as UpdateStockData,
} from "../src/graphql/mutations";

import {
  listStocks,
  listHoldings,
  deleteHolding as DeleteHolding,
} from "../src/graphql/queries";

import calcHoldingsTotals from "../src/utilities/calcHoldingsTotals";

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
  const [showAdd, setShowAdd] = useState(false);
  const [errors, setErrors] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [totals, setTotals] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function getStocks() {
      try {
        const stockData = await API.graphql(graphqlOperation(listStocks));
        const holdingData = await API.graphql(graphqlOperation(listHoldings));

        setTotals(
          calcHoldingsTotals(
            holdingData.data.listHoldings.items,
            stockData.data.listStocks.items
          )
        );

        setStocks(stockData.data.listStocks.items);
        setHoldings(holdingData.data.listHoldings.items);
      } catch (err) {
        setErrors([...errors, "Issue with API call to get list of stocks"]);
      }
    }

    getStocks();
  }, [errors]);

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

  async function handleDeleteStock(id) {
    try {
      const deleteItem = await API.graphql(
        graphqlOperation(DeleteStock, {
          input: {
            id: id,
          },
        })
      );
      setStocks(stocks.filter((stock) => stock.id !== id));
    } catch ({ errors }) {
      console.log("ERRORS DELETING: ", errors);
      throw new Error(errors[0].message);
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

  return (
    <Layout headTitle="Obsido | Home">
      <div className="flex flex-col justify-center">
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
        <div className="bg-gray-700 text-yellow-300 flex justify-center w-full">
          {totals.shares > 0 ? (
            <button
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <pre className="">
                  {JSON.stringify(totals, null, 2)}
                </pre>
              ) : (
                <div className="p-2">
                  <p className="text-3xl">
                    {totals.currentValue}
                  </p>
                  <p className="text-2xl">{`${totals.gainLoss} (${totals.overallPercent})`}</p>
                </div>
              )}
            </button>
          ) : (
            <div>Calculating ...</div>
          )}
        </div>
        {!showAdd && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowAdd(true)}
              className="w-10 h-10 text-green-600"
            >
              <PlusCircleIcon />
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

            {/* <AmplifyAuthenticator> */}
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
              {/* <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button> */}
            </form>
            {/* </AmplifyAuthenticator> */}
          </div>
        )}
        <table className="table-auto border-collapse m-2">
          <thead>
            <tr>
              <th className="border">Stock</th>
              <th className="border">Current Status</th>
              {/* <th className="w-1/4 border">Indicators</th> */}
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td className="border p-2">
                  <div>
                    <Link href={`/stock/${encodeURIComponent(stock.id)}`}>
                      <a className="p-1 bg-green-500 rounded-md text-lg lg:text-xl">
                        {stock.ticker}
                      </a>
                    </Link>
                  </div>
                  <div>{stock.quote.price}</div>
                  <div>{stock.overview.marketCap}</div>
                  <div className="text-xs">{stock.updatedAt}</div>
                </td>
                <td className="border p-2">
                  {stock.calculations ? (
                    <div>
                      <span className="flex flex-row gap-2 align-bottom">
                        <div className="text-xl">
                          {stock.calculations.stockCurrentValue}
                        </div>
                        <span className="inline-block align-bottom">{`(${stock.calculations.stockGainLoss})`}</span>
                      </span>
                      <div>{stock.calculations.stockGainLossPercent}</div>
                      <div>Insert % of Portfolio Here</div>
                    </div>
                  ) : (
                    "No Holding"
                  )}
                </td>
                {/* <td className="border p-1">
                  {stock.calculations ? (
                    <div>Hold for more ...</div>
                  ) : (
                    "No Holding"
                  )}
                </td> */}
                {/* <td className="border p-1">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Link href={`/stock/${encodeURIComponent(stock.id)}`}>
                      <a className="p-1 text-center bg-green-400">view</a>
                    </Link>
                    <button
                      className="p-1 text-center bg-gray-400"
                      onClick={() => handleUpdateStock(stock.id)}
                    >
                      update
                    </button>
                    <button
                      className="p-1 text-center bg-red-400"
                      onClick={() => handleDeleteStock(stock.id)}
                    >
                      delete
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
