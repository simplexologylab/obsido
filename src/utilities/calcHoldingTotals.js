export default function calcHoldingTotals(holdings, price) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let total = {
    shares: 0,
    costBasis: 0,
  };

  holdings.forEach(({ shares, costBasis }) => {
    total.costBasis = total.costBasis + shares * costBasis;
    total.shares = total.shares + shares;
  });

  total.basisDifference = (
    (total.shares * price - total.costBasis) /
    total.costBasis
  ).toFixed(3);
  total.average = currency.format(total.costBasis / total.shares);
  total.costBasis = currency.format(total.costBasis);
  total.currentValue = currency.format(total.shares * price);

  console.log("Total is: ", total)

  return total;
}