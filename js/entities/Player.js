/**
 * Clase del jugador para el juego Cybervania
 * Maneja las estadísticas, inventario y habilidades del personaje
 */
export class Player {
    constructor(playerData = {}) {
        // Datos identificativos
        this.id = playerData.id || this.generateId();
        this.name = playerData.name || 'Hacker';
        this.gender = playerData.gender || 'other';
        this.specialization = playerData.specialization || 'balanced';
        
        // Estadísticas básicas
        this.level = playerData.level || 1;
        this.exp = playerData.exp || 0;
        this.expToNextLevel = this.calculateExpToNextLevel();
        
        // Salud y energía
        this.maxHealth = playerData.maxHealth || 100;
        this.health = playerData.health || this.maxHealth;
        this.maxEnergy = playerData.maxEnergy || 50;
        this.energy = playerData.energy || this.maxEnergy;
        
        // Estadísticas de combate
        this.baseAttack = playerData.baseAttack || 10;
        this.baseDefense = playerData.baseDefense || 5;
        this.baseMagic = playerData.baseMagic || 8;
        this.baseSpeed = playerData.baseSpeed || 7;
        
        // Recursos
        this.credits = playerData.credits || 100;
        this.inventory = playerData.inventory || [];
        this.equippedItems = playerData.equippedItems || {};
        this.skills = playerData.skills || [];
        
        // Aplicar modificadores según la especialización
        this.applySpecializationModifiers();
        
        // Datos de tiempo y ubicación
        this.lastSave = playerData.lastSave || new Date().toISOString();
        this.location = playerData.location || 'cyber_district_start';
        this.timePlayed = playerData.timePlayed || 0;
    }
    
    /**
     * Genera un ID único para el jugador
     */
    generateId() {
        return 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }
    
    /**
     * Aplica modificadores según la especialización del personaje
     */
    applySpecializationModifiers() {
        switch (this.specialization) {
            case 'red': // Ofensivo
                this.baseAttack *= 1.3; // +30% ataque
                this.baseDefense *= 0.9; // -10% defensa
                break;
                
            case 'blue': // Defensivo
                this.baseDefense *= 1.3; // +30% defensa
                this.baseAttack *= 0.9; // -10% ataque
                break;
                
            case 'purple': // Equilibrado
                this.actionsPerTurn = 4; // +1 acción por turno
                break;
                
            default:
                this.actionsPerTurn = 3;
                break;
        }
    }
    
    /**
     * Calcula la experiencia necesaria para subir al siguiente nivel
     */
    calculateExpToNextLevel() {
        return 100 * Math.pow(1.5, this.level - 1);
    }
    
    /**
     * Añade experiencia al jugador y sube de nivel si es suficiente
     * @param {number} amount - Cantidad de experiencia a añadir
     * @return {object} - Objeto con información sobre el cambio de nivel si ocurrió
     */
    addExperience(amount) {
        this.exp += amount;
        
        // Verificar si sube de nivel
        if (this.exp >= this.expToNextLevel) {
            const oldLevel = this.level;
            this.levelUp();
            
            return {
                leveledUp: true,
                oldLevel: oldLevel,
                newLevel: this.level,
                statsIncrease: {
                    maxHealth: this.maxHealth - (oldLevel * 10),
                    attack: this.baseAttack - (oldLevel * 2),
                    defense: this.baseDefense - (oldLevel * 1.5)
                }
            };
        }
        
        return { leveledUp: false, exp: this.exp };
    }
    
    /**
     * Sube de nivel al jugador
     */
    levelUp() {
        this.level++;
        
        // Actualizar experiencia para siguiente nivel
        this.exp = 0;
        this.expToNextLevel = this.calculateExpToNextLevel();
        
        // Mejorar estadísticas
        this.maxHealth += 10;
        this.health = this.maxHealth; // Recupera toda la salud al subir de nivel
        this.baseAttack += 2;
        this.baseDefense += 1.5;
        this.baseMagic += 1.5;
        this.baseSpeed += 1;
        
        // Aplicar modificadores de especialización de nuevo
        this.applySpecializationModifiers();
        
        // Desbloquear nuevas habilidades según nivel
        this.checkLevelSkills();
    }
    
    /**
     * Verifica y desbloquea habilidades según el nivel
     */
    checkLevelSkills() {
        // Aquí se desbloquearian habilidades específicas según el nivel
        // Por ahora es solo un placeholder
        const newSkills = [];
        
        // Ejemplos de habilidades por nivel
        if (this.level === 2) {
            newSkills.push({
                id: 'double_attack',
                name: 'Ataque Doble',
                description: 'Realiza dos ataques consecutivos con penalización',
                type: 'active',
                cost: 15
            });
        }
        
        if (this.level === 3) {
            newSkills.push({
                id: 'cyber_shield',
                name: 'Escudo Cibernético',
                description: 'Crea un escudo que absorbe daño por 3 turnos',
                type: 'active',
                cost: 20
            });
        }
        
        // Añadir nuevas habilidades al jugador
        for (const skill of newSkills) {
            if (!this.hasSkill(skill.id)) {
                this.skills.push(skill);
            }
        }
        
        return newSkills;
    }
    
    /**
     * Comprueba si el jugador tiene una habilidad específica
     */
    hasSkill(skillId) {
        return this.skills.some(s => s.id === skillId);
    }
    
    /**
     * Actualiza el tiempo jugado
     * @param {number} seconds - Segundos a añadir
     */
    addPlayTime(seconds) {
        this.timePlayed += seconds;
    }
    
    /**
     * Guarda la partida actual
     */
    save() {
        const saveData = {
            ...this,
            lastSave: new Date().toISOString()
        };
        
        // Actualizar en localStorage
        try {
            localStorage.setItem('current_player', JSON.stringify(saveData));
            
            // También guardar en las ranuras de guardado
            const saveSlots = JSON.parse(localStorage.getItem('save_slots') || '[]');
            
            // Buscar si ya existe una partida con este ID para actualizarla
            const existingSlotIndex = saveSlots.findIndex(slot => slot.id === this.id);
            
            if (existingSlotIndex >= 0) {
                saveSlots[existingSlotIndex] = saveData;
            } else {
                saveSlots.push(saveData);
            }
            
            localStorage.setItem('save_slots', JSON.stringify(saveSlots));
            
            return true;
        } catch (e) {
            console.error('Error guardando partida:', e);
            return false;
        }
    }
    
    /**
     * Devuelve una representación del objeto para serialización
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            gender: this.gender,
            specialization: this.specialization,
            level: this.level,
            exp: this.exp,
            maxHealth: this.maxHealth,
            health: this.health,
            maxEnergy: this.maxEnergy,
            energy: this.energy,
            baseAttack: this.baseAttack,
            baseDefense: this.baseDefense,
            baseMagic: this.baseMagic,
            baseSpeed: this.baseSpeed,
            credits: this.credits,
            inventory: this.inventory,
            equippedItems: this.equippedItems,
            skills: this.skills,
            lastSave: this.lastSave,
            location: this.location,
            timePlayed: this.timePlayed,
            created: this.created || this.lastSave
        };
    }
}

/**
 * Carga un jugador desde localStorage
 */
export function loadPlayer() {
    try {
        const savedData = localStorage.getItem('current_player');
        if (savedData) {
            return new Player(JSON.parse(savedData));
        }
    } catch (e) {
        console.error('Error cargando jugador:', e);
    }
    
    return null;
}
