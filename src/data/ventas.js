// Sistema de ventas y POS
export const ventas = [
  {
    id: 1,
    fecha: "2024-01-07T09:30:00Z",
    cliente: {
      id: 1,
      nombre: "María González",
      telefono: "+1234567890",
      email: "maria@email.com",
      tipo: "regular"
    },
    productos: [
      { productoId: 1, cantidad: 2, precio: 1.50, subtotal: 3.00 },
      { productoId: 2, cantidad: 1, precio: 2.50, subtotal: 2.50 }
    ],
    subtotal: 5.50,
    impuestos: 0.55,
    descuento: 0.00,
    total: 6.05,
    metodoPago: "efectivo",
    estado: "completada",
    vendedor: "Ana Gerente",
    caja: 1
  },
  {
    id: 2,
    fecha: "2024-01-07T10:15:00Z",
    cliente: {
      id: 2,
      nombre: "Carlos Rodríguez",
      telefono: "+1234567891",
      email: "carlos@email.com",
      tipo: "nuevo"
    },
    productos: [
      { productoId: 3, cantidad: 1, precio: 25.00, subtotal: 25.00 }
    ],
    subtotal: 25.00,
    impuestos: 2.50,
    descuento: 2.50, // Descuento cliente nuevo
    total: 25.00,
    metodoPago: "tarjeta",
    estado: "completada",
    vendedor: "Luis Empleado",
    caja: 1
  },
  {
    id: 3,
    fecha: "2024-01-07T11:00:00Z",
    cliente: {
      id: 3,
      nombre: "Ana Martínez",
      telefono: "+1234567892",
      email: "ana@email.com",
      tipo: "vip"
    },
    productos: [
      { productoId: 1, cantidad: 4, precio: 1.50, subtotal: 6.00 },
      { productoId: 4, cantidad: 3, precio: 3.50, subtotal: 10.50 },
      { productoId: 5, cantidad: 2, precio: 2.00, subtotal: 4.00 }
    ],
    subtotal: 20.50,
    impuestos: 2.05,
    descuento: 1.00, // Descuento VIP
    total: 21.55,
    metodoPago: "transferencia",
    estado: "completada",
    vendedor: "María Supervisora",
    caja: 2
  }
];

export const clientes = [
  {
    id: 1,
    nombre: "María González",
    telefono: "+1234567890",
    email: "maria@email.com",
    direccion: "Calle Principal 123",
    fechaRegistro: "2023-06-15",
    tipo: "regular",
    totalCompras: 156.50,
    ultimaCompra: "2024-01-07",
    puntos: 156,
    activo: true
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    telefono: "+1234567891",
    email: "carlos@email.com",
    direccion: "Avenida Central 456",
    fechaRegistro: "2024-01-07",
    tipo: "nuevo",
    totalCompras: 25.00,
    ultimaCompra: "2024-01-07",
    puntos: 25,
    activo: true
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    telefono: "+1234567892",
    email: "ana@email.com",
    direccion: "Plaza Mayor 789",
    fechaRegistro: "2022-03-10",
    tipo: "vip",
    totalCompras: 890.75,
    ultimaCompra: "2024-01-07",
    puntos: 890,
    activo: true
  }
];

export const metodsPago = [
  { id: "efectivo", nombre: "Efectivo", icon: "💵", activo: true },
  { id: "tarjeta", nombre: "Tarjeta", icon: "💳", activo: true },
  { id: "transferencia", nombre: "Transferencia", icon: "🏦", activo: true },
  { id: "digital", nombre: "Pago Digital", icon: "📱", activo: true }
];

export const cajas = [
  { id: 1, nombre: "Caja Principal", ubicacion: "Mostrador 1", activa: true },
  { id: 2, nombre: "Caja Secundaria", ubicacion: "Mostrador 2", activa: true }
];