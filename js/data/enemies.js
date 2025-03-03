// Definición de los enemigos del juego

export const ENEMIES = {
    // Enemigos normales
    spyware_gargoyle: {
        id: "spyware_gargoyle",
        name: "Gárgola Spyware",
        health: 25,
        damage: 8,
        goldReward: 12,
        type: "normal",
        description: "Un vigilante digital que fortalece enemigos futuros al recopilar datos sobre tus estrategias.",
        imageKey: "enemy-gargoyle",
        attackPattern: ["attack", "special", "attack", "defend"],
        specialAbilities: [
            {
                id: "data_collection",
                name: "Recopilación de Datos",
                description: "Fortalece a los próximos enemigos, aumentando su daño en 2.",
                effect: { type: "global_buff", target: "next_enemies", amount: 2 }
            }
        ]
    },
    
    phishing_mimic: {
        id: "phishing_mimic",
        name: "Señuelo Phishing",
        health: 20,
        damage: 7,
        goldReward: 10,
        type: "normal",
        description: "Una entidad que se camufla como algo inofensivo para engañarte y robarte recursos.",
        imageKey: "enemy-mimic",
        attackPattern: ["debuff", "attack", "special"],
        specialAbilities: [
            {
                id: "data_theft",
                name: "Robo de Datos",
                description: "Te roba 1 carta aleatoria temporalmente.",
                effect: { type: "steal_card", count: 1 }
            }
        ]
    },
    
    rootkit_vampire: {
        id: "rootkit_vampire",
        name: "Vampiro Rootkit",
        health: 32,
        damage: 6,
        goldReward: 15,
        type: "normal",
        description: "Una criatura digital que se oculta en lo profundo del sistema y se alimenta de tu energía.",
        imageKey: "enemy-vampire",
        attackPattern: ["attack", "special", "attack", "defend"],
        specialAbilities: [
            {
                id: "data_leech",
                name: "Drenaje de Datos",
                description: "Absorbe parte de tu salud para curarse.",
                value: 5
            }
        ]
    },
    
    ddos_executioner: {
        id: "ddos_executioner",
        name: "Verdugo DDoS",
        health: 28,
        damage: 4,
        goldReward: 14,
        type: "normal",
        description: "Un atacante que sobrecarga tus defensas con múltiples golpes rápidos.",
        imageKey: "enemy-executioner",
        attackPattern: ["attack", "special", "debuff"],
        specialAbilities: [
            {
                id: "ddos_attack",
                name: "Ataque DDoS",
                description: "Realiza varios ataques de bajo daño en un solo turno.",
                hits: 4
            }
        ]
    },
    
    trojan_knight: {
        id: "trojan_knight",
        name: "Caballero Troyano",
        health: 35,
        damage: 9,
        goldReward: 16,
        type: "normal",
        description: "Un guerrero que aparenta ser una entidad legítima pero esconde un ataque devastador.",
        imageKey: "enemy-knight",
        attackPattern: ["defend", "attack", "special", "attack"],
        specialAbilities: [
            {
                id: "hidden_payload",
                name: "Carga Oculta",
                description: "Ignora la defensa y causa daño directo.",
                damage: 8
            }
        ]
    },
    
    worm_serpent: {
        id: "worm_serpent",
        name: "Serpiente Gusano",
        health: 22,
        damage: 5,
        goldReward: 11,
        type: "normal",
        description: "Una criatura que se propaga infectando múltiples partes del sistema.",
        imageKey: "enemy-serpent",
        attackPattern: ["attack", "special", "debuff"],
        specialAbilities: [
            {
                id: "self_replicate",
                name: "Autorreplicación",
                description: "Se duplica a sí mismo, creando una copia con la mitad de la salud.",
                effect: { type: "summon", enemyId: "worm_copy", healthPercent: 0.5 }
            }
        ]
    },
    
    botnet_swarm: {
        id: "botnet_swarm",
        name: "Enjambre Botnet",
        health: 18,
        damage: 3,
        goldReward: 9,
        type: "normal",
        description: "Un grupo de pequeños drones digitales que atacan coordinadamente.",
        imageKey: "enemy-swarm",
        attackPattern: ["attack", "attack", "special", "debuff"],
        specialAbilities: [
            {
                id: "coordinated_attack",
                name: "Ataque Coordinado",
                description: "Aumenta su daño por cada ataque realizado este combate.",
                effect: { type: "damage_increase", amountPerAttack: 1 }
            }
        ]
    },
    
    ransomware_thief: {
        id: "ransomware_thief",
        name: "Ladrón Ransomware",
        health: 30,
        damage: 7,
        goldReward: 13,
        type: "normal",
        description: "Un enemigo que cifra tus recursos y exige un pago para liberarlos.",
        imageKey: "enemy-thief",
        attackPattern: ["attack", "special", "defend", "attack"],
        specialAbilities: [
            {
                id: "encrypt_cards",
                name: "Cifrado de Cartas",
                description: "Cifra cartas de tu mazo, impidiendo su uso hasta que sean descifradas.",
                count: 2
            }
        ]
    },
    
    // Enemigos élite
    malware_golem: {
        id: "malware_golem",
        name: "Gólem Malware",
        health: 70,
        damage: 12,
        goldReward: 25,
        type: "elite",
        description: "Una construcción masiva formada por múltiples programas maliciosos fusionados.",
        imageKey: "elite-golem",
        attackPattern: ["attack", "defend", "special", "attack", "debuff"],
        specialAbilities: [
            {
                id: "adaptive_defense",
                name: "Defensa Adaptativa",
                description: "Gana resistencia a los tipos de ataque que más utilices.",
                effect: { type: "adaptive_resistance" }
            }
        ]
    },
    
    logic_bomb_specter: {
        id: "logic_bomb_specter",
        name: "Espectro Bomba Lógica",
        health: 60,
        damage: 15,
        goldReward: 28,
        type: "elite",
        description: "Un espíritu digital programado para detonar cuando se cumplan ciertas condiciones.",
        imageKey: "elite-specter",
        attackPattern: ["attack", "defend", "debuff", "special", "attack"],
        specialAbilities: [
            {
                id: "countdown",
                name: "Cuenta Regresiva",
                description: "Inicia una cuenta atrás de 3 turnos. Al llegar a cero, causa un daño masivo.",
                effect: { type: "countdown", turns: 3, damage: 25 }
            }
        ]
    },
    
    zero_day_dragon: {
        id: "zero_day_dragon",
        name: "Dragón Zero Day",
        health: 75,
        damage: 14,
        goldReward: 30,
        type: "elite",
        description: "Una bestia legendaria que explota vulnerabilidades desconocidas en tus sistemas.",
        imageKey: "elite-dragon",
        attackPattern: ["attack", "special", "defend", "attack", "debuff"],
        specialAbilities: [
            {
                id: "exploit_weakness",
                name: "Explotar Debilidad",
                description: "Detecta tu especialización y causa daño adicional según tu enfoque.",
                effect: { type: "counter_specialization" }
            }
        ]
    },
    
    // Jefes
    firewall_guardian: {
        id: "firewall_guardian",
        name: "Guardián del Firewall",
        health: 120,
        damage: 15,
        goldReward: 50,
        type: "boss",
        description: "El protector principal del sistema, bloquea tu acceso al núcleo digital.",
        imageKey: "boss-guardian",
        attackPattern: ["defend", "attack", "special", "debuff", "attack", "special"],
        specialAbilities: [
            {
                id: "access_denied",
                name: "Acceso Denegado",
                description: "Bloquea tus cartas más poderosas por 1 turno.",
                effect: { type: "lock_cards", target: "powerful", duration: 1 }
            },
            {
                id: "system_purge",
                name: "Purga del Sistema",
                description: "Causa daño por cada carta en tu mano.",
                effect: { type: "damage_per_hand_card", damagePerCard: 3 }
            }
        ]
    },
    
    ransomware_knight: {
        id: "ransomware_knight",
        name: "Caballero Ransomware",
        health: 150,
        damage: 16,
        goldReward: 60,
        type: "boss",
        description: "Un temible guardián que cifra parte de tus recursos, exigiendo un alto precio por su liberación.",
        imageKey: "boss-knight",
        attackPattern: ["attack", "defend", "special", "attack", "debuff", "special"],
        specialAbilities: [
            {
                id: "mass_encryption",
                name: "Cifrado Masivo",
                description: "Cifra varias cartas de tu mazo, haciéndolas inutilizables hasta que las desencriptes.",
                effect: { type: "encrypt_cards", count: 5 }
            },
            {
                id: "data_hostage",
                name: "Datos Rehenes",
                description: "Exige créditos o salud a cambio de devolver tus cartas cifradas.",
                effect: { type: "ransom_demand", options: ["credits", "health"] }
            }
        ]
    },
    
    threat_admin: {
        id: "threat_admin",
        name: "Administrador de la Amenaza",
        health: 180,
        damage: 18,
        goldReward: 70,
        type: "boss",
        description: "El jefe final, controlador de todo el sistema de seguridad y señor de los malware.",
        imageKey: "boss-admin",
        attackPattern: ["defend", "special", "attack", "special", "attack", "defend", "special"],
        specialAbilities: [
            {
                id: "system_lockdown",
                name: "Bloqueo del Sistema",
                description: "Reduce tus puntos de acción durante 2 turnos.",
                effect: { type: "reduce_energy", amount: 1, duration: 2 }
            },
            {
                id: "total_scan",
                name: "Escaneo Total",
                description: "Analiza tu mazo y aplica debilidades específicas según tus cartas.",
                effect: { type: "analyze_deck", counterStrategy: true }
            },
            {
                id: "admin_privileges",
                name: "Privilegios de Administrador",
                description: "Se cura y elimina todos los estados negativos.",
                effect: { type: "heal_and_cleanse", healAmount: 20 }
            }
        ]
    }
};

// Funcion para obtener enemigos por tipo
export function getEnemiesByType(type) {
    return Object.values(ENEMIES).filter(enemy => enemy.type === type);
}

// Función para obtener enemigos disponibles para un piso
export function getEnemiesForFloor(floor, type = 'normal') {
    return Object.values(ENEMIES).filter(enemy => {
        if (enemy.type !== type) return false;
        
        // Verificar disponibilidad por piso
        const minFloor = enemy.minFloor || 1;
        const maxFloor = enemy.maxFloor || 999;
        
        return floor >= minFloor && floor <= maxFloor;
    });
}

// Función para obtener jefes disponibles para un piso
export function getBossesForFloor(floor) {
    // Asignación específica por piso
    switch (floor) {
        case 1:
            return [ENEMIES.firewall_guardian];
        case 2:
            return [ENEMIES.ransomware_knight];
        case 3:
            return [ENEMIES.threat_admin];
        default:
            // Si es más allá del piso 3, elegir aleatoriamente
            return Object.values(ENEMIES).filter(enemy => enemy.type === 'boss');
    }
}