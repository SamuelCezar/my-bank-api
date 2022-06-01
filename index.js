import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";
import cors from "cors";

global.fileName = "accounts.json";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/account", accountsRouter);

app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName);
    console.log("API Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    fs.writeFile(global.fileName, JSON.stringify(initialJson))
      .then(() => {
        console.log("API Started and file has been created!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
