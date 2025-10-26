import express from "express";
import CartManager from "../managers/cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/db/carts.json");

//Rutas para Manejo de Carritos (/api/carts/)
//POST /
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.status(200).json({ message: "Lista de carritos de compras:", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET /:cid Muestra los productos de un carrito
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({
        message: "El carrito de compras no se encuentra en la base de datos",
      });
    }
    res.status(200).json({ message: "Carrito de compras encontrado:", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST /:cid/product/:pid Debe agregar el producto al arreglo products del carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    if (!cartId || !productId) {
      return res.status(400).json({
        message:
          "Se necesita mas información para ejecutar la solicitud. Verificar los cid y pid.",
      });
    }
    const addProduct = await cartManager.addProduct(cartId, productId);
    res
      .status(200)
      .json({ message: "Producto agregado al carrito", addProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartsRouter;
