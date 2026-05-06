export default function Breadcrumb( { breadcrumbs }: { breadcrumbs: string[] } ) {
  return (
    <div className="flex py-2 last:!text-black">
      {breadcrumbs.map((breadcrumb: string, index: number) => {
        const isLast = index == breadcrumbs.length - 1
        return (
          <div className="flex">
            <a href="#" key={breadcrumb + index} className={isLast ? "text-black cursor-default" : "text-primary"}>{breadcrumb}</a>
            {!isLast && <span className="mx-2">/</span>}
          </div>
        )
      })}
    </div>
  )
}