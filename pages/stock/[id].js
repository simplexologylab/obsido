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
import awsExports from "../../src/aws-exports";

Amplify.configure({ ...awsExports, ssr: true });

export default function Stock() {
  const router = useRouter();
  const { id } = router.query;

  const [stockInfo, setStockInfo] = useState(null);

  useEffect(() => {
    getStockInfo();
  }, [id]);

  async function getStockInfo() {
    try {
      if (id) {
        console.log(
          await API.graphql(
            graphqlOperation(GetStock, {
              id: id,
            })
          )
        );
        const { data } = await API.graphql(
          graphqlOperation(GetStock, {
            id: id,
          })
        );

        setStockInfo(data.getStock);
      } else {
        console.log("No ID!!!");
      }
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }

  if(stockInfo) {
    return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row bg-black text-white justify-center">
        <a href={'/'} className="w-xl p-4">{`< Back`}</a>
        <p className="flex-auto text-xl text-center p-4 ">
          {stockInfo.description}
        </p>
      </div>
      <code className="p-10 md:p-20">{JSON.stringify(stockInfo, null, 2)}</code>
    </div>
  )} else{
    return (
      <div>Getting info ...</div>
    )
  }
}
