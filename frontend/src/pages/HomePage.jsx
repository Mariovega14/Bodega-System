import React from "react";
import EstadoBodegaChart from "../components/EstadoBodegaChart";
import StockPorProducto from "../components/StockPorProductoChart";
import ProductosPorVencer from "../components/ProductosPorVencer";

function HomePage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10 tracking-tight">
        📦 Panel Principal de la Bodega
      </h1>

      {/* Estado general */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">🏪 Estado General</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <EstadoBodegaChart />
          </div>
        </div>
      </section>

      {/* Stock por producto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">📊 Stock por Producto</h2>
        <div className="bg-white rounded-2xl shadow p-6">
          <StockPorProducto />
        </div>
      </section>

      {/* Productos por vencer */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">⏳ Productos por Vencer</h2>
        <div className="bg-white rounded-2xl shadow p-6">
          <ProductosPorVencer />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
