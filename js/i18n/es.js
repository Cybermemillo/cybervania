/**
 * Configuración de idioma español para Cybervania
 */
export const es = {
    // Menú principal
    mainMenu: {
        title: "CYBERVANIA",
        subtitle: "La oscuridad digital te espera",
        newGame: "Nueva Partida",
        loadGame: "Cargar Partida",
        options: "Opciones",
        credits: "Créditos",
        exit: "Salir"
    },
    
    // Creación de personaje
    character: {
        title: "Creación de Personaje",
        name: "Nombre",
        gender: {
            label: "Género",
            male: "Masculino",
            female: "Femenino",
            other: "Otro"
        },
        specialization: {
            title: "Especialización",
            offense: {
                name: "Cazador Digital",
                description: "Especialista en ataque. Mayor daño pero más vulnerable."
            },
            defense: {
                name: "Guardia Cyber",
                description: "Especialista en defensa. Mayor resistencia pero menos ofensivo."
            },
            balanced: {
                name: "Híbrido Arcano",
                description: "Equilibrado con habilidades especiales. Un punto de acción adicional."
            }
        },
        backstory: "Historia",
        stats: {
            health: "Salud",
            attack: "Ataque",
            defense: "Defensa",
            energy: "Energía",
            actions: "Acciones"
        },
        create: "Crear Personaje",
        back: "Volver",
        nameRequired: "El nombre es obligatorio",
        backstoryPlaceholder: "Escribe brevemente la historia de tu personaje..."
    },
    
    // Pantalla de carga
    loadGame: {
        title: "Cargar Partida",
        empty: "Ranura vacía",
        slot: "Ranura",
        level: "Nivel",
        lastSaved: "Guardado",
        load: "Cargar",
        delete: "Borrar",
        back: "Volver",
        noSaves: "No hay partidas guardadas",
        confirmDelete: "¿Estás seguro de que quieres borrar esta partida?",
        yes: "Sí",
        no: "No"
    },
    
    // Opciones
    options: {
        title: "Opciones",
        audio: {
            title: "Audio",
            music: "Volumen de música",
            sfx: "Volumen de efectos",
            mute: "Silenciar todo"
        },
        graphics: {
            title: "Gráficos",
            quality: "Calidad visual",
            low: "Baja",
            medium: "Media",
            high: "Alta",
            fullscreen: "Pantalla completa"
        },
        gameplay: {
            title: "Jugabilidad",
            difficulty: "Dificultad",
            easy: "Fácil",
            normal: "Normal",
            hard: "Difícil",
            tutorialTips: "Consejos de tutorial"
        },
        accessibility: {
            title: "Accesibilidad",
            textSize: "Tamaño de texto",
            small: "Pequeño",
            medium: "Mediano",
            large: "Grande",
            highContrast: "Alto contraste"
        },
        language: "Idioma",
        save: "Guardar Cambios",
        reset: "Restablecer",
        back: "Volver"
    },
    
    // Créditos
    credits: {
        title: "Créditos",
        development: "Desarrollo",
        art: "Arte",
        music: "Música",
        testing: "Pruebas",
        special: "Agradecimientos Especiales",
        back: "Volver"
    },
    
    // Mensajes generales
    messages: {
        loading: "Cargando...",
        saving: "Guardando...",
        confirmExit: "¿Estás seguro de que quieres salir?",
        yes: "Sí",
        no: "No",
        ok: "Aceptar",
        cancel: "Cancelar",
        error: "Error",
        success: "Éxito"
    }
};
