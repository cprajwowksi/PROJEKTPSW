import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }) => {
    const { keycloak } = useKeycloak();
    const isLoggedIn = keycloak.authenticated;
    const hasRole = keycloak.hasRealmRole("admin")
    return isLoggedIn && hasRole ? children : null;
};

export default PrivateRoute;