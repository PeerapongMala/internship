import { useState } from "react";
import FileUpload from "../components/FileUpload";
import FileListRenderer from "../components/FileListRenderer";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useIndexedDB } from "../hooks/useIndexedDB";

function Upload() {
  const [files, setFiles] = useState<FileList>();
  const { isReady, addItem } = useIndexedDB({ storeName: "test" });

  const handleOnSubmitUploadFile = () => {
    if (!isReady) return;

    if (files?.length) {
      for (let i = 0; i < files?.length; i++) {
        const file = files.item(i);
        const fileName = file?.name ?? "gen:" + Math.ceil(Math.random() * 1e7);
        addItem(file, fileName);
      }
    }
    setFiles(undefined);
  };

  return (
    <div>
      <FileUpload
        multiple
        handleOnUploadFile={(evt) => {
          // console.log(evt);
          const uploadedFiles = evt.target.files;
          if (uploadedFiles) setFiles(uploadedFiles);
        }}
      />
      <button onClick={handleOnSubmitUploadFile}>Upload File</button>
      {files?.length && (
        <div className="flex flex-col">
          <h2 className="my-4 text-2xl font-bold">Pending Files</h2>
          <FileListRenderer files={files} />
        </div>
      )}
    </div>
  );
}

export const Route = createLazyFileRoute("/upload")({
  component: Upload,
});
