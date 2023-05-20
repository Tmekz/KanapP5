const cartItems = document.getElementById("cart__items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const h1Element = document.querySelector("h1");
const cartSection = document.querySelector("section.cart");

let produitSaved = JSON.parse(localStorage.getItem("product"));

// Création d'une fonction pour afficher les produits enregistrés dans le local storage
const mapLocalStorage = () => {
  cartItems.innerHTML = produitSaved
    .map(
      (product) =>
        `
    <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
    <div class="cart__item__img">
    <img src=${product.imageUrl} alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
`
    )
    .join("");
};

// Création d'une fonction qui va checker si le panier est vide et afficher un message.
const displayLocalStorage = () => {
  if (produitSaved == null) {
    h1Element.textContent = "Votre panier est vide";
    cartSection.style.display = "none";
  } else {
    mapLocalStorage();
  }
};

displayLocalStorage();
