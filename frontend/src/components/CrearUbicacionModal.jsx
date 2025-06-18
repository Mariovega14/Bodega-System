import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CrearUbicacionModal({ onUbicacionCreada }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    tipo: '',
    pasillo: '',
    posicion: '',
    nivel: '',
    capacidad: 1,
  });
  const [mensaje, setMensaje] = useState('');

  const generarCoordenada = () => {
    const { pasillo, posicion, nivel } = form;
    return pasillo && posicion && nivel ? `${pasillo}-${posicion}-${nivel}` : '';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ tipo: '', pasillo: '', posicion: '', nivel: '', capacidad: 1 });
    setMensaje('');
  };

  const cerrarModal = () => {
    limpiarFormulario();
    setShow(false);
  };

  const crearUbicacion = async () => {
    setMensaje('');
    try {
      await axios.post('http://localhost:5000/api/ubicaciones', {
        coordenada: generarCoordenada(),
        tipo: form.tipo,
        pasillo: form.pasillo,
        posicion: form.posicion,
        nivel: parseInt(form.nivel),
        capacidad: parseInt(form.capacidad),
      });

      setMensaje('✅ Ubicación creada con éxito');
      onUbicacionCreada();
      setTimeout(() => cerrarModal(), 1500);
    } catch (error) {
      setMensaje(error.response?.data?.error || '❌ Error al crear la ubicación');
    }
  };

  const camposCompletos = () => {
    const { tipo, pasillo, posicion, nivel, capacidad } = form;
    return tipo && pasillo && posicion && nivel && capacidad;
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') cerrarModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear nueva ubicación
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <h3 className="text-lg font-bold mb-4">Crear Ubicación</h3>
            <div className="grid grid-cols-2 gap-4">
              {['tipo', 'pasillo', 'posicion', 'nivel', 'capacidad'].map((campo) => (
                <div key={campo}>
                  <label className="text-sm capitalize">{campo}</label>
                  <input
                    name={campo}
                    value={form[campo]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              ))}
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Coordenada generada: <strong>{generarCoordenada()}</strong>
            </p>

            {mensaje && (
              <div className="mt-3 text-sm font-medium text-center">
                {mensaje.startsWith('✅') ? (
                  <span className="text-green-600">{mensaje}</span>
                ) : (
                  <span className="text-red-600">{mensaje}</span>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={crearUbicacion}
                disabled={!camposCompletos()}
                className={`px-4 py-2 text-white rounded ${
                  camposCompletos() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
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
