import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateId() {
    return crypto.randomUUID();
  }

  async getProducts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);
      return products;
    } catch (error) {
      console.log("Error al cargar la lista de productos.", error);
    }
  }

  async saveNewArray(newArray) {
    try {
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(newArray, null, 2),
        "utf-8"
      );
    } catch (error) {
      throw new Error(
        "Error al actualizar el array de productos. " + error.message
      );
    }
  }

  async addProduct(newProduct) {
    try {
      const products = await this.getProducts();
      const existProduct = products.find(
        (product) => product.title === newProduct.title
      );
      if (existProduct) {
        console.log(
          "El producto que desea agregar ya existe en la base de datos"
        );
      } else {
        const newId = this.generateId();
        const product = { id: newId, ...newProduct };
        products.push(product);
        await this.saveNewArray(products);
        console.log("Producto agregado:", product);
        return products;
      }
    } catch (error) {
      throw new Error("Error al agregar el producto: " + error.message);
    }
  }

  async getProductById(pid) {
    try {
      const products = await this.getProducts();
      const theProduct = products.find((product) => product.id === pid);
      if (theProduct) {
        return theProduct;
      }
    } catch (error) {
      throw new Error("Error al buscar el producto: " + error.message);
    }
  }

  async updateProduct(pid, updates) {
    try {
      const products = await this.getProducts();
      const indexProduct = products.findIndex((product) => product.id === pid);
      if (indexProduct === -1) {
        console.log("Producto no encontrado");
      } else {
        products[indexProduct] = { ...products[indexProduct], ...updates };
        await this.saveNewArray(products);
        console.log("Producto actualizado correctamente");
        return products;
      }
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProductById(pid) {
    try {
      const products = await this.getProducts();
      const existProduct = products.find((product) => product.id === pid);
      if (!existProduct) {
        console.log(
          "El producto que desea eliminar no existe en la base de datos"
        );
      } else {
        const filteredProducts = products.filter(
          (product) => product.id !== pid
        );
        await this.saveNewArray(filteredProducts);
        console.log("Producto eliminado correctamente");
        return filteredProducts;
      }
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}

export default ProductManager;

// Sector de pruebas ----- node productManager.js
//const productManager = new ProductManager("./db/products.json");

//Función getProducts
/* const allProducts = await productManager.getProducts();
console.log(allProducts); */

//Función addProduct
//await productManager.addProduct({ title: "Camisa", price: 4520, stock: 5 });

//Función getProductById
/* const productById = await productManager.getProductById("1");
console.log(productById); */

//Función updateProduct
/* await productManager.updateProduct("5a2d7fc4-7f8e-483c-9976-25baeb47a378", {
  title: "Camisa azul rayada",
  price: 6500,
  stock: 5,
}); */

//Función deleteProductById
//await productManager.deleteProductById("78187783-bb02-4e9b-b5fc-92ce1eace5b4");
