const cartItems = document.getElementById("cart__items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const cartOrderForm = document.querySelector(".cart__order__form");
const h1Element = document.querySelector("h1");
const cartSection = document.querySelector("section.cart");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const formOrder = document.querySelector(".cart__order__form");
const formInputs = document.querySelectorAll(
  ` input[type="text"], input[type="email"] `
);
const emailRegex = /^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i;
const lettersRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s'-]{1,31}$/i;
const lettersNumbersRegex = /^(?=.*\d{5})[a-zA-Z0-9\s\,\'.À-ÖØ-öø-ÿ-]*$/;
let firstName, lastName, address, city, email;
let produitSaved = JSON.parse(localStorage.getItem("product"));
let fusionedData = [];
let mergedProduct = [];

/**
 * Création d'une fonction pour afficher un message si le panier est vide
 */
const emptyCart = () => {
  h1Element.textContent = "Votre panier est vide";
  cartSection.style.display = "none";
};

/**
 * Création d'une fonction pour créer un tableau qui fusionne les données du local storage + BDD en fonction de l'id produit
 */
const dataArrayFusion = () => {
  if (produitSaved != null) {
    produitSaved.forEach(function (item) {
      // Rechercher le produit correspondant à l'ID dans les données de la base de données
      let product = fetchData.find(function (productItem) {
        return productItem._id === item.id;
      });

      let mergedProduct = {
        id: item.id,
        quantity: item.quantity,
        color: item.color,
        name: product.name,
        price: product.price,
        altTxt: product.altTxt,
        imageUrl: product.imageUrl,
        description: product.description,
      };

      // Ajouter le produit fusionné au tableau fusionedData
      fusionedData.push(mergedProduct);
    });
  }
};

/**
 * Création d'une fonction pour afficher les produits du panier enregistrés dans le local storage
 */
const mapLocalStorage = () => {
  cartItems.innerHTML = fusionedData
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
        <p id="kaka">${product.price}€</p>
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

/**
 * Création d'une fonction pour afficher la quantité totale des articles
 */
const displayTotalQuantity = () => {
  let total = 0;
  for (let i = 0; i < produitSaved.length; i++) {
    total += parseInt(produitSaved[i].quantity);
    totalQuantity.textContent = parseInt(total);
  }
};

/**
 * Création d'une fonction pour afficher le prix total
 */
const displayTotalPrice = () => {
  let total = 0;
  for (let i = 0; i < produitSaved.length; i++) {
    total +=
      parseInt(fusionedData[i].price) * parseInt(produitSaved[i].quantity);
    totalPrice.textContent = parseInt(total)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
};

/**
 * Création d'une fonction pour mettre à jour la quantité dans le local storage et dans l'affichage
 */
const updateQuantityItems = () => {
  const itemsQuantity = document.querySelectorAll(".itemQuantity");
  itemsQuantity.forEach((input) => {
    input.addEventListener("change", (event) => {
      const itemId = input.closest(".cart__item").dataset.id;
      const itemColor = input.closest(".cart__item").dataset.color;
      const newQuantity = parseInt(input.value);

      // Mise à jour le local storage avec la nouvelle quantité
      produitSaved = produitSaved.map((product) => {
        if (product.id === itemId && product.color === itemColor) {
          product.quantity = newQuantity;
        }
        return product;
      });
      localStorage.setItem("product", JSON.stringify(produitSaved));

      // Mise à jour de l'affichage du prix et des quantitées
      displayTotalQuantity();
      displayTotalPrice();
    });
  });
};

/**
 * Création d'une fonction pour supprimer un élément au click
 */
const deleteItem = () => {
  const deleteItemElements = document.querySelectorAll(".deleteItem");

  deleteItemElements.forEach((button) => {
    button.addEventListener("click", (event) => {
      const cartItem = button.closest(".cart__item");
      const itemId = cartItem.dataset.id;
      const itemColor = cartItem.dataset.color;

      // Supprimer l'élément correspondant du local storage
      produitSaved = produitSaved.filter((product) => {
        return !(product.id === itemId && product.color === itemColor);
      });

      // Mettre à jour le localStorage
      if (produitSaved.length === 0) {
        // Si tous les éléments ont été supprimé, vider complètement le localStorage
        localStorage.removeItem("product");
        emptyCart(); // Appeler emptyCart si le localStorage est vide
      } else {
        // Sinon, mettre à jour le localStorage avec les éléments restants
        localStorage.setItem("product", JSON.stringify(produitSaved));

        // Supprimer l'élément de l'affichage
        cartItem.remove();

        // Mettre à jour l'affichage total de la quantité et du prix
        displayTotalQuantity();
        displayTotalPrice();
      }
    });
  });
};

/**
 * Création d'une fonction pour vérifier que les quantités tappées soient bien entre 1 et 100 (pas de virgules ou points et pas de nombre négatif)
 */
const controlQuantity = () => {
  const itemsQuantity = document.querySelectorAll(".itemQuantity");
  itemsQuantity.forEach((input) => {
    input.addEventListener("keyup", (event) => {
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

/**
 * Création d'une fonction qui regroupe la logique du checker form
 */
const errorDisplay = (tag, message, valid) => {
  const errorFormMessage = document.getElementById(tag + "ErrorMsg");

  if (!valid) {
    errorFormMessage.textContent = message;
  } else {
    errorFormMessage.textContent = "";
  }
};

/**
 * Création d'une fonction pour checker les inputs du formulaire et afficher un message d'érreur si besoin
 */
const checkForm = () => {
  const firstNameChecker = (value) => {
    if (value.length < 2 || value.length > 50 || !value.match(lettersRegex)) {
      errorDisplay(
        "firstName",
        "Le prénom doit mesurer entre 2 et 50 caractères et ne peut contenir aucuns chiffres ou caractères spéciaux"
      );
      firstName = null;
    } else {
      errorDisplay("firstName", "", true);
      firstName = value;
    }
  };
  const lastNameChecker = (value) => {
    if (value.length < 2 || value.length > 50 || !value.match(lettersRegex)) {
      errorDisplay(
        "lastName",
        "Le nom doit mesurer entre 2 et 50 caractères et ne peut contenir aucuns chiffres ou caractères spéciaux"
      );
      lastName = null;
    } else {
      errorDisplay("lastName", "", true);
      lastName = value;
    }
  };
  const adressChecker = (value) => {
    if (
      value.length < 10 ||
      value.length > 100 ||
      !value.match(lettersNumbersRegex)
    ) {
      errorDisplay(
        "address",
        "L'adresse doit contenir entre 10 et 100 caractères et ne peut contenir certains caractères spéciaux. De plus merci d'indiquer ici votre code postal."
      );
      address = null;
    } else {
      errorDisplay("address", "", true);
      address = value;
    }
  };
  const villeChecker = (value) => {
    if (value.length < 2 || value.length > 45 || !value.match(lettersRegex)) {
      errorDisplay(
        "city",
        "La ville doit mesurer entre 2 et 45 caractères et ne peut contenir aucuns chiffres ou caractères spéciaux. Merci d'indiquer votre code postal dans l'adresse."
      );
      city = null;
    } else {
      errorDisplay("city", "", true);
      city = value;
    }
  };

  const emailChecker = (value) => {
    if (!value.match(emailRegex)) {
      errorDisplay(
        "email",
        "L'email ne peut contenir d'accent et certains caractères spéciaux"
      );
      email = null;
    } else {
      errorDisplay("email", "", true);
      email = value;
    }
  };

  formInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      switch (event.target.id) {
        case "firstName":
          firstNameChecker(event.target.value);
          break;
        case "lastName":
          lastNameChecker(event.target.value);
          break;
        case "address":
          adressChecker(event.target.value);
          break;
        case "city":
          villeChecker(event.target.value);
          break;
        case "email":
          emailChecker(event.target.value);
          break;
        default:
          null;
      }
    });
  });
};

/**
 * Création d'une fonction pour submit la commande
 */
const submitForm = () => {
  formOrder.addEventListener("submit", (event) => {
    // event.preventDefault(); (si l'évaluateur veut voir la réponse du submit voir ligne 344)

    // Check si tous les champs du formulaire sont valides
    if (firstName && lastName && address && city && email) {
      // Création d'un objet avec les détails du client
      const contactForm = {
        contact: {
          firstName,
          lastName,
          address,
          city,
          email,
        },
        // Récupération des ID des produits commandés
        products: listIDs(),
      };

      // Envoi de la requête POST
      postOrder(contactForm);
    }
  });
};

/**
 * Création d'une fonction qui récupère les IDS des produits du local storage
 */
function listIDs() {
  let ids = [];
  for (let i = 0; i < produitSaved.length; i++) {
    ids.push(produitSaved[i].id);
  }
  return ids;
}

/**
 * Création d'une fonction pour fetcher l'API et envoyer la requête POST
 */
const postOrder = async (contactForm) => {
  await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(contactForm),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      // Si l'évaluateur veut voir la réponse
      // console.log(orderId);
      // console.log(data);
      window.location.href = "confirmation.html?orderId=" + orderId;
    })
    .catch((err) => {
      console.error(err);
      alert("erreur: " + err);
    });
};

/**
 * Création d'une fonction qui joue les différentes fonctions au chargement de la page
 */
const launchPage = async () => {
  if (produitSaved == null) {
    emptyCart();
  } else {
    await callApi("http://localhost:3000/api/products/");
    dataArrayFusion();
    mapLocalStorage();
    displayTotalQuantity();
    displayTotalPrice();
    updateQuantityItems();
    controlQuantity();
    deleteItem();
    checkForm();
    submitForm();
  }
};

window.addEventListener("load", launchPage);
