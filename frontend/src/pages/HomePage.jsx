import React from "react";
import EstadoBodegaChart from "../components/EstadoBodegaChart";
import StockPorProducto from "../components/StockPorProductoChart";
import ProductosPorVencer from "../components/ProductosPorVencer";
import OcupacionPorPasilloChart from "../components/OcupacionPorPasilloChart";

function HomePage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10 tracking-tight">
        📦 Panel Principal de la Bodega
      </h1>

      {/* Estado general */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Estado General */}
          <div className="w-full md:w-1/2 max-w-xl bg-white rounded-2xl shadow p-6 flex flex-col min-h-[460px]">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
              🏪 <span>Estado General</span>
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <EstadoBodegaChart />
            </div>
          </div>

          {/* Ocupación por Pasillo */}
          <div className="w-full md:w-1/2 max-w-xl bg-white rounded-2xl shadow p-6 flex flex-col min-h-[460px]">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
              🚧 <span>Ocupación por Pasillo</span>
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <OcupacionPorPasilloChart />
            </div>
          </div>
        </div>
      </section>

      {/* Productos por vencer */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">⏳ Productos por Vencer</h2>
        <div className="bg-white rounded-2xl shadow p-6">
          <ProductosPorVencer />
        </div>
      </section>

      {/* Stock por producto */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">📊 Stock por Producto</h2>
        <div className="bg-white rounded-2xl shadow p-6">
          <StockPorProducto />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
