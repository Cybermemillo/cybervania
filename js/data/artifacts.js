export const ARTIFACTS = {
    // Artefactos comunes
    proxy_server: {
        id: "proxy_server",
        name: "Servidor Proxy",
        rarity: "common",
        description: "Reduce el daño recibido en 1 punto.",
        effect: "damage_reduction",
        value: 1,
        stackable: false,
        imageKey: "artifact-proxy"
    },
    
    usb_booster: {
        id: "usb_booster",
        name: "Amplificador USB",
        rarity: "common",
        description: "Empiezas cada combate con 1 punto de acción adicional.",
        effect: "start_energy",
        value: 1,
        stackable: false,
        imageKey: "artifact-usb"
    },
    
    packet_sniffer: {
        id: "packet_sniffer",
        name: "Analizador de Paquetes",
        rarity: "common",
        description: "La primera carta que juegues cada turno revela la intención del enemigo.",
        effect: "reveal_intent",
        trigger: "first_card_played",
        stackable: false,
        imageKey: "artifact-sniffer"
    },
    
    cached_memory: {
        id: "cached_memory",
        name: "Memoria Caché",
        rarity: "common",
        description: "Al inicio de cada turno, puedes colocar una carta de tu mano en la parte superior de tu mazo.",
        effect: "card_topdeck",
        trigger: "turn_start",
        stackable: false,
        imageKey: "artifact-cache"
    },
    
    protocol_buffer: {
        id: "protocol_buffer",
        name: "Buffer de Protocolos",
        rarity: "common",
        description: "Puedes retener hasta 2 cartas al final de tu turno.",
        effect: "retain_cards",
        value: 2,
        stackable: false,
        imageKey: "artifact-buffer"
    },
    
    // Artefactos poco comunes
    encryption_key: {
        id: "encryption_key",
        name: "Llave de Cifrado",
        rarity: "uncommon",
        description: "Las cartas de defensa otorgan 2 puntos adicionales de defensa.",
        effect: "defense_boost",
        value: 2,
        stackable: false,
        imageKey: "artifact-key"
    },
    
    binary_optimizer: {
        id: "binary_optimizer",
        name: "Optimizador Binario",
        rarity: "uncommon",
        description: "Las cartas que cuestan 0 causan 3 puntos de daño adicional.",
        effect: "zero_cost_damage",
        value: 3,
        stackable: false,
        imageKey: "artifact-optimizer"
    },
    
    quantum_processor: {
        id: "quantum_processor",
        name: "Procesador Cuántico",
        rarity: "uncommon",
        description: "Cada tres turnos, duplica el efecto de la próxima carta que juegues.",
        effect: "duplicate_card",
        trigger: "every_three_turns",
        stackable: false,
        imageKey: "artifact-processor"
    },
    
    vpn_shield: {
        id: "vpn_shield",
        name: "Escudo VPN",
        rarity: "uncommon",
        description: "La primera vez que pierdas salud en combate, gana 12 de defensa.",
        effect: "damage_reaction",
        trigger: "first_damage",
        value: 12,
        oneTimeUse: true,
        stackable: false,
        imageKey: "artifact-vpn"
    },
    
    gpu_accelerator: {
        id: "gpu_accelerator",
        name: "Acelerador GPU",
        rarity: "uncommon",
        description: "Tus cartas de tipo ataque cuestan 1 punto menos (mínimo 1).",
        effect: "cost_reduction",
        cardType: "attack",
        value: 1,
        stackable: false,
        imageKey: "artifact-gpu"
    },
    
    // Artefactos raros
    rootkit_module: {
        id: "rootkit_module",
        name: "Módulo Rootkit",
        rarity: "rare",
        description: "Al inicio del combate, aplica 2 de Vulnerable a todos los enemigos.",
        effect: "start_vulnerable",
        value: 2,
        stackable: false,
        imageKey: "artifact-rootkit"
    },
    
    quantum_entangler: {
        id: "quantum_entangler",
        name: "Entrelazador Cuántico",
        rarity: "rare",
        description: "Cada vez que juegues 3 cartas en un turno, roba 1 carta.",
        effect: "draw_on_threshold",
        cardThreshold: 3,
        drawAmount: 1,
        stackable: false,
        imageKey: "artifact-entangler"
    },
    
    neural_implant: {
        id: "neural_implant",
        name: "Implante Neural",
        rarity: "rare",
        description: "Cada vez que agotas una carta, gana 3 de defensa.",
        effect: "exhaust_defense",
        value: 3,
        stackable: false,
        imageKey: "artifact-implant"
    },
    
    polymorphic_code: {
        id: "polymorphic_code",
        name: "Código Polimórfico",
        rarity: "rare",
        description: "La primera carta que juegues cada combate se juega dos veces.",
        effect: "double_first_card",
        oneTimeUse: true,
        stackable: false,
        imageKey: "artifact-polymorph"
    },
    
    backdoor_access: {
        id: "backdoor_access",
        name: "Acceso Backdoor",
        rarity: "rare",
        description: "Una vez por combate, causa 25 de daño a un enemigo. Se recarga al subir de piso.",
        effect: "direct_damage",
        value: 25,
        usesPerCombat: 1,
        stackable: false,
        imageKey: "artifact-backdoor"
    },
    
    // Artefactos de jefe
    firewall_core: {
        id: "firewall_core",
        name: "Núcleo de Firewall",
        rarity: "boss",
        description: "Al inicio de cada turno, gana 5 de defensa.",
        effect: "turn_defense",
        value: 5,
        stackable: false,
        dropFrom: "firewall_guardian",
        imageKey: "artifact-firewall"
    },
    
    ransomware_key: {
        id: "ransomware_key",
        name: "Llave Maestra de Ransomware",
        rarity: "boss",
        description: "Inmunidad a efectos que encriptan o bloquean tus cartas.",
        effect: "encryption_immunity",
        stackable: false,
        dropFrom: "ransomware_knight",
        imageKey: "artifact-ransomkey"
    },
    
    threat_database: {
        id: "threat_database",
        name: "Base de Datos de Amenazas",
        rarity: "boss",
        description: "Al inicio del combate, aplica 1 de Debilidad y 1 de Vulnerable a todos los enemigos.",
        effect: "start_debuffs",
        debuffs: [
            { effect: "weak", value: 1 },
            { effect: "vulnerable", value: 1 }
        ],
        stackable: false,
        dropFrom: "threat_admin",
        imageKey: "artifact-database"
    },
    
    // Artefactos finales (obtenidos tras derrotar al jefe final)
    digital_crown: {
        id: "digital_crown",
        name: "Corona Digital",
        rarity: "special",
        description: "Al inicio de cada turno, gana 1 punto de acción y roba 1 carta adicional.",
        effect: "turn_bonus",
        energy: 1,
        draw: 1,
        stackable: false,
        dropFrom: "final_boss",
        imageKey: "artifact-crown"
    },
    
    castle_key: {
        id: "castle_key",
        name: "Llave del Castillo Digital",
        rarity: "special",
        description: "Al derrotar a un enemigo, gana 3 de salud y 10 créditos adicionales.",
        effect: "kill_reward",
        heal: 3,
        credits: 10,
        stackable: false,
        specialUnlock: true,
        imageKey: "artifact-key-special"
    },
    
    belnades_amulet: {
        id: "belnades_amulet",
        name: "Amuleto de Belnades",
        rarity: "special",
        description: "Las cartas de tipo poder se juegan dos veces.",
        effect: "power_double",
        stackable: false,
        specialUnlock: true,
        imageKey: "artifact-amulet"
    }
};

// Función para obtener artefactos por rareza
export function getArtifactsByRarity(rarity) {
    return Object.values(ARTIFACTS).filter(artifact => artifact.rarity === rarity);
}

// Función para obtener artefactos aleatorios
export function getRandomArtifacts(count, rarity = null, excludeIds = []) {
    let availableArtifacts = Object.values(ARTIFACTS);
    
    // Filtrar por rareza si se especifica
    if (rarity) {
        availableArtifacts = availableArtifacts.filter(artifact => artifact.rarity === rarity);
    } else {
        // Por defecto, excluir artefactos especiales y de jefes a menos que se indique lo contrario
        availableArtifacts = availableArtifacts.filter(artifact => 
            artifact.rarity !== "special" && 
            artifact.rarity !== "boss" && 
            !artifact.specialUnlock
        );
    }
    
    // Excluir IDs específicos
    if (excludeIds.length > 0) {
        availableArtifacts = availableArtifacts.filter(artifact => !excludeIds.includes(artifact.id));
    }
    
    // Mezclar y seleccionar
    const shuffled = [...availableArtifacts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}