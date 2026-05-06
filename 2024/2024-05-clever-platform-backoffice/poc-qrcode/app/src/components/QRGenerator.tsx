import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import CountdownTimer from "./CountdownTimer";

const DEFAULT_USER_ID = "ST1234";

function QRGenerator({ backendUrl }: { backendUrl: string }) {
  const [qrcodeKey, setQrcodeKey] = useState<string>();
  const [qrcodeExpiredAt, setQrcodeExpiredAt] = useState<Date>();
  const [isGenerate, setGenerate] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateQRCode = () => {
    const userId = inputRef.current?.value;
    fetch(`${backendUrl}/generate`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        generate: isGenerate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { qrcode, expiresAt } = data;
        setQrcodeKey(qrcode);
        setQrcodeExpiredAt(expiresAt);
      });
  };

  const handleDownloadQR = () => {
    const qr = document.getElementById("qrcode-renderer");
    if (!qr) {
      throw "Something went wrong";
    }

    const svgData = new XMLSerializer().serializeToString(qr);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = function () {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx?.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx?.fillRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png", 1.0);

      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode";
      downloadLink.href = `${pngFile}`;
      downloadLink.target = "_blank";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      downloadLink.remove();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex gap-2">
            <label htmlFor="user-id-input-data">User ID:</label>
            <input
              type="text"
              name="user-id-input-data"
              defaultValue={DEFAULT_USER_ID}
              ref={inputRef}
            />
            <input
              type="checkbox"
              id="generate"
              checked={isGenerate}
              onChange={() => {
                setGenerate((prev) => !prev);
              }}
            />
            <label htmlFor="generate" className="text-white">
              Random Token
            </label>
          </div>
          <button
            onClick={handleCreateQRCode}
            className="p-4 w-full bg-gray-600 my-4 rounded-lg"
          >
            Create a new QR Code
          </button>
        </div>
      </div>
      {qrcodeKey && (
        <>
          <div className="p-4 rounded-2xl bg-white">
            <QRCode value={qrcodeKey} id="qrcode-renderer" />
          </div>
          <div className="flex justify-around gap-6">
            {qrcodeExpiredAt && <CountdownTimer expiresAt={qrcodeExpiredAt} />}
            <button onClick={handleDownloadQR}>Download QRCode</button>
          </div>
        </>
      )}
    </div>
  );
}

export default QRGenerator;
