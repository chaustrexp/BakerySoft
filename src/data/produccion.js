// Sistema de producción y recetas
export const recetas = [
  {
    id: 1,
    nombre: "Pan Francés Tradicional",
    productoId: 1,
    categoria: "Panes",
    rendimiento: 10, // unidades
    tiempoPreparacion: 180, // minutos
    tiempoCoccion: 25,
    temperaturaHorno: 220,
    dificultad: "media",
    ingredientes: [
      { materiaId: 1, cantidad: 5, unidad: "kg", costo: 12.50 },
      { materiaId: 2, cantidad: 0.2, unidad: "kg", costo: 2.00 },
      { materiaId: 3, cantidad: 0.1, unidad: "kg", costo: 0.25 },
      { agua: true, cantidad: 3, unidad: "litros", costo: 0.00 }
    ],
    instrucciones: [
      "Mezclar harina y sal en bowl grande",
      "Disolver levadura en agua tibia",
      "Incorporar líquidos a secos gradualmente",
      "Amasar 10 minutos hasta textura lisa",
      "Primera fermentación: 1 hora",
      "Formar panes y dejar reposar 45 min",
      "Hornear a 220°C por 25 minutos"
    ],
    costoTotal: 14.75,
    costoPorUnidad: 1.48,
    notas: "Verificar temperatura del horno antes de hornear",
    activa: true,
    fechaCreacion: "2023-01-15",
    creadoPor: "Chef Principal"
  },
  {
    id: 2,
    nombre: "Croissant de Mantequilla",
    productoId: 2,
    categoria: "Bollería",
    rendimiento: 12,
    tiempoPreparacion: 480, // 8 horas con reposos
    tiempoCoccion: 18,
    temperaturaHorno: 200,
    dificultad: "alta",
    ingredientes: [
      { materiaId: 1, cantidad: 3, unidad: "kg", costo: 7.50 },
      { materiaId: 5, cantidad: 1.5, unidad: "kg", costo: 12.00 },
      { materiaId: 6, cantidad: 12, unidad: "unidades", costo: 1.80 },
      { materiaId: 4, cantidad: 0.3, unidad: "kg", costo: 0.75 }
    ],
    instrucciones: [
      "Preparar masa base y refrigerar 2 horas",
      "Preparar bloque de mantequilla",
      "Realizar laminado en 3 vueltas",
      "Refrigerar entre cada vuelta (1 hora)",
      "Formar croissants y fermentar 2 horas",
      "Pintar con huevo batido",
      "Hornear a 200°C por 18 minutos"
    ],
    costoTotal: 22.05,
    costoPorUnidad: 1.84,
    notas: "Mantener temperatura fría durante laminado",
    activa: true,
    fechaCreacion: "2023-02-20",
    creadoPor: "Chef Especialista"
  }
];

export const planProduccion = [
  {
    id: 1,
    fecha: "2024-01-08",
    turno: "madrugada", // madrugada, mañana, tarde
    productos: [
      {
        productoId: 1,
        cantidad: 50,
        horaInicio: "04:00",
        horaFin: "07:00",
        estado: "planificado",
        responsable: "Panadero Principal",
        horno: 1
      },
      {
        productoId: 6,
        cantidad: 30,
        horaInicio: "05:00",
        horaFin: "08:30",
        estado: "planificado",
        responsable: "Panadero Asistente",
        horno: 2
      }
    ],
    estado: "planificado",
    notas: "Producción normal de lunes"
  },
  {
    id: 2,
    fecha: "2024-01-08",
    turno: "mañana",
    productos: [
      {
        productoId: 2,
        cantidad: 24,
        horaInicio: "06:00",
        horaFin: "10:00",
        estado: "en_proceso",
        responsable: "Chef Especialista",
        horno: 1
      },
      {
        productoId: 5,
        cantidad: 40,
        horaInicio: "08:00",
        horaFin: "11:00",
        estado: "planificado",
        responsable: "Repostero",
        horno: 3
      }
    ],
    estado: "en_proceso",
    notas: "Pedido especial de croissants para hotel"
  }
];

export const controlCalidad = [
  {
    id: 1,
    fecha: "2024-01-07",
    productoId: 1,
    lote: "PF-240107-001",
    cantidad: 48,
    parametros: {
      peso: { valor: 95, unidad: "g", minimo: 90, maximo: 100, cumple: true },
      temperatura: { valor: 96, unidad: "°C", minimo: 95, maximo: 98, cumple: true },
      color: { valor: "dorado", esperado: "dorado", cumple: true },
      textura: { valor: "crujiente", esperado: "crujiente", cumple: true }
    },
    inspector: "Supervisor de Calidad",
    resultado: "aprobado",
    observaciones: "Lote dentro de especificaciones"
  },
  {
    id: 2,
    fecha: "2024-01-07",
    productoId: 2,
    lote: "CR-240107-001",
    cantidad: 24,
    parametros: {
      peso: { valor: 85, unidad: "g", minimo: 80, maximo: 90, cumple: true },
      capas: { valor: 7, unidad: "capas", minimo: 6, maximo: 8, cumple: true },
      color: { valor: "dorado", esperado: "dorado", cumple: true },
      mantequilla: { valor: "visible", esperado: "visible", cumple: true }
    },
    inspector: "Chef Principal",
    resultado: "aprobado",
    observaciones: "Excelente laminado"
  }
];

export const hornos = [
  {
    id: 1,
    nombre: "Horno Principal",
    tipo: "convección",
    capacidad: 60,
    temperaturaMax: 300,
    estado: "operativo",
    ubicacion: "Área de Producción 1",
    mantenimiento: "2024-01-01"
  },
  {
    id: 2,
    nombre: "Horno Secundario",
    tipo: "convección",
    capacidad: 40,
    temperaturaMax: 280,
    estado: "operativo",
    ubicacion: "Área de Producción 1",
    mantenimiento: "2024-01-01"
  },
  {
    id: 3,
    nombre: "Horno de Repostería",
    tipo: "convección",
    capacidad: 30,
    temperaturaMax: 250,
    estado: "operativo",
    ubicacion: "Área de Repostería",
    mantenimiento: "2024-01-01"
  }
];