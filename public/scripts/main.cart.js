document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchId");
  const cidInput = document.getElementById("cid");
  const modalBody = document.querySelector("#exampleModalToggle2 .modal-body");

  searchBtn.addEventListener("click", async () => {
    const cid = cidInput.value.trim();

    if (!cid) {
      modalBody.innerHTML =
        "<p class='text-danger'>Por favor ingrese un ID válido.</p>";
      return;
    }

    try {
      const res = await fetch(`/api/carts/${cid}`);
      const data = await res.json();

      if (!res.ok) {
        modalBody.innerHTML = `<p class="text-danger">${data.message}</p>`;
        return;
      }

      // Si el carrito no tiene productos
      if (!data.payload || data.payload.length === 0) {
        modalBody.innerHTML = `<p class="text-center">Todavía no hay productos en este carrito 🛒</p>`;
        return;
      }

      // Cards
      let html = `<div class="container"><div class="row gy-3">`;

      data.payload.forEach((item) => {
        const product = item.product;

        // tomo la primera imagen del array thumbnail
        const img = product.thumbnail?.[0] || "/images/no-image.png";

        html += `
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="row g-0">
                  <div class="col-md-4 d-flex align-items-center">
                    <img 
                      src="${img}"
                      class="img-fluid rounded-start" 
                      alt="${product.title}"
                      style="object-fit: cover; height: 150px; width: 100%"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">${product.title}</h5>
                      <p class="card-text mb-1"><strong>Precio:</strong> $${product.price}</p>
                      <p class="card-text mb-1"><strong>Cantidad:</strong> ${item.quantity}</p>
                      <p class="card-text">
                        <small class="text-body-secondary">ID: ${product._id}</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
      });

      html += `</div></div>`;
      modalBody.innerHTML = html;
    } catch (error) {
      modalBody.innerHTML = `<p class="text-danger">Error al cargar el carrito.</p>`;
      console.error(error);
    }
  });
});
