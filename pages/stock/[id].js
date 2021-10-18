import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  Amplify,
  API,
  Auth,
  withSSRContext,
  graphqlOperation,
} from "aws-amplify";

import { getStock as GetStock } from "../../src/graphql/queries";
import {
  updateStockData as UpdateStockData,
  deleteStock as DeleteStock,
  createHolding as CreateHolding,
  deleteHolding as DeleteHolding,
} from "../../src/graphql/mutations";

import Layout from "../../src/components/layout";
import PriceRange from "../../src/components/price-range";
import { formatCurrency } from "../../src/utilities/textFormatting";

import awsExports from "../../src/aws-exports";

Amplify.configure({ ...awsExports, ssr: true });

export default function Stock() {
  const router = useRouter();
  const { id } = router.query;

  const [stockInfo, setStockInfo] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [adding, setAdding] = useState(false);
  const [showCalcDetails, setShowCalcDetails] = useState(false);

  useEffect(() => {
    // async function updateStock() {
    //   if (holdings.length === 0) {
    //     const { data } = await API.graphql(
    //       graphqlOperation(GetStock, {
    //         id: id,
    //       })
    //     );
    //     setStockInfo(data.getStock);
    //     setHoldings(data.getStock.holdings.items);
    //   } else {
    //     const { data } = await API.graphql(
    //       graphqlOperation(UpdateStockData, {
    //         id: id,
    //       })
    //     );
    //     setStockInfo(data.updateStockData);
    //     setHoldings(data.updateStockData.holdings.items);
    //   }

    // }

    async function getStockData() {
      const { data } = await API.graphql(
        graphqlOperation(GetStock, {
          id: id,
        })
      );
      setStockInfo(data.getStock);
      setHoldings(data.getStock.holdings.items);
    }

    try {
      if (id) {
        getStockData();
      } else {
        console.log("No ID!!!");
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }, [id, holdings.length]);

  async function handleUpdateStock() {
    try {
      const stockData = await API.graphql(
        graphqlOperation(UpdateStockData, {
          id: stockInfo.id,
        })
      );
      setStockInfo(stockData.data.updateStockData);
    } catch ({ errors }) {
      console.log("Errors: ", errors);
      throw new Error(errors[0]);
    }
  }

  async function handleAddHolding(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    try {
      const holding = await API.graphql(
        graphqlOperation(CreateHolding, {
          input: {
            brokerage: form.get("brokerage"),
            costBasis: form.get("costBasis"),
            holdingStockId: stockInfo.id,
            purchaseDate: "2021-01-02",
            shares: form.get("shares"),
            notes: form.get("notes"),
          },
        })
      );
      setHoldings([...holdings, holding.data.createHolding]);
    } catch ({ errors }) {
      console.log("Errors: ", errors);
      throw new Error(errors[0]);
    }
  }

  async function handleRemoveHolding(id) {
    try {
      const remove = await API.graphql(
        graphqlOperation(DeleteHolding, {
          input: {
            id: id,
          },
        })
      );
      setHoldings(
        holdings.filter(({ id }) => id !== remove.data.deleteHolding.id)
      );
    } catch ({ errors }) {
      console.log("Errors: ", errors);
      throw new Error(errors[0]);
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
      router.push("/");
    } catch ({ errors }) {
      console.log("ERRORS DELETING: ", errors);
      throw new Error(errors[0].message);
    }
  }

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (stockInfo) {
    return (
      <Layout
        headTitle={`Obsido | ${stockInfo.ticker}`}
        pageTitle={stockInfo.name ? stockInfo.name : stockInfo.ticker}
        className="flex flex-col justify-center"
        backLink="/"
        kickOut={`https://finance.yahoo.com/chart/${stockInfo.ticker}`}
      >
        <div className="font-primary">
          <div className="w-full p-2 bg-black text-white">
            <div className="">
              <p className="text-3xl">{stockInfo.quote.price}</p>
            </div>
            <PriceRange
              low={stockInfo.overview.last52Low}
              price={stockInfo.quote.price}
              high={stockInfo.overview.last52High}
              id={stockInfo.id}
            />
            <p className="text-sm">As of: {stockInfo.updatedAt}</p>
          </div>
          {stockInfo.calculations && (
            <div>
              <button
                onClick={() => setShowCalcDetails(!showCalcDetails)}
                className="bg-gray-700 flex justify-center w-full"
              >
                {showCalcDetails ? (
                  <pre className="text-yellow-300">
                    {JSON.stringify(stockInfo.calculations, null, 2)}
                  </pre>
                ) : (
                  <div className="p-2">
                    <p className="text-yellow-300 text-3xl">
                      {formatCurrency(stockInfo.calculations.stockCurrentValue)}
                    </p>
                    <p className="text-yellow-300 text-2xl">{`${formatCurrency(
                      stockInfo.calculations.stockGainLoss
                    )} (${(
                      stockInfo.calculations.stockGainLossPercent * 100
                    ).toFixed(2)}%)`}</p>
                  </div>
                )}
              </button>
            </div>
          )}
          {!adding && (
            <div className="flex flex-row justify-between">
              <button className="m-4" onClick={() => setAdding(!adding)}>
                {adding ? "Close" : "Add Holding"}
              </button>
              <button
                className="m-4"
                onClick={() => handleUpdateStock(stockInfo.id)}
              >
                Update Stock
              </button>
              <button
                className="m-4"
                onClick={() => handleDeleteStock(stockInfo.id)}
              >
                Delete Stock
              </button>
            </div>
          )}
          {adding && (
            <div className="p-4 bg-green-100">
              <form onSubmit={handleAddHolding}>
                <fieldset>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      className="p-2"
                      placeholder="Purchase Date"
                      defaultValue={``}
                      name="purchaseDate"
                    />
                    <input
                      className="p-2"
                      placeholder="Enter # Shares"
                      defaultValue={``}
                      name="shares"
                    />
                    <input
                      className="p-2"
                      placeholder="Enter Cost Basis"
                      defaultValue={``}
                      name="costBasis"
                    />
                    <input
                      className="p-2"
                      placeholder="Brokerage"
                      defaultValue={``}
                      name="brokerage"
                    />
                  </div>
                  <div className="m-4">
                    <textarea
                      className="p-2 resize w-full"
                      placeholder="Notes"
                      defaultValue={``}
                      name="notes"
                    />
                  </div>
                </fieldset>
                <div className="flex flex-row justify-between">
                  <button className="border-2 p-2 bg-white">Add Holding</button>
                  <button className="m-l-10" onClick={() => setAdding(!adding)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {holdings.length > 0 ? (
            <div className="flex flex-col justify-center">
              <table className="table-auto border-collapse m-2">
                <thead>
                  <tr>
                    <th className="border">Shares</th>
                    <th className="border">Cost</th>
                    <th className="border">Cost Basis</th>
                    <th className="border">Purchase Date</th>
                    <th className="border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr key={holding.id}>
                      <td className="border p-2">{holding.shares}</td>
                      <td className="border p-2">
                        {currency.format(holding.costBasis)}
                      </td>
                      <td className="border p-2">
                        {currency.format(holding.costBasis * holding.shares)}
                      </td>
                      <td className="border p-2">{holding.purchaseDate}</td>
                      <td className="border p-2">
                        {" "}
                        <button onClick={() => handleRemoveHolding(holding.id)}>
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">No Holdings</div>
          )}
{/* 
          <pre className="p-10 md:p-20">
            <code>{JSON.stringify(stockInfo, null, 2)}</code>
          </pre> */}
        </div>
      </Layout>
    );
  } else {
    return <Layout pageTitle="..." />;
  }
}
