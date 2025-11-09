const socket = io();

//Elementos del html ---------------------------------------------
const productsBox = document.getElementById("productsBox");
const formNewProduct = document.getElementById("addNewProduct");

//Muestra los productos en la base de datos ---------------------------------------------
socket.on("Products data", (products) => {
  renderProducts(products);
});

function renderProducts(products) {
  productsBox.innerHTML = "";
  products.forEach((product) => {
    productsBox.innerHTML += `
        <div class="col">
          <div class="card h-100" card>
            <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}"/>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">Precio: $${product.price}</p>
              <p class="card-text">Categoría: ${product.category}</p>
              <p class="card-text">Descripción: ${product.description}</p>
              <p class="card-text">Stock: ${product.stock}</p>
              <button class=" btn btn-delete" data-id="${product.id}">Eliminar</button>
            </div>
          </div>
        </div>
    `;
  });
  deleteBtns();
}
//Botón Eliminar en las cards de productos ---------------------------------------------
function deleteBtns() {
  const deleteBtns = document.querySelectorAll(".btn-delete");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const idProduct = event.target.dataset.id;
      try {
        const response = await fetch(`/api/products/${idProduct}`, {
          method: "DELETE",
        });
        console.log("Producto eliminado correctamente");
        if (!response.ok) {
          console.error("Error al intentar borrar el producto:", error);
        }
      } catch (error) {
        console.error("Error al enviar:", error);
      }
    });
  });
}

//Formulario para agregar productos ---------------------------------------------
formNewProduct.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formNewProduct);
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      console.log("✅", result.message);
    }
  } catch (error) {
    console.error("Error al enviar:", error);
  }
});
