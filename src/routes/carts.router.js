import express from "express";
import Cart from "../models/cart.model.js";

const cartsRouter = express.Router();

//Rutas para Manejo de Carritos (/api/carts/)
//POST Genera un carrito vacio
cartsRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST / muestra todos los carritos
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({ message: "Lista de carritos de compras:", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET /:cid Muestra los productos de un carrito
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({
        message: "El carrito de compras no se encuentra en la base de datos",
      });
    }
    res.status(200).json({
      message: "Carrito de compras encontrado:",
      payload: cart.products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST /:cid/product/:pid Debe agregar el producto al arreglo products del carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity = 1 } = req.body;
    if (!cartId || !productId) {
      return res.status(400).json({
        message:
          "Se necesita mas información para ejecutar la solicitud. Verificar los cid y pid.",
      });
    }

    const updatedCart = await Cart.findById(cartId);
    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    const addedProduct = updatedCart.products.find(
      (p) => p.product.toString() === productId
    );
    if (addedProduct) {
      addedProduct.quantity += quantity;
    } else {
      updatedCart.products.push({ product: productId, quantity });
    }
    await updatedCart.save();

    res
      .status(200)
      .json({ message: "Producto agregado al carrito", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//DELETE un carrito
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const deletedCart = await Cart.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res.status(404).json({
        message:
          "El carrito que desea eliminar no se encuentra en la base de datos",
      });
    }
    res
      .status(200)
      .json({ message: "Carrito de compras eliminado", payload: deletedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//DELETE todos los productos de un carrito
cartsRouter.delete("/:cid/products", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Carrito de compras no encontrado" });
    }
    cart.products = [];
    await cart.save();

    res.status(200).json({
      message: "Se eliminaron todos los productos del carrito",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartsRouter;
