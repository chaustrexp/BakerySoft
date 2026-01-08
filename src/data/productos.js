// Base de datos de productos de panadería
export const productos = [
  {
    id: 1,
    nombre: "Pan Francés",
    categoria: "Panes",
    precio: 1.50,
    costo: 0.80,
    margen: 87.5,
    tiempoPreparacion: 180, // minutos
    tiempoCoccion: 25,
    imagen: "🥖",
    descripcion: "Pan tradicional francés crujiente",
    ingredientes: [
      { materiaId: 1, cantidad: 0.5, unidad: "kg" }, // Harina
      { materiaId: 2, cantidad: 0.02, unidad: "kg" }, // Levadura
      { materiaId: 3, cantidad: 0.01, unidad: "kg" }  // Sal
    ],
    activo: true,
    popularidad: 95
  },
  {
    id: 2,
    nombre: "Croissant",
    categoria: "Bollería",
    precio: 2.50,
    costo: 1.20,
    margen: 108.3,
    tiempoPreparacion: 480, // 8 horas (con reposos)
    tiempoCoccion: 18,
    imagen: "🥐",
    descripcion: "Croissant de mantequilla artesanal",
    ingredientes: [
      { materiaId: 1, cantidad: 0.3, unidad: "kg" },
      { materiaId: 5, cantidad: 0.15, unidad: "kg" }, // Mantequilla
      { materiaId: 6, cantidad: 1, unidad: "unidades" } // Huevos
    ],
    activo: true,
    popularidad: 88
  },
  {
    id: 3,
    nombre: "Torta de Chocolate",
    categoria: "Tortas",
    precio: 25.00,
    costo: 12.00,
    margen: 108.3,
    tiempoPreparacion: 120,
    tiempoCoccion: 45,
    imagen: "🎂",
    descripcion: "Torta de chocolate con cobertura",
    ingredientes: [
      { materiaId: 1, cantidad: 0.4, unidad: "kg" },
      { materiaId: 4, cantidad: 0.3, unidad: "kg" }, // Azúcar
      { materiaId: 8, cantidad: 0.1, unidad: "kg" }, // Chocolate
      { materiaId: 6, cantidad: 4, unidad: "unidades" }
    ],
    activo: true,
    popularidad: 92
  },
  {
    id: 4,
    nombre: "Empanada de Pollo",
    categoria: "Salados",
    precio: 3.50,
    costo: 1.80,
    margen: 94.4,
    tiempoPreparacion: 90,
    tiempoCoccion: 20,
    imagen: "🥟",
    descripcion: "Empanada rellena de pollo y verduras",
    ingredientes: [
      { materiaId: 1, cantidad: 0.2, unidad: "kg" },
      { materiaId: 7, cantidad: 0.05, unidad: "litros" } // Aceite
    ],
    activo: true,
    popularidad: 85
  },
  {
    id: 5,
    nombre: "Donut Glaseada",
    categoria: "Bollería",
    precio: 2.00,
    costo: 0.90,
    margen: 122.2,
    tiempoPreparacion: 150,
    tiempoCoccion: 5,
    imagen: "🍩",
    descripcion: "Donut frita con glaseado dulce",
    ingredientes: [
      { materiaId: 1, cantidad: 0.15, unidad: "kg" },
      { materiaId: 4, cantidad: 0.1, unidad: "kg" },
      { materiaId: 7, cantidad: 0.2, unidad: "litros" }
    ],
    activo: true,
    popularidad: 78
  },
  {
    id: 6,
    nombre: "Pan Integral",
    categoria: "Panes",
    precio: 2.00,
    costo: 1.10,
    margen: 81.8,
    tiempoPreparacion: 200,
    tiempoCoccion: 35,
    imagen: "🍞",
    descripcion: "Pan integral con semillas",
    ingredientes: [
      { materiaId: 1, cantidad: 0.6, unidad: "kg" },
      { materiaId: 2, cantidad: 0.025, unidad: "kg" },
      { materiaId: 3, cantidad: 0.012, unidad: "kg" }
    ],
    activo: true,
    popularidad: 70
  }
];

export const categorias = [
  { id: 1, nombre: "Panes", color: "bg-amber-100 text-amber-800", icon: "🍞" },
  { id: 2, nombre: "Bollería", color: "bg-orange-100 text-orange-800", icon: "🥐" },
  { id: 3, nombre: "Tortas", color: "bg-pink-100 text-pink-800", icon: "🎂" },
  { id: 4, nombre: "Salados", color: "bg-green-100 text-green-800", icon: "🥟" },
  { id: 5, nombre: "Postres", color: "bg-purple-100 text-purple-800", icon: "🧁" },
  { id: 6, nombre: "Bebidas", color: "bg-blue-100 text-blue-800", icon: "☕" }
];