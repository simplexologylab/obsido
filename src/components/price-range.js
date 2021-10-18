export default function PriceRange({ id, low, high, price }) {
  return (
    <input
      className="pointer-events-none"
      type="range"
      id={id}
      min={low}
      max={high}
      defaultValue={price}
    />
  );
}
