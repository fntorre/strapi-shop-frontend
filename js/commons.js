const header = document.getElementById("main-header");
header.innerHTML = `
    <div class="container">
        <div class="logo">
            <a href="file:///C:/Users/usuario/Desktop/desk/strapi/repo/strapi-shop-frontend/index.html">
                <img src="file:///C:/Users/usuario/Desktop/desk/strapi/repo/strapi-shop-frontend/img/logo.png">
            </a>
        </div>
        <div class="search-container">
        <input type="text" id="searchInput" placeholder="Buscar productos...">
    <div id="searchResults"></div>
      </div>      
        <div id="btnCart">Mi carrito<span id="itemsCart">0</span></div>  
    <div id="cart">
    <div id="closeCart">Cerrar</div>
    <h2>Carrito de Compras</h2>
    <ul id="cartItems"></ul>
    <p id="cartTotal">Total: $0</p> <!-- Nuevo elemento para mostrar el total -->
  </div>
    </div>
    <div id="shadowbg"></div>
`;

const footer = document.getElementById("footer");
footer.innerHTML = `
    <div class="container-footer">
    <div class="footer-bottom">
    <p>Foxland Strapi Shop 2023</p>    
    </div>
    </div>
`;


const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Función para realizar la búsqueda de productos
function searchProducts(query) {
  const apiUrl = `http://localhost:1337/api/products/?filters[productName][$contains]=${query}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const products = data.data;

      if (products.length === 0) {
        searchResults.innerHTML = "No se encontraron productos.";
      } else {
        searchResults.innerHTML = ""; // Limpiar resultados anteriores

        products.forEach((product) => {
          function formatearNumeroConPuntos(numero) {
            return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
          const productName = product.attributes.productName;
          const productDescription = product.attributes.descripcionCorta;
          const productPrice = product.attributes.price;
          const precioFormateado = formatearNumeroConPuntos(productPrice)
          const productLink = `file:///C:/Users/usuario/Desktop/desk/strapi/repo/strapi-shop-frontend/product.html?producto=${product.id}`; 

          const resultItem = document.createElement("div");
          resultItem.className = "itemSearchResult";
          resultItem.innerHTML = `<a href="${productLink}">${productName}</a><p>${productDescription}</p><p>$${precioFormateado}</p>`;
          searchResults.appendChild(resultItem);
        });
      }
    })
    .catch((error) => console.error(error));
}

// Evento input en el campo de búsqueda
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query !== "") {
    searchProducts(query);
  } else {
    searchResults.innerHTML = ""; // Limpiar resultados si el campo está vacío
  }
});

// Función para cerrar los resultados de búsqueda
function closeSearchResults() {
    searchResults.style.display = "none";
  }
  
  // Evento input en el campo de búsqueda
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query !== "") {
      searchResults.style.display = "block"; // Mostrar resultados al escribir
      searchProducts(query);
    } else {
      searchResults.style.display = "none"; // Ocultar resultados si el campo está vacío
    }
  });
  
  // Evento click en cualquier parte del documento
  document.addEventListener("click", (event) => {
    // Verificar si el clic no ocurrió dentro del bloque de búsqueda ni dentro de los resultados
    if (
      event.target !== searchInput &&
      event.target !== searchResults &&
      !searchResults.contains(event.target)
    ) {
      closeSearchResults(); // Cerrar resultados de búsqueda
    }
  });


