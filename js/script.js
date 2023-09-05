const apiUrl = "http://localhost:1337/api/products?populate=*";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const products = data.data;
    const productListElement = document.getElementById("productList");

    function formatearNumeroConPuntos(numero) {
      return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    products.forEach((product) => {
      const productName = product.attributes.productName;
      const descripcionCorta = product.attributes.descripcionCorta;
      const price = product.attributes.price;
      const precioFormateado = formatearNumeroConPuntos(price);
      const sku = product.attributes.sku;
      const stock = product.attributes.stock;
      const images = product.attributes.imagen.data;
      const id = product.id;

      const productElement = document.createElement("div");
      productElement.innerHTML = `
        <div class="productBox">
       <div class="slider-container">
       <div class="slider"></div>
            <div class="slider-btn prev-btn">&lt;</div>
            <div class="slider-btn next-btn">&gt;</div>
          </div>
          <div class="productInfo">
          <p class="skuName">SKU: ${sku}</p>
            <h2 class="productName">${productName}</h2>
            <p>${descripcionCorta}</p>
            <p class="price">$${precioFormateado}</p>
            <a class="more" href="">Ver Más</a>
          </div>
        </div>
      `;

      const verMasLink = productElement.querySelector("a"); // Selecciona el enlace "Ver Más"

      verMasLink.addEventListener("click", (event) => {
        let url = "file:///C:/Users/usuario/Desktop/desk/strapi/repo/strapi-shop-frontend";
        event.preventDefault(); // Evita el comportamiento de enlace predeterminado
        const productUrl = url + `/product.html?producto=${id}`;
        window.location.href = productUrl; // Navega a la página de detalles del producto
      });

      const sliderContainer = productElement.querySelector(".slider");
      const prevBtn = productElement.querySelector(".prev-btn");
      const nextBtn = productElement.querySelector(".next-btn");

      images.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = `http://localhost:1337${image.attributes.url}`;
        imgElement.style.maxWidth = "100%";
        sliderContainer.appendChild(imgElement);
      });

      function updateArrowVisibility() {
        prevBtn.style.display = slides.length > 1 ? "block" : "none";
        nextBtn.style.display = slides.length > 1 ? "block" : "none";
      }

      let slideIndex = 0;
      const slides = sliderContainer.querySelectorAll("img");

      function updateSlidePosition() {
        sliderContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
      }

      function updateSlideIndex(increment) {
        slideIndex = (slideIndex + increment + slides.length) % slides.length;
        updateSlidePosition();
        updateArrowVisibility();
      }

      prevBtn.addEventListener("click", () => {
        updateSlideIndex(-1);
      });

      nextBtn.addEventListener("click", () => {
        updateSlideIndex(1);
      });

      updateArrowVisibility();

      productListElement.appendChild(productElement);

      updateSlidePosition();
    });
  })
  .catch((error) => console.log(error));

const sliders = "http://localhost:1337/api/sliders?populate=*";

fetch(sliders)
  .then((response) => response.json())
  .then((data) => {
    const imagenes = data.data;
    console.log(imagenes);

    const container = document.getElementById("sliderPrincipal");
    let contenido = "";

    imagenes.forEach((imagen) => {
      const imageUrl = imagen.attributes.imagen.data.attributes.url;
      const imageLink = imagen.attributes.imagenLink;
      contenido += `<div class="swiper-slide"><a href=${imageLink}><img src="http://localhost:1337${imageUrl}" /></a></div>`;
    });

    container.innerHTML = `<div class="swiper-container">
        <div class="swiper-wrapper">${contenido}</div>
        <div class="swiper-pagination"></div>
  <div class="swiper-scrollbar"></div>
      </div>`;

    // Inicializar Swiper
    new Swiper(".swiper-container", {
      loop: true, // Repetir el slider
      direction: "horizontal",
      pagination: {
        el: ".swiper-pagination",
        clickable: true, // Permitir hacer clic en la paginación para navegar
      },

      scrollbar: {
        el: ".swiper-scrollbar",
      },
    });
  });

// Asegurarse de que el código se ejecute después de que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const btnCart = document.getElementById("btnCart");
  const btnCartClose = document.getElementById("closeCart");
  const cart = document.getElementById("cart");

  // Verificar que los elementos existan antes de agregar eventos
  if (btnCart && btnCartClose && cart) {
    btnCart.addEventListener("click", () => {
      cart.classList.add("show");
      updateCartView();
      document.body.style.overflow = "hidden";
    });

    const cantcartItems = JSON.parse(localStorage.getItem("cart")).length;
    const itemsCart = document.getElementById("itemsCart");
    itemsCart.innerHTML = cantcartItems;

    btnCartClose.addEventListener("click", () => {
      cart.classList.remove("show");
      updateCartView();
      document.body.style.overflow = "auto";
    });
  } else {
    console.error("Uno o más elementos no se encontraron en el DOM.");
  }

  function formatearNumeroConPuntos(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function updateCartView() {
    const cartItemsList = document.getElementById("cartItems");

    if (cartItemsList) {
      cartItemsList.innerHTML = "";

      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      let total = 0; // Inicializa el total en 0

      cartItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        const precioTotal = item.price * item.quantity; // Calcula el precio total
        const precioFormateado = formatearNumeroConPuntos(precioTotal); // Formatea el precio

        listItem.innerHTML = `
        <div class="rowCart">
        
        <img src="${item.imageUrl}" alt="${item.name}" width="100">
        <div class="prdCartInfo">            <h3>${item.name}</h3>
        Cantidad: ${item.quantity}  <br> Talle: ${item.size}<br> Precio: <b>$${precioFormateado}</b>
        <button class="removeBtn" data-id="${item.id}">Eliminar</button> </div>
        </div>
        `;
        cartItemsList.appendChild(listItem);

        total += precioTotal; // Actualiza el total
      });

      const cartTotalElement = document.getElementById("cartTotal");
      const totalFormateado = formatearNumeroConPuntos(total); // Formatea el total
      cartTotalElement.textContent = `Total: $${totalFormateado}`; // Actualiza el elemento de total

      cartItemsList.addEventListener("click", (event) => {
        if (event.target.classList.contains("removeBtn")) {
          const productIdToRemove = event.target.getAttribute("data-id");
          if (productIdToRemove) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = cart.filter(
              (item) => item.id !== productIdToRemove
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            updateCartView();
          }
        }
      });

      const cantcartItems = JSON.parse(localStorage.getItem("cart")).length;
      const itemsCart = document.getElementById("itemsCart");
      itemsCart.innerHTML = cantcartItems;
    } else {
      console.error("El elemento cartItems no se encontró en el DOM.");
    }
  }

  // Llamar a la función inicial para cargar los elementos en el carrito si es necesario
  updateCartView();
});
