export default function SchoolCard( { school }: { school: {[x: string]: string} } ) {
  return (
    <div className="flex flex-col gap-3 bg-gray-100 rounded-md py-2 px-3">
      <div className="flex gap-2 items-center">
        {school.logoURL ? <img src={school.logoURL} alt={school.name} className="size-8 bg-white rounded-full" /> : <div className="size-8 bg-white rounded-full"></div>}
        <div className="text-xl font-bold">{school.name}</div>
      </div>
      <div className="text-sm">รหัสโรงเรียน: {school.id} (ตัวย่อ: {school.shortId})</div>
    </div>
  )
}