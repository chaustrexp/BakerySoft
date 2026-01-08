// Sistema de recursos humanos
export const empleados = [
  {
    id: 1,
    codigo: "EMP-001",
    nombre: "Carlos Administrador",
    apellido: "García",
    email: "carlos.garcia@bakerysoft.com",
    telefono: "+1234567890",
    direccion: "Calle Principal 123",
    fechaNacimiento: "1985-03-15",
    fechaIngreso: "2020-01-15",
    puesto: "Gerente General",
    departamento: "Administración",
    salario: 2500.00,
    tipoContrato: "indefinido",
    estado: "activo",
    avatar: "👨‍💼",
    role: "admin",
    profilePhoto: "/img/administrador.png",
    horario: {
      lunes: { entrada: "08:00", salida: "17:00" },
      martes: { entrada: "08:00", salida: "17:00" },
      miercoles: { entrada: "08:00", salida: "17:00" },
      jueves: { entrada: "08:00", salida: "17:00" },
      viernes: { entrada: "08:00", salida: "17:00" },
      sabado: { entrada: "08:00", salida: "12:00" },
      domingo: { descanso: true }
    }
  },
  {
    id: 2,
    codigo: "EMP-002",
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana.martinez@bakerysoft.com",
    telefono: "+1234567891",
    direccion: "Avenida Central 456",
    fechaNacimiento: "1990-07-22",
    fechaIngreso: "2021-03-10",
    puesto: "Chef Principal",
    departamento: "Producción",
    salario: 2200.00,
    tipoContrato: "indefinido",
    estado: "activo",
    avatar: "👩‍🍳",
    role: "supervisor",
    profilePhoto: "/img/supervisor.jpeg",
    horario: {
      lunes: { entrada: "05:00", salida: "14:00" },
      martes: { entrada: "05:00", salida: "14:00" },
      miercoles: { entrada: "05:00", salida: "14:00" },
      jueves: { entrada: "05:00", salida: "14:00" },
      viernes: { entrada: "05:00", salida: "14:00" },
      sabado: { entrada: "06:00", salida: "12:00" },
      domingo: { descanso: true }
    }
  },
  {
    id: 3,
    codigo: "EMP-003",
    nombre: "Luis",
    apellido: "Rodríguez",
    email: "luis.rodriguez@bakerysoft.com",
    telefono: "+1234567892",
    direccion: "Plaza Mayor 789",
    fechaNacimiento: "1988-11-08",
    fechaIngreso: "2021-06-01",
    puesto: "Panadero Senior",
    departamento: "Producción",
    salario: 1800.00,
    tipoContrato: "indefinido",
    estado: "activo",
    avatar: "👨‍🍳",
    role: "employee",
    profilePhoto: "/img/empleado.jpeg",
    horario: {
      lunes: { entrada: "04:00", salida: "13:00" },
      martes: { entrada: "04:00", salida: "13:00" },
      miercoles: { entrada: "04:00", salida: "13:00" },
      jueves: { entrada: "04:00", salida: "13:00" },
      viernes: { entrada: "04:00", salida: "13:00" },
      sabado: { entrada: "05:00", salida: "11:00" },
      domingo: { descanso: true }
    }
  },
  {
    id: 4,
    codigo: "EMP-004",
    nombre: "María",
    apellido: "López",
    email: "maria.lopez@bakerysoft.com",
    telefono: "+1234567893",
    direccion: "Barrio Norte 321",
    fechaNacimiento: "1992-05-18",
    fechaIngreso: "2022-02-14",
    puesto: "Vendedora",
    departamento: "Ventas",
    salario: 1200.00,
    tipoContrato: "indefinido",
    estado: "activo",
    avatar: "👩‍💼",
    horario: {
      lunes: { entrada: "07:00", salida: "16:00" },
      martes: { entrada: "07:00", salida: "16:00" },
      miercoles: { entrada: "07:00", salida: "16:00" },
      jueves: { entrada: "07:00", salida: "16:00" },
      viernes: { entrada: "07:00", salida: "16:00" },
      sabado: { entrada: "07:00", salida: "15:00" },
      domingo: { entrada: "08:00", salida: "14:00" }
    }
  }
];

export const asistencia = [
  {
    id: 1,
    empleadoId: 1,
    fecha: "2024-01-07",
    entrada: "08:05",
    salida: "17:10",
    horasTrabajadas: 9.08,
    horasExtras: 0.08,
    estado: "presente",
    observaciones: "Llegada 5 min tarde"
  },
  {
    id: 2,
    empleadoId: 2,
    fecha: "2024-01-07",
    entrada: "04:55",
    salida: "14:00",
    horasTrabajadas: 9.08,
    horasExtras: 0,
    estado: "presente",
    observaciones: ""
  },
  {
    id: 3,
    empleadoId: 3,
    fecha: "2024-01-07",
    entrada: "04:00",
    salida: "13:15",
    horasTrabajadas: 9.25,
    horasExtras: 0.25,
    estado: "presente",
    observaciones: "Hora extra por pedido especial"
  },
  {
    id: 4,
    empleadoId: 4,
    fecha: "2024-01-07",
    entrada: "07:00",
    salida: "16:00",
    horasTrabajadas: 9,
    horasExtras: 0,
    estado: "presente",
    observaciones: ""
  }
];

export const nomina = [
  {
    id: 1,
    empleadoId: 1,
    periodo: "2024-01",
    salarioBase: 2500.00,
    horasExtras: 8,
    valorHoraExtra: 15.63,
    bonificaciones: 200.00,
    deducciones: {
      seguroSocial: 250.00,
      impuestos: 300.00,
      otros: 50.00
    },
    totalDeducciones: 600.00,
    salarioNeto: 2225.00,
    estado: "calculado"
  },
  {
    id: 2,
    empleadoId: 2,
    periodo: "2024-01",
    salarioBase: 2200.00,
    horasExtras: 4,
    valorHoraExtra: 13.75,
    bonificaciones: 150.00,
    deducciones: {
      seguroSocial: 220.00,
      impuestos: 260.00,
      otros: 30.00
    },
    totalDeducciones: 510.00,
    salarioNeto: 1895.00,
    estado: "calculado"
  }
];

export const evaluaciones = [
  {
    id: 1,
    empleadoId: 2,
    fecha: "2023-12-15",
    periodo: "2023-Q4",
    evaluador: "Carlos Administrador",
    criterios: {
      puntualidad: { puntuacion: 9, peso: 20 },
      calidad: { puntuacion: 10, peso: 30 },
      productividad: { puntuacion: 8, peso: 25 },
      trabajo_equipo: { puntuacion: 9, peso: 15 },
      iniciativa: { puntuacion: 8, peso: 10 }
    },
    puntuacionTotal: 8.85,
    comentarios: "Excelente desempeño en calidad de productos. Mantiene estándares altos consistentemente.",
    objetivos: [
      "Capacitar a nuevo personal en técnicas de panadería",
      "Desarrollar nueva línea de productos integrales"
    ],
    estado: "completada"
  }
];

export const capacitaciones = [
  {
    id: 1,
    titulo: "Seguridad Alimentaria HACCP",
    descripcion: "Curso de análisis de peligros y puntos críticos de control",
    instructor: "Instituto de Seguridad Alimentaria",
    fechaInicio: "2024-01-15",
    fechaFin: "2024-01-17",
    duracion: 24, // horas
    modalidad: "presencial",
    participantes: [1, 2, 3],
    estado: "programada",
    costo: 450.00
  },
  {
    id: 2,
    titulo: "Técnicas Avanzadas de Repostería",
    descripcion: "Curso especializado en decoración y técnicas modernas",
    instructor: "Chef Internacional María Delgado",
    fechaInicio: "2024-02-01",
    fechaFin: "2024-02-03",
    duracion: 18,
    modalidad: "presencial",
    participantes: [2],
    estado: "programada",
    costo: 680.00
  }
];

export const departamentos = [
  { id: 1, nombre: "Administración", jefe: 1, empleados: 1 },
  { id: 2, nombre: "Producción", jefe: 2, empleados: 2 },
  { id: 3, nombre: "Ventas", jefe: 4, empleados: 1 },
  { id: 4, nombre: "Mantenimiento", jefe: null, empleados: 0 }
];

export const puestos = [
  { id: 1, nombre: "Gerente General", salarioMin: 2000, salarioMax: 3000 },
  { id: 2, nombre: "Chef Principal", salarioMin: 1800, salarioMax: 2500 },
  { id: 3, nombre: "Panadero Senior", salarioMin: 1500, salarioMax: 2000 },
  { id: 4, nombre: "Panadero Junior", salarioMin: 1000, salarioMax: 1500 },
  { id: 5, nombre: "Vendedor", salarioMin: 800, salarioMax: 1500 },
  { id: 6, nombre: "Cajero", salarioMin: 800, salarioMax: 1200 }
];