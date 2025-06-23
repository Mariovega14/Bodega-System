import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            const userData = JSON.parse(localStorage.getItem("usuario"));
            setUsuario(userData);
        }
    }, [token]);

    const login = async (credenciales) => {
        const res = await axios.post("http://localhost:5000/api/usuarios/login", credenciales);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
        setToken(res.data.token);
        setUsuario(res.data.usuario);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
