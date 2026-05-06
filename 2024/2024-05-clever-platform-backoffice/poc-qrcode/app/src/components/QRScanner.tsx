import { useRef, useState } from "react";
import QrScanner from "qr-scanner";

function QRScanner({ backendUrl }: { backendUrl: string }) {
  const [data, setData] = useState<string>();
  const [result, setResult] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readQRCode = async () => {
    const image = fileInputRef.current?.files?.item(0);
    if (image)
      return await QrScanner.scanImage(image, {})
        .then((result) => result)
        .catch((error) => console.log(error || "No QR code found."));
  };

  const handleScanQRCode = async () => {
    const data = await readQRCode();

    if (data) {
      setData(JSON.stringify(data));
      fetch(`${backendUrl}/scan?id=${data}`, {
        method: "get",
      })
        .then((res) => res.json())
        .then((result) => {
          setResult(JSON.stringify(result));
        })
        .catch((err) => {
          setResult(JSON.stringify(err));
        });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex gap-4 items-center justify-center">
        <input type="file" ref={fileInputRef} onChange={handleScanQRCode} />
        <button
          onClick={handleScanQRCode}
          className="p-4 w-fit bg-gray-600 rounded-lg"
        >
          Scan QR Code
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full items-start justify-center">
        <span>Read QR Code Data</span>
        <div className="bg-gray-600 w-full h-40 p-2">{data}</div>
      </div>

      <div className="flex flex-col gap-4 w-full items-start justify-center">
        <span>Read From Backend</span>
        <div className="bg-gray-600 w-full h-40 p-2">{result}</div>
      </div>
    </div>
  );
}

export default QRScanner;
