export default function Tabs({ tabs }: { tabs: { name: string, id: string }[]}) {
  const tabSelect = "scores"

  return (
    <div className="flex gap-2 border-b-2 shadow-sm bg-white">{tabs.map((tab, index) => (
      <button key={tab.id + index} className={`px-5 py-2 ${tab.id == tabSelect ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>{tab.name}</button>
    ))}</div>
  )
}