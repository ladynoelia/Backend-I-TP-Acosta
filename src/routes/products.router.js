import express from "express";
import ProductManager from "../managers/productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/db/products.json");

// Obtener todos los productos
productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un producto
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    if (!newProduct || Object.keys(newProduct).length === 0) {
      return res.status(400).json({
        message:
          "Se necesita información para agregar un producto a la base de datos",
      });
    }
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado", products });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener producto por Id
productsRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en la base de datos" });
    }
    res.status(200).json({ message: "Producto encontrado:", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un producto
productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const products = await productManager.updateProduct(pid, updates);
    if (!products || Object.keys(updates).length === 0) {
      return res.status(401).json({
        message:
          "Los datos del producto no se pudieron actualuzar. Revisar Id y/o updates.",
      });
    }
    res.status(200).json({ message: "Producto actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un producto por Id
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    if (!products) {
      return res.status(404).json({
        message:
          "El producto que desea eliminar no se encuentra en la base de datos",
      });
    }
    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
