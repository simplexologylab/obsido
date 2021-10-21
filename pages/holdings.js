import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Amplify,
  API,
  Auth,
  withSSRContext,
  graphqlOperation,
} from "aws-amplify";
Amplify.configure({ ...awsExports, ssr: true });

import awsExports from "../src/aws-exports";
import Layout from "../src/components/layout";

import { listHoldings } from "../src/graphql/queries";
import { updateHolding as UpdateHolding } from "../src/graphql/mutations";

export async function getServerSideProps({ req }) {
  const SSR = withSSRContext({ req });
  const response = await SSR.API.graphql({ query: listHoldings });

  return {
    props: {
      holdings: response.data.listHoldings.items,
    },
  };
}

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [initial, setInitial] = useState([]);

  useEffect(() => {
    async function getHoldings() {
      try {
        const holdingData = await API.graphql(graphqlOperation(listHoldings));
        console.log('Holdings are: ', holdingData.data.listHoldings.items)
        setHoldings(holdingData.data.listHoldings.items);
        setInitial(holdingData.data.listHoldings.items);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    getHoldings();
  }, []);

  async function handleUpdateHolding(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    try {
      const update = await API.graphql(
        graphqlOperation(UpdateHolding, {
          input: {
            id: event.target.id,
            purchaseDate: form.get("purchaseDate"),
            shares: form.get("shares"),
            costBasis: form.get("costBasis"),
          },
        })
      );

      console.log("Updated to: ", update.data.updateHolding);
    } catch (error) {
      console.log(error);
    }
  }

  function handleFilter(event) {
    const filtered = initial.filter(({ stock }) => {
      let compare = stock.ticker.toUpperCase();
      if (stock.name) {
        compare = compare + stock.name.toUpperCase();
      }
      return compare.includes(event.target.value.toUpperCase());
    });

    setHoldings(filtered);
  }


  return (
    <Layout>
      <div className="bg-blue-500 p-4">
        <input type="text" onChange={handleFilter} />
      </div>
      {/* {holdings.map((holding) => (
        <div key={holding.id}>
          <p>{holding.id}</p>
          <form id={holding.id} onSubmit={handleUpdateHolding}>
            <div className="flex flex-row gap-4 bg-gray-200 p-2">
              <p>{holding.stock.ticker}</p>
              <input defaultValue={holding.purchaseDate} name="purchaseDate" />
              <input defaultValue={holding.shares} name="shares" />
              <input defaultValue={holding.costBasis} name="costBasis" />
            </div>
            <div>
              <button>Update</button>
            </div>
          </form>
        </div>
      ))} */}
      <pre>
        <code>{JSON.stringify(holdings, null, 2)}</code>
      </pre>
    </Layout>
  );
}
