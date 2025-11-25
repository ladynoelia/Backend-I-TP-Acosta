import express from "express";
import Product from "../models/product.model.js";

const productsRouter = express.Router();

// Obtener todos los productos
productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const data = await Product.paginate({}, { limit, page });
    const products = data.docs;
    delete data.docs;

    res
      .status(200)
      .json({ message: "Lista de productos", payload: products, ...data });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al mostrar la lista de productos",
    });
  }
});

// Agregar un producto
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    console.log("Producto recibido:", newProduct);
    if (!newProduct || Object.keys(newProduct).length === 0) {
      return res.status(400).json({
        message:
          "Se necesita información para agregar un producto a la base de datos",
      });
    }
    const product = new Product(newProduct);
    await product.save();
    res.status(201).json({ message: "Producto agregado", product });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al agregar el producto",
      error,
    });
  }
});

// Obtener producto por Id
productsRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en la base de datos" });
    }
    res.status(200).json({ message: "Producto encontrado:", product });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", message: "Error al buscar el producto" });
  }
});

// Actualizar un producto
productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(pid, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct || Object.keys(updates).length === 0) {
      return res.status(401).json({
        message:
          "Los datos del producto no se pudieron actualuzar. Revisar Id y/o updates.",
      });
    }
    res
      .status(200)
      .json({ message: "Producto actualizado", payload: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar el producto" });
  }
});

// Eliminar un producto por Id
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return res.status(404).json({
        message:
          "El producto que desea eliminar no se encuentra en la base de datos",
      });
    }
    res.status(200).json({ message: "Producto eliminado", deletedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al borrar el producto" });
  }
});

export default productsRouter;
