import { BehaviorTree } from '../ai/BehaviorTree.js';

export class Enemy {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.type = config.type || 'normal'; // normal, elite, boss
        this.health = config.health || 20;
        this.maxHealth = config.maxHealth || this.health;
        this.defense = config.defense || 0;
        this.damage = config.damage || 5;
        this.goldReward = config.goldReward || 10;
        this.cardReward = config.cardReward || false;
        this.status = {
            vulnerable: 0,
            weak: 0,
            poisoned: 0,
            burning: 0,
            frozen: 0,
            stunned: 0,
            encrypted: 0 // Mecánica única: cartas encriptadas
        };
        
        this.actions = config.actions || [];
        this.nextAction = null;
        this.imageKey = config.imageKey || 'enemy-default';
        this.description = config.description || '';
        
        // Sistema de IA basado en Behavior Trees
        this.ai = null;
        if (config.aiTree) {
            this.ai = new BehaviorTree(config.aiTree, this);
        }
        
        // Patrones de ataque
        this.attackPattern = config.attackPattern || ['attack'];
        this.patternIndex = 0;
        
        // Para enemigos con efectos especiales
        this.specialAbilities = config.specialAbilities || [];
    }
    
    initialize() {
        this.selectNextAction();
    }

    takeDamage(amount) {
        // Aplicar modificadores de estado
        if (this.status.vulnerable > 0) {
            amount = Math.floor(amount * 1.5);
        }
        
        // Reducir daño con defensa
        let finalDamage = amount - this.defense;
        if (finalDamage < 0) finalDamage = 0;
        
        this.defense = Math.max(0, this.defense - amount);
        this.health -= finalDamage;
        
        // Asegurar que la salud no sea negativa
        if (this.health < 0) this.health = 0;
        
        return finalDamage;
    }

    addDefense(amount) {
        // Si tiene debilidad, la defensa es menos efectiva
        if (this.status.weak > 0) {
            amount = Math.floor(amount * 0.75);
        }
        
        this.defense += amount;
        return amount;
    }

    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health - oldHealth; // Cantidad real curada
    }

    addStatusEffect(effect, duration) {
        if (this.status.hasOwnProperty(effect)) {
            // Algunos efectos se acumulan, otros renuevan duración
            if (['poisoned', 'burning'].includes(effect)) {
                this.status[effect] += duration;
            } else {
                this.status[effect] = Math.max(this.status[effect], duration);
            }
            return true;
        }
        return false;
    }

    selectNextAction() {
        if (this.ai) {
            // Usa el Behavior Tree si está disponible
            this.ai.update();
            return;
        }
        
        // Sistema de patrón de ataque simple por defecto
        const actionType = this.attackPattern[this.patternIndex];
        this.patternIndex = (this.patternIndex + 1) % this.attackPattern.length;
        
        switch (actionType) {
            case 'attack':
                this.nextAction = {
                    type: 'attack',
                    value: this.damage,
                    description: `${this.name} atacará por ${this.damage} daño.`
                };
                break;
            case 'defend':
                const defenseAmount = Math.floor(this.damage * 0.8);
                this.nextAction = {
                    type: 'defend',
                    value: defenseAmount,
                    description: `${this.name} ganará ${defenseAmount} de defensa.`
                };
                break;
            case 'debuff':
                this.nextAction = {
                    type: 'debuff',
                    effect: 'vulnerable',
                    duration: 2,
                    description: `${this.name} te hará vulnerable por 2 turnos.`
                };
                break;
            case 'special':
                // Seleccionar habilidad especial aleatoria
                if (this.specialAbilities.length > 0) {
                    const special = this.specialAbilities[Math.floor(Math.random() * this.specialAbilities.length)];
                    this.nextAction = {
                        type: 'special',
                        ...special
                    };
                } else {
                    // Volver a ataque normal si no hay habilidades especiales
                    this.nextAction = {
                        type: 'attack',
                        value: this.damage,
                        description: `${this.name} atacará por ${this.damage} daño.`
                    };
                }
                break;
        }
    }

    executeAction(target) {
        if (!this.nextAction) this.selectNextAction();
        
        const action = this.nextAction;
        let result = {
            success: true,
            description: '',
            damage: 0,
            effects: []
        };
        
        // Ejecutar acción basada en tipo
        switch (action.type) {
            case 'attack':
                let dmg = action.value;
                if (this.status.weak > 0) {
                    dmg = Math.floor(dmg * 0.75);
                }
                
                const actualDamage = target.takeDamage(dmg);
                result.damage = actualDamage;
                result.description = `${this.name} atacó por ${actualDamage} daño.`;
                break;
                
            case 'defend':
                const defAmount = this.addDefense(action.value);
                result.description = `${this.name} ganó ${defAmount} de defensa.`;
                break;
                
            case 'debuff':
                const applied = target.addStatusEffect(action.effect, action.duration);
                result.description = applied ? 
                    `${this.name} aplicó ${action.effect} por ${action.duration} turnos.` : 
                    `${this.name} falló al aplicar ${action.effect}.`;
                break;
                
            case 'special':
                result = this.executeSpecialAction(action, target);
                break;
                
            default:
                result.success = false;
                result.description = `${this.name} no pudo ejecutar su acción.`;
        }
        
        // Seleccionar próxima acción
        this.selectNextAction();
        
        return result;
    }
    
    executeSpecialAction(action, target) {
        const result = {
            success: true,
            description: '',
            damage: 0,
            effects: []
        };
        
        switch (action.id) {
            case 'data_leech':
                // Drena vida del jugador
                const drainAmount = Math.min(action.value, target.health);
                target.takeDamage(drainAmount);
                this.heal(drainAmount);
                result.description = `${this.name} absorbió ${drainAmount} de salud!`;
                result.damage = drainAmount;
                break;
                
            case 'ddos_attack':
                // Múltiples ataques pequeños
                const hits = action.hits || 3;
                let totalDamage = 0;
                for (let i = 0; i < hits; i++) {
                    const dmg = Math.floor(this.damage * 0.4);
                    const actualDmg = target.takeDamage(dmg);
                    totalDamage += actualDmg;
                }
                result.description = `${this.name} realizó un ataque DDoS por ${totalDamage} daño total!`;
                result.damage = totalDamage;
                break;
                
            case 'encrypt_cards':
                // Cifra cartas del jugador (las bloquea temporalmente)
                if (target.encryptCards && typeof target.encryptCards === 'function') {
                    const count = action.count || 2;
                    const encryptedCount = target.encryptCards(count);
                    result.description = `${this.name} cifró ${encryptedCount} cartas en tu mazo!`;
                }
                break;
                
            case 'hidden_payload':
                // Ataque que ignora defensa
                if (action.damage) {
                    target.health -= action.damage;
                    if (target.health < 0) target.health = 0;
                    result.damage = action.damage;
                    result.description = `${this.name} ejecutó un ataque que ignoró tu defensa por ${action.damage} daño!`;
                }
                break;
                
            case 'self_replicate':
                // Generar una copia del enemigo
                if (action.effect && action.effect.type === 'summon') {
                    // La lógica de invocación se maneja desde la escena de combate
                    result.description = `${this.name} se ha replicado!`;
                    result.effects.push({
                        type: 'summon',
                        enemyId: action.effect.enemyId,
                        healthPercent: action.effect.healthPercent
                    });
                }
                break;
                
            case 'adaptive_defense':
                // Genera resistencia adaptativa
                this.addStatusEffect('adaptive_resist', 3);
                this.addDefense(10);
                result.description = `${this.name} analizó tu estrategia y adaptó sus defensas!`;
                break;
                
            case 'countdown':
                // Iniciar cuenta atrás para un gran ataque
                if (action.effect) {
                    result.description = `${this.name} inicia una cuenta regresiva! Ataque masivo en ${action.effect.turns} turnos.`;
                    result.effects.push({
                        type: 'countdown',
                        turns: action.effect.turns,
                        damage: action.effect.damage
                    });
                }
                break;
                
            case 'exploit_weakness':
                // Causa daño según la especialización del jugador
                let specialDamage = this.damage;
                if (target.specialization === 'red') {
                    specialDamage += 5; // Más daño a especializaciones ofensivas
                }
                const actualDmg = target.takeDamage(specialDamage);
                result.damage = actualDmg;
                result.description = `${this.name} explotó tu especialización causando ${actualDmg} daño!`;
                break;
                
            case 'access_denied':
                // Bloquea cartas poderosas
                if (action.effect) {
                    result.description = `${this.name} bloqueó tus herramientas más poderosas!`;
                    result.effects.push({
                        type: 'lock_cards',
                        target: action.effect.target,
                        duration: action.effect.duration
                    });
                }
                break;
                
            case 'system_purge':
                // Daño basado en el tamaño de la mano
                if (target.hand && target.hand.length > 0) {
                    const damagePerCard = action.effect ? action.effect.damagePerCard : 3;
                    const totalDamage = target.hand.length * damagePerCard;
                    const actualDmg = target.takeDamage(totalDamage);
                    result.damage = actualDmg;
                    result.description = `${this.name} causó ${actualDmg} daño basado en las ${target.hand.length} cartas en tu mano!`;
                }
                break;
                
            case 'mass_encryption':
                // Cifrado masivo de cartas
                if (target.encryptCards && typeof target.encryptCards === 'function') {
                    const count = action.effect ? action.effect.count : 5;
                    const encryptedCount = target.encryptCards(count);
                    result.description = `${this.name} cifró ${encryptedCount} cartas en tu mazo!`;
                }
                break;
                
            case 'data_hostage':
                // Demanda de rescate para liberar cartas
                result.description = `${this.name} exige un rescate para liberar tus cartas cifradas!`;
                result.effects.push({
                    type: 'ransom_demand',
                    options: action.effect ? action.effect.options : ['credits', 'health']
                });
                break;
                
            case 'system_lockdown':
                // Reducir puntos de acción
                if (action.effect) {
                    result.description = `${this.name} bloqueó parte de tus recursos durante ${action.effect.duration} turnos!`;
                    result.effects.push({
                        type: 'reduce_energy',
                        amount: action.effect.amount,
                        duration: action.effect.duration
                    });
                }
                break;
                
            case 'admin_privileges':
                // Curación y limpieza de estados
                let healAmount = action.effect ? action.effect.healAmount : 20;
                const healed = this.heal(healAmount);
                
                // Limpiar todos los estados negativos
                this.status.vulnerable = 0;
                this.status.weak = 0;
                this.status.poisoned = 0;
                this.status.burning = 0;
                this.status.frozen = 0;
                
                result.description = `${this.name} utilizó privilegios de administrador para curarse ${healed} puntos y eliminar todos los estados negativos!`;
                break;
                
            default:
                result.success = false;
                result.description = `${this.name} intentó usar una habilidad desconocida.`;
        }
        
        return result;
    }

    startTurn() {
        // Procesar efectos de estado al inicio del turno
        if (this.status.poisoned > 0) {
            const poisonDamage = Math.ceil(this.status.poisoned / 2);
            this.health -= poisonDamage;
            this.status.poisoned--;
        }
        
        if (this.status.burning > 0) {
            const burnDamage = 3;
            this.health -= burnDamage;
            this.status.burning--;
        }
        
        // Reducir contadores de estados
        for (const status in this.status) {
            if (status !== 'poisoned' && status !== 'burning') { // Ya procesados
                if (this.status[status] > 0) {
                    this.status[status]--;
                }
            }
        }
        
        return this.health <= 0;
    }

    isDefeated() {
        return this.health <= 0;
    }

    getRewards() {
        // Calcular recompensas al derrotar al enemigo
        const rewards = {
            gold: this.goldReward,
            cards: []
        };
        
        // Probabilidad de carta según rareza del enemigo
        if (this.type === 'boss') {
            rewards.cards.push({
                rarity: 'rare',
                count: 1
            });
        } else if (this.type === 'elite') {
            if (Math.random() < 0.7) {
                rewards.cards.push({
                    rarity: 'uncommon',
                    count: 1
                });
            }
        } else {
            if (Math.random() < 0.3) {
                rewards.cards.push({
                    rarity: 'common',
                    count: 1
                });
            }
        }
        
        return rewards;
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            health: this.health,
            maxHealth: this.maxHealth,
            defense: this.defense,
            damage: this.damage,
            status: { ...this.status },
            nextAction: this.nextAction,
            patternIndex: this.patternIndex
        };
    }

    static deserialize(data) {
        // Obtener información completa del enemigo desde el catálogo global
        const enemyTemplate = ENEMIES[data.id];
        if (!enemyTemplate) return null;
        
        // Crear enemigo base y luego actualizarlo con datos guardados
        const enemy = new Enemy(enemyTemplate);
        
        enemy.health = data.health;
        enemy.defense = data.defense;
        enemy.status = data.status;
        enemy.nextAction = data.nextAction;
        enemy.patternIndex = data.patternIndex;
        
        return enemy;
    }
}