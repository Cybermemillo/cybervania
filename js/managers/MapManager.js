import { ENEMIES } from '../data/enemies.js';
import { EVENTS } from '../data/events.js';

export class MapManager {
    constructor() {
        this.map = [];
        this.currentFloor = 1;
        this.currentPosition = { x: 0, y: 0 };
        this.pathHistory = [];
        this.nodesPerFloor = 15;
        this.encounterTypes = {
            ENEMY: 'enemy',
            ELITE: 'elite',
            BOSS: 'boss',
            EVENT: 'event',
            REST: 'rest',
            SHOP: 'shop',
            TREASURE: 'treasure'
        };
    }
    
    generateMap(floor) {
        this.currentFloor = floor;
        this.map = [];
        
        // Estructura básica del mapa: una serie de niveles con nodos interconectados
        const levels = 4; // Cada piso tiene 4 niveles antes del jefe
        const nodesPerLevel = Math.floor(this.nodesPerFloor / levels);
        
        // Generar nodos por nivel
        for (let level = 0; level < levels; level++) {
            const levelNodes = [];
            const nodeCount = level === 0 ? 1 : Math.min(4, nodesPerLevel);
            
            for (let i = 0; i < nodeCount; i++) {
                levelNodes.push(this.createNode(level, i, floor));
            }
            
            this.map.push(levelNodes);
        }
        
        // Añadir nivel final con el jefe o evento especial
        const finalLevel = [];
        if (floor % 3 === 0) { // Cada 3 pisos hay un jefe
            finalLevel.push(this.createBossNode(floor));
        } else {
            finalLevel.push(this.createEliteNode(floor));
        }
        
        this.map.push(finalLevel);
        
        // Establecer conexiones entre nodos
        this.connectMapNodes();
        
        // Iniciar posición en el primer nodo
        this.currentPosition = { x: 0, y: 0 };
        this.pathHistory = [{ x: 0, y: 0 }];
        
        return this.map;
    }
    
    createNode(level, position, floor) {
        // Determinar el tipo de nodo basado en probabilidades que varían según el nivel y piso
        let type;
        const rand = Math.random();
        
        if (level === 0) {
            // El primer nivel siempre es un enemigo común para empezar
            type = this.encounterTypes.ENEMY;
        } else {
            // Ajustar probabilidades según avanza el jugador
            const enemyChance = 0.45 - (level * 0.05);
            const eventChance = 0.3;
            const restChance = 0.15;
            const shopChance = 0.1 + (floor * 0.01);
            const treasureChance = 0.05;
            const eliteChance = 0.05 + (level * 0.05) + (floor * 0.02);
            
            if (rand < enemyChance) {
                type = this.encounterTypes.ENEMY;
            } else if (rand < enemyChance + eventChance) {
                type = this.encounterTypes.EVENT;
            } else if (rand < enemyChance + eventChance + restChance) {
                type = this.encounterTypes.REST;
            } else if (rand < enemyChance + eventChance + restChance + shopChance) {
                type = this.encounterTypes.SHOP;
            } else if (rand < enemyChance + eventChance + restChance + shopChance + treasureChance) {
                type = this.encounterTypes.TREASURE;
            } else {
                type = this.encounterTypes.ELITE;
            }
        }
        
        // Crear el nodo con sus detalles
        return {
            id: `node_${level}_${position}`,
            type: type,
            level: level,
            position: position,
            connections: [],
            visited: false,
            available: level === 0, // Solo el primer nodo está disponible inicialmente
            data: this.generateNodeContent(type, floor)
        };
    }
    
    createBossNode(floor) {
        let bossId;
        
        // Seleccionar jefe según el piso
        if (floor === 3) {
            bossId = "firewall_guardian";
        } else if (floor === 6) {
            bossId = "ransomware_knight";
        } else if (floor === 9) {
            bossId = "threat_admin";
        } else {
            // Jefes finales basados en especialización
            bossId = "malware_master"; // Por defecto
        }
        
        return {
            id: `boss_${floor}`,
            type: this.encounterTypes.BOSS,
            level: this.map.length,
            position: 0,
            connections: [],
            visited: false,
            available: false,
            data: {
                enemyId: bossId,
                enemy: ENEMIES[bossId] || { name: "Jefe Corrompido" }
            }
        };
    }
    
    createEliteNode(floor) {
        // Seleccionar un enemigo elite aleatorio
        const eliteEnemies = Object.values(ENEMIES).filter(e => e.type === "elite");
        const elite = eliteEnemies[Math.floor(Math.random() * eliteEnemies.length)];
        
        return {
            id: `elite_${floor}_${Date.now()}`,
            type: this.encounterTypes.ELITE,
            level: this.map.length,
            position: 0,
            connections: [],
            visited: false,
            available: false,
            data: {
                enemyId: elite.id,
                enemy: elite
            }
        };
    }
    
    generateNodeContent(type, floor) {
        switch(type) {
            case this.encounterTypes.ENEMY:
                return this.generateEnemyEncounter(floor);
            
            case this.encounterTypes.ELITE:
                return this.generateEliteEncounter(floor);
                
            case this.encounterTypes.EVENT:
                return this.generateEventEncounter(floor);
                
            case this.encounterTypes.REST:
                return {
                    options: [
                        { id: "rest", name: "Descansar", effect: "heal", value: Math.floor(20 + floor * 2) },
                        { id: "upgrade", name: "Mejorar carta", effect: "upgrade" },
                        { id: "decrypt", name: "Descifrar", effect: "decrypt", value: 2, condition: "has_encrypted" }
                    ]
                };
                
            case this.encounterTypes.SHOP:
                return {
                    shopLevel: floor,
                    cardCount: 3 + Math.floor(floor / 3),
                    artifactCount: 1 + Math.floor(floor / 4),
                    potionCount: 2
                };
                
            case this.encounterTypes.TREASURE:
                return {
                    rewards: [
                        { type: "credits", value: 25 + (floor * 15) },
                        { type: "artifact", level: floor },
                        { type: "card", rarity: "rare" }
                    ]
                };
                
            default:
                return {};
        }
    }
    
    generateEnemyEncounter(floor) {
        // Filtrar enemigos normales
        const normalEnemies = Object.values(ENEMIES).filter(e => e.type === "normal");
        
        // Seleccionar enemigo(s) basados en el piso
        let selectedEnemies = [];
        
        if (floor < 3) {
            // Pisos iniciales: un solo enemigo débil
            const weakEnemies = normalEnemies.filter(e => e.health <= 30);
            selectedEnemies.push(weakEnemies[Math.floor(Math.random() * weakEnemies.length)]);
        } else if (floor < 6) {
            // Pisos intermedios: un solo enemigo o dos débiles
            if (Math.random() < 0.7) {
                selectedEnemies.push(normalEnemies[Math.floor(Math.random() * normalEnemies.length)]);
            } else {
                const weakEnemies = normalEnemies.filter(e => e.health <= 25);
                selectedEnemies.push(weakEnemies[Math.floor(Math.random() * weakEnemies.length)]);
                selectedEnemies.push(weakEnemies[Math.floor(Math.random() * weakEnemies.length)]);
            }
        } else {
            // Pisos avanzados: un enemigo fuerte o dos normales
            if (Math.random() < 0.5) {
                const strongEnemies = normalEnemies.filter(e => e.health >= 30);
                selectedEnemies.push(strongEnemies[Math.floor(Math.random() * strongEnemies.length)]);
            } else {
                selectedEnemies.push(normalEnemies[Math.floor(Math.random() * normalEnemies.length)]);
                selectedEnemies.push(normalEnemies[Math.floor(Math.random() * normalEnemies.length)]);
            }
        }
        
        return {
            enemies: selectedEnemies,
            difficulty: Math.min(1.0 + (floor * 0.1), 2.0) // La dificultad aumenta con el piso
        };
    }
    
    generateEliteEncounter(floor) {
        // Filtrar enemigos elite
        const eliteEnemies = Object.values(ENEMIES).filter(e => e.type === "elite");
        const elite = eliteEnemies[Math.floor(Math.random() * eliteEnemies.length)];
        
        return {
            enemies: [elite],
            difficulty: Math.min(1.2 + (floor * 0.1), 2.5),
            rewards: [
                { type: "credits", value: 20 + (floor * 10) },
                { type: "card", rarity: Math.random() < 0.3 ? "rare" : "uncommon" }
            ]
        };
    }
    
    generateEventEncounter(floor) {
        // Obtener eventos disponibles para este piso
        const availableEvents = Object.values(EVENTS).filter(e => 
            e.minFloor <= floor && 
            (e.maxFloor === undefined || e.maxFloor >= floor)
        );
        
        // Seleccionar un evento aleatorio
        const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        
        return {
            eventId: selectedEvent.id,
            event: selectedEvent
        };
    }
    
    connectMapNodes() {
        // Para cada nivel (excepto el último)
        for (let level = 0; level < this.map.length - 1; level++) {
            const currentLevelNodes = this.map[level];
            const nextLevelNodes = this.map[level + 1];
            
            // Para cada nodo en el nivel actual
            for (let i = 0; i < currentLevelNodes.length; i++) {
                const node = currentLevelNodes[i];
                
                // Determinar cuántas conexiones saldrán de este nodo
                const connectionCount = Math.min(
                    Math.max(1, Math.floor(Math.random() * 3)), // 1-2 conexiones
                    nextLevelNodes.length // No más que los nodos disponibles
                );
                
                // Crear conexiones únicas
                const connections = new Set();
                while (connections.size < connectionCount) {
                    const targetIndex = Math.floor(Math.random() * nextLevelNodes.length);
                    connections.add(targetIndex);
                }
                
                // Establecer conexiones
                for (const targetIndex of connections) {
                    const targetNode = nextLevelNodes[targetIndex];
                    node.connections.push({
                        level: level + 1,
                        position: targetIndex
                    });
                }
            }
        }
    }
    
    moveToNode(level, position) {
        // Verificar si el movimiento es válido
        if (!this.isValidMove(level, position)) {
            return false;
        }
        
        // Actualizar posición actual
        this.currentPosition = { x: level, y: position };
        this.pathHistory.push({ x: level, y: position });
        
        // Marcar como visitado
        const node = this.map[level][position];
        node.visited = true;
        
        // Actualizar nodos disponibles
        this.updateAvailableNodes();
        
        return node;
    }
    
    isValidMove(level, position) {
        // Verificar si el nodo existe
        if (!this.map[level] || !this.map[level][position]) {
            return false;
        }
        
        // Verificar si el nodo está disponible
        return this.map[level][position].available;
    }
    
    updateAvailableNodes() {
        // Reiniciar disponibilidad de todos los nodos
        for (let level = 0; level < this.map.length; level++) {
            for (let position = 0; position < this.map[level].length; position++) {
                this.map[level][position].available = false;
            }
        }
        
        // Hacer que los nodos conectados al nodo actual estén disponibles
        const currentNode = this.map[this.currentPosition.x][this.currentPosition.y];
        for (const connection of currentNode.connections) {
            this.map[connection.level][connection.position].available = true;
        }
    }
    
    getCurrentNode() {
        return this.map[this.currentPosition.x][this.currentPosition.y];
    }
    
    getAvailableNodes() {
        const available = [];
        for (let level = 0; level < this.map.length; level++) {
            for (let position = 0; position < this.map[level].length; position++) {
                if (this.map[level][position].available) {
                    available.push(this.map[level][position]);
                }
            }
        }
        return available;
    }
    
    isFloorComplete() {
        // El piso se completa cuando llegamos al último nivel
        return this.currentPosition.x === this.map.length - 1;
    }
    
    serialize() {
        return {
            map: this.map,
            currentFloor: this.currentFloor,
            currentPosition: this.currentPosition,
            pathHistory: this.pathHistory
        };
    }
    
    deserialize(data) {
        this.map = data.map;
        this.currentFloor = data.currentFloor;
        this.currentPosition = data.currentPosition;
        this.pathHistory = data.pathHistory;
    }
}
