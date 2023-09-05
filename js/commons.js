const header = document.getElementById("main-header");
header.innerHTML = `
    <div class="container">
        <div class="logo">
            <a href="file:///C:/Users/usuario/Desktop/desk/strapi/repo/strapi-shop-frontend/index.html">
                <img src="file:///C:/Users/usuario/Desktop/desk/strapi/repo/strapi-shop-frontend/img/logo.png">
            </a>
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

