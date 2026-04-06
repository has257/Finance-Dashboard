export default function SummaryCard({ title, value, change }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{change}%</span>
    </div>
  );
}
