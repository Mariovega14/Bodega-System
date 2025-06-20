import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const COLORS = ["#00C49F", "#FF4C4C"];

function EstadoBodegaChart() {
  const [data, setData] = useState([]);
  const [resumen, setResumen] = useState("");

  useEffect(() => {
    axios.get("/api/dashboard/estado-general").then((res) => {
      const { vacias, ocupadas, total } = res.data;

      if (total > 0) {
        const porcentajeVacias = ((vacias / total) * 100).toFixed(1);
        const porcentajeOcupadas = ((ocupadas / total) * 100).toFixed(1);

        setData([
          { name: "Vacías", value: vacias },
          { name: "Ocupadas", value: ocupadas }
        ]);

        setResumen(`💡 ${ocupadas} de ${total} ubicaciones están ocupadas (${porcentajeOcupadas}%)`);
      } else {
        setData([
          { name: "Vacías", value: 0 },
          { name: "Ocupadas", value: 0 }
        ]);

        setResumen("💡 No hay datos disponibles de la bodega.");
      }
    }).catch((err) => {
      console.error("❌ Error al consultar estado-general:", err);
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">Estado General de la Bodega</h2>
      <p className="text-sm text-gray-600 mb-4">{resumen}</p>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          innerRadius={70}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
          // ❌ No usamos label aquí para evitar superposición
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value, entry, index) => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const porcentaje = ((entry.payload.value / total) * 100).toFixed(1);
            return `${value} (${porcentaje}%)`;
          }}
        />
      </PieChart>
    </div>
  );
}

export default EstadoBodegaChart;
