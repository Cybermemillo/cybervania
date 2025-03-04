/**
 * Sistema de combate para Cybervania
 * Maneja todas las mecánicas de combate por turnos
 */
export class CombatSystem {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.player = null;
        this.enemy = null;
        this.turn = 'player'; // player, enemy, none
        this.isActive = false;
        this.enemyDatabase = this.initEnemyDatabase();
    }
    
    /**
     * Inicializa la base de datos de enemigos
     */
    initEnemyDatabase() {
        return {
            "espectro_cibernetico": {
                name: "Espectro Cibernético",
                health: 80,
                attack: 8,
                defense: 3,
                speed: 5,
                exp: 25,
                credits: 75,
                sprite: "cyber_ghoul.png",
                abilities: ["basic_attack", "energy_drain"],
                drops: ["health_potion", "data_fragment"],
                description: "Una entidad digital que habita en sistemas antiguos. Se alimenta de energía residual."
            },
            "dron_centinela": {
                name: "Dron Centinela",
                health: 60,
                attack: 12,
                defense: 2,
                speed: 8,
                exp: 30,
                credits: 85,
                sprite: "drone_sentinel.png",
                abilities: ["basic_attack", "double_shot"],
                drops: ["emp_grenade", "energy_cell"],
                description: "Unidad de vigilancia autónoma. Sus sensores deteriorados lo hacen atacar indiscriminadamente."
            },
            "cazador_digital": {
                name: "Cazador Digital",
                health: 100,
                attack: 7,
                defense: 5,
                speed: 4,
                exp: 35,
                credits: 90,
                sprite: "digital_hunter.png",
                abilities: ["basic_attack", "defensive_stance"],
                drops: ["neural_stimulant", "reinforced_armor"],
                description: "Programa de seguridad avanzado. Se especializa en detectar y neutralizar intrusiones no autorizadas."
            }
        };
    }
    
    /**
     * Inicia un combate con un enemigo específico o aleatorio
     */
    startCombat(player, enemyId = null) {
        this.player = player;
        
        // Seleccionar enemigo
        if (enemyId && this.enemyDatabase[enemyId]) {
            // Usar enemigo específico
            this.enemy = this.createEnemyFromTemplate(this.enemyDatabase[enemyId]);
        } else {
            // Usar enemigo aleatorio
            this.enemy = this.generateRandomEnemy();
        }
        
        // Ajustar enemigo según nivel del jugador
        this.scaleEnemyToPlayerLevel();
        
        // Inicializar combate
        this.turn = 'player';
        this.isActive = true;
        
        // Notificar a la UI
        if (this.uiManager) {
            this.uiManager.updateCombatUI(this.player, this.enemy);
            this.uiManager.addMessage(`¡Un ${this.enemy.name} aparece!`);
        }
        
        return {
            player: this.player,
            enemy: this.enemy
        };
    }
    
    /**
     * Crea una instancia de enemigo desde una plantilla
     */
    createEnemyFromTemplate(template) {
        return {
            name: template.name,
            maxHealth: template.health,
            health: template.health,
            attack: template.attack,
            defense: template.defense,
            speed: template.speed,
            exp: template.exp,
            credits: template.credits,
            sprite: template.sprite,
            abilities: [...template.abilities],
            drops: [...template.drops],
            isStunned: false,
            description: template.description
        };
    }
    
    /**
     * Genera un enemigo aleatorio
     */
    generateRandomEnemy() {
        const enemyKeys = Object.keys(this.enemyDatabase);
        const randomKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        return this.createEnemyFromTemplate(this.enemyDatabase[randomKey]);
    }
    
    /**
     * Ajusta las estadísticas del enemigo según el nivel del jugador
     */
    scaleEnemyToPlayerLevel() {
        if (!this.player || !this.enemy) return;
        
        const levelFactor = 1 + (this.player.level - 1) * 0.2;
        
        this.enemy.maxHealth = Math.floor(this.enemy.maxHealth * levelFactor);
        this.enemy.health = this.enemy.maxHealth;
        this.enemy.attack = Math.floor(this.enemy.attack * levelFactor);
        this.enemy.defense = Math.floor(this.enemy.defense * levelFactor);
        this.enemy.exp = Math.floor(this.enemy.exp * levelFactor);
        this.enemy.credits = Math.floor(this.enemy.credits * levelFactor);
    }
    
    /**
     * El jugador realiza un ataque básico
     */
    playerAttack() {
        if (this.turn !== 'player' || !this.isActive) return null;
        
        // Calcular daño
        const damage = Math.max(1, this.player.attack - this.enemy.defense);
        this.enemy.health = Math.max(0, this.enemy.health - damage);
        
        const result = {
            action: 'attack',
            actor: 'player',
            target: 'enemy',
            damage: damage,
            enemyDefeated: this.enemy.health <= 0
        };
        
        // Verificar si el enemigo ha sido derrotado
        if (this.enemy.health <= 0) {
            this.isActive = false;
            result.rewards = this.calculateRewards();
        } else {
            // Siguiente turno
            this.turn = 'enemy';
        }
        
        return result;
    }
    
    /**
     * El jugador usa una habilidad
     */
    playerUseSkill(skillId) {
        if (this.turn !== 'player' || !this.isActive) return null;
        
        const skill = this.getSkillById(skillId);
        if (!skill) return null;
        
        // Verificar coste de energía
        if (this.player.energy < skill.energyCost) {
            return { error: 'energy', message: 'No tienes suficiente energía' };
        }
        
        // Consumir energía
        this.player.energy -= skill.energyCost;
        
        let damage = 0;
        let healing = 0;
        let effects = [];
        
        // Aplicar efectos según la habilidad
        switch (skillId) {
            case 'critical_strike':
                damage = Math.floor(this.player.attack * 1.5);
                this.enemy.health = Math.max(0, this.enemy.health - damage);
                break;
                
            case 'cyber_shield':
                effects.push({
                    type: 'defense_up',
                    value: 3,
                    duration: 3
                });
                this.player.defense += 3;
                this.player.activeEffects = this.player.activeEffects || [];
                this.player.activeEffects.push({
                    id: 'cyber_shield',
                    remaining: 3,
                    onExpire: () => { this.player.defense -= 3; }
                });
                break;
                
            case 'neural_interference':
                damage = Math.floor(this.player.attack * 0.8);
                this.enemy.health = Math.max(0, this.enemy.health - damage);
                this.enemy.isStunned = true;
                effects.push({
                    type: 'stun',
                    duration: 1
                });
                break;
                
            case 'energy_restoration':
                healing = Math.floor(this.player.maxHealth * 0.2);
                this.player.health = Math.min(this.player.maxHealth, this.player.health + healing);
                break;
        }
        
        const result = {
            action: 'skill',
            actor: 'player',
            skillId,
            skillName: skill.name,
            target: skill.target,
            damage,
            healing,
            effects,
            enemyDefeated: this.enemy.health <= 0
        };
        
        // Verificar si el enemigo ha sido derrotado
        if (this.enemy.health <= 0) {
            this.isActive = false;
            result.rewards = this.calculateRewards();
        } else {
            // Siguiente turno
            this.turn = 'enemy';
        }
        
        return result;
    }
    
    /**
     * El jugador usa un objeto
     */
    playerUseItem(itemId) {
        if (this.turn !== 'player' || !this.isActive) return null;
        
        // Buscar item en inventario
        const itemIndex = this.player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return null;
        
        const item = this.player.inventory[itemIndex];
        let effect = 0;
        
        // Aplicar efecto según tipo de ítem
        switch (item.type) {
            case 'heal':
                effect = Math.min(item.value, this.player.maxHealth - this.player.health);
                this.player.health += effect;
                break;
                
            case 'energy':
                effect = Math.min(item.value, this.player.maxEnergy - this.player.energy);
                this.player.energy += effect;
                break;
                
            case 'damage':
                effect = Math.max(1, item.value - this.enemy.defense);
                this.enemy.health = Math.max(0, this.enemy.health - effect);
                break;
                
            default:
                return { error: 'invalid_item', message: 'Este objeto no se puede usar en combate' };
        }
        
        // Eliminar objeto del inventario
        this.player.inventory.splice(itemIndex, 1);
        
        const result = {
            action: 'item',
            actor: 'player',
            itemName: item.name,
            itemType: item.type,
            effect,
            enemyDefeated: this.enemy.health <= 0
        };
        
        // Verificar si el enemigo ha sido derrotado
        if (this.enemy.health <= 0) {
            this.isActive = false;
            result.rewards = this.calculateRewards();
        } else {
            // Siguiente turno
            this.turn = 'enemy';
        }
        
        return result;
    }
    
    /**
     * El jugador se defiende
     */
    playerDefend() {
        if (this.turn !== 'player' || !this.isActive) return null;
        
        // Aumentar defensa temporalmente
        const defenseBonus = Math.floor(this.player.defense * 0.5);
        this.player.defense += defenseBonus;
        this.player.defending = true;
        
        const result = {
            action: 'defend',
            actor: 'player',
            defenseBonus
        };
        
        // Siguiente turno
        this.turn = 'enemy';
        
        return result;
    }
    
    /**
     * El enemigo realiza su turno
     */
    enemyTurn() {
        if (this.turn !== 'enemy' || !this.isActive) return null;
        
        // Verificar si el enemigo está aturdido
        if (this.enemy.isStunned) {
            this.enemy.isStunned = false;
            
            // Siguiente turno
            this.turn = 'player';
            
            return {
                action: 'stunned',
                actor: 'enemy'
            };
        }
        
        // Elegir acción del enemigo
        const action = this.selectEnemyAction();
        let result = null;
        
        switch (action) {
            case 'basic_attack':
                result = this.enemyBasicAttack();
                break;
                
            case 'energy_drain':
                result = this.enemyEnergyDrain();
                break;
                
            case 'double_shot':
                result = this.enemyDoubleShot();
                break;
                
            case 'defensive_stance':
                result = this.enemyDefensiveStance();
                break;
        }
        
        // Comprobar si el jugador está defendiéndose
        if (this.player.defending) {
            const defenseBonus = Math.floor(this.player.defense * 0.5 / 1.5);
            this.player.defense -= defenseBonus;
            this.player.defending = false;
        }
        
        // Verificar si el jugador ha sido derrotado
        if (this.player.health <= 0) {
            this.isActive = false;
            result.playerDefeated = true;
        } else {
            // Siguiente turno
            this.turn = 'player';
        }
        
        return result;
    }
    
    /**
     * Enemigo realiza ataque básico
     */
    enemyBasicAttack() {
        const damage = Math.max(1, this.enemy.attack - this.player.defense);
        this.player.health = Math.max(0, this.player.health - damage);
        
        return {
            action: 'attack',
            actor: 'enemy',
            target: 'player',
            damage
        };
    }
    
    /**
     * Enemigo realiza drenaje de energía
     */
    enemyEnergyDrain() {
        const damage = Math.max(1, Math.floor(this.enemy.attack * 0.7) - this.player.defense);
        const energyD