/**
 * Gestor de especializaciones del jugador (Red, Blue, Purple)
 * Este sistema maneja las bonificaciones y habilidades únicas de cada especialización
 */
export class SpecializationManager {
    constructor(player) {
        this.player = player;
        this.specialization = player.specialization || 'neutral';
        this.specialAbilities = this.getSpecializationAbilities();
        this.passiveBonuses = this.getPassiveBonuses();
        this.masteryLevel = 1; // Nivel de maestría en la especialización
        this.masteryXP = 0; // Experiencia hacia el siguiente nivel
        this.masteryXPRequired = 100; // XP para el siguiente nivel
    }
    
    /**
     * Inicializa la especialización del jugador
     * @param {string} specialization - El tipo de especialización (red, blue, purple)
     */
    initializeSpecialization(specialization) {
        this.specialization = specialization;
        this.specialAbilities = this.getSpecializationAbilities();
        this.passiveBonuses = this.getPassiveBonuses();
        
        // Aplicar bonificaciones iniciales
        this.applyPassiveBonuses();
    }
    
    /**
     * Obtiene las habilidades únicas de la especialización
     * @returns {Array} - Lista de habilidades especiales
     */
    getSpecializationAbilities() {
        switch (this.specialization) {
            case 'red': // Ofensivo
                return [
                    {
                        id: 'red_opener',
                        name: 'Penetración de Seguridad',
                        description: 'El primer ataque de cada combate aplica Vulnerable.',
                        trigger: 'first_attack',
                        effect: 'apply_vulnerable',
                        unlocked: true
                    },
                    {
                        id: 'critical_strike',
                        name: 'Ataque Crítico',
                        description: '20% de probabilidad de que los ataques causen el doble de daño.',
                        trigger: 'attack_played',
                        effect: 'double_damage',
                        chance: 0.2,
                        unlocked: this.masteryLevel >= 2
                    },
                    {
                        id: 'attack_chain',
                        name: 'Cadena de Ataques',
                        description: 'Después de jugar 3 ataques en un turno, roba 1 carta.',
                        trigger: 'attack_chain',
                        effect: 'draw_card',
                        threshold: 3,
                        unlocked: this.masteryLevel >= 3
                    }
                ];
                
            case 'blue': // Defensivo
                return [
                    {
                        id: 'blue_shield',
                        name: 'Firewall Adaptativo',
                        description: 'La primera vez que recibes daño en combate, gana 8 de defensa.',
                        trigger: 'first_damage',
                        effect: 'gain_defense',
                        value: 8,
                        unlocked: true
                    },
                    {
                        id: 'defense_boost',
                        name: 'Defensa Reforzada',
                        description: 'Las cartas de defensa otorgan +2 de defensa adicional.',
                        trigger: 'defense_played',
                        effect: 'bonus_defense',
                        value: 2,
                        unlocked: this.masteryLevel >= 2
                    },
                    {
                        id: 'damage_conversion',
                        name: 'Conversión de Daño',
                        description: 'La defensa no utilizada al final del turno causa 1 de daño por cada 5 puntos.',
                        trigger: 'turn_end',
                        effect: 'defense_to_damage',
                        ratio: 5,
                        unlocked: this.masteryLevel >= 3
                    }
                ];
                
            case 'purple': // Equilibrado
                return [
                    {
                        id: 'purple_balance',
                        name: 'Equilibrio Táctico',
                        description: 'Al inicio del combate, roba 1 carta adicional.',
                        trigger: 'combat_start',
                        effect: 'draw_card',
                        value: 1,
                        unlocked: true
                    },
                    {
                        id: 'type_synergy',
                        name: 'Sinergia de Tipos',
                        description: 'Jugar un ataque y una defensa en el mismo turno otorga 3 de defensa.',
                        trigger: 'mixed_play',
                        effect: 'gain_defense',
                        value: 3,
                        unlocked: this.masteryLevel >= 2
                    },
                    {
                        id: 'tactical_planning',
                        name: 'Planificación Táctica',
                        description: 'Cada 4 cartas jugadas, gana 1 punto de acción.',
                        trigger: 'card_count',
                        effect: 'gain_energy',
                        threshold: 4,
                        unlocked: this.masteryLevel >= 3
                    }
                ];
                
            default: // Neutral/Sin especialización
                return [];
        }
    }
    
    /**
     * Obtiene las bonificaciones pasivas de la especialización
     * @returns {Object} - Bonificaciones pasivas
     */
    getPassiveBonuses() {
        switch (this.specialization) {
            case 'red':
                return {
                    offensiveSkillBonus: Math.floor(this.masteryLevel / 2) + 1,
                    damageMultiplier: 1 + (this.masteryLevel * 0.05),
                    startingHealth: 0,
                    actionPointsBonus: 0
                };
                
            case 'blue':
                return {
                    defensiveSkillBonus: Math.floor(this.masteryLevel / 2) + 1,
                    defenseMultiplier: 1 + (this.masteryLevel * 0.05),
                    startingHealth: 5 + (this.masteryLevel * 2),
                    actionPointsBonus: 0
                };
                
            case 'purple':
                return {
                    offensiveSkillBonus: Math.floor(this.masteryLevel / 3),
                    defensiveSkillBonus: Math.floor(this.masteryLevel / 3),
                    actionPointsBonus: this.masteryLevel >= 3 ? 1 : 0,
                    cardDrawBonus: Math.floor(this.masteryLevel / 2)
                };
                
            default:
                return {};
        }
    }
    
    /**
     * Aplica bonificaciones pasivas al jugador
     */
    applyPassiveBonuses() {
        const bonuses = this.passiveBonuses;
        
        if (bonuses.offensiveSkillBonus) {
            this.player.offensiveSkill += bonuses.offensiveSkillBonus;
        }
        
        if (bonuses.defensiveSkillBonus) {
            this.player.defensiveSkill += bonuses.defensiveSkillBonus;
        }
        
        if (bonuses.startingHealth) {
            this.player.maxHealth += bonuses.startingHealth;
            this.player.health += bonuses.startingHealth;
        }
        
        if (bonuses.actionPointsBonus) {
            this.player.maxActionPoints += bonuses.actionPointsBonus;
            this.player.actionPoints += bonuses.actionPointsBonus;
        }
    }
    
    /**
     * Procesa un evento de juego para activar habilidades especiales
     * @param {string} triggerType - Tipo de evento desencadenante
     * @param {Object} context - Datos contextuales del evento
     * @returns {Object|null} - Resultado de la habilidad activada o null
     */
    processGameEvent(triggerType, context = {}) {
        // Verificar si alguna habilidad reacciona a este evento
        const ability = this.specialAbilities.find(ability => {
            return ability.trigger === triggerType && ability.unlocked;
        });
        
        if (!ability) return null;
        
        // Para habilidades con probabilidad, verificar si se activa
        if (ability.chance && Math.random() > ability.chance) {
            return null;
        }
        
        // Para habilidades con umbrales, verificar si se cumple
        if (ability.threshold && context.count < ability.threshold) {
            return null;
        }
        
        // Activar el efecto de la habilidad
        return this.executeAbilityEffect(ability, context);
    }
    
    /**
     * Ejecuta el efecto de una habilidad especial
     * @param {Object} ability - La habilidad a ejecutar
     * @param {Object} context - Contexto de la ejecución
     * @returns {Object} - Resultado de la ejecución
     */
    executeAbilityEffect(ability, context) {
        const result = {
            abilityId: ability.id,
            abilityName: ability.name,
            success: true,
            effects: []
        };
        
        switch (ability.effect) {
            case 'apply_vulnerable':
                if (context.target) {
                    context.target.addStatusEffect('vulnerable', 1);
                    result.effects.push({
                        type: 'status',
                        status: 'vulnerable',
                        target: 'enemy',
                        value: 1
                    });
                }
                break;
                
            case 'double_damage':
                result.effects.push({
                    type: 'damage_multiplier',
                    value: 2
                });
                break;
                
            case 'draw_card':
                const cardsToDraw = ability.value || 1;
                this.player.drawCards(cardsToDraw);
                result.effects.push({
                    type: 'draw',
                    count: cardsToDraw
                });
                break;
                
            case 'gain_defense':
                const defenseGained = this.player.gainDefense(ability.value || 0);
                result.effects.push({
                    type: 'defense',
                    value: defenseGained
                });
                break;
                
            case 'bonus_defense':
                result.effects.push({
                    type: 'defense_bonus',
                    value: ability.value
                });
                break;
                
            case 'defense_to_damage':
                if (this.player.defense > 0) {
                    const damageAmount = Math.floor(this.player.defense / ability.ratio);
                    if (damageAmount > 0 && context.target) {
                        context.target.takeDamage(damageAmount);
                        result.effects.push({
                            type: 'damage',
                            value: damageAmount
                        });
                    }
                }
                break;
                
            case 'gain_energy':
                this.player.gainActionPoints(1);
                result.effects.push({
                    type: 'energy',
                    value: 1
                });
                break;
                
            default:
                result.success = false;
                result.message = 'Unknown ability effect';
        }
        
        return result;
    }
    
    /**
     * Añade experiencia a la maestría de especialización
     * @param {number} amount - Cantidad de experiencia a añadir
     * @returns {Object} - Resultado de la adición de experiencia
     */
    gainMasteryXP(amount) {
        this.masteryXP += amount;
        
        const result = {
            currentXP: this.masteryXP,
            requiredXP: this.masteryXPRequired,
            leveledUp: false,
            newLevel: this.masteryLevel,
            unlockedAbilities: []
        };
        
        // Verificar si subió de nivel
        if (this.masteryXP >= this.masteryXPRequired) {
            this.masteryLevel++;
            this.masteryXP -= this.masteryXPRequired;
            this.masteryXPRequired = Math.floor(this.masteryXPRequired * 1.5);
            
            // Actualizar bonificaciones
            this.passiveBonuses = this.getPassiveBonuses();
            this.applyPassiveBonuses();
            
            // Actualizar habilidades desbloqueadas
            this.specialAbilities = this.getSpecializationAbilities();
            
            result.leveledUp = true;
            result.newLevel = this.masteryLevel;
            
            // Verificar habilidades recién desbloqueadas
            const newlyUnlocked = this.specialAbilities.filter(
                ability => ability.unlocked && ability.masteryLevel === this.masteryLevel
            );
            
            result.unlockedAbilities = newlyUnlocked.map(ability => ({
                id: ability.id,
                name: ability.name,
                description: ability.description
            }));
        }
        
        return result;
    }
    
    /**
     * Aplica el multiplicador de daño de especialización
     * @param {number} damage - Daño base
     * @returns {number} - Daño modificado
     */
    applyDamageModifier(damage) {
        if (this.passiveBonuses.damageMultiplier) {
            return Math.floor(damage * this.passiveBonuses.damageMultiplier);
        }
        return damage;
    }
    
    /**
     * Aplica el multiplicador de defensa de especialización
     * @param {number} defense - Defensa base
     * @returns {number} - Defensa modificada
     */
    applyDefenseModifier(defense) {
        if (this.passiveBonuses.defenseMultiplier) {
            return Math.floor(defense * this.passiveBonuses.defenseMultiplier);
        }
        return defense;
    }
    
    /**
     * Serializa el estado del gestor de especializaciones
     * @returns {Object} - Estado serializado
     */
    serialize() {
        return {
            specialization: this.specialization,
            masteryLevel: this.masteryLevel,
            masteryXP: this.masteryXP,
            masteryXPRequired: this.masteryXPRequired
        };
    }
    
    /**
     * Crea un gestor de especializaciones desde datos serializados
     * @param {Object} data - Datos serializados
     * @param {Object} player - Jugador al que asignar el gestor
     * @returns {SpecializationManager} - Nueva instancia
     */
    static deserialize(data, player) {
        const manager = new SpecializationManager(player);
        
        if (data) {
            manager.specialization = data.specialization;
            manager.masteryLevel = data.masteryLevel;
            manager.masteryXP = data.masteryXP;
            manager.masteryXPRequired = data.masteryXPRequired;
            
            // Reinicializar las habilidades y bonificaciones con los nuevos niveles
            manager.specialAbilities = manager.getSpecializationAbilities();
            manager.passiveBonuses = manager.getPassiveBonuses();
        }
        
        return manager;
    }
}