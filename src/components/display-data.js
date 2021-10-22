export default function DisplayData({ calculations, setting }) {
  switch (setting) {
    case "stockGainLossPercent":
      return (
        <>
          {calculations.stockGainLossPercent >= 0 ? (
            <p className="bg-green-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockGainLossPercent * 100
            ).toFixed(1)}%`}</p>
          ) : (
            <p className="bg-red-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockGainLossPercent * 100
            ).toFixed(1)}%`}</p>
          )}
        </>
      );

    case "stockCAGR":
      return (
        <>
          {calculations.stockCAGR >= 0 ? (
            <p className="bg-green-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockCAGR * 100
            ).toFixed(1)}%`}</p>
          ) : (
            <p className="bg-red-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockCAGR * 100
            ).toFixed(1)}%`}</p>
          )}
        </>
      );

    case "stockMAGR":
      return (
        <>
          {calculations.stockMAGR >= 0 ? (
            <p className="bg-green-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockMAGR * 100
            ).toFixed(1)}%`}</p>
          ) : (
            <p className="bg-red-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockMAGR * 100
            ).toFixed(1)}%`}</p>
          )}
        </>
      );

    case "stockWAGR":
      return (
        <>
          {calculations.stockWAGR >= 0 ? (
            <p className="bg-green-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockWAGR * 100
            ).toFixed(1)}%`}</p>
          ) : (
            <p className="bg-red-400 rounded-md text-lg md:text-xl font-bold p-1 text-center float-right">{`${(
              calculations.stockWAGR * 100
            ).toFixed(1)}%`}</p>
          )}
        </>
      );

    default:
      return <div>999</div>;
  }
}
