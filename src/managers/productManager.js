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
      throw new Error("Error al cargar la lista de productos.", error);
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
        throw new Error(
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
      if (!theProduct) {
        throw new Error("Producto no encontrado");
      } else {
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
        throw new Error(
          "Producto no encontrado o falta información para actualizarlo correctamente."
        );
      }
      if (!updates || Object.keys(updates).length === 0) {
        throw new Error(
          "Falta información para actualizar correctamente el producto."
        );
      }
      products[indexProduct] = { ...products[indexProduct], ...updates };
      await this.saveNewArray(products);
      console.log("Producto actualizado correctamente");
      return products;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProductById(pid) {
    try {
      const products = await this.getProducts();
      const existProduct = products.find((product) => product.id === pid);
      if (!existProduct) {
        throw new Error(
          "El producto que desea eliminar no se encuentra en la base de datos"
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

// Sector de pruebas ----- node src/managers/productManager.js
//const productManager = new ProductManager("src/db/products.json");

//Función getProducts
/* const allProducts = await productManager.getProducts();
console.log(allProducts); */

//Función addProduct
//await productManager.addProduct({ title: "Camisa", price: 4520, stock: 5 });
/* await productManager.addProduct({
  title: "Hitokage",
  description: "Aprox. Size: L: 14 cm, A: 12.7 cm, H: 17.80 cm",
  code: "",
  price: 4000,
  status: true,
  stock: 6,
  category: "Sekiguchi Pokemon",
  thumbnail: [
    "./src/assets/images/products/pokemon/004-1.png",
    "./src/assets/images/products/pokemon/004-2.jpg",
    "./src/assets/images/products/pokemon/004-3.jpg",
  ],
}); */

//Función getProductById
/* const productById = await productManager.getProductById("1");
console.log(productById); */
/* const productById = await productManager.getProductById("2");
console.log(productById); */

//Función updateProduct
/* await productManager.updateProduct("5a2d7fc4-7f8e-483c-9976-25baeb47a378", {
  title: "Camisa a rayas",
  price: 7500,
  stock: 8,
}); */
//await productManager.updateProduct("2", { status: false, stock: 0 });

//Función deleteProductById
//await productManager.deleteProductById("d5c1aa26-598d-42e9-9506-5b81d8fa21f0");
//await productManager.deleteProductById("2");
