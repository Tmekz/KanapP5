const cartItems = document.getElementById("cart__items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const h1Element = document.querySelector("h1");
const cartSection = document.querySelector("section.cart");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
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
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity} data-product-id="${product.id}">
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

// Création d'une fonction pour afficher un message si le panier est vide
const emptyCart = () => {
  h1Element.textContent = "Votre panier est vide";
  cartSection.style.display = "none";
};

// Création d'une fonction pour afficher la quantité totale des produits
const displayTotalQuantity = () => {
  let total = 0;
  for (let i = 0; i < produitSaved.length; i++) {
    total += parseInt(produitSaved[i].quantity);
    totalQuantity.textContent = parseInt(total);
  }
};

// Création d'une fonction pour mettre à jour la quantité dans le local storage et dans l'affichage
const updateQuantityItems = () => {
  const itemsQuantity = document.querySelectorAll(".itemQuantity");
  itemsQuantity.forEach((input) => {
    input.addEventListener("change", (event) => {
      const productId = event.target.dataset.productId;
      const newQuantity = parseInt(event.target.value);
      produitSaved = produitSaved.map((product) => {
        if (product.id === productId) {
          product.quantity = newQuantity;
        }
        return product;
      });
      displayTotalQuantity();
      displayTotalPrice();
      localStorage.setItem("product", JSON.stringify(produitSaved));
    });
  });
};

// Création d'une fonction pour afficher le prix total
const displayTotalPrice = () => {
  totalPrice.textContent = calculateTotalPrice();
};

// Création d'une fonction pour mettre à jour le prix total
const calculateTotalPrice = () => {
  let totalPrice = 0;
  for (let i = 0; i < produitSaved.length; i++) {
    const product = produitSaved[i];
    totalPrice += product.price * product.quantity;
  }
  return totalPrice;
};

// Création d'une fonction pour vérifier que les quantités tappées soient bien entre 1 et 100 (pas de virgules ou points et pas de nombre négatif)
const controlQuantity = () => {
  const itemsQuantity = document.querySelectorAll(".itemQuantity");
  itemsQuantity.forEach((input) => {
    input.addEventListener("keyup", (e) => {
      if (input.value != null) {
        if (input.value <= 0) {
          input.value = 1;
        }
        if (input.value > 100) {
          input.value = 100;
        }
      }
    });
    input.addEventListener("keydown", (event) => {
      const forbiddenKeys = [".", ",", "-", "+"];
      if (forbiddenKeys.includes(event.key)) {
        event.preventDefault();
      }
    });
  });
};

const deleteItem = () => {
  const deleteItemElement = document.querySelectorAll(".deleteItem");

  // Ajouter un gestionnaire d'événements à deleteItemElement
  deleteItemElement.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("test test");
    });
  });

  // // Création d'une fonction pour supprimer un produit du panier
  // const deleteCartItem = (productId) => {
  //   produitSaved = produitSaved.filter((product) => product.id !== productId);
  //   localStorage.setItem("product", JSON.stringify(produitSaved));
  //   mapLocalStorage(); // Mettre à jour l'affichage des produits
  //   displayTotalQuantity(); // Mettre à jour la quantité totale
  //   displayTotalPrice(); // Mettre à jour le prix total
  // };

  // deleteItemElement.addEventListener("click", (event) => {
  //   const cartItem = event.target.closest(".cart__item");
  //   if (cartItem) {
  //     const productId = cartItem.dataset.id;
  //     deleteCartItem(productId);
  //   }
  // });
};
// Création d'une fonction qui joue les différentes fonctions au chargement de la page
const launchPage = async () => {
  if (produitSaved == null) {
    emptyCart();
  } else {
    await mapLocalStorage();
    displayTotalQuantity();
    displayTotalPrice();
    updateQuantityItems();
    controlQuantity();
    deleteItem();
  }
};

window.addEventListener("load", launchPage);
