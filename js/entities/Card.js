export class Card {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.cost = config.cost || 1;
        this.type = config.type || 'attack'; // attack, defense, skill, power
        this.rarity = config.rarity || 'common'; // common, uncommon, rare, legendary
        this.team = config.team || 'neutral'; // red, blue, purple, neutral
        this.effects = config.effects || [];
        this.modifiers = config.modifiers || [];
        this.upgraded = config.upgraded || false;
        this.imageKey = config.imageKey || 'card-default';
        this.sound = config.sound || 'card-play';
    }

    play(source, target) {
        const result = {
            success: true,
            effects: []
        };

        // Aplicar cada efecto de la carta
        for (const effect of this.effects) {
            const appliedEffect = this.applyEffect(effect, source, target);
            result.effects.push(appliedEffect);
        }

        // Registrar uso de la carta para mecánicas que dependen de ello
        source.recordCardPlayed(this);

        return result;
    }

    applyEffect(effect, source, target) {
        const result = {
            type: effect.type,
            value: effect.value,
            success: true,
            message: ''
        };

        // Aplicar modificadores al valor del efecto
        let modifiedValue = effect.value;
        for (const modifier of this.modifiers) {
            if (modifier.affects === effect.type) {
                modifiedValue = modifier.modify(modifiedValue, source, target);
            }
        }
        result.value = modifiedValue;

        // Aplicar el efecto según su tipo
        switch (effect.type) {
            case 'damage':
                result.actualDamage = target.takeDamage(modifiedValue);
                result.message = `Causó ${result.actualDamage} de daño.`;
                break;
                
            case 'defense':
                source.addDefense(modifiedValue);
                result.message = `Añadió ${modifiedValue} de defensa.`;
                break;
                
            case 'heal':
                const healAmount = source.heal(modifiedValue);
                result.message = `Recuperó ${healAmount} de salud.`;
                break;
                
            case 'draw':
                source.drawCards(modifiedValue);
                result.message = `Robó ${modifiedValue} carta(s).`;
                break;
                
            case 'energy':
                source.addActionPoints(modifiedValue);
                result.message = `Ganó ${modifiedValue} punto(s) de acción.`;
                break;
                
            case 'debuff':
                target.addStatusEffect(effect.effect, effect.duration);
                result.message = `Aplicó ${effect.effect} por ${effect.duration} turno(s).`;
                break;
                
            case 'buff':
                source.addStatusEffect(effect.effect, effect.duration);
                result.message = `Ganó ${effect.effect} por ${effect.duration} turno(s).`;
                break;
                
            case 'special':
                result.message = this.handleSpecialEffect(effect, source, target);
                break;
                
            default:
                result.success = false;
                result.message = 'Tipo de efecto desconocido.';
        }

        return result;
    }

    handleSpecialEffect(effect, source, target) {
        switch (effect.id) {
            case 'backdoor':
                // Roba una carta de habilidad aleatoria del enemigo
                if (target.deck && target.deck.cards.length > 0) {
                    const enemyCards = target.deck.cards.filter(c => c.type === 'skill');
                    if (enemyCards.length > 0) {
                        const stolenCard = enemyCards[Math.floor(Math.random() * enemyCards.length)];
                        source.addTemporaryCard(stolenCard);
                        return `¡Robó ${stolenCard.name} del enemigo!`;
                    }
                }
                return 'Intentó hackear sin éxito.';
                
            case 'brute_force':
                // Ataque múltiple con baja precisión
                let hits = 0;
                const maxHits = effect.maxHits || 5;
                const hitChance = effect.hitChance || 0.6;
                const damage = effect.damage || 3;
                
                for (let i = 0; i < maxHits; i++) {
                    if (Math.random() <= hitChance) {
                        target.takeDamage(damage);
                        hits++;
                    }
                }
                return `Golpeó ${hits} de ${maxHits} veces por un total de ${hits * damage} de daño.`;
                
            case 'vulnerability_scan':
                // Encuentra debilidades en el enemigo
                target.addStatusEffect('vulnerable', 2);
                return 'Escaneó vulnerabilidades en el objetivo.';
                
            // Más efectos especiales aquí...
            
            default:
                return 'Efecto especial desconocido.';
        }
    }

    upgrade() {
        if (this.upgraded) return false;
        
        this.upgraded = true;
        this.name = this.name + '+';
        
        // Mejorar efectos según tipo de carta
        for (const effect of this.effects) {
            switch (effect.type) {
                case 'damage':
                    effect.value = Math.floor(effect.value * 1.5);
                    break;
                case 'defense':
                    effect.value = Math.floor(effect.value * 1.5);
                    break;
                case 'heal':
                    effect.value = Math.floor(effect.value * 1.3);
                    break;
                case 'draw':
                    effect.value += 1;
                    break;
                case 'debuff':
                case 'buff':
                    effect.duration += 1;
                    break;
                // Otros efectos según sea necesario
            }
        }
        
        // Algunas cartas pueden tener reducción de coste al mejorarlas
        if (this.cost > 1 && Math.random() > 0.7) {
            this.cost -= 1;
        }
        
        return true;
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            cost: this.cost,
            type: this.type,
            rarity: this.rarity,
            team: this.team,
            upgraded: this.upgraded,
            effects: this.effects,
            modifiers: this.modifiers
        };
    }

    static deserialize(data) {
        return new Card(data);
    }
}
