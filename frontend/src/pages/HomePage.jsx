function HomePage() {
  const rolUsuario = "admin"; // o trabajador

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">SISTEMA DE BODEGA</h1>
       <h1 className="text-4xl font-bold mb-4">BIENVENIDXS</h1>
      <p className="text-xl text-gray-700">
        Bienvenido, <span className="font-semibold">{rolUsuario.toUpperCase()}</span>
      </p>
    </div>
  );
}

export default HomePage;
