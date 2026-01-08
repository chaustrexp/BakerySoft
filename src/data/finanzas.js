// Sistema financiero y contabilidad
export const transacciones = [
  {
    id: 1,
    fecha: "2024-01-07",
    tipo: "ingreso",
    categoria: "ventas",
    concepto: "Ventas del día",
    monto: 1250.75,
    metodoPago: "mixto",
    referencia: "VTA-240107",
    estado: "confirmado",
    caja: 1
  },
  {
    id: 2,
    fecha: "2024-01-07",
    tipo: "egreso",
    categoria: "materias_primas",
    concepto: "Compra harina - Molinos San Juan",
    monto: 125.00,
    metodoPago: "transferencia",
    referencia: "COMP-240107-001",
    estado: "confirmado",
    proveedor: "Molinos San Juan"
  },
  {
    id: 3,
    fecha: "2024-01-07",
    tipo: "egreso",
    categoria: "servicios",
    concepto: "Factura de electricidad",
    monto: 89.50,
    metodoPago: "transferencia",
    referencia: "ELEC-240107",
    estado: "pendiente"
  },
  {
    id: 4,
    fecha: "2024-01-06",
    tipo: "ingreso",
    categoria: "ventas",
    concepto: "Ventas del día",
    monto: 1180.25,
    metodoPago: "mixto",
    referencia: "VTA-240106",
    estado: "confirmado",
    caja: 1
  }
];

export const presupuesto = {
  mes: "2024-01",
  ingresos: {
    ventas: { presupuestado: 35000, real: 8750, porcentaje: 25 },
    servicios: { presupuestado: 2000, real: 450, porcentaje: 22.5 },
    otros: { presupuestado: 500, real: 120, porcentaje: 24 }
  },
  egresos: {
    materias_primas: { presupuestado: 12000, real: 2850, porcentaje: 23.75 },
    nomina: { presupuestado: 8000, real: 2000, porcentaje: 25 },
    servicios: { presupuestado: 1500, real: 380, porcentaje: 25.33 },
    alquiler: { presupuestado: 2500, real: 2500, porcentaje: 100 },
    otros: { presupuestado: 1000, real: 245, porcentaje: 24.5 }
  },
  utilidad: {
    presupuestada: 12500,
    real: 1345,
    porcentaje: 10.76
  }
};

export const flujoEfectivo = [
  {
    fecha: "2024-01-01",
    saldoInicial: 15000,
    ingresos: 1200,
    egresos: 800,
    saldoFinal: 15400
  },
  {
    fecha: "2024-01-02",
    saldoInicial: 15400,
    ingresos: 1350,
    egresos: 950,
    saldoFinal: 15800
  },
  {
    fecha: "2024-01-03",
    saldoInicial: 15800,
    ingresos: 1180,
    egresos: 720,
    saldoFinal: 16260
  },
  {
    fecha: "2024-01-04",
    saldoInicial: 16260,
    ingresos: 1420,
    egresos: 1100,
    saldoFinal: 16580
  },
  {
    fecha: "2024-01-05",
    saldoInicial: 16580,
    ingresos: 1680,
    egresos: 890,
    saldoFinal: 17370
  },
  {
    fecha: "2024-01-06",
    saldoInicial: 17370,
    ingresos: 1180,
    egresos: 650,
    saldoFinal: 17900
  },
  {
    fecha: "2024-01-07",
    saldoInicial: 17900,
    ingresos: 1250,
    egresos: 214.50,
    saldoFinal: 18935.50
  }
];

export const cuentasPorCobrar = [
  {
    id: 1,
    cliente: "Hotel Plaza",
    factura: "FAC-001",
    fecha: "2024-01-05",
    vencimiento: "2024-01-20",
    monto: 450.00,
    saldo: 450.00,
    estado: "pendiente",
    diasVencido: 0
  },
  {
    id: 2,
    cliente: "Restaurante El Buen Sabor",
    factura: "FAC-002",
    fecha: "2024-01-03",
    vencimiento: "2024-01-18",
    monto: 280.00,
    saldo: 280.00,
    estado: "pendiente",
    diasVencido: 0
  },
  {
    id: 3,
    cliente: "Cafetería Central",
    factura: "FAC-003",
    fecha: "2023-12-28",
    vencimiento: "2024-01-12",
    monto: 150.00,
    saldo: 75.00,
    estado: "parcial",
    diasVencido: 0
  }
];

export const cuentasPorPagar = [
  {
    id: 1,
    proveedor: "Molinos San Juan",
    factura: "MSJ-001",
    fecha: "2024-01-05",
    vencimiento: "2024-01-20",
    monto: 125.00,
    saldo: 125.00,
    estado: "pendiente",
    diasVencido: 0
  },
  {
    id: 2,
    proveedor: "Levaduras del Norte",
    factura: "LDN-002",
    fecha: "2024-01-04",
    vencimiento: "2024-01-19",
    monto: 85.00,
    saldo: 85.00,
    estado: "pendiente",
    diasVencido: 0
  }
];

export const categoriasCosto = [
  { id: "materias_primas", nombre: "Materias Primas", color: "bg-blue-100 text-blue-800" },
  { id: "nomina", nombre: "Nómina", color: "bg-green-100 text-green-800" },
  { id: "servicios", nombre: "Servicios", color: "bg-yellow-100 text-yellow-800" },
  { id: "alquiler", nombre: "Alquiler", color: "bg-purple-100 text-purple-800" },
  { id: "mantenimiento", nombre: "Mantenimiento", color: "bg-red-100 text-red-800" },
  { id: "marketing", nombre: "Marketing", color: "bg-pink-100 text-pink-800" },
  { id: "otros", nombre: "Otros", color: "bg-gray-100 text-gray-800" }
];

export const categoriasIngreso = [
  { id: "ventas", nombre: "Ventas", color: "bg-green-100 text-green-800" },
  { id: "servicios", nombre: "Servicios", color: "bg-blue-100 text-blue-800" },
  { id: "otros", nombre: "Otros Ingresos", color: "bg-gray-100 text-gray-800" }
];