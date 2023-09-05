document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("producto");
  const apiUrl = `http://localhost:1337/api/products/${productId}?populate=*`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const product = data.data;
      const productListElement = document.getElementById("productPage");
      const cartItemsList = document.getElementById("cartItems");

      function formatearNumeroConPuntos(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      const productName = product.attributes.productName;
      const description = product.attributes.description;
      const price = product.attributes.price;
      const precioFormateado = formatearNumeroConPuntos(price);
      const sku = product.attributes.sku;
      const stock = product.attributes.stock;
      const images = product.attributes.imagen.data;
      const imagenPrincipal = product.attributes.imagen.data[0].attributes.url;
      const tamanos = product.attributes.tamanos.data;

      const productElement = document.createElement("div");
      productElement.innerHTML = `
        <div class="productBox pdp">
          <div class="slider-container">
            <div class="slider"></div>
            <div class="slider-btn prev-btn">&lt;</div>
            <div class="slider-btn next-btn">&gt;</div>
          </div>
          <div class="productInfo">
            <p class="skuName">SKU: ${sku}</p>
            <h1 class="productName">${productName}</h1>
            <p>${description}</p>
            <p class="price">$${precioFormateado}</p>
            <label for="sizeSelector">Talle:</label>
            <select id="sizeSelector"></select>
            <div class="contBuy">
              <input type="number" id="quantityInput" value="1" min="1">
             
              <button id="addToCartBtn">Agregar al carrito</button>
            </div>
          </div>
        </div>
      `;

      const sliderContainer = productElement.querySelector(".slider");
      const prevBtn = productElement.querySelector(".prev-btn");
      const nextBtn = productElement.querySelector(".next-btn");
      const quantityInput = productElement.querySelector("#quantityInput");
      const addToCartBtn = productElement.querySelector("#addToCartBtn");

      setTimeout(() => {
        tamanos.forEach((talle) => {
          const sizeSelector = document.getElementById("sizeSelector");
          const sizeOption = document.createElement("option");
          sizeOption.value = talle.attributes.Talle;
          sizeOption.textContent = talle.attributes.Talle;
          sizeSelector.appendChild(sizeOption);
        });
      }, 1000);

      images.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = `http://localhost:1337${image.attributes.url}`;
        imgElement.style.maxWidth = "100%";
        sliderContainer.appendChild(imgElement);
      });

      function updateArrowVisibility() {
        prevBtn.style.display = images.length > 1 ? "block" : "none";
        nextBtn.style.display = images.length > 1 ? "block" : "none";
      }

      let slideIndex = 0;

      function updateSlidePosition() {
        sliderContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
      }

      function updateSlideIndex(increment) {
        slideIndex = (slideIndex + increment + images.length) % images.length;
        updateSlidePosition();
        updateArrowVisibility();
      }

      prevBtn.addEventListener("click", () => {
        updateSlideIndex(-1);
      });

      nextBtn.addEventListener("click", () => {
        updateSlideIndex(1);
      });

      const btnCart = document.getElementById("btnCart");
      const btnCartClose = document.getElementById("closeCart");
      const cart = document.getElementById("cart");
      btnCart.addEventListener("click", () => {
        cart.classList.add("show");
        updateCartView();
        document.body.style.overflow = "hidden";
      });

      btnCartClose.addEventListener("click", () => {
        cart.classList.remove("show");
        updateCartView();
        document.body.style.overflow = "auto";
      });

      function formatearNumeroConPuntos(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      function updateCartView() {
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
            <div class="prdCartInfo">            
            <h3>${item.name}</h3>
            Cantidad: ${item.quantity} <br>
            Talle: ${item.size}<br>
            Precio: <b>$${precioFormateado}</b>
            <button class="removeBtn" data-id="${item.id}">Eliminar</button> </div>
            </div>
            `;
          cartItemsList.appendChild(listItem);

          total += precioTotal; // Actualiza el total
        });

        const cartTotalElement = document.getElementById("cartTotal");
        const totalFormateado = formatearNumeroConPuntos(total); // Formatea el total
        cartTotalElement.textContent = `Total: $${totalFormateado}`; // Actualiza el elemento de total

        const cantcartItems = JSON.parse(localStorage.getItem("cart")).length;
        const itemsCart = document.getElementById("itemsCart");
        itemsCart.innerHTML = cantcartItems;
      }

      // Event listener para eliminar productos del carrito
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

      addToCartBtn.addEventListener("click", () => {
        const selectedQuantity = parseInt(quantityInput.value);
        const selectedSize = sizeSelector.value;
        if (!isNaN(selectedQuantity) && selectedQuantity > 0) {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existingProductIndex = cart.findIndex(
            (item) => item.id === productId && item.size === selectedSize
          );

          if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += selectedQuantity;
          } else {
            cart.push({
              id: productId,
              name: productName,
              price: price,
              quantity: selectedQuantity,
              imageUrl: `http://localhost:1337${imagenPrincipal}`,
              size: selectedSize,
            });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartView();
          document.getElementById("cart").classList.add("show");
        }
      });

      updateArrowVisibility();
      updateCartView();
      productListElement.appendChild(productElement);
      updateSlidePosition();
    })
    .catch((error) => console.log(error));
});
