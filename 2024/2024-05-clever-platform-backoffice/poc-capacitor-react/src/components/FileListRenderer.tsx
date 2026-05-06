export default function FileListRenderer({ files }: { files?: FileList }) {
  const renderFileList = () => {
    const l = files?.length ?? 0;
    const renderer = [];
    for (let i = 0; i < l; i++) {
      const item = files?.item(i);
      renderer.push(item);
    }

    return (
      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        {renderer.map((item, i) => {
          return (
            <li key={i}>
              {item?.name} ({item?.type})
            </li>
          );
        })}
      </ul>
    );
  };

  if (!files) return <></>;
  return renderFileList();
}
