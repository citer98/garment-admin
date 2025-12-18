export default function StatCard({ title, value }) {
return (
<div className="bg-white rounded-xl p-4 shadow">
<div className="text-sm text-gray-500">{title}</div>
<div className="text-2xl font-bold">{value}</div>
</div>
)
}