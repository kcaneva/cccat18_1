import express, { Request, Response } from "express";
import { controllerSignup } from "./controllerSignup";

const app = express();
app.use(express.json());

app.get("/ping", async function (req, res) { res.json( { message: "pong" } ) } );
app.post("/signup", controllerSignup);

const port = 3000;
app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`)
});
