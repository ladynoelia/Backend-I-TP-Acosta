const socket = io();

socket.on("Products data", (products) => {
  /* console.log("Products payload:", products);
  console.log("Tipo:", typeof products);
  console.log("Es array?:", Array.isArray(products)); */

  const productsBox = document.getElementById("productsBox");
  productsBox.innerHTML = "";
  products.forEach((data) => {
    productsBox.innerHTML += `
        <div class="col">
          <div class="card h-100" card>
            <img src="${data.thumbnail}" class="card-img-top" alt="${data.title}"/>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${data.title}</h5>
              <p class="card-text">Precio: $${data.price}</p>
              <p class="card-text">Categoría: ${data.category}</p>
              <p class="card-text">Descripción: ${data.description}</p>
              <p class="card-text">Stock: ${data.stock}</p>
              <button class=" btn btn-vermas" id= "${data.id}">Eliminar</button>
            </div>
          </div>
        </div>
    `;
  });
});

const formNewProduct = document.getElementById("addNewProduct");
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
    console.error("❌ Error al enviar:", error);
  }
});
