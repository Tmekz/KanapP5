const callApi = (endpoint) => {
  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => (fetchData = data))
    .catch((error) => {
      console.error("Erreur de connexion avec le serveur : ", error);
      window.alert("Connexion au serveur impossible !");
    });
};
