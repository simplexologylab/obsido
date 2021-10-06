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
  createHolding as CreateHolding,
  deleteHolding as DeleteHolding,
} from "../../src/graphql/mutations";

import Layout from "../../src/components/layout";

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
    async function updateStock() {
      if (holdings.length === 0) {
        const { data } = await API.graphql(
          graphqlOperation(GetStock, {
            id: id,
          })
        );
        setStockInfo(data.getStock);
        setHoldings(data.getStock.holdings.items);
      } else {
        const { data } = await API.graphql(
          graphqlOperation(UpdateStockData, {
            id: id,
          })
        );
        setStockInfo(data.updateStockData);
        setHoldings(data.updateStockData.holdings.items);
      }
    }

    try {
      if (id) {
        updateStock();
      } else {
        console.log("No ID!!!");
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }, [id, holdings.length]);

  // async function updateStockInfo() {
  //   try {
  //     const stockData = await API.graphql(
  //       graphqlOperation(UpdateStockData, {
  //         id: stockInfo.id,
  //       })
  //     );
  //     console.log(stockData.data.updateStockData)
  //     setStockInfo(stockData.data.updateStockData);
  //   } catch ({ errors }) {
  //     console.log("Errors: ", errors);
  //     throw new Error(errors[0]);
  //   }
  // }

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

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (stockInfo) {
    return (
      <Layout
        headTitle={`Obsido | ${stockInfo.ticker}`}
        pageTitle={stockInfo.name}
        className="flex flex-col justify-center"
        backLink="/"
      >
        {adding && (
          <div className="p-10 bg-gray-400">
            <form onSubmit={handleAddHolding}>
              <fieldset className="flex flex-col gap-3 p-10">
                <input
                  className="p-2"
                  placeholder="Purchase Date"
                  defaultValue={``}
                  name="purchaseDate"
                />
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  className="p-2"
                  placeholder="Enter # Shares"
                  defaultValue={``}
                  name="shares"
                />
                <label htmlFor="shares">Shares</label>
                <input
                  className="p-2"
                  placeholder="Enter Cost Basis"
                  defaultValue={``}
                  name="costBasis"
                />
                <label htmlFor="costBasis">Cost Basis</label>
                <input
                  className="p-2"
                  placeholder="Brokerage"
                  defaultValue={``}
                  name="brokerage"
                />
                <label htmlFor="brokerage">Brokerage</label>
                <input
                  className="p-2"
                  placeholder="Notes"
                  defaultValue={``}
                  name="notes"
                />
                <label htmlFor="notes">Notes</label>
              </fieldset>
              <button className="border-2 p-2 bg-white">Add Holding</button>
            </form>
          </div>
        )}
        <button
          onClick={() => setShowCalcDetails(!showCalcDetails)}
          className="bg-gray-700"
        >
          {showCalcDetails ? (
            <pre className="text-yellow-300 justify-center">
              {JSON.stringify(stockInfo.calculations, null, 2)}
            </pre>
          ) : (
            <div className="p-2">
              <p className="text-yellow-300 text-3xl">
                {stockInfo.calculations.stockCurrentValue}
              </p>
              <p className="text-yellow-300 text-2xl">{`${stockInfo.calculations.stockGainLoss} (${stockInfo.calculations.stockGainLossPercent})`}</p>
            </div>
          )}
        </button>
        <div className="flex flex-row justify-center">
          <button className="m-4" onClick={() => setAdding(!adding)}>
            {adding ? "Close" : "Add Holding"}
          </button>
        </div>
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
          "No Holdings"
        )}
        <pre className="p-10 md:p-20">
          <code>{JSON.stringify(stockInfo, null, 2)}</code>
        </pre>
      </Layout>
    );
  } else {
    return <Layout pageTitle="..." />;
  }
}
