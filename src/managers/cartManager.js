import fs from "fs/promises";
import crypto from "crypto";
import ProductManager from "./productManager.js";
import { error } from "console";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateId() {
    return crypto.randomUUID();
  }

  async getAllCarts() {
    try {
      const cartsData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      throw new error("Error al cargar la lista de carritos.", error);
    }
  }

  async updateCartFile(updatedCart) {
    try {
      const carts = await this.getAllCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === updatedCart.id);
      if (cartIndex === -1) {
        carts.push(updatedCart);
      } else {
        carts[cartIndex] = updatedCart;
      }
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
    } catch (error) {
      throw new Error(
        "Error al guardar el carrito de compras. " + error.message
      );
    }
  }

  //crea un nuevo carrito
  async newCart() {
    try {
      const newId = this.generateId();
      const cartProducts = [];
      const newCart = { id: newId, products: cartProducts };
      await this.updateCartFile(newCart);
      console.log("Nuevo carrito agregado exitosamente:", newCart);
    } catch (error) {
      throw new Error("Error al crear el carrito de compras. " + error.message);
    }
  }

  //Muestra los productos que pertenecen al carrito con el cid proporcionado
  async getCartById(cid) {
    try {
      const carts = await this.getAllCarts();
      const myCart = carts.find((cart) => cart.id === cid);
      if (!myCart) {
        throw new error("No existe el carrito en la base de datos");
      }
      return myCart;
    } catch (error) {
      throw new Error(
        "Error al mostrar el carrito de compras. " + error.message
      );
    }
  }

  //Agrega un producto al carrito.
  async addProduct(cid, pid) {
    try {
      //Busco el carrito
      const carts = await this.getAllCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cid);
      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }
      const myCart = carts[cartIndex];

      //busco si existe el producto en el .json
      const productManager = new ProductManager("./src/db/products.json");
      const addedProduct = await productManager.getProductById(pid);
      if (!addedProduct) {
        throw new error("Producto no encontrado");
      }

      //busco si existe el producto en el carrito
      const existProduct = myCart.products.findIndex(
        (product) => product.productId === pid
      );
      if (existProduct === -1) {
        myCart.products.push({ productId: pid, quantity: 1 });
        console.log("Producto agregado al Carrito");
      } else {
        myCart.products[existProduct].quantity += 1;
        console.log("Se agregó una unidad del producto al Carrito");
      }

      await this.updateCartFile(myCart);
      return myCart;
    } catch (error) {
      throw new Error(
        "Error al agregar el producto al carrito de compras. " + error.message
      );
    }
  }
}

export default CartManager;

// Sector de pruebas ----- node src/managers/cartManager.js
//const cartManager = new CartManager("./src/db/carts.json");

//Funtion getAllCarts
//const carts = await cartManager.getAllCarts();
//console.table(carts);

//Funtion newCart
//await cartManager.newCart();

//Funtion getCartById
/* const myCart = await cartManager.getCartById(
  "f40648ad-9748-47d8-8698-9dc7216b2045"
);
console.log(myCart); */
/* const myCart = await cartManager.getCartById("f");
console.log(myCart); */

//Funtion addProduct
//await cartManager.addProduct("2209c67b-f4b4-44eb-baec-ae9f545e64f8", "2");
