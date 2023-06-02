/**
 * Création fonction pour afficher les données
 */
const displayKanap = async () => {
  await callApi("http://localhost:3000/api/products/");

  for (let i = 0; i < fetchData.length; i++) {
    element = fetchData[i];
    document.querySelector("#items").innerHTML += `
        <a href="./product.html?id=${element._id}">
            <article>
                <img src="${element.imageUrl}" alt="${element.altTxt}">
                <h3 class="productName">${element.name}</h3>
                <p class="productDescription">${element.description}</p>
            </article>
        </a>`;
  }
/* Hello */

  //   items.innerHTML = fetchData
  //     .map(
  //       (product) =>
  //         `
  //   <a href="./product.html?id=${product._id}">
  //     <article>
  //       <img src=${product.imageUrl} alt="${product.altTxt}">
  //       <h3 class="productName">${product.name} </h3>
  //       <p class="productDescription">${product.description}</p>
  //     </article>
  // </a>
  //   `
  //     )
  //     .join("");
};

window.addEventListener("load", displayKanap);
