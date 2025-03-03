export const EVENTS = {
    // Eventos básicos
    abandoned_terminal: {
        id: "abandoned_terminal",
        name: "Terminal Abandonado",
        description: "Descubres una antigua terminal con acceso parcial a la red. Podría contener información útil, pero también podría alertar a los enemigos cercanos.",
        minFloor: 1,
        image: "event-terminal",
        options: [
            {
                id: "hack",
                name: "Hackear el terminal",
                description: "Intenta extraer información útil.",
                outcomes: [
                    {
                        chance: 0.7,
                        result: "Consigues acceder a una base de datos con información valiosa.",
                        effects: [
                            { type: "draw_card", rarity: "uncommon", team: "random" },
                            { type: "credits", value: 15 }
                        ]
                    },
                    {
                        chance: 0.3,
                        result: "¡El terminal activa una alarma silenciosa! Enemigos se acercan a tu posición.",
                        effects: [
                            { type: "combat", enemyId: "spyware_gargoyle" }
                        ]
                    }
                ]
            },
            {
                id: "analyze",
                name: "Analizar sin conectarte",
                description: "Examina el terminal con precaución.",
                outcomes: [
                    {
                        chance: 0.5,
                        result: "Encuentras una vulnerabilidad que te permite extraer datos seguros.",
                        effects: [
                            { type: "card_choice", count: 1, rarity: "uncommon" }
                        ]
                    },
                    {
                        chance: 0.5,
                        result: "El análisis revela que el terminal no tiene información útil.",
                        effects: []
                    }
                ]
            },
            {
                id: "ignore",
                name: "Ignorar",
                description: "Mejor no arriesgarse.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Decides que es demasiado arriesgado y continúas tu camino.",
                        effects: []
                    }
                ]
            }
        ]
    },
    
    ctf_challenge: {
        id: "ctf_challenge",
        name: "Desafío CTF",
        description: "Una interfaz holográfica aparece ante ti, presentando un desafío de 'Capture The Flag'. Resolver este reto podría mejorar tus habilidades.",
        minFloor: 1,
        image: "event-ctf",
        options: [
            {
                id: "accept",
                name: "Aceptar el desafío",
                description: "Intentar resolver el CTF.",
                outcomes: [
                    {
                        chance: 0.6,
                        skillCheck: "hacking",
                        threshold: 3,
                        result: "¡Resuelves el desafío con éxito! Obtienes acceso a una potente herramienta digital.",
                        effects: [
                            { type: "card_specific", cardId: "zero_day" }
                        ]
                    },
                    {
                        chance: 0.4,
                        result: "El desafío es más complicado de lo esperado, pero aprendes de tus errores.",
                        effects: [
                            { type: "upgrade_random_card" },
                            { type: "skill_increase", skill: "hacking", value: 1 }
                        ]
                    }
                ]
            },
            {
                id: "analyze_first",
                name: "Analizar antes de intentarlo",
                description: "Examinar el desafío en busca de pistas.",
                outcomes: [
                    {
                        chance: 0.8,
                        result: "Tu análisis revela un enfoque óptimo para resolver el desafío.",
                        effects: [
                            { type: "card_choice", count: 2, rarity: "uncommon", team: "purple" }
                        ]
                    },
                    {
                        chance: 0.2,
                        result: "El análisis activa una trampa en el sistema.",
                        effects: [
                            { type: "damage", value: 5 }
                        ]
                    }
                ]
            },
            {
                id: "ignore",
                name: "Ignorar el desafío",
                description: "No vale la pena el riesgo.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Decides no participar en el CTF y sigues tu camino.",
                        effects: []
                    }
                ]
            }
        ]
    },
    
    digital_shrine: {
        id: "digital_shrine",
        name: "Santuario Digital",
        description: "Encuentras un antiguo santuario digital donde los hackers dejaban ofrendas. Las inscripciones sugieren que aquí se pueden obtener bendiciones... por un precio.",
        minFloor: 2,
        image: "event-shrine",
        options: [
            {
                id: "pray",
                name: "Ofrecer créditos",
                description: "Dona 25 créditos al santuario.",
                requirement: { type: "credits", value: 25 },
                outcomes: [
                    {
                        chance: 1,
                        result: "El santuario brilla con energía digital y sientes una nueva fuerza fluyendo por tu sistema.",
                        effects: [
                            { type: "max_health", value: 7 },
                            { type: "heal", value: 15 }
                        ]
                    }
                ]
            },
            {
                id: "sacrifice_card",
                name: "Sacrificar una carta",
                description: "Ofrecer una carta de tu mazo.",
                outcomes: [
                    {
                        chance: 1,
                        result: "El santuario acepta tu sacrificio. A cambio, una nueva herramienta aparece.",
                        effects: [
                            { type: "remove_card" },
                            { type: "card_choice", count: 1, rarity: "rare" }
                        ]
                    }
                ]
            },
            {
                id: "blood_offering",
                name: "Ofrenda de salud",
                description: "Sacrifica 10 puntos de salud.",
                outcomes: [
                    {
                        chance: 1,
                        result: "El dolor es intenso mientras el santuario extrae tu energía vital, pero a cambio recibes conocimiento.",
                        effects: [
                            { type: "damage", value: 10 },
                            { type: "upgrade_all_cards" }
                        ]
                    }
                ]
            },
            {
                id: "ignore",
                name: "Ignorar el santuario",
                description: "Mejor no interferir con fuerzas que no comprendes.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Decides no interactuar con el misterioso santuario y sigues tu camino.",
                        effects: []
                    }
                ]
            }
        ]
    },
    
    code_anomaly: {
        id: "code_anomaly",
        name: "Anomalía en el Código",
        description: "Detectas una extraña inestabilidad en el código del entorno. Podría ser peligroso, pero también una oportunidad para manipular la realidad digital.",
        minFloor: 3,
        image: "event-anomaly",
        options: [
            {
                id: "exploit",
                name: "Explotar la anomalía",
                description: "Intenta manipular el código para tu beneficio.",
                outcomes: [
                    {
                        chance: 0.5,
                        result: "¡Logras controlar la anomalía! El código se reescribe a tu favor.",
                        effects: [
                            { type: "transform_cards", count: 3, target: "random", quality: "improve" }
                        ]
                    },
                    {
                        chance: 0.5,
                        result: "La anomalía se desestabiliza bajo tu influencia, causando una reacción en cadena.",
                        effects: [
                            { type: "transform_cards", count: 3, target: "random", quality: "random" },
                            { type: "damage", value: 12 }
                        ]
                    }
                ]
            },
            {
                id: "stabilize",
                name: "Estabilizar el código",
                description: "Intenta reparar la anomalía.",
                outcomes: [
                    {
                        chance: 0.7,
                        result: "Logras estabilizar la anomalía. El sistema te recompensa por la reparación.",
                        effects: [
                            { type: "heal", value: 15 },
                            { type: "credits", value: 20 }
                        ]
                    },
                    {
                        chance: 0.3,
                        result: "Tus intentos de reparación fallan, y la anomalía te arrastra momentáneamente.",
                        effects: [
                            { type: "confuse_cards", count: 3 }
                        ]
                    }
                ]
            },
            {
                id: "analyze",
                name: "Analizar sin intervenir",
                description: "Estudia la anomalía desde una distancia segura.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Observas cuidadosamente la anomalía y aprendes valiosas lecciones sobre el comportamiento del código.",
                        effects: [
                            { type: "card_choice", count: 1, rarity: "uncommon" },
                            { type: "skill_increase", skill: "both", value: 1 }
                        ]
                    }
                ]
            }
        ]
    },

    encrypted_cache: {
        id: "encrypted_cache",
        name: "Caché Cifrado",
        description: "Descubres un caché de datos altamente cifrado. Parece contener información valiosa, pero acceder a ella requerirá habilidades de descifrado.",
        minFloor: 2,
        image: "event-cache",
        options: [
            {
                id: "brute_force",
                name: "Fuerza bruta",
                description: "Intenta todas las combinaciones posibles.",
                outcomes: [
                    {
                        chance: 0.4,
                        result: "¡Funcionó! Después de múltiples intentos, el caché se abre revelando su contenido.",
                        effects: [
                            { type: "card_choice", count: 2, rarity: "rare" },
                            { type: "credits", value: 30 }
                        ]
                    },
                    {
                        chance: 0.6,
                        result: "El sistema detecta tus intentos y activa contramedidas.",
                        effects: [
                            { type: "damage", value: 15 }
                        ]
                    }
                ]
            },
            {
                id: "decrypt",
                name: "Descifrar con cuidado",
                description: "Utiliza técnicas avanzadas de criptoanálisis.",
                skill: "hacking",
                difficulty: 4,
                outcomes: [
                    {
                        chance: 0.8,
                        skillCheck: "hacking",
                        threshold: 4,
                        result: "Tu enfoque metódico es efectivo. El caché revela contraseñas y accesos privilegiados.",
                        effects: [
                            { type: "add_specific_card", cardId: "masterkey" },
                            { type: "credits", value: 15 }
                        ]
                    },
                    {
                        chance: 0.2,
                        result: "A pesar de tus esfuerzos, no logras romper la encriptación.",
                        effects: [
                            { type: "credits", value: 5 }
                        ]
                    }
                ]
            },
            {
                id: "leave",
                name: "Dejar el caché",
                description: "Podría ser una trampa. Mejor seguir adelante.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Decides no arriesgarte con el caché cifrado.",
                        effects: []
                    }
                ]
            }
        ]
    },
    
    hacker_merchant: {
        id: "hacker_merchant",
        name: "Mercader del Mercado Negro",
        description: "Un misterioso vendedor con una interfaz encriptada te ofrece servicios especiales que no encontrarás en las tiendas convencionales.",
        minFloor: 3,
        image: "event-merchant",
        options: [
            {
                id: "buy_forbidden",
                name: "Comprar software prohibido",
                description: "45 créditos: Adquirir una poderosa herramienta ilegal.",
                requirement: { type: "credits", value: 45 },
                outcomes: [
                    {
                        chance: 1,
                        result: "El mercader te entrega un paquete de software altamente sofisticado.",
                        effects: [
                            { type: "add_specific_card", cardId: "black_market_exploit", upgraded: true }
                        ]
                    }
                ]
            },
            {
                id: "buy_information",
                name: "Comprar información",
                description: "30 créditos: Obtener inteligencia sobre tus enemigos.",
                requirement: { type: "credits", value: 30 },
                outcomes: [
                    {
                        chance: 1,
                        result: "El mercader te revela detalles sobre la estructura de seguridad que enfrentarás.",
                        effects: [
                            { type: "reveal_map" },
                            { type: "skill_increase", skill: "both", value: 2 }
                        ]
                    }
                ]
            },
            {
                id: "card_modification",
                name: "Servicio de modificación",
                description: "20 créditos: Modificar una carta de tu mazo.",
                requirement: { type: "credits", value: 20 },
                outcomes: [
                    {
                        chance: 1,
                        result: "El mercader toma una de tus herramientas y la modifica con tecnología avanzada.",
                        effects: [
                            { type: "transform_card", target: "choose", quality: "improve" }
                        ]
                    }
                ]
            },
            {
                id: "leave",
                name: "Rechazar los servicios",
                description: "No confías en este mercader.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Decides no hacer negocios con el sospechoso mercader y sigues tu camino.",
                        effects: []
                    }
                ]
            }
        ]
    },
    
    // Eventos avanzados (disponibles en pisos superiores)
    neural_interface: {
        id: "neural_interface",
        name: "Interfaz Neural Experimental",
        description: "Encuentras una estación de interfaz neural que promete mejorar tus capacidades cognitivas, pero podría tener efectos secundarios imprevistos.",
        minFloor: 5,
        image: "event-neural",
        options: [
            {
                id: "full_integration",
                name: "Integración completa",
                description: "Conectar tu mente directamente a la interfaz.",
                outcomes: [
                    {
                        chance: 0.6,
                        result: "La interfaz amplifica tus capacidades neuronales, permitiéndote procesar información a velocidades sobrehumanas.",
                        effects: [
                            { type: "permanent_action_points", value: 1 },
                            { type: "damage", value: 10 }
                        ]
                    },
                    {
                        chance: 0.4,
                        result: "La integración causa una sobrecarga neuronal. Tu mente se defiende, pero el daño está hecho.",
                        effects: [
                            { type: "damage", value: 20 },
                            { type: "confuse_cards", count: 5 }
                        ]
                    }
                ]
            },
            {
                id: "partial_integration",
                name: "Integración parcial",
                description: "Establecer una conexión limitada y controlada.",
                outcomes: [
                    {
                        chance: 0.8,
                        result: "La interfaz limitada funciona correctamente, mejorando tu rendimiento cognitivo.",
                        effects: [
                            { type: "card_draw_increase", value: 1 },
                            { type: "damage", value: 5 }
                        ]
                    },
                    {
                        chance: 0.2,
                        result: "Incluso la conexión limitada causa algunas interferencias mentales.",
                        effects: [
                            { type: "damage", value: 8 }
                        ]
                    }
                ]
            },
            {
                id: "analyze_only",
                name: "Solo analizar",
                description: "Examinar la interfaz sin conectarte a ella.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Estudias cuidadosamente la interfaz y extraes valiosos conocimientos técnicos.",
                        effects: [
                            { type: "upgrade_random_card", count: 2 }
                        ]
                    }
                ]
            }
        ]
    },
    
    quantum_glitch: {
        id: "quantum_glitch",
        name: "Anomalía Cuántica",
        description: "Una extraña fluctuación en la realidad digital crea múltiples versiones de ti mismo en líneas temporales alternativas.",
        minFloor: 6,
        image: "event-quantum",
        options: [
            {
                id: "merge_timelines",
                name: "Fusionar líneas temporales",
                description: "Intenta combinar tus versiones alternativas.",
                outcomes: [
                    {
                        chance: 0.5,
                        result: "¡Éxito! Las versiones alternativas se integran, cada una aportando sus conocimientos únicos.",
                        effects: [
                            { type: "duplicate_random_card", count: 3 },
                            { type: "max_health", value: 10 }
                        ]
                    },
                    {
                        chance: 0.5,
                        result: "La fusión es inestable. Las versiones alternativas luchan por el control, creando conflictos internos.",
                        effects: [
                            { type: "damage", value: 15 },
                            { type: "transform_cards", count: 3, target: "random", quality: "random" }
                        ]
                    }
                ]
            },
            {
                id: "observe",
                name: "Observar alternativas",
                description: "Estudia tus otras versiones sin interactuar directamente.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Observas con fascinación las decisiones que tomaron tus otros yos. Aprendes de sus éxitos y errores.",
                        effects: [
                            { type: "card_choice", count: 1, rarity: "rare" },
                            { type: "skill_increase", skill: "both", value: 2 }
                        ]
                    }
                ]
            },
            {
                id: "collapse_function",
                name: "Colapsar función de onda",
                description: "Fuerza la resolución de la anomalía cuántica.",
                outcomes: [
                    {
                        chance: 0.7,
                        result: "La realidad se estabiliza alrededor de tu versión más fuerte.",
                        effects: [
                            { type: "heal", value: 30 },
                            { type: "remove_card", count: 2, target: "choose" }
                        ]
                    },
                    {
                        chance: 0.3,
                        result: "El colapso cuántico selecciona aleatoriamente entre las versiones de ti mismo.",
                        effects: [
                            { type: "transform_deck", percent: 20 }
                        ]
                    }
                ]
            }
        ]
    },
    
    virtual_arena: {
        id: "virtual_arena",
        name: "Arena Virtual",
        description: "Una simulación de combate de alto nivel que desafía a los mejores hackers. La victoria promete grandes recompensas, pero la derrota puede ser costosa.",
        minFloor: 4,
        image: "event-arena",
        options: [
            {
                id: "enter_tournament",
                name: "Participar en el torneo",
                description: "Enfrentarte a otros hackers en combates simulados.",
                outcomes: [
                    {
                        chance: 0.6,
                        skillCheck: "both",
                        threshold: 10,
                        result: "¡Emerges victorioso! Tu rendimiento en la arena impresiona a todos los presentes.",
                        effects: [
                            { type: "card_choice", count: 2, rarity: "rare" },
                            { type: "credits", value: 50 },
                            { type: "add_artifact", artifactId: "champion_trophy" }
                        ]
                    },
                    {
                        chance: 0.4,
                        result: "La competencia es feroz. Logras un resultado respetable, pero no alcanzas los primeros puestos.",
                        effects: [
                            { type: "card_choice", count: 1, rarity: "uncommon" },
                            { type: "credits", value: 20 },
                            { type: "damage", value: 10 }
                        ]
                    }
                ]
            },
            {
                id: "exhibition_match",
                name: "Participar en combate de exhibición",
                description: "Un solo enfrentamiento contra un oponente destacado.",
                outcomes: [
                    {
                        chance: 0.7,
                        result: "Derrotas a tu oponente con una estrategia brillante, ganando el respeto del público.",
                        effects: [
                            { type: "add_specific_card", cardId: "arena_champion", upgraded: true },
                            { type: "credits", value: 25 }
                        ]
                    },
                    {
                        chance: 0.3,
                        result: "Tu oponente es más fuerte de lo esperado y te derrota, pero aprendes de la experiencia.",
                        effects: [
                            { type: "damage", value: 15 },
                            { type: "skill_increase", skill: "both", value: 2 }
                        ]
                    }
                ]
            },
            {
                id: "observe_matches",
                name: "Observar los combates",
                description: "Estudia las técnicas de otros hackers sin participar.",
                outcomes: [
                    {
                        chance: 1,
                        result: "Observas atentamente las estrategias empleadas en la arena, aprendiendo valiosas tácticas.",
                        effects: [
                            { type: "upgrade_random_card", count: 3 },
                            { type: "skill_increase", skill: "defensive", value: 1 }
                        ]
                    }
                ]
            }
        ]
    }
};
