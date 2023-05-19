// Création fonction pour fetcher les données
let dataKanap = [];
const fetchKanap = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => (dataKanap = data))
    .catch((error) => {
      console.log('Erreur de connexion avec le serveur : ', error);
      window.alert("Connexion au serveur impossible !");
    });
};

// Création fonction pour afficher les données
const displayKanap = async () => {
  await fetchKanap();
  items.innerHTML = dataKanap
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

window.addEventListener("load", displayKanap);
