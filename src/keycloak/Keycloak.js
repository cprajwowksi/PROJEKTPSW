import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8081",
    realm: "panda-realm",
    clientId: "react-app",
});


export default keycloak;