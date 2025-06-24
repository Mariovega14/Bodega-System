import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

function EstadoBodegaChartApex() {
  const [series, setSeries] = useState([0, 0]); // [vacias, ocupadas]
  const [labels, setLabels] = useState(["Vacías", "Ocupadas"]);
  const [resumen, setResumen] = useState("");

  useEffect(() => {
    axios
      .get("/api/dashboard/estado-general")
      .then((res) => {
        const { vacias, ocupadas, total } = res.data;

        if (total > 0) {
          const porcentajeVacias = ((vacias / total) * 100).toFixed(1);
          const porcentajeOcupadas = ((ocupadas / total) * 100).toFixed(1);

          setSeries([parseInt(vacias), parseInt(ocupadas)]);
          setResumen(
            `💡 ${ocupadas} de ${total} ubicaciones están ocupadas (${porcentajeOcupadas}%)`
          );
        } else {
          setSeries([0, 0]);
          setResumen("💡 No hay datos disponibles de la bodega.");
        }
      })
      .catch((err) => {
        console.error("❌ Error al obtener estado-general:", err);
      });
  }, []);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: labels,
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
      formatter: function (val) {
        return `${val.toFixed(1)}%`;
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} ubicaciones`;
        },
      },
    },
    colors: ["#34D399", "#F87171"], // verde y rojo suaves
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-xl mx-auto">
      <p className="text-sm text-gray-600 mb-0">{resumen}</p>

      <Chart
        options={chartOptions}
        series={series}
        type="donut"
        width="100%"
        height={320}
      />
    </div>
  );
}

export default EstadoBodegaChartApex;
