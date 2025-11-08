import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";

//import CartManager from "./managers/cartManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/productManager.js";

const app = express();
const server = http.createServer(app);

//Middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//const cartManager = new CartManager("./src/db/carts.json");

/* app.get("/", (req, res) => {
  res.json({ status: "Éxito!", message: "Hello!" });
}); */

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

// ----------- Websocket -----------
const io = new Server(server);
const productManager = new ProductManager("./src/db/products.json");
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", async (socket) => {
  console.log("conectados!" + socket.id);
  //Manda los productos en la base de datos
  const productsData = await productManager.getProducts();
  io.emit("Products data", productsData);

  /* //Recibe los datos y agrega un producto nuevo
  socket.on("New Product", async (newProduct) => {
    console.log("Producto agregado:", newProduct);
    await productManager.addProduct(newProduct);
  }); */
});
// node src/app.js
server.listen(8080, () => {
  console.log("servidor iniciado! xD");
});
