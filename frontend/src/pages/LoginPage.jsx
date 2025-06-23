import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [form, setForm] = useState({ usuario: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
            toast.success("✅ Bienvenido");
            navigate("/");
        } catch (err) {
            toast.error("❌ Credenciales inválidas");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md border border-gray-200 shadow-md rounded-xl p-8">
                <h1 className="text-2xl font-extrabold text-red-700 uppercase tracking-wide mb-6 text-center">
                    Iniciar Sesión
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="usuario" className="block text-sm font-semibold text-gray-800 mb-1">
                            Usuario
                        </label>
                        <input
                            type="text"
                            name="usuario"
                            placeholder="Nombre de usuario"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-red-700 text-white font-bold py-2 rounded-md transition-all duration-300"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
