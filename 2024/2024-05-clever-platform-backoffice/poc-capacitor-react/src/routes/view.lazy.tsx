import { createLazyFileRoute } from "@tanstack/react-router";
import { useIndexedDB } from "../hooks/useIndexedDB";
import { useState } from "react";

function View() {
  const { items, deleteItem, getItem } = useIndexedDB({ storeName: "test" });

  const [selectedItem, setSelectedItem] = useState<Blob>();

  const renderHeader = () => {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Item Name
          </th>
          <th scope="col" className="px-6 py-3">
            <span className="sr-only">Controls</span>
          </th>
        </tr>
      </thead>
    );
  };

  const renderRecord = ({ name }: { name: string }, key?: string | number) => {
    return (
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        key={key}
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {name}
        </th>
        {/* <td className="px-6 py-4">Silver</td>
        <td className="px-6 py-4">Laptop</td>
        <td className="px-6 py-4">$2999</td> */}
        <td className="px-6 py-4 text-right flex gap-4 justify-end">
          <span
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              getItem(name).then((item) => {
                setSelectedItem(item);
              });
            }}
          >
            View
          </span>
          <span
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              deleteItem(name);
            }}
          >
            Delete
          </span>
        </td>
      </tr>
    );
  };

  const renderSelectedItem = () => {
    if (!selectedItem) {
      return (
        <span className="text-neutral-500	 dark:text-neutral-400">
          Select View Item
        </span>
      );
    }

    if (selectedItem) {
      if (selectedItem?.type.startsWith("audio")) {
        const url = URL.createObjectURL(selectedItem);
        // const audio = new Audio();
        // audio.controls = true;
        // audio.src = url;
        // audio.autoplay = true;
        // audio.play();
        return (
          <audio controls>
            <source src={url} type={selectedItem.type} />
          </audio>
        );
      } else if (selectedItem?.type.startsWith("image")) {
        const url = URL.createObjectURL(selectedItem);
        return <img src={url} className="w-full lg:w-1/3 h-auto" />;
      }
      return (
        <textarea className="bg-white text-black">
          {selectedItem.toString()}
        </textarea>
      );
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl mb-2">Item Viewer</h2>
        {renderSelectedItem()}
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {renderHeader()}
        <tbody>
          {items.map((item, i) => {
            return renderRecord(item, i);
          })}
        </tbody>
      </table>
    </div>
  );
}

export const Route = createLazyFileRoute("/view")({
  component: View,
});
