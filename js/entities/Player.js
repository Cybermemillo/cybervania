export class Player {
    constructor(data = {}) {
        // Datos básicos
        this.name = data.name || 'Hacker';
        this.specialization = data.specialization || 'neutral';
        
        // Atributos principales
        this.health = data.health || 70;
        this.maxHealth = data.maxHealth || 70;
        this.defense = data.defense || 0;
        this.actionPoints = data.actionPoints || 3;
        this.maxActionPoints = data.maxActionPoints || 3;
        
        // Recursos
        this.credits = data.credits || 100;
        
        // Habilidades
        this.offensiveSkill = data.offensiveSkill || 1;
        this.defensiveSkill = data.defensiveSkill || 1;
        
        // Inventario
        this.artifacts = data.artifacts || [];
        this.potions = data.potions || [];
        
        // Estados de combate
        this.status = {
            vulnerable: 0,
            weak: 0,
            poisoned: 0,
            burning: 0,
            strength: 0,
            dexterity: 0
        };
        
        // Estadísticas
        this.stats = {
            enemiesDefeated: 0,
            damageDealt: 0,
            damageReceived: 0,
            cardsPlayed: 0,
            creditsCollected: 0,
            elitesKilled: 0,
            bossesKilled: 0,
            turnsPlayed: 0,
            maxCombo: 0,
            losses: 0,
            floors: 1
        };
        
        // Aplicar bonificaciones según especialización
        this.applySpecializationBonuses();
    }
    
    applySpecializationBonuses() {
        switch (this.specialization) {
            case 'red': // Ataque
                this.offensiveSkill += 1;
                break;
                
            case 'blue': // Defensa
                this.defensiveSkill += 1;
                this.maxHealth += 5;
                this.health += 5;
                break;
                
            case 'purple': // Equilibrado
                this.maxActionPoints += 1;
                this.actionPoints += 1;
                break;
        }
    }
    
    takeDamage(amount) {
        // Aplicar vulnerabilidad si corresponde
        if (this.status.vulnerable > 0) {
            amount = Math.floor(amount * 1.5);
        }
        
        // Reducir daño por defensa
        let actualDamage = amount;
        if (this.defense > 0) {
            if (amount <= this.defense) {
                this.defense -= amount;
                actualDamage = 0;
            } else {
                actualDamage = amount - this.defense;
                this.defense = 0;
            }
        }
        
        // Aplicar daño y registrar estadísticas
        this.health = Math.max(0, this.health - actualDamage);
        this.stats.damageReceived += actualDamage;
        
        return {
            damageTaken: actualDamage,
            remainingDefense: this.defense,
            remainingHealth: this.health
        };
    }
    
    heal(amount) {
        // No permitir curar más allá de la salud máxima
        const actualHeal = Math.min(amount, this.maxHealth - this.health);
        this.health += actualHeal;
        
        return actualHeal;
    }
    
    gainDefense(amount) {
        // Aplicar bonificaciones de destreza
        if (this.status.dexterity > 0) {
            amount += this.status.dexterity;
        }
        
        // Aplicar efectos de artefactos
        amount = this.applyArtifactEffects('defense_gain', amount);
        
        this.defense += amount;
        return amount;
    }
    
    spendActionPoints(amount) {
        // No permitir gastar más de los puntos disponibles
        if (amount > this.actionPoints) {
            return false;
        }
        
        this.actionPoints -= amount;
        return true;
    }
    
    gainActionPoints(amount) {
        this.actionPoints = Math.min(this.maxActionPoints, this.actionPoints + amount);
        return this.actionPoints;
    }
    
    resetActionPoints() {
        this.actionPoints = this.maxActionPoints;
        return this.actionPoints;
    }
    
    addArtifact(artifact) {
        // Aplicar efectos inmediatos si los hay
        if (artifact.immediateEffect) {
            this.applyArtifactImmediateEffect(artifact);
        }
        
        // Añadir al inventario
        this.artifacts.push(artifact);
    }
    
    hasArtifact(artifactId) {
        return this.artifacts.some(artifact => artifact.id === artifactId);
    }
    
    removeArtifact(artifactId) {
        const index = this.artifacts.findIndex(a => a.id === artifactId);
        if (index !== -1) {
            const artifact = this.artifacts[index];
            this.artifacts.splice(index, 1);
            return artifact;
        }
        return null;
    }
    
    applyArtifactImmediateEffect(artifact) {
        switch (artifact.id) {
            case 'usb_booster':
                this.maxActionPoints += 1;
                this.actionPoints += 1;
                break;
                
            case 'medical_kit':
                this.heal(Math.floor(this.maxHealth * 0.3));
                break;
                
            case 'skill_chip':
                this.offensiveSkill += 1;
                this.defensiveSkill += 1;
                break;
                
            case 'upgrade_module':
                this.maxHealth += 10;
                this.health += 10;
                break;
        }
    }
    
    applyArtifactEffects(triggerType, value) {
        let modifiedValue = value;
        
        for (const artifact of this.artifacts) {
            switch (triggerType) {
                case 'defense_gain':
                    if (artifact.id === 'encryption_key') {
                        modifiedValue += artifact.value;
                    }
                    break;
                    
                case 'damage_dealt':
                    if (artifact.id === 'rootkit_module' && this.isFirstCardOfCombat) {
                        modifiedValue += artifact.value;
                        this.isFirstCardOfCombat = false;
                    }
                    break;
                    
                // Más casos para otros tipos de efectos
                
                case 'turn_start':
                    if (artifact.id === 'vpn_shield') {
                        this.gainDefense(artifact.value);
                    }
                    break;
            }
        }
        
        return modifiedValue;
    }
    
    processStatusEffects() {
        // Procesar efectos de estado al inicio del turno
        let damageFromStatus = 0;
        
        // Veneno
        if (this.status.poisoned > 0) {
            const poisonDamage = Math.ceil(this.status.poisoned / 2);
            this.health -= poisonDamage;
            damageFromStatus += poisonDamage;
            this.status.poisoned--;
        }
        
        // Quemadura
        if (this.status.burning > 0) {
            const burnDamage = 3;
            this.health -= burnDamage;
            damageFromStatus += burnDamage;
            this.status.burning--;
        }
        
        // Disminuir duración de otros estados
        for (const status in this.status) {
            if (status !== 'poisoned' && status !== 'burning' && 
                status !== 'strength' && status !== 'dexterity') {
                if (this.status[status] > 0) {
                    this.status[status]--;
                }
            }
        }
        
        return damageFromStatus;
    }
    
    startCombat() {
        // Reiniciar estados al inicio del combate
        this.defense = 0;
        this.actionPoints = this.maxActionPoints;
        this.isFirstCardOfCombat = true;
        
        // Reiniciar estados temporales
        this.status = {
            vulnerable: 0,
            weak: 0,
            poisoned: 0,
            burning: 0,
            strength: 0,
            dexterity: 0
        };
        
        // Aplicar efectos de artefactos al inicio del combate
        for (const artifact of this.artifacts) {
            if (artifact.effect === 'start_vulnerable' && artifact.id === 'rootkit_module') {
                // Este se maneja desde el lado de la escena de combate
            }
        }
    }
    
    endCombat() {
        // Limpiar estados al final del combate
        this.defense = 0;
        this.status = {
            vulnerable: 0,
            weak: 0,
            poisoned: 0,
            burning: 0,
            strength: 0,
            dexterity: 0
        };
    }
    
    hasSpecialRestOption() {
        // Verificar si tiene artefactos que otorguen opciones especiales de descanso
        return this.artifacts.some(artifact => artifact.id === 'neural_implant');
    }
    
    getSpecialRestOption() {
        // Devolver opción especial de descanso según artefactos
        if (this.hasArtifact('neural_implant')) {
            return {
                id: 'neural_upgrade',
                name: 'Mejora Neural',
                description: 'Duplica una carta de tu mazo.',
                effect: 'duplicate_card'
            };
        }
        
        return null;
    }
    
    levelUp() {
        // Aumentar atributos al subir nivel
        this.maxHealth += 5;
        this.health += 5;
        
        // Aumentar habilidades según especialización
        if (this.specialization === 'red') {
            this.offensiveSkill += 1;
        } else if (this.specialization === 'blue') {
            this.defensiveSkill += 1;
        } else {
            // Para purple o cualquier otra
            if (Math.random() < 0.5) {
                this.offensiveSkill += 1;
            } else {
                this.defensiveSkill += 1;
            }
        }
        
        this.stats.floors++;
        
        return {
            newMaxHealth: this.maxHealth,
            offensiveSkill: this.offensiveSkill,
            defensiveSkill: this.defensiveSkill
        };
    }
    
    serialize() {
        // Convertir a formato para guardado
        return {
            name: this.name,
            specialization: this.specialization,
            health: this.health,
            maxHealth: this.maxHealth,
            defense: this.defense,
            actionPoints: this.actionPoints,
            maxActionPoints: this.maxActionPoints,
            credits: this.credits,
            offensiveSkill: this.offensiveSkill,
            defensiveSkill: this.defensiveSkill,
            artifacts: this.artifacts,
            potions: this.potions,
            stats: this.stats
        };
    }
    
    static deserialize(data) {
        // Crear jugador desde datos guardados
        return new Player(data);
    }
}
