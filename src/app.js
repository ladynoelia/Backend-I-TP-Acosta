import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/productManager.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ----------- Websocket -----------
export const io = new Server(server);
const productManager = new ProductManager("./src/db/products.json");
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ----------- Handlebars -----------
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
// ----------- Views -----------
app.use("/", viewsRouter);
// ----------- ProductManager -----------
app.use("/api/products", productsRouter);

// ----------- CartManager -----------
app.use("/api/carts", cartsRouter);

io.on("connection", async (socket) => {
  console.log("conectados!" + socket.id);
  //Manda los productos en la base de datos
  const productsData = await productManager.getProducts();
  socket.emit("Products data", productsData);
});

// MongoDB
connectMongoDB();

server.listen(8080, () => {
  console.log("servidor iniciado! xD");
});
// nodemon src/app.js
