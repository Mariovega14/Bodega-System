import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
    const { usuario } = useAuth();

    if (!usuario) return <Navigate to="/login" />;

    if (roles && !roles.includes(usuario.rol)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
