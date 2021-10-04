export default function calcHoldingsTotals(holdings, stocks) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let total = {
    shares: 0,
    costBasis: 0,
    currentValue: 0,
    gainLoss: 0,
  };

  holdings.forEach(({ shares, costBasis, stock }) => {
    if (stock) { // have some bad data where stock deleted but not holding
      total.shares = total.shares + shares;
      total.costBasis = total.costBasis + shares * costBasis;
      const { quote } = stocks.find(({ ticker }) => ticker === stock.ticker);
      total.gainLoss = total.gainLoss + (quote.price - costBasis) * shares;
      total.currentValue = total.currentValue + (quote.price * shares);
    }
  });

  // total.basisDifference = (
  //   (total.shares * price - total.costBasis) /
  //   total.costBasis
  // ).toFixed(3);
  total.shares = total.shares.toFixed(3)
  total.overallPercent = (total.gainLoss/total.costBasis * 100).toFixed(3)
  total.costBasis = currency.format(total.costBasis);
  total.currentValue = currency.format(total.currentValue);
  total.gainLoss = currency.format(total.gainLoss)

  return total;
}
