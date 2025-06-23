import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
    const [form, setForm] = useState({ usuario: "", password: "", rol: "operador" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/usuarios/registro", form);
            toast.success("✅ Usuario registrado correctamente");
        } catch (err) {
            toast.error("❌ Error al registrar el usuario");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md border border-gray-200 shadow-md rounded-xl p-8">
                <h1 className="text-2xl font-extrabold text-red-700 uppercase tracking-wide mb-6 text-center">
                    Registro de Usuario
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
                            placeholder="Contraseña segura"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="rol" className="block text-sm font-semibold text-gray-800 mb-1">
                            Rol
                        </label>
                        <select
                            name="rol"
                            onChange={handleChange}
                            value={form.rol}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-700 transition"
                        >
                            <option value="operador">Operador</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-red-700 text-white font-bold py-2 rounded-md transition-all duration-300"
                    >
                        Registrar Usuario
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
