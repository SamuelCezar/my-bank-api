import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, resp) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextId++, ...account };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    resp.send(account);
  } catch (err) {
    resp.status(400).send({ error: err.message });
  }
});

router.get("/", async (req, resp) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    resp.send(data);
  } catch (err) {
    resp.status(400).send({ error: err.message });
  }
});

export default router;
