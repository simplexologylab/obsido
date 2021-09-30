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

import awsExports from "../../src/aws-exports";

Amplify.configure({ ...awsExports, ssr: true });

export default function Stock() {
  const router = useRouter();
  const { id } = router.query;

  const [stockInfo, setStockInfo] = useState(null);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    getStockInfo();
  }, [id]);

  async function updateStockInfo() {
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

  async function addHolding() {
    try {
      const holding = await API.graphql(
        graphqlOperation(CreateHolding, {
          input: {
            brokerage: "Fidelity",
            costBasis: 50,
            holdingStockId: stockInfo.id,
            purchaseDate: "2021-01-02",
            shares: 10,
          },
        })
      );
      setHoldings([...holdings, holding.data.createHolding]);
    } catch ({ errors }) {
      console.log("Errors: ", errors);
      throw new Error(errors[0]);
    }
  }

  async function removeHolding(id) {
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

  async function getStockInfo() {
    try {
      if (id) {
        const { data } = await API.graphql(
          graphqlOperation(GetStock, {
            id: id,
          })
        );

        setStockInfo(data.getStock);
        setHoldings(data.getStock.holdings.items);
      } else {
        console.log("No ID!!!");
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  if (stockInfo) {
    return (
      <div className="flex flex-col justify-center">
        <div className="flex flex-row bg-black text-white justify-center">
          <a href={"/"} className="w-xl p-4">{`< Back`}</a>
          <p className="flex-auto text-xl text-center p-4 ">{stockInfo.name}</p>
          <button className="m-4" onClick={updateStockInfo}>
            Update Stock
          </button>
          <button className="m-4" onClick={addHolding}>
            Add Holding
          </button>
        </div>
        <pre className="p-10 md:p-20">
          <code>{JSON.stringify(stockInfo.updatedAt, null, 2)}</code>
        </pre>

        {holdings.map((holding) => (
          <pre className="p-10 md:p-20" key={holding.id}>
            <code>{JSON.stringify(holding, null, 2)}</code>
            <button onClick={() => removeHolding(holding.id)}>delete</button>
          </pre>
        ))}
        <pre className="p-10 md:p-20">
          <code>{JSON.stringify(stockInfo.overview, null, 2)}</code>
        </pre>
        <pre className="p-10 md:p-20">
          <code>{JSON.stringify(stockInfo.quote, null, 2)}</code>
        </pre>
      </div>
    );
  } else {
    return <div>Getting info ...</div>;
  }
}
