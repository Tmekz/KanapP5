// Récupère l'orderId de l'URL
let orderId = new URLSearchParams(window.location.search).get("orderId");

// Affiche le numéro de commande dans la zone dédiée
document.getElementById("orderId").textContent = orderId;

// Vide le localStorage
window.localStorage.clear();
