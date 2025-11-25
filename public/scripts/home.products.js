const btnsAddToCart = document.getElementsByClassName("btn-add-cart");

async function searchForCart() {
  const savedCart = JSON.parse(localStorage.getItem("savedCart"));
  if (savedCart && savedCart.cid) {
    return savedCart.cid;
  }

  const res = await fetch("/api/carts/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  const newCid = data._id || data.cid || data.payload?._id;

  localStorage.setItem("savedCart", JSON.stringify({ cid: newCid }));
  return newCid;
}

for (const button of btnsAddToCart) {
  button.addEventListener("click", async (e) => {
    const pid = e.target.dataset.pid;

    try {
      const cid = await searchForCart();

      const res = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const resultado = await res.json();

      if (res.ok) {
        Toastify({
          text: `Agregaste un producto al Carrito con ID: ${cid}`,
          duration: 3000,
          position: "center",
          gravity: "top",
        }).showToast();
      } else {
        alert(resultado.message || "Error al agregar el producto");
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al agregar el producto al carrito",
      });
    }
  });
}
