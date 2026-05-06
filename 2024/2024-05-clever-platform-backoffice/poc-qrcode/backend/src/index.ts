import express, { Request, Response } from "express";
import cors from "cors";
import { generateRandomString } from "./utils";

// time to valid for qrcode
const VALID_QR_CODE_TIME = 60 * 1000;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// cached qrcode token map to users
const cachedUsers: Map<string, string> = new Map();

// endpoint to generate qrcode token
app.put("/generate", (req: Request, res: Response) => {
  const { userId, generate = false } = req.body;
  if (userId) {
    let uniqueQrcodeId = userId;
    if (generate) uniqueQrcodeId = generateRandomString(6, cachedUsers);

    // Store the data in cache
    cachedUsers.set(uniqueQrcodeId, userId);
    console.log(`Data stored with key: ${uniqueQrcodeId} = ${userId}`);

    // Calculate expiration time (current time + qrcode valid time)
    const expiresAt = new Date(Date.now() + VALID_QR_CODE_TIME);

    // Schedule removal after 5 minutes (300,000 milliseconds)
    setTimeout(() => {
      cachedUsers.delete(uniqueQrcodeId);
      console.log(
        `Data with key: ${uniqueQrcodeId} has been removed from cache`
      );
    }, VALID_QR_CODE_TIME);

    // send qrcode unique key
    res.json({ qrcode: uniqueQrcodeId, expiresAt });
  }
});

// endpoint to scan qrcode token to return the data
app.get("/scan", (req: Request, res: Response) => {
  const { id } = req.query;
  const qrcodeId = id?.toString();
  if (qrcodeId && cachedUsers.has(qrcodeId)) {
    const userId = cachedUsers.get(qrcodeId);
    res.json({ userId });
  }
  res.send("Not found!");
});

// endpoint to debug cache
app.get("/debug", (req: Request, res: Response) => {
  res.json([...cachedUsers.entries()]);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
