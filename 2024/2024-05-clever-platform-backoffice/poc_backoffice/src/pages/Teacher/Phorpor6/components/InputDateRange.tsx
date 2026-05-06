import IconCalendar from "@/components/Icon/IconCalendar";

export function InputDateRange() {
  return (
    <div className="flex gap-2 items-center pe-2 w-fit">
      <div className="flex-1 flex gap-1 items-center">
        <input type="date" className="w-10 flex-1 p-2 input-date" placeholder="วว/ดด/ปปปป" />
        <div>-</div>
        <input type="date" className="w-10 flex-1 p-2 input-date" placeholder="วว/ดด/ปปปป" />
      </div>
      <IconCalendar />
    </div>
  )
}