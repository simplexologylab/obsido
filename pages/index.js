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
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-gray-700 flex justify-center w-full"
        >
          {showDetails ? (
            <pre className="text-yellow-300">
              {JSON.stringify(totals, null, 2)}
            </pre>
          ) : (
            <div className="p-2">
              <p className="text-yellow-300 text-3xl">{totals.currentValue}</p>
              <p className="text-yellow-300 text-2xl">{`${totals.gainLoss} (${totals.overallPercent})`}</p>
            </div>
          )}
        </button>
        {errors.length > 0 && <div>{JSON.stringify(errors, null, 2)}</div>}
        <button
          className="w-sm m-4 p-2 bg-green-600 text-white border-2 border-gray"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? "Cancel" : "Add Stock"}
        </button>
        {showAdd && (
          <div className="flex flex-col justify-center bg-gray-300">
            <p className="text-center text-xl p-2">Add New Stock</p>

            {/* <AmplifyAuthenticator> */}
            <form
              className="flex flex-row p-4 align-middle justify-center"
              onSubmit={handleCreateStock}
            >
              <fieldset className="flex flex-row">
                <p className="text-xl p-2">Enter Ticker Symbol</p>
                <input
                  className="border-2 rounded-lg p-2 m-2 text-2xl"
                  placeholder="Enter Ticker Symbol"
                  defaultValue={``}
                  name="ticker"
                />
              </fieldset>
              <button className="bg-blue-300 p-2 rounded-lg">
                Create Stock
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
              <th className="border">Holdings</th>
              <th className="border">Gain/Loss</th>
              <th className="border">Current Value</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td className="border p-1">
                  <div className="text-xl">
                    <Link href={`/stock/${encodeURIComponent(stock.id)}`}>
                      <a className="p-1 text-center bg-green-400">
                        {stock.ticker}
                      </a>
                    </Link>
                  </div>
                  <div>{stock.quote.price}</div>
                  <div>{stock.overview.marketCap}</div>
                  <div className="text-xs">{stock.updatedAt}</div>
                </td>
                <td className="border p-1">
                  {
                    holdings.filter((h) => h.stock.ticker === stock.ticker)
                      .length
                  }
                </td>
                <td className="border p-1">
                  {stock.calculations ? (
                    <div>
                      <div>{stock.calculations.stockGainLoss}</div>
                      <div>{stock.calculations.stockGainLossPercent}</div>
                    </div>
                  ) : (
                    "No Holding"
                  )}
                </td>
                <td className="border p-1">
                  {stock.calculations ? (
                    <div>
                      <div>{stock.calculations.stockCurrentValue}</div>
                      <div>Insert % of Portfolio Here</div>
                    </div>
                  ) : (
                    "No Holding"
                  )}
                </td>
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
