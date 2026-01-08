// Datos de materias primas para la panadería
export const materiasPrimas = [
  {
    id: 1,
    nombre: "Harina de Trigo",
    cantidad: 150,
    unidad: "kg",
    estado: "Óptimo",
    proveedor: "Molinos San Juan",
    stockMinimo: 50,
    stockMaximo: 200
  },
  {
    id: 2,
    nombre: "Levadura Fresca",
    cantidad: 8,
    unidad: "kg",
    estado: "Crítico",
    proveedor: "Levaduras del Norte",
    stockMinimo: 10,
    stockMaximo: 25
  },
  {
    id: 3,
    nombre: "Sal Marina",
    cantidad: 25,
    unidad: "kg",
    estado: "Bajo",
    proveedor: "Sal del Pacífico",
    stockMinimo: 20,
    stockMaximo: 50
  },
  {
    id: 4,
    nombre: "Azúcar Blanca",
    cantidad: 80,
    unidad: "kg",
    estado: "Óptimo",
    proveedor: "Azucarera Central",
    stockMinimo: 30,
    stockMaximo: 100
  },
  {
    id: 5,
    nombre: "Mantequilla",
    cantidad: 12,
    unidad: "kg",
    estado: "Bajo",
    proveedor: "Lácteos Premium",
    stockMinimo: 15,
    stockMaximo: 30
  },
  {
    id: 6,
    nombre: "Huevos",
    cantidad: 240,
    unidad: "unidades",
    estado: "Óptimo",
    proveedor: "Granja Los Robles",
    stockMinimo: 100,
    stockMaximo: 300
  },
  {
    id: 7,
    nombre: "Aceite Vegetal",
    cantidad: 5,
    unidad: "litros",
    estado: "Crítico",
    proveedor: "Aceites Naturales",
    stockMinimo: 10,
    stockMaximo: 25
  },
  {
    id: 8,
    nombre: "Chocolate en Polvo",
    cantidad: 18,
    unidad: "kg",
    estado: "Óptimo",
    proveedor: "Chocolates Artesanales",
    stockMinimo: 5,
    stockMaximo: 20
  },
  {
    id: 9,
    nombre: "Vainilla Líquida",
    cantidad: 2,
    unidad: "litros",
    estado: "Bajo",
    proveedor: "Esencias Naturales",
    stockMinimo: 3,
    stockMaximo: 8
  }
];

// Estados posibles del inventario
export const estadosInventario = {
  OPTIMO: "Óptimo",
  BAJO: "Bajo",
  CRITICO: "Crítico"
};