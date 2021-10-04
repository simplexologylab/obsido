export default function calcHoldingTotals(holdings, price) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let total = {
    shares: 0,
    costBasis: 0,
    gainLoss: 0,
  };

  holdings.forEach(({ shares, costBasis }) => {
    total.costBasis = total.costBasis + shares * costBasis;
    total.shares = total.shares + shares;
    total.gainLoss = total.gainLoss + (price - costBasis) * shares;
  });

  total.basisDifference = (
    ((total.shares * price - total.costBasis) / total.costBasis) *
    100
  ).toFixed(3);
  total.average = currency.format(total.costBasis / total.shares);
  total.costBasis = currency.format(total.costBasis);
  total.gainLoss = currency.format(total.gainLoss);
  total.currentValue = currency.format(total.shares * price);

  return total;
}
