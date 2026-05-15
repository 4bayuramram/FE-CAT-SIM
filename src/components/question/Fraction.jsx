export default function Fraction({ value }) {
  const [num, den] = value.split("/");

  if (!num || !den) return value;

  return (
    <span className="inline-flex flex-col items-center justify-center mx-1 leading-none">
      <span className="text-sm">{num}</span>
      <span className="border-t border-black w-5"></span>
      <span className="text-sm">{den}</span>
    </span>
  );
}
