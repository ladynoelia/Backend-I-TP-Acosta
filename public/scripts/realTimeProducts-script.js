const socket = io();

socket.on("Products data", (products) => {
  console.log("Products payload:", products);
  console.log("Tipo:", typeof products);
  console.log("Es array?:", Array.isArray(products));

  const productsBox = document.getElementById("productsBox");
  productsBox.innerHTML = "";
  products.forEach((data) => {
    productsBox.innerHTML += `
    <div>
    <img src="${data.thumbnail}" alt="${data.title}"/>
    <h2>${data.title}</h2>
    <h3>Precio: $${data.price}</h3>
    <h3>Categoria: ${data.category}</h3>
    <h3>Descripción: ${data.description}</h3>
    <h3>Stock: ${data.stock}</h3>
    <button id= "${data.id}">Eliminar</button> </div>
    `;
  });
});

const formNewProduct = document.getElementById("addNewProduct");
formNewProduct.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: e.target.title.value,
    description: e.target.description.value,
    code: e.target.code.value,
    price: Number(e.target.price.value),
    status: e.target.status.value,
    stock: Number(e.target.stock.value),
    category: e.target.category.value,
    thumbnail: e.target.file.value,
  };
  socket.emit("New Product", newProduct);
});
