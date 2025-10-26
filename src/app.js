import express from "express";
//import ProductManager from "./managers/productManager.js";
//import CartManager from "./managers/cartManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/view.router.js";

const app = express();
app.use(express.json()); //habilita recibir info en formato json
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//const productManager = new ProductManager("./src/db/products.json");
//const cartManager = new CartManager("./src/db/carts.json");

/* app.get("/", (req, res) => {
  res.json({ status: "Éxito!", message: "Hello!" });
}); */

// ----------- Handlebars -----------
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use("/", viewsRouter);
// ----------- ProductManager -----------
app.use("/api/products", productsRouter);

// ----------- CartManager -----------
app.use("/api/carts", cartsRouter);

// node src/app.js
app.listen(8080, () => {
  console.log("servidor iniciado! xD");
});
