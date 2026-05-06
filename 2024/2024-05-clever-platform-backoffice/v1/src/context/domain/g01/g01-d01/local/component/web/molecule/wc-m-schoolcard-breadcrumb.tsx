import TextBreadcrumb from '../atom/wc-a-text-breadcrumb';

export default function SchoolCardBreadcrumb({
  list,
  subtext,
  image,
  className,
}: {
  list: Array<string>;
  subtext?: string;
  image?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-[10px] rounded-[10px] bg-neutral-100 p-[10px] ${className}`}
    >
      <div className="flex gap-[10px]">
        {image && <img alt="Logo" src={image} className="h-6 w-6" />}
        <TextBreadcrumb list={list} />
      </div>
      <p className="text-sm">{subtext}</p>
    </div>
  );
}
