import React, { useEffect, useState } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";


function LayoutPage() {
  const [coordenadas, setCoordenadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [pasilloSeleccionado, setPasilloSeleccionado] = useState("");
  const [pasillosDisponibles, setPasillosDisponibles] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/layout")
      .then((res) => {
        setCoordenadas(res.data);
        const pasillosUnicos = [
          ...new Set(res.data.map((item) => item.coordenada.split("-")[0])),
        ];
        setPasillosDisponibles(pasillosUnicos);
      })
      .catch((err) => console.error("Error al obtener layout:", err));
  }, []);

  const toggleSeleccion = (coordenada) => {
    setSeleccionadas((prev) =>
      prev.includes(coordenada)
        ? prev.filter((c) => c !== coordenada)
        : [...prev, coordenada]
    );
  };

  const cargarLayout = () => {
    axios
      .get("http://localhost:5000/api/layout")
      .then((res) => {
        setCoordenadas(res.data);
        const pasillosUnicos = [
          ...new Set(res.data.map((item) => item.coordenada.split("-")[0])),
        ];
        setPasillosDisponibles(pasillosUnicos);
      })
      .catch((err) => console.error("Error al obtener layout:", err));
  };

  useEffect(() => {
    cargarLayout();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [skuNuevo, setSkuNuevo] = useState("");
  const [fechaNuevo, setFechaNuevo] = useState("");
  const [coordTarget, setCoordTarget] = useState("");

  const abrirModalAgregar = (coordenada) => {
    setCoordTarget(coordenada);
    setSkuNuevo("");
    setFechaNuevo("");
    setModalOpen(true);
  };

  const agregarProducto = async () => {
    try {
      await axios.post("/api/layout/agregar-manual", {
        sku: skuNuevo,
        coordenada: coordTarget,
        fechaVencimiento: fechaNuevo,
      });
      setModalOpen(false);
      cargarLayout();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleEliminarSeleccionadas = async () => {
    try {
      const res = await axios.post("/api/layout/salida-multiple", {
        coordenadas: seleccionadas,
      });
      console.log(res.data.resultados);
      // Refresca tu layout aquí si es necesario
      setSeleccionadas([]);
      cargarLayout();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  const exportarWordPasillo = (pasillo) => {
    const filas = coordenadas
      .filter((item) => item.coordenada.startsWith(`${pasillo}-`))
      .map((item) => {
        return new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(item.coordenada)],
              shading: { fill: "FFFFFF" },
            }),
            new TableCell({
              children: [new Paragraph(item.nombreProducto || "-")],
              shading: { fill: "FFFFFF" },
            }),
            new TableCell({
              children: [new Paragraph(item.estado)],
              shading: { fill: "FFFFFF" },
            }),
            new TableCell({
              children: [new Paragraph(item.sku || "-")],
              shading: { fill: "FFFFFF" },
            }),
            new TableCell({
              children: [
                new Paragraph(
                  item.fechaUltimoMov
                    ? new Date(item.fechaUltimoMov).toLocaleString("es-CL")
                    : "-"
                ),
              ],
              shading: { fill: "FFFFFF" },
            }),
          ],
        });
      });

    if (filas.length === 0) {
      alert(`No se encontraron ubicaciones para el pasillo ${pasillo}`);
      return;
    }

    const encabezado = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Coordenada", bold: true })] })],
          shading: { fill: "DDDDDD" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Producto", bold: true })] })],
          shading: { fill: "DDDDDD" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Estado", bold: true })] })],
          shading: { fill: "DDDDDD" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "SKU", bold: true })] })],
          shading: { fill: "DDDDDD" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Últ. Movimiento", bold: true })] })],
          shading: { fill: "DDDDDD" },
        }),
      ],
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: "center",
              spacing: { after: 300 },
              children: [
                new TextRun({
                  text: `📦 Resumen del Inventario - Pasillo ${pasillo}`,
                  bold: true,
                  size: 36,
                  font: "Arial",
                }),
              ],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [encabezado, ...filas],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Resumen_Pasillo_${pasillo}.docx`);
    });
  };

  const coordenadasFiltradas = coordenadas.filter((item) => {
    const texto = `${item.coordenada} ${item.sku} ${item.nombreProducto}`.toLowerCase();
    const matchBusqueda = texto.includes(busqueda.toLowerCase());

    const matchEstado = estadoFiltro ? item.estado === estadoFiltro : true;

    const fechaMov = item.fechaUltimoMov ? new Date(item.fechaUltimoMov) : null;
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta + 'T23:59:59') : null;

    const matchFecha =
      (!desde || (fechaMov && fechaMov >= desde)) &&
      (!hasta || (fechaMov && fechaMov <= hasta));

    return matchBusqueda && matchEstado && matchFecha;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-8 tracking-wide text-center">
        🗘️ Layout - Estado de Ubicaciones
      </h1>

      {/* Filtros + Selector + Botones, todo junto */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar SKU, coordenada o producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          >
            <option value="">📦 Todos los estados</option>
            <option value="Ocupado">🟥 Ocupado</option>
            <option value="Vacío">⬜ Libre</option>
          </select>

          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />

          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>

        {/* Pasillo y botones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              📍 Seleccionar pasillo:
            </label>
            <select
              value={pasilloSeleccionado}
              onChange={(e) => setPasilloSeleccionado(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full"
            >
              <option value="">-- Elegir --</option>
              {pasillosDisponibles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3">
            <button
              onClick={() => exportarWordPasillo(pasilloSeleccionado)}
              disabled={!pasilloSeleccionado}
              className={`px-5 py-2 rounded text-white font-semibold shadow transition-all duration-200 ${pasilloSeleccionado
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              📄 Exportar resumen Word
            </button>

            <button
              onClick={handleEliminarSeleccionadas}
              disabled={seleccionadas.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded disabled:opacity-50"
            >
              🗑️ Eliminar seleccionados
            </button>
          </div>
        </div>
      </div>


      <div className="overflow-x-auto shadow-lg border border-gray-300 rounded bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-black text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-center">Acción</th>
              <th className="px-4 py-3 text-left">Coordenada</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Vencimiento</th>
              <th className="px-4 py-3 text-left">Últ. Movimiento</th>
            </tr>
          </thead>
          <tbody>
            {coordenadasFiltradas.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center">
                    {item.estado === "Ocupado" && (
                      <input
                        type="checkbox"
                        checked={seleccionadas.includes(item.coordenada)}
                        onChange={() => toggleSeleccion(item.coordenada)}
                        className="w-4 h-4"
                      />
                    )}
                    {item.estado === "Vacío" && (
                      <button
                        onClick={() => abrirModalAgregar(item.coordenada)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ➕
                      </button>
                    )}
                  </div>
                </td>

                {/* RESTO DE LAS CELDAS */}
                <td className="px-4 py-2">{item.coordenada}</td>
                <td className="px-4 py-2">{item.tipo}</td>
                <td className="px-4 py-2">{item.sku || "-"}</td>
                <td className="px-4 py-2">{item.nombreProducto || "-"}</td>
                <td
                  className={`px-4 py-2 font-semibold ${item.estado === "Ocupado"
                    ? "text-yellow-600"
                    : "text-gray-500"
                    }`}
                >
                  {item.estado}
                </td>
                <td className="px-4 py-2">
                  {item.fechaVencimiento
                    ? new Date(item.fechaVencimiento).toLocaleDateString("es-CL")
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {item.fechaUltimoMov
                    ? new Date(item.fechaUltimoMov).toLocaleString("es-CL", {
                      timeZone: "America/Santiago",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Agregar producto a {coordTarget}
            </h2>
            <input
              type="text"
              placeholder="SKU"
              className="w-full mb-3 px-4 py-2 border rounded"
              value={skuNuevo}
              onChange={(e) => setSkuNuevo(e.target.value)}
            />
            <input
              type="date"
              className="w-full mb-4 px-4 py-2 border rounded"
              value={fechaNuevo}
              onChange={(e) => setFechaNuevo(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:underline">
                Cancelar
              </button>
              <button
                onClick={agregarProducto}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
}




export default LayoutPage;
