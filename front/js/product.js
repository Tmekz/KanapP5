const colors = document.getElementById("colors");
const itemImg = document.querySelector(".item__img");
const quantity = document.getElementById("quantity");

/**
 * Récupération de l'ID du produit via l'url cliqué
 */
let productId = new URLSearchParams(window.location.search).get("id");

/**
 * Création d'une fonction pour afficher les détails du produit en fonction de son ID
 */
const getProduct = async () => {
  await callApi("http://localhost:3000/api/products/" + productId);
  itemImg.innerHTML = `
  <img src="${fetchData.imageUrl}" alt="${fetchData.altTxt}">`;
  title.textContent = fetchData.name;
  price.textContent = fetchData.price;
  description.textContent = fetchData.description;

  // On va afficher ici les différentes couleurs du produit
  for (let i = 0; i < fetchData.colors.length; i++) {
    colorsChoice(fetchData.colors[i]);
    quantity.value = "1";
  }
};

/**
 * Création d'une fonction qui va créer les options de couleur dans la liste déroulante 
 */
const colorsChoice = (choice) => {
  const addColorOption = document.createElement("option");
  colors.appendChild(addColorOption);
  addColorOption.value = choice;
  addColorOption.textContent = choice;
};

/**
 * Création d'une fonction pour vérifier les quantités entre 1 et 100
 */
const controlQuantity = () => {
  const quantityValue = document.getElementById("quantity").value;
  if (quantityValue != null) {
    if (quantityValue < 0) {
      document.getElementById("quantity").value = 1;
    }
    if (quantityValue > 100) {
      document.getElementById("quantity").value = 100;
    }
  }
};

/**
 * Jouer la fonction de control quantité
 */
quantity.addEventListener("keyup", controlQuantity);
quantity.addEventListener("keydown", (event) => {
  // Empêche la saisie de certains caractères
  const forbiddenKeys = [".", ",", "-", "+"];
  if (forbiddenKeys.includes(event.key)) {
    event.preventDefault();
  }
});

/**
 * Création d'une fonction pour vérifier qu'une couleur soit choisie sinon message d'alerte
 */
const controlColor = () => {
  const colorsValue = colors.value;
  if (colorsValue == "") {
    window.alert("Merci de choisir une couleur avant d'ajouter au panier");
  }
};

/**
 * Création d'une fonction de création d'un message de confirmation quand l'utilisateur click sur le bouton "Ajouter au panier"
 */
const confirmationAddCart = () => {
  addToCart.textContent = "Panier ajouté !";
  setTimeout(() => {
    addToCart.textContent = "Ajouter au panier";
  }, 450);
};

/**
 * Création d'un évènnement pour lancer la sauvegarde du panier lors du click sur le bouton "ajouter au panier"
 */
addToCart.addEventListener("click", () => {
  const quantityValue = quantity.value;
  const colorsValue = colors.value;
  if (quantityValue <= 0 || quantityValue > 100) {
    controlQuantity();
  } else if (colorsValue == "") {
    controlColor();
  } else {
    saveToCart();
    confirmationAddCart();
  }
});

/**
 * Création d'une fonction pour envoyer dans le local storage les donnnées du panier
 */
const saveToCart = () => {
  const quantityValue = parseInt(quantity.value);
  const colorsValue = colors.value;
  let produitSaved = JSON.parse(localStorage.getItem("product"));

  let optionsProduct = {
    id: productId,
    quantity: quantityValue,
    color: colorsValue,
  };

  if (produitSaved) {
    // Création d'une fonction pour rechercher si un produit existe déjà avec même ID + couleur
    const existingProduct = produitSaved.find(
      (product) => product.id === productId && product.color === colorsValue
    );

    if (existingProduct) {
      // Création d'une fonction pour ajuster automatiquement la quantité du produit à 100 si la commande dépasse 100 exemplaires
      const newQuantity = existingProduct.quantity + quantityValue;

      if (newQuantity > 100) {
        window.alert(
          "Vous ne pouvez pas commander plus de 100 exemplaires d'un même produit. La quantité du panier sera automatiquement ajustée à 100."
        );
        existingProduct.quantity = 100; // Ajuste automatiquement la quantité du local storage à 100
      } else {
        existingProduct.quantity = newQuantity;
      }
    } else {
      produitSaved.push(optionsProduct);
    }
  } else {
    produitSaved = [optionsProduct];
  }

  localStorage.setItem("product", JSON.stringify(produitSaved));
};


// Création d'un event pour initier getProduct() au chargement de la page
window.addEventListener("onload", getProduct());
