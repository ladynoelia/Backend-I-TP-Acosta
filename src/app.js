import express from "express";
import ProductManager from "./managers/productManager.js";

const app = express();
app.use(express.json());
const productManager = new ProductManager("./src/db/products.json");

app.get("/", (req, res) => {
  res.json({ status: "Éxito!", message: "Hello!" });
});

// Obtener todos los productos
app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un producto
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener producto por Id
app.get("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    res.status(200).json({ message: "Producto encontrado:", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto
app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const products = await productManager.updateProduct(pid, updates);
    res.status(200).json({ message: "Producto actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un producto por Id
app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("servidor iniciado! xD");
});

// node src/app.js
