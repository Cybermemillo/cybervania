import { Player } from '../entities/Player.js';
import { DeckManager } from '../managers/DeckManager.js';
import { ENEMIES } from '../data/enemies.js';
import { ARTIFACTS } from '../data/artifacts.js';
import { EVENTS } from '../data/events.js';

export class Game {
    constructor(data = {}) {
        // Estado principal del juego
        this.player = data.player || new Player();
        this.deckManager = data.deckManager || new DeckManager();
        this.currentFloor = data.currentFloor || 1;
        this.maps = data.maps || {};
        this.artifacts = data.artifacts || [];
        
        // Estadísticas
        this.statistics = data.statistics || {
            enemiesDefeated: 0,
            damageDealt: 0,
            damageReceived: 0,
            cardsPlayed: 0,
            goldFound: 0,
            elitesKilled: 0,
            bossesKilled: 0,
            turnsPlayed: 0
        };
        
        // Seed para generación aleatoria
        this.seed = data.seed || Math.floor(Math.random() * 1000000);
        
        // Variable global para acceso
        window.game = this;
    }
    
    saveGame() {
        // Guardar juego a localStorage
        if (!window.dataManager) return false;
        
        return window.dataManager.saveGame();
    }
    
    getMapForFloor(floor) {
        // Obtener o generar mapa para un piso
        if (this.maps[floor]) {
            return this.maps[floor];
        }
        
        return null;
    }
    
    setMapForFloor(floor, mapData) {
        this.maps[floor] = mapData;
    }
    
    getEnemyById(enemyId) {
        // Obtener enemigo por ID
        const enemyData = ENEMIES[enemyId];
        if (enemyData) {
            // Clonar para no modificar el original
            return { ...enemyData };
        }
        return null;
    }
    
    getEnemiesForFloor(floor, difficulty = 'normal') {
        // Obtener lista de enemigos disponibles para un piso
        if (!window.dataManager) return [];
        
        return window.dataManager.getEnemiesForFloor(floor, difficulty);
    }
    
    getBossesForFloor(floor) {
        // Obtener jefes disponibles para un piso
        if (!window.dataManager) return [];
        
        return window.dataManager.getBossesForFloor(floor);
    }
    
    getEventsForFloor(floor) {
        // Obtener eventos disponibles para un piso
        if (!window.dataManager) return [];
        
        return window.dataManager.getEventsForFloor(floor);
    }
    
    getArtifactById(artifactId) {
        // Obtener artefacto por ID
        const artifactData = ARTIFACTS[artifactId];
        if (artifactData) {
            // Clonar para no modificar el original
            return { ...artifactData };
        }
        return null;
    }
    
    getRandomArtifact(rarity = null, excludeIds = []) {
        // Obtener artefacto aleatorio
        if (!window.dataManager) return null;
        
        return window.dataManager.getRandomArtifact(rarity, excludeIds);
    }
    
    getRandomCards(count, rarity = null, team = null) {
        // Obtener cartas aleatorias
        if (!window.dataManager) return [];
        
        return window.dataManager.getRandomCards(count, rarity, team);
    }
    
    getRandomShopCards(count) {
        // Obtener cartas para tienda
        if (!window.dataManager) return [];
        
        return window.dataManager.getRandomShopCards(count);
    }
    
    getRandomShopArtifacts(count) {
        // Obtener artefactos para tienda
        if (!window.dataManager) return [];
        
        return window.dataManager.getRandomShopArtifacts(count);
    }
    
    advanceToNextFloor() {
        // Subir de piso
        this.currentFloor++;
        
        // Subir de nivel al jugador
        this.player.levelUp();
        
        // Guardar automáticamente
        this.saveGame();
        
        return this.currentFloor;
    }
    
    revealMap() {
        // Revelar todo el mapa del piso actual
        const currentMap = this.maps[this.currentFloor];
        if (!currentMap) return false;
        
        // Marcar todos los nodos como disponibles
        for (const node of currentMap.nodes) {
            // No marcar nodos ya visitados
            if (!node.visited) {
                // Solo hacer disponibles los que sean accesibles desde el nodo actual
                const currentNode = currentMap.nodes.find(n => n.id === currentMap.currentNodeId);
                const nodePath = this.findPath(currentMap, currentNode, node);
                
                if (nodePath.length > 0) {
                    node.available = true;
                }
            }
        }
        
        return true;
    }
    
    findPath(map, startNode, targetNode) {
        // Implementación simple de búsqueda de camino
        // Normalmente usaríamos A* o algo más sofisticado
        const visited = new Set();
        const queue = [[startNode.id]];
        
        while (queue.length > 0) {
            const path = queue.shift();
            const nodeId = path[path.length - 1];
            
            if (nodeId === targetNode.id) {
                return path;
            }
            
            if (!visited.has(nodeId)) {
                visited.add(nodeId);
                
                // Encontrar conexiones desde este nodo
                const connections = map.connections.filter(c => c.from === nodeId);
                
                for (const connection of connections) {
                    if (!visited.has(connection.to)) {
                        const newPath = [...path, connection.to];
                        queue.push(newPath);
                    }
                }
            }
        }
        
        return []; // No hay camino
    }
    
    calculateScore() {
        // Calcular puntuación total
        let score = 0;
        
        // Puntos por enemigos derrotados
        score += this.statistics.enemiesDefeated * 10;
        
        // Puntos por jefes derrotados
        score += this.statistics.bossesKilled * 100;
        
        // Puntos por élites derrotados
        score += this.statistics.elitesKilled * 25;
        
        // Puntos por pisos completados
        score += (this.currentFloor - 1) * 200;
        
        // Bonus por salud restante
        if (this.player.health > 0) {
            score += Math.floor((this.player.health / this.player.maxHealth) * 50);
        }
        
        // Bonus por cartas raras
        const rareCards = this.deckManager.getAllCards().filter(card => card.rarity === 'rare').length;
        score += rareCards * 15;
        
        // Penalización por tiempo (turnos)
        score -= Math.floor(this.statistics.turnsPlayed / 10);
        
        return Math.max(0, score);
    }
    
    static createNewGame(playerName, specialization) {
        // Crear una partida nueva
        if (!window.dataManager) return null;
        
        const gameData = window.dataManager.createNewGame(playerName, specialization);
        return new Game(gameData);
    }
    
    static loadGame() {
        // Cargar partida guardada
        if (!window.dataManager) return null;
        
        const gameData = window.dataManager.loadGame();
        if (!gameData) return null;
        
        return new Game(gameData);
    }
}
