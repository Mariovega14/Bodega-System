import React from "react";
import EstadoBodegaChart from "../components/EstadoBodegaChart";
import StockPorProducto from "../components/StockPorProducto";
import ProductosPorVencer from "../components/ProductosPorVencer";

function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Panel Principal de la Bodega</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico Estado General */}
        <EstadoBodegaChart />
      </div>

      {/* Sección adicional: stock por producto */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Stock por Producto</h2>
        <StockPorProducto />
        <ProductosPorVencer />
      </div>
    </div>
  );
}

export default HomePage;
