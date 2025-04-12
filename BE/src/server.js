import express from "express";
import mongoose from "mongoose";
import users from "./routes/users.router";
import bodyParser from "body-parser";
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
mongoose
  .connect(process.env.URL_CONNECT_MONGODB)
  .then(() => {
    console.log("Connect success!");
  })
  .catch((error) => {
    console.log("Connect error!", error);
  });

// Lấy được thông tin truyền lên từ client
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/api", users);

// chuyen thong tin user qua bên nguoi dung chuyen doi nguoi qua bên phuong thuc thu 2 của trinh duyet
app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
