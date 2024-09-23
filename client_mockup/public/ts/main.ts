import express, { Express, Request, Response } from "express";
const port = process.env.PORT || 8080;
const path = require('path');
const app : Express = express();
console.log('Server is up');
app.listen(8080);

app.get("/",
  async (req : Request, res : Response) => {
    res.sendFile(path.join(__dirname, "login.html"));
  });


  app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
  });