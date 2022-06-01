import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, resp) => {
  try {
    let account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error("Name e Balance são obrigatórios.");
    }

    const data = JSON.parse(await readFile(global.fileName));

    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance,
    };
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
    console.log("Dados retornados");
  } catch (err) {
    resp.status(400).send({ error: err.message });
  }
});

router.get("/:id", async (req, resp) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    resp.send(account);
  } catch (error) {
    resp.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, resp) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    resp.end();
  } catch (error) {
    resp.status(400).send({ error: err.message });
  }
});

router.put("/", async (req, resp) => {
  try {
    const account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error("Name e Balance são obrigatórios.");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === parseInt(account.id));

    if(index === -1){
      throw new Error("Registro não encontrado.")
    }

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    resp.send(account);
  } catch (error) {
    resp.status(400).send({ error: err.message });
  }
});

router.patch("/updateBalance", async (req, resp) => {
  try {
    const account = req.body;

    if (!account.id || account.balance == null) {
      throw new Error("ID e Balance são obrigatórios.");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === parseInt(account.id));

    if(index === -1){
      throw new Error("Registro não encontrado.")
    }

    data.accounts[index].balance = account.balance;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    resp.send(data.accounts[index]);
  } catch (error) {
    resp.status(400).send({ error: err.message });
  }
});

router.use((err, req, resp, next) => {
  console.log(err);
  resp.status(400).send({ error: err.message });
});

export default router;
