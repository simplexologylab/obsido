export default function calcHoldingsTotals(stocks) {
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

  stocks.forEach((stock) => {
    if (stock.calculations) {
      total.shares =
        total.shares + stock.calculations.stockTotalShares;
      total.costBasis =
         total.costBasis + stock.calculations.stockCostBasis;

      const { quote } = stocks.find(({ ticker }) => ticker === stock.ticker);
      total.gainLoss =
        total.gainLoss + stock.calculations.stockGainLoss
      total.currentValue =
        total.currentValue + stock.calculations.stockCurrentValue
    }
  });

  total.shares = total.shares.toFixed(3);
  total.overallPercent = ((total.gainLoss / total.costBasis) * 100).toFixed(3);

  return total;
}
