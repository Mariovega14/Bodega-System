import React, { useState, useEffect } from "react";
import axios from "axios";

function OcupacionPorPasilloChart() {
    const [pasillo, setPasillo] = useState("p1");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pasillos, setPasillos] = useState([]);

    const fetchOcupacion = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/dashboard/estado-pasillo/${pasillo}`);
            setData(res.data);
        } catch (error) {
            console.error("Error al obtener datos del pasillo:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOcupacion();
    }, [pasillo]);

    useEffect(() => {
        axios.get("/api/dashboard/pasillos")
            .then(res => {
                setPasillos(res.data);
                if (res.data.length > 0 && !pasillo) {
                    setPasillo(res.data[0]);
                }
            })
            .catch(err => console.error("Error al cargar pasillos:", err));
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="mb-4">
                <label htmlFor="pasillo" className="block text-gray-900 font-medium mb-1">
                    Selecciona un pasillo
                </label>
                <select
                    id="pasillo"
                    value={pasillo}
                    onChange={(e) => setPasillo(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2"
                >
                    {pasillos.map((p) => (
                        <option key={p} value={p}>
                            {p.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-gray-900">Cargando datos...</p>}

            {data && (
                // Contenedor principal
                <div className="flex flex-col items-center space-y-4">
                    {/* Barra vertical */}
                    <div className="relative h-60 w-16 bg-gray-200 rounded-xl overflow-hidden shadow-md border border-gray-300 flex flex-col-reverse">
                        {/* Parte ocupada */}
                        <div
                            className="bg-green-500 transition-all duration-700"
                            style={{ height: `${data.porcentajeOcupacion}%` }}
                        />

                        {/* Parte vacía */}
                        <div
                            className="bg-red-400 transition-all duration-700"
                            style={{ height: `${100 - data.porcentajeOcupacion}%` }}
                        />

                        {/* Indicador de porcentaje en el centro */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-white">
                            {data.porcentajeOcupacion}%
                        </div>
                    </div>

                    {/* Texto descriptivo */}
                    <p className="text-sm text-gray-900 font-medium">
                        Ocupadas: {data.ubicacionesOcupadas} / {data.totalUbicaciones}
                    </p>

                    {/* Leyenda de colores */}
                    <div className="flex gap-4 text-xs text-gray-900">
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                            Ocupado
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                            Disponible
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OcupacionPorPasilloChart;
