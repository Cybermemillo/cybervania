import { AudioManager } from './AudioManager.js';
import { Player } from '../entities/Player.js';
import { DeckManager } from './DeckManager.js';
import { ENEMIES } from '../data/enemies.js';
import { ARTIFACTS } from '../data/artifacts.js';
import { EVENTS } from '../data/events.js';

export class DataManager {
    constructor() {
        // Instancia única
        if (window.dataManagerInstance) {
            return window.dataManagerInstance;
        }
        
        // Inicializar gestor de audio
        this.audioManager = new AudioManager();
        
        // Registrar como instancia global
        window.dataManagerInstance = this;
    }
    
    // Inicialización de partida nueva
    createNewGame(playerName, specialization) {
        // Crear jugador
        const player = new Player({
            name: playerName,
            specialization: specialization
        });
        
        // Crear mazo
        const deckManager = new DeckManager();
        
        // Añadir cartas adicionales según especialización
        this.addSpecializationCards(deckManager, specialization);
        
        // Crear estado de juego
        const gameState = {
            player: player,
            deckManager: deckManager,
            currentFloor: 1,
            maps: {},
            visitedNodes: [],
            artifacts: [],
            statistics: {
                enemiesDefeated: 0,
                damageDealt: 0,
                damageReceived: 0,
                cardsPlayed: 0,
                goldFound: 0,
                elitesKilled: 0,
                bossesKilled: 0,
                turnsPlayed: 0
            },
            seed: Math.floor(Math.random() * 1000000)
        };
        
        return gameState;
    }
    
    addSpecializationCards(deckManager, specialization) {
        // Añadir cartas iniciales según la especialización
        switch (specialization) {
            case 'red':
                // Añadir cartas ofensivas
                deckManager.addCard(this.getCardById('exploit'));
                deckManager.addCard(this.getCardById('malware_injection'));
                break;
                
            case 'blue':
                // Añadir cartas defensivas
                deckManager.addCard(this.getCardById('security_patch'));
                deckManager.addCard(this.getCardById('encryption'));
                break;
                
            case 'purple':
                // Añadir cartas mixtas
                deckManager.addCard(this.getCardById('penetration_test'));
                deckManager.addCard(this.getCardById('incident_response'));
                break;
        }
    }
    
    // Gestión de datos del piso
    getMapForFloor(floorNumber) {
        // Obtener datos del mapa para un piso específico
        if (!window.game || !window.game.maps) return null;
        
        return window.game.maps[floorNumber];
    }
    
    setMapForFloor(floorNumber, mapData) {
        // Guardar datos del mapa para un piso
        if (!window.game) return false;
        
        if (!window.game.maps) {
            window.game.maps = {};
        }
        
        window.game.maps[floorNumber] = mapData;
        return true;
    }
    
    // Gestión de contenido del juego
    getEnemiesForFloor(floor, difficulty) {
        // Obtener enemigos disponibles para un piso según dificultad
        const enemies = Object.values(ENEMIES).filter(enemy => {
            // Filtrar por tipo y disponibilidad en el piso
            if (difficulty === 'normal' && enemy.type !== 'normal') return false;
            if (difficulty === 'elite' && enemy.type !== 'elite') return false;
            
            // Verificar si el enemigo está disponible en este piso
            const minFloor = enemy.minFloor || 1;
            const maxFloor = enemy.maxFloor || 999;
            
            return floor >= minFloor && floor <= maxFloor;
        });
        
        // Si no hay enemigos disponibles, devolver enemigos básicos
        if (enemies.length === 0) {
            return Object.values(ENEMIES).filter(enemy => enemy.type === difficulty).slice(0, 3);
        }
        
        return enemies;
    }
    
    getBossesForFloor(floor) {
        // Obtener jefes disponibles para un piso
        return Object.values(ENEMIES).filter(enemy => {
            return enemy.type === 'boss' && 
                  (!enemy.floorSpecific || enemy.floorSpecific === floor);
        });
    }
    
    getEventsForFloor(floor) {
        // Obtener eventos disponibles para un piso
        return Object.values(EVENTS).filter(event => {
            const minFloor = event.minFloor || 1;
            const maxFloor = event.maxFloor || 999;
            
            return floor >= minFloor && floor <= maxFloor;
        });
    }
    
    getRandomCards(count, rarity = null, team = null) {
        // Delegamos a DeckManager
        const tempManager = new DeckManager();
        return tempManager.getRandomCards(count, rarity, team);
    }
    
    getRandomArtifact(rarity = null, excludeIds = []) {
        // Obtener un artefacto aleatorio con filtros opcionales
        const artifacts = Object.values(ARTIFACTS).filter(artifact => {
            if (rarity && artifact.rarity !== rarity) return false;
            if (excludeIds.includes(artifact.id)) return false;
            return true;
        });
        
        if (artifacts.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * artifacts.length);
        return { ...artifacts[randomIndex] };
    }
    
    getRandomShopCards(count) {
        // Cartas para la tienda - mayor probabilidad de raras
        const rarities = ['common', 'uncommon', 'uncommon', 'rare'];
        const cards = [];
        
        for (let i = 0; i < count; i++) {
            const rarity = rarities[Math.floor(Math.random() * rarities.length)];
            const card = this.getRandomCards(1, rarity)[0];
            if (card) {
                // Añadir precio a la carta
                card.price = this.calculateCardPrice(card);
                cards.push(card);
            }
        }
        
        return cards;
    }
    
    getRandomShopArtifacts(count) {
        const artifacts = [];
        const rarities = ['common', 'uncommon', 'uncommon', 'rare'];
        
        for (let i = 0; i < count; i++) {
            const rarity = rarities[Math.floor(Math.random() * rarities.length)];
            const artifact = this.getRandomArtifact(rarity);
            
            if (artifact) {
                // Añadir precio al artefacto
                artifact.price = this.calculateArtifactPrice(artifact);
                artifacts.push(artifact);
            }
        }
        
        return artifacts;
    }
    
    getRandomShopPotions(count) {
        // TODO: Implementar sistema de pociones
        return [];
    }
    
    calculateCardPrice(card) {
        // Calcular precio de carta según rareza
        let basePrice;
        
        switch (card.rarity) {
            case 'common':
                basePrice = 50;
                break;
            case 'uncommon':
                basePrice = 75;
                break;
            case 'rare':
                basePrice = 150;
                break;
            default:
                basePrice = 100;
        }
        
        // Aplicar variación aleatoria de ±10%
        const variation = (Math.random() * 0.2 - 0.1) * basePrice;
        return Math.floor(basePrice + variation);
    }
    
    calculateArtifactPrice(artifact) {
        // Calcular precio de artefacto según rareza
        let basePrice;
        
        switch (artifact.rarity) {
            case 'common':
                basePrice = 150;
                break;
            case 'uncommon':
                basePrice = 250;
                break;
            case 'rare':
                basePrice = 350;
                break;
            default:
                basePrice = 200;
        }
        
        // Aplicar variación aleatoria de ±10%
        const variation = (Math.random() * 0.2 - 0.1) * basePrice;
        return Math.floor(basePrice + variation);
    }
    
    // Gestión de guardado/carga
    saveGame() {
        if (!window.game) return false;
        
        try {
            // Serializar estado del juego
            const saveData = {
                player: window.game.player.serialize(),
                deckManager: window.game.deckManager.serialize(),
                currentFloor: window.game.currentFloor,
                maps: window.game.maps,
                artifacts: window.game.artifacts,
                statistics: window.game.statistics,
                seed: window.game.seed,
                timestamp: Date.now()
            };
            
            // Guardar en localStorage
            localStorage.setItem('cybervania_save', JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Error al guardar partida:', error);
            return false;
        }
    }
    
    loadGame() {
        try {
            const saveDataString = localStorage.getItem('cybervania_save');
            if (!saveDataString) return null;
            
            const saveData = JSON.parse(saveDataString);
            
            // Restaurar estado del juego
            const player = Player.deserialize(saveData.player);
            const deckManager = DeckManager.deserialize(saveData.deckManager);
            
            const gameState = {
                player: player,
                deckManager: deckManager,
                currentFloor: saveData.currentFloor,
                maps: saveData.maps,
                artifacts: saveData.artifacts,
                statistics: saveData.statistics,
                seed: saveData.seed
            };
            
            window.game = gameState;
            return gameState;
        } catch (error) {
            console.error('Error al cargar partida:', error);
            return null;
        }
    }
    
    // Métodos adicionales
    getCardById(cardId) {
        // TODO: Implementar método para obtener carta por ID
        return null;
    }
}
