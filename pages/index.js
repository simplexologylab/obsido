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

import { listStocks } from "../src/graphql/queries";

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

  useEffect(() => {
    getStocks();
  }, []);

  async function getStocks() {
    try {
      const { data } = await API.graphql(graphqlOperation(listStocks));
      setStocks(data.listStocks.items);
    } catch (err) {
      setErrors([...errors, "Issue with API call to get list of stocks"])
    }
  }

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
        <title>Learn SSR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center">
        <div className="flex flex-row bg-black content-center">
          <h2 className="flex-auto p-4 text-white text-2xl text-center">Obsido</h2>
          <button
            className="w-sm border-2 m-4 p-2 bg-green-600 text-white border-2 border-gray"
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

        {/* <p className="p-5 text-xl text-center">{`${stocks.length} stocks`}</p> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-10">
          {stocks.map((stock) => (
            <div
              className="flex flex-col border-4 p-6 rounded-sm "
              key={stock.id}
            >
              <h3 className="text-xl text-center">{stock.ticker}</h3>
              <div className="p-4">{JSON.stringify(stock, null, 2)}</div>
              <div className="grid grid-cols-2 gap-4">
                <a
                  className="border-4 text-center border-green-400"
                  href={`/stock/${stock.id}`}
                >
                  View Stock
                </a>
                <button
                  className="border-2 border-red-300"
                  onClick={() => handleDeleteStock(stock.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
