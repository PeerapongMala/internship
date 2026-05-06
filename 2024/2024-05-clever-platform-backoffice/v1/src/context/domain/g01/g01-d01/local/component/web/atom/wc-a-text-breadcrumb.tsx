export default function TextBreadcrumb({ list }: { list: Array<string> }) {
  return (
    <div className="flex text-left text-xl font-bold">
      {list.map((t, i) => (
        <div key={`bcl-${i}`}>
          {i == 0 ? null : <span className="mx-1">/</span>}
          <span className="underline">{t}</span>
        </div>
      ))}
    </div>
  );
}
