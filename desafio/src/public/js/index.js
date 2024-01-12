const socket = io();


document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();


      const formData = new FormData(form);


      const post = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        thumbnails: formData.get("thumbnails"),
        code: formData.get("code"),
        stock: formData.get("stock"),
      }


      socket.emit("post_send", post);
    });
  }
});
  

socket.on("productos", (data) => {
  const products = document.querySelector("#products");
  products.innerHTML = "";


  data.forEach((producto) => {
    const productElement = document.createElement("div");
    productElement.classList.add("card", "m-2", "col-md-4", "bg-light", "border", "border-primary");
    productElement.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${producto.title}</h5>
        <p class="card-text">Descripción: ${producto.description}</p>
        <p class="card-text">Precio: $${producto.price}</p>
        <p class="card-text">Código: ${producto.code}</p>
        <p class="card-text">Stock: ${producto.stock}</p>
        <p class="card-text">Fotos: ${producto.thumbnails}</p>
        <p class="card-text">Status: ${producto.status}</p>
        <p class="card-text">ID: ${producto._id}</p>
        <button class="btn btn-danger" onclick="deleteProduct('${producto._id}')">Eliminar</button>
      </div>
    `;
    products.appendChild(productElement);
  });
});



function deleteAndReload(productId) {
  deleteProduct(productId);


  reloadPage();
}


function reloadPage() {
  location.reload();
}






function deleteProduct(_id) {
  socket.emit("delete_product", _id);
}


socket.on("connect_error", (error) => {
  console.error("Error de conexión con el servidor:", error);
});