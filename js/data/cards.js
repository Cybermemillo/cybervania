// Definición de las cartas disponibles en el juego

export const CARDS = {
    // Cartas básicas (disponibles para todos)
    basic_attack: {
        id: "basic_attack",
        name: "Ataque Básico",
        description: "Inflige 6 puntos de daño.",
        cost: 1,
        type: "attack",
        rarity: "starter",
        team: "neutral",
        effects: [
            { type: "damage", value: 6 }
        ],
        imageKey: "card-basic-attack"
    },
    
    basic_defense: {
        id: "basic_defense",
        name: "Defensa Básica",
        description: "Obtén 5 puntos de defensa.",
        cost: 1,
        type: "defense",
        rarity: "starter",
        team: "neutral",
        effects: [
            { type: "defense", value: 5 }
        ],
        imageKey: "card-basic-defense"
    },
    
    scanning: {
        id: "scanning",
        name: "Escaneo",
        description: "Roba 1 carta. Si es una habilidad, roba otra carta.",
        cost: 1,
        type: "skill",
        rarity: "starter",
        team: "neutral",
        effects: [
            { type: "draw", value: 1 },
            { type: "special", id: "scan_skill" }
        ],
        imageKey: "card-scanning"
    },
    
    // Red Team (Ataque/Ofensivo)
    exploit: {
        id: "exploit",
        name: "Exploit Crítico",
        description: "Inflige 10 puntos de daño. Ignora la defensa enemiga.",
        cost: 2,
        type: "attack",
        rarity: "uncommon",
        team: "red",
        effects: [
            { type: "special", id: "ignore_defense", damage: 10 }
        ],
        imageKey: "card-exploit"
    },
    
    brute_force: {
        id: "brute_force",
        name: "Ataque de Fuerza Bruta",
        description: "Realiza 5 ataques de 3 daño cada uno con 60% de precisión.",
        cost: 2,
        type: "attack",
        rarity: "uncommon",
        team: "red",
        effects: [
            { type: "special", id: "brute_force", maxHits: 5, damage: 3, hitChance: 0.6 }
        ],
        imageKey: "card-brute-force"
    },
    
    backdoor: {
        id: "backdoor",
        name: "Backdoor",
        description: "Roba una habilidad aleatoria del enemigo y úsala temporalmente.",
        cost: 1,
        type: "skill",
        rarity: "rare",
        team: "red",
        effects: [
            { type: "special", id: "backdoor" }
        ],
        imageKey: "card-backdoor"
    },
    
    ddos: {
        id: "ddos",
        name: "Ataque DDoS",
        description: "Inflige 2 de daño. Se repite por cada carta Ataque jugada este turno.",
        cost: 1,
        type: "attack",
        rarity: "uncommon",
        team: "red",
        effects: [
            { type: "special", id: "ddos_attack", baseDamage: 2 }
        ],
        imageKey: "card-ddos"
    },
    
    malware_injection: {
        id: "malware_injection",
        name: "Inyección de Malware",
        description: "Aplica 3 de Veneno. Si el enemigo ya tiene Veneno, aplica 2 más.",
        cost: 1,
        type: "skill",
        rarity: "common",
        team: "red",
        effects: [
            { type: "debuff", effect: "poisoned", duration: 3 },
            { type: "special", id: "enhance_poison", extraPoison: 2 }
        ],
        imageKey: "card-malware"
    },
    
    // Blue Team (Defensivo)
    security_patch: {
        id: "security_patch",
        name: "Parche de Seguridad",
        description: "Gana 8 de defensa. Elimina un estado negativo.",
        cost: 1,
        type: "defense",
        rarity: "common",
        team: "blue",
        effects: [
            { type: "defense", value: 8 },
            { type: "special", id: "remove_debuff" }
        ],
        imageKey: "card-security-patch"
    },
    
    firewall: {
        id: "firewall",
        name: "Firewall",
        description: "Gana 12 de defensa. Al inicio de tu próximo turno, gana 6 de defensa.",
        cost: 2,
        type: "defense",
        rarity: "uncommon",
        team: "blue",
        effects: [
            { type: "defense", value: 12 },
            { type: "special", id: "next_turn_defense", value: 6 }
        ],
        imageKey: "card-firewall"
    },
    
    backup_restore: {
        id: "backup_restore",
        name: "Restaurar Backup",
        description: "Recupera 7 de salud. Descarta tu mano y roba esa misma cantidad de cartas.",
        cost: 2,
        type: "skill",
        rarity: "uncommon",
        team: "blue",
        effects: [
            { type: "heal", value: 7 },
            { type: "special", id: "restore_hand" }
        ],
        imageKey: "card-backup"
    },
    
    antivirus: {
        id: "antivirus",
        name: "Antivirus",
        description: "Aplica 2 de Debilidad. Gana 4 de defensa por cada efecto negativo en el enemigo.",
        cost: 2,
        type: "skill",
        rarity: "uncommon",
        team: "blue",
        effects: [
            { type: "debuff", effect: "weak", duration: 2 },
            { type: "special", id: "defense_per_debuff", baseDefense: 4 }
        ],
        imageKey: "card-antivirus"
    },
    
    encryption: {
        id: "encryption",
        name: "Encriptación",
        description: "Gana 6 de defensa. Previene el próximo estado negativo que recibirías.",
        cost: 1,
        type: "defense",
        rarity: "uncommon",
        team: "blue",
        effects: [
            { type: "defense", value: 6 },
            { type: "buff", effect: "immune_debuff", duration: 1 }
        ],
        imageKey: "card-encryption"
    },
    
    // Purple Team (Equilibrado/Mixto)
    penetration_test: {
        id: "penetration_test",
        name: "Test de Penetración",
        description: "Inflige 4 de daño y aplica 1 de Vulnerable. Si el enemigo ya es Vulnerable, inflige 4 de daño adicional.",
        cost: 1,
        type: "attack",
        rarity: "uncommon",
        team: "purple",
        effects: [
            { type: "damage", value: 4 },
            { type: "debuff", effect: "vulnerable", duration: 1 },
            { type: "special", id: "bonus_damage_if_vulnerable", bonusDamage: 4 }
        ],
        imageKey: "card-pentest"
    },
    
    incident_response: {
        id: "incident_response",
        name: "Respuesta a Incidentes",
        description: "Gana 5 de defensa. Si recibiste daño en el último turno, inflige 7 de daño.",
        cost: 1,
        type: "skill",
        rarity: "common",
        team: "purple",
        effects: [
            { type: "defense", value: 5 },
            { type: "special", id: "damage_if_damaged", damage: 7 }
        ],
        imageKey: "card-incident"
    },
    
    threat_intelligence: {
        id: "threat_intelligence",
        name: "Inteligencia sobre Amenazas",
        description: "Analiza al enemigo revelando su próxima acción. Roba 2 cartas.",
        cost: 1,
        type: "skill",
        rarity: "uncommon",
        team: "purple",
        effects: [
            { type: "special", id: "reveal_intent" },
            { type: "draw", value: 2 }
        ],
        imageKey: "card-intelligence"
    },
    
    vulnerability_scan: {
        id: "vulnerability_scan",
        name: "Escaneo de Vulnerabilidades",
        description: "Aplica 2 de Vulnerable. Tus próximos 2 ataques hacen 3 de daño adicional.",
        cost: 1,
        type: "skill",
        rarity: "uncommon",
        team: "purple",
        effects: [
            { type: "debuff", effect: "vulnerable", duration: 2 },
            { type: "special", id: "boost_next_attacks", count: 2, extraDamage: 3 }
        ],
        imageKey: "card-vuln-scan"
    },
    
    zero_day: {
        id: "zero_day",
        name: "Zero Day",
        description: "Inflige 15 de daño. Solo puede jugarse si has jugado al menos 2 habilidades este turno.",
        cost: 2,
        type: "attack",
        rarity: "rare",
        team: "purple",
        effects: [
            { type: "special", id: "conditional_damage", damage: 15, condition: "skills_played", threshold: 2 }
        ],
        imageKey: "card-zeroday"
    }
};

// Función para obtener todas las cartas por equipo
export function getCardsByTeam(team) {
    return Object.values(CARDS).filter(card => card.team === team);
}

// Función para obtener cartas por rareza
export function getCardsByRarity(rarity) {
    return Object.values(CARDS).filter(card => card.rarity === rarity);
}

// Función para obtener cartas iniciales
export function getStarterDeck() {
    return [
        CARDS.basic_attack,
        CARDS.basic_attack,
        CARDS.basic_attack,
        CARDS.basic_defense,
        CARDS.basic_defense,
        CARDS.scanning,
        CARDS.scanning
    ];
}
