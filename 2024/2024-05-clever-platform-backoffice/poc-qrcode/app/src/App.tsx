import QRGenerator from "./components/QRGenerator";
import QRScanner from "./components/QRScanner";

const BACKEND_URL = "http://localhost:3000";

function App() {
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row justify-center items-start gap-8">
      <div className="flex flex-col w-full lg:w-fit gap-6 p-6 rounded-xl border">
        <h1 className="font-bold text-xl mb-4">QR Generator</h1>
        <QRGenerator backendUrl={BACKEND_URL} />
      </div>
      <div className="flex flex-col w-full lg:w-fit gap-6 p-6 rounded-xl border">
        <h1 className="font-bold text-xl mb-4">QR Scanner</h1>
        <QRScanner backendUrl={BACKEND_URL} />
      </div>
    </div>
  );
}

export default App;
