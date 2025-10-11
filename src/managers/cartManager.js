import fs from "fs/promises";
import crypto from "crypto";
import ProductManager from "./productManager.js";

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
      console.log("Error al cargar la lista de carritos.", error);
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

  async lookForCart(cid) {
    try {
      const carts = await this.getAllCarts();
      const myCart = carts.find((cart) => cart.id === cid);
      if (myCart) {
        return myCart;
      } else {
        console.log("No existe el carrito en la base de datos");
      }
    } catch (error) {
      throw new Error("No se encontró el carrito de compras. " + error.message);
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
  async showCart(cid) {
    try {
      const myCart = await this.lookForCart(cid);
      if (myCart) {
        console.log(`Los productos de tu carrito son ${myCart.products}`);
        return myCart;
      }
    } catch (error) {
      throw new Error(
        "Error al mostrar los productos del carrito de compras. " +
          error.message
      );
    }
  }

  //POST /:cid/product/:pid: Debe agregar el producto al arreglo products del carrito
  // seleccionado, utilizando el siguiente formato:
  //▪ product: Solo debe contener el ID del producto.
  //quantity: Debe contener el número de ejemplares de dicho producto (se agregará de uno en uno).
  //Si un producto ya existente intenta agregarse, se debe incrementar el campo  quantity de dicho producto.
  async addProduct(cid, pid) {
    try {
      const carts = await this.getAllCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cid);
      if (cartIndex === -1) {
        console.log("Carrito no encontrado");
      }
      const myCart = carts[cartIndex];

      const productManager = new ProductManager("./src/db/products.json");
      const addedProduct = await productManager.getProductById(pid);
      if (!addedProduct) {
        console.log("Producto no encontrado");
      }
      const existProduct = myCart.products.find(
        (product) => product.id === pid
      );
      if (!existProduct) {
        myCart.products.push({ product: pid, quantity: 1 });
      } else {
        existProduct.quantity += 1;
      }

      carts[cartIndex] = myCart;
      await this.updateCartFile(carts);
    } catch (error) {
      throw new Error(
        "Error al agregar el producto al carrito de compras. " + error.message
      );
    }
  }
}

export default CartManager;

// Sector de pruebas ----- node src/managers/cartManager.js
const cartManager = new CartManager("./src/db/carts.json");

//Funtion newCart
//await cartManager.newCart();

//Funtion showCart
//await cartManager.showCart("9fd69e54-0c65-4937-a933-4c35d91df60");

//Funtion addProduct
await cartManager.addProduct("884e2bd4-c2c8-43ed-bc1c-a67994aaf424");
