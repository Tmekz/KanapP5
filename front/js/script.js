/**
 * Création fonction pour afficher les données de l'API
 */
const displayKanap = async () => {
  await callApi("http://localhost:3000/api/products/");
  items.innerHTML = fetchData
    .map(
      (product) =>
        `
    <a href="./product.html?id=${product._id}">
      <article>
        <img src=${product.imageUrl} alt="${product.altTxt}">
        <h3 class="productName">${product.name} </h3>
        <p class="productDescription">${product.description}</p>
      </article>
  </a>
    `
    )
    .join("");
};

// Création d'un event pour lancer displayKanap au chargement de la page
window.addEventListener("load", displayKanap);
