const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

dotenv.config();
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connect success! ");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

app.listen(8080, () => {
  console.log("Server is running");
});
