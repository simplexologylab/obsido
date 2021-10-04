import { useState, useEffect } from "react";

import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import {
  Amplify,
  API,
  Auth,
  withSSRContext,
  graphqlOperation,
} from "aws-amplify";

import Head from "next/head";
import awsExports from "../src/aws-exports";

import {
  addStock as AddStock,
  deleteStock as DeleteStock,
} from "../src/graphql/mutations";

import {
  listStocks,
  listHoldings,
  deleteHolding as DeleteHolding,
} from "../src/graphql/queries";

import calcHoldingTotals from "../src/utilities/calcHoldingTotals";
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
      console.log("ERRORS DELETING: ", ...errors);
      throw new Error(errors[0].message);
    }
  }

  return (
    <div>
      <Head>
        <title>Obsido | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center">
        <div className="flex flex-row bg-black content-center">
          <h2 className="flex-auto p-4 text-white text-2xl text-center">
            Obsido
          </h2>
          <button
            className="w-sm m-4 p-2 bg-green-600 text-white border-2 border-gray"
            onClick={() => setShowAdd(!showAdd)}
          >
            {showAdd ? "Cancel" : "Add Stock"}
          </button>
        </div>
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
        {errors.length > 0 && <div>{JSON.stringify(errors, null, 2)}</div>}

        <div>
          <pre>{JSON.stringify(totals, null, 2)}</pre>
        </div>

        <table className="table-auto border-collapse m-2">
          <thead>
            <tr>
              <th className="border">Ticker</th>
              <th className="border">Shares Owned</th>
              <th className="border">Market Cap</th>
              <th className="border">Latest Price</th>
              <th className="border">Holdings</th>
              <th className="border">Gain/Loss</th>
              <th className="border">Cost Basis</th>
              <th className="border">Current Value</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td className="border p-1">{stock.ticker}</td>
                <td className="border p-1">{stock.ticker}</td>
                <td className="border p-1">{stock.overview.marketCap}</td>
                <td className="border p-1">{stock.quote.price}</td>
                <td className="border p-1">
                  {
                    holdings.filter((h) => h.stock.ticker === stock.ticker)
                      .length
                  }
                </td>
                <td className="border p-1">
                  {
                    calcHoldingTotals(
                      holdings.filter((h) => h.stock.ticker === stock.ticker),
                      stock.quote.price
                    ).gainLoss
                  }
                </td>
                <td className="border p-1">
                  {
                    calcHoldingTotals(
                      holdings.filter((h) => h.stock.ticker === stock.ticker),
                      stock.quote.price
                    ).costBasis
                  }
                </td>
                <td className="border p-1">
                  {
                    calcHoldingTotals(
                      holdings.filter((h) => h.stock.ticker === stock.ticker),
                      stock.quote.price
                    ).currentValue
                  }
                </td>
                <td className="flex flex-row gap-3 border p-1">
                  <a
                    className="p-1 text-center bg-green-400"
                    href={`/stock/${stock.id}`}
                  >
                    view
                  </a>
                  <button
                    className="p-1 text-center bg-red-400"
                    onClick={() => handleDeleteStock(stock.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
