/**
 * Catálogo de nichos en español para inspirar búsquedas.
 * Estructura: Categoría → Nicho → Subnicho → Micronicho (hoja).
 * Seleccionar cualquier nivel rellena el buscador con ese término.
 */

export interface Subniche {
  label: string;
  micro: string[];
}
export interface Niche {
  label: string;
  subniches: Subniche[];
}
export interface Category {
  id: string;
  label: string;
  emoji: string;
  niches: Niche[];
}

export const NICHE_CATALOG: Category[] = [
  {
    id: "salud",
    label: "Salud",
    emoji: "🩺",
    niches: [
      {
        label: "Salud mental",
        subniches: [
          {
            label: "Ansiedad y estrés",
            micro: ["ataques de pánico", "estrés laboral", "ansiedad social", "burnout", "ataques de ira", "respiración para la calma"],
          },
          {
            label: "Sueño",
            micro: ["insomnio", "apnea del sueño", "higiene del sueño", "ruido blanco", "despertar descansado", "siestas energéticas"],
          },
          {
            label: "Terapia y bienestar",
            micro: ["terapia online", "meditación guiada", "diario emocional", "gratitud diaria", "mindfulness", "autoestima"],
          },
          {
            label: "Estados de ánimo",
            micro: ["depresión", "seguimiento del ánimo", "soledad", "duelo y pérdida", "TDAH adultos"],
          },
        ],
      },
      {
        label: "Nutrición",
        subniches: [
          {
            label: "Dietas",
            micro: ["conteo de calorías", "ayuno intermitente", "dieta keto", "dieta mediterránea", "vegano/vegetariano", "déficit calórico"],
          },
          {
            label: "Alergias e intolerancias",
            micro: ["sin gluten", "intolerancia a la lactosa", "alergias alimentarias", "etiquetas de ingredientes", "dieta FODMAP"],
          },
          {
            label: "Planificación de comidas",
            micro: ["meal prep", "listas de compra", "recetas saludables", "comer con presupuesto", "batch cooking", "macros"],
          },
          {
            label: "Hidratación y suplementos",
            micro: ["recordatorio de agua", "vitaminas", "proteína", "creatina", "control de cafeína"],
          },
        ],
      },
      {
        label: "Condiciones crónicas",
        subniches: [
          {
            label: "Diabetes",
            micro: ["control de glucosa", "conteo de carbohidratos", "diabetes tipo 2", "monitor continuo de glucosa", "recordatorio de insulina"],
          },
          {
            label: "Dolor crónico",
            micro: ["migraña", "dolor de espalda", "fibromialgia", "artritis", "registro de síntomas"],
          },
          {
            label: "Salud femenina",
            micro: ["seguimiento menstrual", "menopausia", "fertilidad", "embarazo", "ovulación", "endometriosis"],
          },
          {
            label: "Medicación",
            micro: ["recordatorio de pastillas", "interacciones de fármacos", "adherencia al tratamiento", "botiquín familiar"],
          },
        ],
      },
      {
        label: "Adicciones y hábitos",
        subniches: [
          {
            label: "Dejar hábitos",
            micro: ["dejar de fumar", "dejar el alcohol", "dejar el azúcar", "control de pornografía", "menos tiempo en redes"],
          },
          {
            label: "Construir hábitos",
            micro: ["seguimiento de hábitos", "rachas diarias", "rutina de mañana", "rutina de noche"],
          },
        ],
      },
    ],
  },
  {
    id: "amor",
    label: "Amor y relaciones",
    emoji: "❤️",
    niches: [
      {
        label: "Citas (dating)",
        subniches: [
          {
            label: "Apps de citas",
            micro: ["fatiga de apps de citas", "perfiles falsos", "ghosting", "fotos de perfil", "mensajes de apertura", "verificación de identidad"],
          },
          {
            label: "Conocer gente",
            micro: ["citas para introvertidos", "citas mayores de 40", "citas de nicho", "citas LGBT", "conocer por hobbies", "citas sin apps"],
          },
          {
            label: "Primera cita",
            micro: ["ideas de citas", "romper el hielo", "seguridad en citas", "citas baratas", "temas de conversación"],
          },
        ],
      },
      {
        label: "Pareja",
        subniches: [
          {
            label: "Comunicación",
            micro: ["resolver discusiones", "lenguajes del amor", "terapia de pareja", "escucha activa", "celos y confianza"],
          },
          {
            label: "Convivencia",
            micro: ["finanzas en pareja", "reparto de tareas", "planificar juntos", "metas de pareja", "calendario compartido"],
          },
          {
            label: "Distancia",
            micro: ["relaciones a distancia", "citas virtuales", "mantener la chispa", "zonas horarias", "juegos para parejas"],
          },
          {
            label: "Intimidad",
            micro: ["reavivar la pasión", "ideas de intimidad", "preguntas profundas", "noche de cita en casa"],
          },
        ],
      },
      {
        label: "Familia y amistad",
        subniches: [
          {
            label: "Amistades",
            micro: ["hacer amigos de adulto", "reconectar amistades", "soledad", "planes con amigos", "amigos por intereses"],
          },
          {
            label: "Eventos",
            micro: ["organizar bodas", "aniversarios", "regalos personalizados", "recordar fechas importantes", "despedidas de soltero"],
          },
        ],
      },
      {
        label: "Rupturas",
        subniches: [
          {
            label: "Superar una ruptura",
            micro: ["pasar página", "contacto cero", "sanar el corazón", "volver a salir", "autoestima tras ruptura"],
          },
        ],
      },
    ],
  },
  {
    id: "dinero",
    label: "Dinero y finanzas",
    emoji: "💰",
    niches: [
      {
        label: "Finanzas personales",
        subniches: [
          {
            label: "Presupuesto",
            micro: ["control de gastos", "app de presupuesto", "ahorro automático", "regla 50/30/20", "fondo de emergencia", "gastos hormiga"],
          },
          {
            label: "Deudas",
            micro: ["pagar tarjetas de crédito", "consolidar deudas", "préstamos estudiantiles", "método bola de nieve", "salir de deudas"],
          },
          {
            label: "Suscripciones",
            micro: ["cancelar suscripciones", "gastos recurrentes", "pruebas gratis olvidadas", "compartir suscripciones", "auditoría de cobros"],
          },
          {
            label: "Ahorro",
            micro: ["metas de ahorro", "reto de ahorro", "ahorrar para un viaje", "ahorrar para una casa", "redondeo de compras"],
          },
        ],
      },
      {
        label: "Inversión",
        subniches: [
          {
            label: "Bolsa",
            micro: ["invertir para principiantes", "ETFs", "dividendos", "interés compuesto", "DCA", "análisis de acciones"],
          },
          {
            label: "Cripto",
            micro: ["seguimiento de cripto", "wallets", "impuestos de cripto", "staking", "DeFi", "alertas de precio"],
          },
          {
            label: "Retiro",
            micro: ["plan de pensiones", "independencia financiera", "FIRE", "rentas vitalicias", "calculadora de retiro"],
          },
          {
            label: "Bienes raíces",
            micro: ["invertir en propiedades", "rentas vacacionales", "calculadora hipotecaria", "casa propia vs renta"],
          },
        ],
      },
      {
        label: "Negocios e ingresos",
        subniches: [
          {
            label: "Freelance",
            micro: ["facturación freelance", "encontrar clientes", "cobrar a tiempo", "contratos", "fijar precios", "portafolio"],
          },
          {
            label: "Ecommerce",
            micro: ["vender en línea", "dropshipping", "gestión de inventario", "Amazon FBA", "print on demand", "logística de envíos"],
          },
          {
            label: "Ingresos pasivos",
            micro: ["side hustles", "monetizar contenido", "rentas", "afiliados", "vender plantillas", "cursos online"],
          },
          {
            label: "Impuestos y contabilidad",
            micro: ["declaración de impuestos", "facturas y recibos", "deducciones", "contabilidad para autónomos"],
          },
        ],
      },
    ],
  },
  {
    id: "productividad",
    label: "Productividad",
    emoji: "⚡",
    niches: [
      {
        label: "Gestión de tareas",
        subniches: [
          {
            label: "To-do y hábitos",
            micro: ["listas de tareas", "seguimiento de hábitos", "procrastinación", "priorizar tareas", "GTD", "tareas recurrentes"],
          },
          {
            label: "Enfoque",
            micro: ["técnica pomodoro", "bloqueo de distracciones", "trabajo profundo", "bloqueo de apps", "música para concentrarse"],
          },
          {
            label: "Gestión del tiempo",
            micro: ["time blocking", "calendario", "decir que no", "reuniones eficientes", "registro de tiempo"],
          },
        ],
      },
      {
        label: "Notas y conocimiento",
        subniches: [
          {
            label: "Tomar notas",
            micro: ["notas de reuniones", "segundo cerebro", "organizar ideas", "notas por voz", "resúmenes con IA"],
          },
          {
            label: "Estudio",
            micro: ["flashcards", "resúmenes", "técnicas de memoria", "repetición espaciada", "preparar exámenes"],
          },
        ],
      },
      {
        label: "Trabajo remoto",
        subniches: [
          {
            label: "Equipos remotos",
            micro: ["coordinar zonas horarias", "reuniones asíncronas", "documentación de equipo", "onboarding remoto"],
          },
          {
            label: "Nómadas digitales",
            micro: ["trabajar viajando", "coworkings", "visas de nómada", "internet en cualquier lugar"],
          },
        ],
      },
    ],
  },
  {
    id: "fitness",
    label: "Fitness y deporte",
    emoji: "💪",
    niches: [
      {
        label: "Entrenamiento",
        subniches: [
          {
            label: "Gimnasio",
            micro: ["rutinas de gym", "seguimiento de progreso", "entrenar en casa", "hipertrofia", "fuerza", "registro de series"],
          },
          {
            label: "Cardio",
            micro: ["running", "ciclismo", "natación", "plan de maratón", "HIIT", "caminar 10k pasos"],
          },
          {
            label: "Calistenia y movilidad",
            micro: ["calistenia", "estiramientos", "movilidad", "yoga en casa", "pilates"],
          },
        ],
      },
      {
        label: "Bienestar físico",
        subniches: [
          {
            label: "Recuperación",
            micro: ["prevención de lesiones", "descanso muscular", "masaje y foam roller", "dolor post-entreno"],
          },
          {
            label: "Composición corporal",
            micro: ["perder grasa", "ganar músculo", "recomposición", "medidas corporales", "fotos de progreso"],
          },
        ],
      },
      {
        label: "Deportes",
        subniches: [
          {
            label: "Deportes específicos",
            micro: ["fútbol amateur", "tenis", "escalada", "crossfit", "artes marciales", "golf"],
          },
        ],
      },
    ],
  },
  {
    id: "educacion",
    label: "Educación y carrera",
    emoji: "🎓",
    niches: [
      {
        label: "Aprender",
        subniches: [
          {
            label: "Idiomas",
            micro: ["aprender inglés", "práctica de conversación", "vocabulario", "acento y pronunciación", "intercambio de idiomas"],
          },
          {
            label: "Habilidades",
            micro: ["programación", "diseño", "marketing digital", "excel", "música/instrumentos", "dibujo"],
          },
          {
            label: "Estudiar mejor",
            micro: ["concentración para estudiar", "planificar el semestre", "grupos de estudio", "no procrastinar tareas"],
          },
        ],
      },
      {
        label: "Trabajo",
        subniches: [
          {
            label: "Empleo",
            micro: ["buscar trabajo", "currículum", "entrevistas", "LinkedIn", "carta de presentación", "seguimiento de postulaciones"],
          },
          {
            label: "Carrera",
            micro: ["cambio de carrera", "trabajo remoto", "burnout laboral", "pedir aumento", "networking", "marca personal"],
          },
        ],
      },
    ],
  },
  {
    id: "hogar",
    label: "Hogar y familia",
    emoji: "🏠",
    niches: [
      {
        label: "Organización del hogar",
        subniches: [
          {
            label: "Tareas del hogar",
            micro: ["limpieza", "lista de compras del hogar", "mantenimiento", "reparto de tareas en casa", "decluttering"],
          },
          {
            label: "Finanzas del hogar",
            micro: ["gastos del hogar", "recibos y facturas", "presupuesto familiar"],
          },
        ],
      },
      {
        label: "Crianza",
        subniches: [
          {
            label: "Bebés",
            micro: ["rutinas de bebés", "seguimiento de lactancia", "sueño del bebé", "pañales y tomas", "hitos del desarrollo"],
          },
          {
            label: "Niños",
            micro: ["control de pantallas", "actividades para niños", "tareas escolares", "recompensas y rutinas", "alimentación infantil"],
          },
          {
            label: "Adolescentes",
            micro: ["comunicación con adolescentes", "uso responsable del móvil", "orientación vocacional"],
          },
        ],
      },
      {
        label: "Jardín y DIY",
        subniches: [
          {
            label: "Casa y jardín",
            micro: ["cuidado de plantas", "huerto en casa", "proyectos DIY", "decoración del hogar"],
          },
        ],
      },
    ],
  },
  {
    id: "mascotas",
    label: "Mascotas",
    emoji: "🐾",
    niches: [
      {
        label: "Perros y gatos",
        subniches: [
          {
            label: "Cuidado",
            micro: ["salud de mascotas", "vacunas y desparasitación", "alimentación", "control de peso", "peluquería"],
          },
          {
            label: "Entrenamiento",
            micro: ["adiestramiento de perros", "ansiedad por separación", "socialización", "enseñar trucos"],
          },
          {
            label: "Día a día",
            micro: ["paseadores de perros", "guardería canina", "recordatorios de cuidados", "comunidad de dueños"],
          },
        ],
      },
      {
        label: "Otras mascotas",
        subniches: [
          {
            label: "Especies",
            micro: ["acuarios", "aves", "reptiles", "conejos y roedores"],
          },
        ],
      },
    ],
  },
  {
    id: "comida",
    label: "Comida y cocina",
    emoji: "🍳",
    niches: [
      {
        label: "Cocinar en casa",
        subniches: [
          {
            label: "Recetas",
            micro: ["recetas con lo que tengo", "recetas rápidas", "cocina para uno", "postres", "recetas internacionales"],
          },
          {
            label: "Organización",
            micro: ["planificar el menú semanal", "lista de despensa", "evitar desperdicio de comida", "fechas de caducidad"],
          },
        ],
      },
      {
        label: "Comer fuera",
        subniches: [
          {
            label: "Restaurantes",
            micro: ["recomendaciones de restaurantes", "reservas", "dividir la cuenta", "opciones para alérgicos"],
          },
        ],
      },
    ],
  },
  {
    id: "tecnologia",
    label: "Tecnología e IA",
    emoji: "🤖",
    niches: [
      {
        label: "Inteligencia artificial",
        subniches: [
          {
            label: "Herramientas de IA",
            micro: ["organizar prompts", "comparar modelos de IA", "asistentes de IA", "automatizar tareas con IA", "resumir documentos"],
          },
          {
            label: "IA para creadores",
            micro: ["generar imágenes", "editar video con IA", "voz e doblaje", "guiones con IA"],
          },
        ],
      },
      {
        label: "Vida digital",
        subniches: [
          {
            label: "Privacidad y seguridad",
            micro: ["gestor de contraseñas", "proteger datos personales", "antiphishing", "VPN", "control de permisos de apps"],
          },
          {
            label: "Dispositivos",
            micro: ["respaldos automáticos", "liberar almacenamiento", "domótica/casa inteligente", "gestión de archivos"],
          },
        ],
      },
    ],
  },
  {
    id: "creadores",
    label: "Creadores y contenido",
    emoji: "🎬",
    niches: [
      {
        label: "Redes sociales",
        subniches: [
          {
            label: "Crecer audiencia",
            micro: ["ideas de contenido", "calendario de publicaciones", "programar posts", "analizar métricas", "hashtags"],
          },
          {
            label: "Formatos",
            micro: ["edición de Reels/TikTok", "guiones de video", "miniaturas", "subtítulos automáticos", "repurposing de contenido"],
          },
        ],
      },
      {
        label: "Monetización",
        subniches: [
          {
            label: "Ingresos de creador",
            micro: ["patrocinios", "membresías", "vender a la audiencia", "newsletter", "kit de medios"],
          },
        ],
      },
    ],
  },
  {
    id: "emprendimiento",
    label: "Emprendimiento",
    emoji: "🚀",
    niches: [
      {
        label: "Empezar un negocio",
        subniches: [
          {
            label: "Idea y validación",
            micro: ["validar una idea", "estudio de mercado", "encontrar un nicho", "analizar competencia", "MVP"],
          },
          {
            label: "Lanzamiento",
            micro: ["conseguir primeros clientes", "landing page", "lista de espera", "lanzar en Product Hunt"],
          },
        ],
      },
      {
        label: "Operación",
        subniches: [
          {
            label: "Gestión",
            micro: ["CRM simple", "gestión de proyectos", "atención al cliente", "agendar citas", "cobrar a clientes"],
          },
          {
            label: "Marketing",
            micro: ["email marketing", "SEO", "anuncios", "referidos", "cold email"],
          },
        ],
      },
    ],
  },
  {
    id: "viajes",
    label: "Viajes y ocio",
    emoji: "✈️",
    niches: [
      {
        label: "Planificar viajes",
        subniches: [
          {
            label: "Itinerarios",
            micro: ["organizar viajes", "presupuesto de viaje", "viajar en grupo", "itinerario día a día", "viajar solo"],
          },
          {
            label: "Reservas",
            micro: ["vuelos baratos", "alojamiento", "equipaje", "alertas de precios", "puntos y millas"],
          },
          {
            label: "En el destino",
            micro: ["qué hacer cerca", "mapas offline", "traductor de viaje", "gastos del viaje", "diario de viaje"],
          },
        ],
      },
      {
        label: "Ocio",
        subniches: [
          {
            label: "Entretenimiento",
            micro: ["qué película ver", "organizar quedadas", "eventos cerca de mí", "juegos de mesa", "clubes de lectura"],
          },
        ],
      },
    ],
  },
];
