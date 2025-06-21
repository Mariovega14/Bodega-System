import React, { useEffect, useState } from "react";
import axios from "axios";

function CrearUbicacionModal({ onUbicacionCreada }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    tipo: "",
    pasillo: "",
    posicion: "",
    nivel: "",
    capacidad: 1,
  });
  const [mensaje, setMensaje] = useState("");

  const generarCoordenada = () => {
    const { pasillo, posicion, nivel } = form;
    return pasillo && posicion && nivel
      ? `${pasillo}-${posicion}-${nivel}`
      : "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ tipo: "", pasillo: "", posicion: "", nivel: "", capacidad: 1 });
    setMensaje("");
  };

  const cerrarModal = () => {
    limpiarFormulario();
    setShow(false);
  };

  const crearUbicacion = async () => {
    setMensaje("");
    try {
      await axios.post("http://localhost:5000/api/ubicaciones", {
        coordenada: generarCoordenada(),
        tipo: form.tipo,
        pasillo: form.pasillo,
        posicion: form.posicion,
        nivel: parseInt(form.nivel),
        capacidad: parseInt(form.capacidad),
      });

      setMensaje("✅ Ubicación creada con éxito");
      onUbicacionCreada();
      setTimeout(() => cerrarModal(), 1500);
    } catch (error) {
      setMensaje(
        error.response?.data?.error || "❌ Error al crear la ubicación"
      );
    }
  };

  const camposCompletos = () => {
    const { tipo, pasillo, posicion, nivel, capacidad } = form;
    return tipo && pasillo && posicion && nivel && capacidad;
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded shadow"
      >
        ➕ Crear nueva ubicación
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6 border-b pb-2">
              🗂️ Nueva Ubicación
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {["tipo", "pasillo", "posicion", "nivel", "capacidad"].map(
                (campo) => (
                  <div key={campo}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                      {campo}
                    </label>
                    <input
                      name={campo}
                      value={form[campo]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                )
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Coordenada generada:{" "}
              <strong className="text-black">{generarCoordenada()}</strong>
            </p>

            {mensaje && (
              <div className="text-center text-sm font-medium mb-4">
                {mensaje.startsWith("✅") ? (
                  <span className="text-green-600">{mensaje}</span>
                ) : (
                  <span className="text-red-600">{mensaje}</span>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={cerrarModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={crearUbicacion}
                disabled={!camposCompletos()}
                className={`px-4 py-2 text-white font-semibold rounded ${
                  camposCompletos()
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CrearUbicacionModal;
