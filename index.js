import express from "express";
import accountsRouter from "./routes/accounts.js"
import {promises as fs, readFile, writeFile} from "fs";


const app = express();
app.use(express.json());

app.use("/account", accountsRouter);

app.listen(3000, async () => {
    try {
        await fs.readFile("accounts.json");
        console.log("API Started!");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        fs.writeFile("accounts.json", JSON.stringify(initialJson)).then(() => {
            console.log("API Started and file has been created!")
        }).catch(err => {
            console.log(err);
        });
    }

})