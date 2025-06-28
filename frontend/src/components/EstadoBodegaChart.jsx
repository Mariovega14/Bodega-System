import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

function EstadoBodegaChartApex() {
  const [series, setSeries] = useState([0, 0]);
  const [labels, setLabels] = useState(["Vacías", "Ocupadas"]);
  const [resumen, setResumen] = useState("");
  const [chartKey, setChartKey] = useState(Date.now()); // fuerza rerender

  const fetchData = () => {
    axios
      .get("/api/dashboard/estado-general")
      .then((res) => {
        const { vacias, ocupadas, total } = res.data;

        if (total > 0) {
          const porcentajeOcupadas = ((ocupadas / total) * 100).toFixed(1);
          setSeries([parseInt(vacias), parseInt(ocupadas)]);
          setResumen(
            `💡 ${ocupadas} de ${total} ubicaciones están ocupadas (${porcentajeOcupadas}%)`
          );
          setChartKey(Date.now()); // actualizar clave para rerender
        } else {
          setSeries([0, 0]);
          setResumen("💡 No hay datos disponibles de la bodega.");
        }
      })
      .catch((err) => {
        console.error("❌ Error al obtener estado-general:", err);
      });
  };

  useEffect(() => {
    fetchData();

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const chartOptions = {
    chart: {
      id: "main-donut",
      type: "donut",
    },
    labels,
    legend: {
      position: "bottom",
      formatter: function (seriesName, opts) {
        const total = series.reduce((a, b) => a + b, 0);
        const value = opts.w.globals.series[opts.seriesIndex];
        const porcentaje = ((value / total) * 100).toFixed(1);
        return `${seriesName}: ${porcentaje}%`;
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        colors: ["#ffffff"],
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "inherit",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} ubicaciones`,
      },
    },
    colors: ["#34D399", "#F87171"],
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-xl mx-auto">
      <p className="text-sm text-gray-900 mb-4 font-medium">{resumen}</p>
      <div className="text-gray-900">
        <Chart
          key={chartKey}
          options={chartOptions}
          series={series}
          type="donut"
          width="100%"
          height={320}
        />
      </div>
    </div>
  );
}

export default EstadoBodegaChartApex;
