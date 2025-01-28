const express = require("express");
const app = express();
const PORT = 3000;
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const indexRouter = require("./routes/index");
const ownersRouter = require("./routes/ownerRouter");
const usersRouter = require("./routes/userRouter");
const productsRouter = require("./routes/productRouter");
const shopsRouter = require("./routes/shopRouter");
const cartRouter = require("./routes/cartRouter");

const db = require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use("/", indexRouter);
app.use("/owner", ownersRouter);
app.use("/user", usersRouter);
app.use("/product", productsRouter);
app.use("/shop", shopsRouter);
app.use("/cart", cartRouter);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on Port http://localhost:${PORT}/`);
});
