import { EVENTS } from '../data/events.js';

export class EventScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EventScene' });
    }

    init(data) {
        this.eventId = data.eventId || 'abandoned_terminal';
        this.nextScene = data.nextScene || 'MapScene';
        this.player = window.game.player;
        this.returnToMap = data.returnToMap !== false;
    }

    create() {
        // Cargar el fondo
        this.add.image(0, 0, 'bg-event').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Obtener datos del evento
        this.eventData = EVENTS[this.eventId];
        if (!this.eventData) {
            console.error(`Evento no encontrado: ${this.eventId}`);
            this.returnToScene();
            return;
        }
        
        // Reproducir música de evento
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playMusic('event');
        }
        
        // Crear panel del evento
        this.createEventPanel();
    }
    
    createEventPanel() {
        // Contenedor principal
        this.eventContainer = this.add.container(this.cameras.main.width / 2, 150);
        
        // Imagen del evento
        const eventImage = this.add.image(0, 0, this.eventData.image);
        eventImage.setScale(0.8);
        
        // Título del evento
        const titleText = this.add.text(0, -170, this.eventData.name.toUpperCase(), {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        
        // Descripción del evento
        const descriptionText = this.add.text(0, 150, this.eventData.description, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        
        this.eventContainer.add([eventImage, titleText, descriptionText]);
        
        // Crear opciones
        this.createEventOptions();
    }
    
    createEventOptions() {
        // Contenedor de opciones
        this.optionsContainer = this.add.container(this.cameras.main.width / 2, 400);
        
        // Si no hay opciones, mostrar solo botón de continuar
        if (!this.eventData.options || this.eventData.options.length === 0) {
            const continueButton = this.createButton(0, 50, 'Continuar', () => {
                this.returnToScene();
            });
            
            this.optionsContainer.add(continueButton);
            return;
        }
        
        // Mostrar opciones disponibles
        const options = this.eventData.options;
        const spacing = 70;
        const totalHeight = (options.length - 1) * spacing;
        const startY = -totalHeight / 2;
        
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const y = startY + i * spacing;
            
            // Verificar si la opción tiene requisitos
            let canChoose = true;
            let requirementText = '';
            
            if (option.requirement) {
                if (option.requirement.type === 'credits') {
                    canChoose = this.player.credits >= option.requirement.value;
                    requirementText = `(Requiere ${option.requirement.value} créditos)`;
                } else if (option.requirement.type === 'health') {
                    canChoose = this.player.health >= option.requirement.value;
                    requirementText = `(Requiere ${option.requirement.value} salud)`;
                } else if (option.requirement.type === 'artifact') {
                    canChoose = this.player.hasArtifact(option.requirement.id);
                    requirementText = `(Requiere ${option.requirement.name})`;
                } else if (option.requirement.type === 'skill') {
                    const skill = option.requirement.skill === 'offensive' ? 
                        this.player.offensiveSkill : 
                        this.player.defensiveSkill;
                    canChoose = skill >= option.requirement.value;
                    requirementText = `(Requiere ${option.requirement.skill} ${option.requirement.value})`;
                }
            }
            
            // Crear botón de opción
            const optionButton = this.createOptionButton(
                option.name, 
                option.description,
                canChoose,
                requirementText,
                y,
                () => {
                    this.selectOption(option);
                }
            );
            
            this.optionsContainer.add(optionButton);
        }
    }
    
    createOptionButton(name, description, enabled, requirementText, y, callback) {
        const button = this.add.container(0, y);
        
        // Fondo del botón
        const buttonBg = this.add.rectangle(0, 0, 600, 50, enabled ? 0x333355 : 0x333333)
            .setStrokeStyle(2, enabled ? 0x4444ff : 0x555555);
        
        // Texto principal
        const buttonText = this.add.text(-290, 0, name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: enabled ? '#ffffff' : '#aaaaaa'
        }).setOrigin(0, 0.5);
        
        // Descripción (si hay)
        let descText = null;
        if (description) {
            descText = this.add.text(0, 25, description, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: enabled ? '#cccccc' : '#888888',
                align: 'center',
                wordWrap: { width: 580 }
            }).setOrigin(0.5, 0);
        }
        
        // Texto de requisito (si hay)
        let reqText = null;
        if (requirementText) {
            reqText = this.add.text(290, 0, requirementText, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: enabled ? '#aaaaff' : '#aa5555',
                align: 'right'
            }).setOrigin(1, 0.5);
        }
        
        // Añadir componentes
        const components = [buttonBg, buttonText];
        if (descText) components.push(descText);
        if (reqText) components.push(reqText);
        
        button.add(components);
        
        // Hacer el botón interactivo si está habilitado
        if (enabled) {
            button.setInteractive(new Phaser.Geom.Rectangle(-300, -25, 600, 50), Phaser.Geom.Rectangle.Contains);
            
            button.on('pointerover', () => {
                buttonBg.setFillStyle(0x444466);
            });
            
            button.on('pointerout', () => {
                buttonBg.setFillStyle(0x333355);
            });
            
            button.on('pointerdown', () => {
                buttonBg.setFillStyle(0x222244);
            });
            
            button.on('pointerup', () => {
                buttonBg.setFillStyle(0x444466);
                
                // Reproducir sonido
                if (window.dataManager && window.dataManager.audioManager) {
                    window.dataManager.audioManager.playSound('click');
                }
                
                callback();
            });
        }
        
        return button;
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const buttonBg = this.add.rectangle(0, 0, 200, 50, 0x333355)
            .setStrokeStyle(2, 0x4444ff);
        
        const buttonText = this.add.text(0, 0, text, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.add([buttonBg, buttonText]);
        
        // Interacción
        button.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
        
        button.on('pointerover', () => {
            buttonBg.setFillStyle(0x444466);
        });
        
        button.on('pointerout', () => {
            buttonBg.setFillStyle(0x333355);
        });
        
        button.on('pointerdown', () => {
            buttonBg.setFillStyle(0x222244);
        });
        
        button.on('pointerup', () => {
            buttonBg.setFillStyle(0x444466);
            
            // Reproducir sonido
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('click');
            }
            
            callback();
        });
        
        return button;
    }
    
    selectOption(option) {
        // Eliminar opciones
        this.optionsContainer.destroy();
        
        // Determinar resultado
        const outcome = this.determineOutcome(option.outcomes);
        
        // Mostrar resultado
        this.showOutcome(outcome);
    }
    
    determineOutcome(outcomes) {
        // Si solo hay un resultado posible, devolverlo directamente
        if (outcomes.length === 1) {
            return outcomes[0];
        }
        
        // Verificar resultados con skillCheck
        for (const outcome of outcomes) {
            // Si tiene skillCheck, verificar
            if (outcome.skillCheck) {
                const playerSkill = outcome.skillCheck === 'hacking' ? 
                    this.player.offensiveSkill : 
                    this.player.defensiveSkill;
                
                // Si pasa el skillCheck, este es el resultado
                if (playerSkill >= outcome.threshold) {
                    return outcome;
                }
            }
        }
        
        // Ningún skillCheck pasado, usar probabilidades
        const random = Math.random();
        let probabilitySum = 0;
        
        for (const outcome of outcomes) {
            probabilitySum += outcome.chance;
            if (random < probabilitySum) {
                return outcome;
            }
        }
        
        // Por si acaso, devolver el último
        return outcomes[outcomes.length - 1];
    }
    
    showOutcome(outcome) {
        // Crear contenedor para el resultado
        this.outcomeContainer = this.add.container(this.cameras.main.width / 2, 400);
        
        // Fondo del resultado
        const outcomeBg = this.add.rectangle(0, 0, 700, 150, 0x222244, 0.8)
            .setStrokeStyle(2, 0x4444ff);
        
        // Texto del resultado
        const resultText = this.add.text(0, -50, outcome.result, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 650 }
        }).setOrigin(0.5);
        
        this.outcomeContainer.add([outcomeBg, resultText]);
        
        // Botón para continuar
        const continueButton = this.createButton(0, 60, 'Continuar', () => {
            // Aplicar efectos del resultado
            this.applyOutcomeEffects(outcome.effects);
        });
        
        this.outcomeContainer.add(continueButton);
    }
    
    applyOutcomeEffects(effects) {
        // Si no hay efectos, volver al mapa directamente
        if (!effects || effects.length === 0) {
            this.returnToScene();
            return;
        }
        
        // Aplicar cada efecto en secuencia
        let effectIndex = 0;
        
        const processNextEffect = () => {
            if (effectIndex >= effects.length) {
                // Todos los efectos aplicados
                this.returnToScene();
                return;
            }
            
            const effect = effects[effectIndex++];
            this.applyEffect(effect, () => {
                // Pausa breve entre efectos
                this.time.delayedCall(500, () => {
                    processNextEffect();
                });
            });
        };
        
        processNextEffect();
    }
    
    applyEffect(effect, callback) {
        switch (effect.type) {
            case 'credits':
                this.player.credits += effect.value;
                this.showEffectAnimation(`+${effect.value} Créditos`, '#ffff00', callback);
                break;
                
            case 'damage':
                this.player.health = Math.max(1, this.player.health - effect.value);
                this.showEffectAnimation(`-${effect.value} Salud`, '#ff0000', callback);
                break;
                
            case 'heal':
                const healAmount = Math.min(effect.value, this.player.maxHealth - this.player.health);
                this.player.health += healAmount;
                this.showEffectAnimation(`+${healAmount} Salud`, '#00ff00', callback);
                break;
                
            case 'max_health':
                this.player.maxHealth += effect.value;
                this.showEffectAnimation(`+${effect.value} Salud Máxima`, '#00ffaa', callback);
                break;
                
            case 'card_choice':
                this.showCardChoices(effect, callback);
                return;
                
            case 'card_specific':
                // Añadir una carta específica al mazo
                const specificCard = window.game.deckManager.getCardById(effect.cardId);
                if (specificCard) {
                    window.game.deckManager.addCard(specificCard);
                    this.showEffectAnimation(`Nueva carta: ${specificCard.name}`, '#aaaaff', callback);
                } else {
                    callback();
                }
                break;
                
            case 'remove_card':
                this.showCardRemoval(effect, callback);
                return;
                
            case 'upgrade_random_card':
                const upgradedCount = window.game.deckManager.upgradeRandomCards(effect.count || 1);
                this.showEffectAnimation(`${upgradedCount} carta(s) mejorada(s)`, '#aaaaff', callback);
                break;
                
            case 'upgrade_all_cards':
                const allUpgradedCount = window.game.deckManager.upgradeAllCards();
                this.showEffectAnimation(`${allUpgradedCount} carta(s) mejorada(s)`, '#aaaaff', callback);
                break;
                
            case 'transform_cards':
                this.showTransformCards(effect, callback);
                return;
                
            case 'add_artifact':
                const artifact = window.game.getArtifactById(effect.artifactId);
                if (artifact) {
                    this.player.addArtifact(artifact);
                    this.showEffectAnimation(`Nuevo artefacto: ${artifact.name}`, '#ffaaff', callback);
                } else {
                    callback();
                }
                break;
                
            case 'skill_increase':
                if (effect.skill === 'offensive' || effect.skill === 'both') {
                    this.player.offensiveSkill += effect.value;
                }
                if (effect.skill === 'defensive' || effect.skill === 'both') {
                    this.player.defensiveSkill += effect.value;
                }
                this.showEffectAnimation(`+${effect.value} Habilidad`, '#aaffaa', callback);
                break;
                
            case 'reveal_map':
                window.game.revealMap();
                this.showEffectAnimation('Mapa revelado', '#ffffff', callback);
                break;
                
            case 'combat':
                this.showEffectAnimation('¡Emboscada!', '#ff5555', () => {
                    this.scene.start('CombatScene', {
                        enemies: [window.game.getEnemyById(effect.enemyId)],
                        nextScene: this.nextScene
                    });
                });
                break;
                
            default:
                console.warn(`Tipo de efecto desconocido: ${effect.type}`);
                callback();
        }
    }
    
    showEffectAnimation(text, color, callback) {
        const x = this.cameras.main.width / 2;
        const y = 300;
        
        const effectText = this.add.text(x, y, text, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: color || '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        // Animación
        this.tweens.add({
            targets: effectText,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                effectText.destroy();
                if (callback) callback();
            }
        });
        
        // Sonido apropiado según el tipo de efecto
        if (window.dataManager && window.dataManager.audioManager) {
            if (text.includes('Salud') && text.includes('+')) {
                window.dataManager.audioManager.playSound('heal');
            } else if (text.includes('Créditos')) {
                window.dataManager.audioManager.playSound('item-pickup');
            } else if (text.includes('carta')) {
                window.dataManager.audioManager.playSound('card-draw');
            } else if (text.includes('Emboscada')) {
                window.dataManager.audioManager.playSound('enemy-attack');
            } else {
                window.dataManager.audioManager.playSound('success');
            }
        }
    }
    
    showCardChoices(effect, callback) {
        // Obtener cartas para elegir
        const count = effect.count || 1;
        const rarity = effect.rarity || 'common';
        const team = effect.team || 'random';
        
        const cardChoices = window.game.deckManager.getRandomCards(count, rarity, team);
        
        if (cardChoices.length === 0) {
            callback();
            return;
        }
        
        // Crear panel de selección de cartas
        const choicePanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo
        const panelBg = this.add.rectangle(0, 0, 700, 450, 0x222244, 0.95)
            .setStrokeStyle(2, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -180, 'ELIGE UNA CARTA', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#4444ff',
            align: 'center'
        }).setOrigin(0.5);
        
        choicePanel.add([panelBg, titleText]);
        
        // Mostrar cartas para elegir
        const cardSpacing = 220;
        const startX = -((cardChoices.length - 1) * cardSpacing) / 2;
        
        for (let i = 0; i < cardChoices.length; i++) {
            const card = cardChoices[i];
            const x = startX + i * cardSpacing;
            
            // Crear carta visual
            const cardContainer = this.createCardVisual(card, x, 0);
            cardContainer.card = card;
            
            // Hacer interactiva
            cardContainer.setInteractive(new Phaser.Geom.Rectangle(-100, -150, 200, 300), Phaser.Geom.Rectangle.Contains);
            
            // Eventos
            cardContainer.on('pointerover', () => {
                this.tweens.add({
                    targets: cardContainer,
                    y: -30,
                    scale: 1.1,
                    duration: 200
                });
            });
            
            cardContainer.on('pointerout', () => {
                this.tweens.add({
                    targets: cardContainer,
                    y: 0,
                    scale: 1,
                    duration: 200
                });
            });
            
            cardContainer.on('pointerdown', () => {
                // Añadir la carta seleccionada al mazo
                window.game.deckManager.addCard(card);
                
                // Destruir panel
                choicePanel.destroy();
                
                // Mostrar mensaje
                this.showEffectAnimation(`Carta añadida: ${card.name}`, '#aaaaff', callback);
            });
            
            choicePanel.add(cardContainer);
        }
        
        // Botón para omitir
        const skipButton = this.createButton(0, 180, 'OMITIR', () => {
            choicePanel.destroy();
            callback();
        });
        
        choicePanel.add(skipButton);
    }
    
    createCardVisual(card, x, y) {
        const cardContainer = this.add.container(x, y);
        
        // Fondo de la carta
        const cardBg = this.add.image(0, 0, 'card-frame');
        
        // Color según el equipo
        let cardTint = 0xffffff;
        if (card.team === 'red') {
            cardTint = 0xffcccc;
        } else if (card.team === 'blue') {
            cardTint = 0xccccff;
        } else if (card.team === 'purple') {
            cardTint = 0xeeccff;
        }
        cardBg.setTint(cardTint);
        
        // Imagen de la carta
        const cardImage = this.add.image(0, -30, card.imageKey || 'card-default');
        cardImage.setScale(0.6);
        
        // Nombre de la carta
        const cardName = this.add.text(0, -100, card.name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '18px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Coste de energía
        const costText = this.add.text(70, -100, card.cost.toString(), {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Tipo
        let typeText = 'NOR';
        if (card.type === 'attack') typeText = 'ATQ';
        else if (card.type === 'defense') typeText = 'DEF';
        else if (card.type === 'skill') typeText = 'HAB';
        else if (card.type === 'power') typeText = 'POD';
        
        const cardType = this.add.text(-70, -100, typeText, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#000000'
        }).setOrigin(0.5);
        
        // Descripción
        const cardDesc = this.add.text(0, 60, card.description, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);
        
        cardContainer.add([cardBg, cardImage, cardName, costText, cardType, cardDesc]);
        
        return cardContainer;
    }
    
    showCardRemoval(effect, callback) {
        // Obtener cartas que se pueden eliminar
        const cards = window.game.deckManager.getAllCards();
        
        if (cards.length === 0) {
            callback();
            return;
        }
        
        // Crear panel para eliminar carta
        const removalPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo
        const panelBg = this.add.rectangle(0, 0, 800, 500, 0x442222, 0.95)
            .setStrokeStyle(2, 0xff4444);
        
        // Título
        const titleText = this.add.text(0, -220, 'ELIMINAR UNA CARTA', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#ff4444',
            align: 'center'
        }).setOrigin(0.5);
        
        removalPanel.add([panelBg, titleText]);
        
        // Mostrar todas las cartas
        const cardsPerRow = 5;
        const cardSpacing = { x: 160, y: 200 };
        const startPos = { x: -300, y: -120 };
        
        for (let i = 0; i < cards.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            
            const x = startPos.x + col * cardSpacing.x;
            const y = startPos.y + row * cardSpacing.y;
            
            // Crear miniatura de carta
            const cardContainer = this.createMiniCardVisual(cards[i], x, y);
            cardContainer.card = cards[i];
            
            // Hacer interactiva
            cardContainer.setInteractive(new Phaser.Geom.Rectangle(-70, -100, 140, 200), Phaser.Geom.Rectangle.Contains);
            
            cardContainer.on('pointerover', () => {
                this.tweens.add({
                    targets: cardContainer,
                    y: y - 20,
                    scale: 1.1,
                    duration: 200
                });
            });
            
            cardContainer.on('pointerout', () => {
                this.tweens.add({
                    targets: cardContainer,
                    y: y,
                    scale: 1,
                    duration: 200
                });
            });
            
            cardContainer.on('pointerdown', () => {
                // Eliminar la carta seleccionada
                window.game.deckManager.removeCard(cards[i]);
                
                // Destruir panel
                removalPanel.destroy();
                
                // Mostrar mensaje
                this.showEffectAnimation(`Carta eliminada: ${cards[i].name}`, '#ff5555', callback);
            });
            
            removalPanel.add(cardContainer);
        }
        
        // Botón para cancelar
        const cancelButton = this.createButton(0, 220, 'CANCELAR', () => {
            removalPanel.destroy();
            callback();
        });
        
        removalPanel.add(cancelButton);
    }
    
    createMiniCardVisual(card, x, y) {
        const cardContainer = this.add.container(x, y);
        
        // Fondo de la carta
        const cardBg = this.add.image(0, 0, 'card-frame').setScale(0.7);
        
        // Color según el equipo
        let cardTint = 0xffffff;
        if (card.team === 'red') {
            cardTint = 0xffcccc;
        } else if (card.team === 'blue') {
            cardTint = 0xccccff;
        } else if (card.team === 'purple') {
            cardTint = 0xeeccff;
        }
        cardBg.setTint(cardTint);
        
        // Imagen de la carta
        const cardImage = this.add.image(0, -20, card.imageKey || 'card-default').setScale(0.4);
        
        // Nombre abreviado
        let shortName = card.name;
        if (shortName.length > 12) {
            shortName = shortName.substring(0, 10) + '...';
        }
        
        const cardName = this.add.text(0, -70, shortName, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '14px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Coste
        const costText = this.add.text(50, -70, card.cost.toString(), {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Tipo abreviado
        let typeText = 'N';
        if (card.type === 'attack') typeText = 'A';
        else if (card.type === 'defense') typeText = 'D';
        else if (card.type === 'skill') typeText = 'S';
        else if (card.type === 'power') typeText = 'P';
        
        const cardType = this.add.text(-50, -70, typeText, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#000000'
        }).setOrigin(0.5);
        
        cardContainer.add([cardBg, cardImage, cardName, costText, cardType]);
        
        return cardContainer;
    }
    
    showTransformCards(effect, callback) {
        // Seleccionar cartas para transformar
        const count = effect.count || 1;
        const target = effect.target || 'random';
        
        if (target === 'random') {
            // Transformar cartas aleatorias
            const transformed = window.game.deckManager.transformRandomCards(count, effect.quality);
            this.showEffectAnimation(`${transformed} carta(s) transformada(s)`, '#ff00ff', callback);
        } else {
            // Dejar que el jugador elija
            this.showCardTransformSelection(count, effect.quality, callback);
        }
    }
    
    showCardTransformSelection(count, quality, callback) {
        // Similar a showCardRemoval pero para transformar
        const cards = window.game.deckManager.getAllCards();
        
        if (cards.length === 0) {
            callback();
            return;
        }
        
        // Crear panel para transformar carta
        const transformPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo
        const panelBg = this.add.rectangle(0, 0, 800, 500, 0x442244, 0.95)
            .setStrokeStyle(2, 0xff44ff);
        
        // Título
        const titleText = this.add.text(0, -220, 'TRANSFORMAR CARTAS', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#ff44ff',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitleText = this.add.text(0, -180, `Selecciona ${count} carta(s) para transformar`, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        transformPanel.add([panelBg, titleText, subtitleText]);
        
        // Variables para seguimiento de selección
        const selectedCards = [];
        const selectedVisuals = [];
        
        // Mostrar todas las cartas
        const cardsPerRow = 5;
        const cardSpacing = { x: 160, y: 200 };
        const startPos = { x: -300, y: -120 };
        
        for (let i = 0; i < cards.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            
            const x = startPos.x + col * cardSpacing.x;
            const y = startPos.y + row * cardSpacing.y;
            
            // Crear miniatura de carta
            const cardContainer = this.createMiniCardVisual(cards[i], x, y);
            cardContainer.card = cards[i];
            cardContainer.originalPosition = { x, y };
            
            // Hacer interactiva
            cardContainer.setInteractive(new Phaser.Geom.Rectangle(-70, -100, 140, 200), Phaser.Geom.Rectangle.Contains);
            
            cardContainer.on('pointerover', () => {
                if (!cardContainer.selected) {
                    this.tweens.add({
                        targets: cardContainer,
                        y: y - 20,
                        scale: 1.1,
                        duration: 200
                    });
                }
            });
            
            cardContainer.on('pointerout', () => {
                if (!cardContainer.selected) {
                    this.tweens.add({
                        targets: cardContainer,
                        y: y,
                        scale: 1,
                        duration: 200
                    });
                }
            });
            
            cardContainer.on('pointerdown', () => {
                if (!cardContainer.selected && selectedCards.length < count) {
                    // Seleccionar carta
                    cardContainer.selected = true;
                    selectedCards.push(cards[i]);
                    selectedVisuals.push(cardContainer);
                    
                    // Visualización de selección
                    cardContainer.setTint(0xff00ff);
                    this.tweens.add({
                        targets: cardContainer,
                        y: y - 30,
                        scale: 1.2,
                        duration: 200
                    });
                    
                    // Si ya seleccionó suficientes, habilitar el botón de transformar
                    if (selectedCards.length === count) {
                        transformButton.setTint(0xffffff);
                        transformButton.setInteractive();
                    }
                } else if (cardContainer.selected) {
                    // Deseleccionar carta
                    cardContainer.selected = false;
                    const index = selectedCards.indexOf(cards[i]);
                    if (index > -1) {
                        selectedCards.splice(index, 1);
                        selectedVisuals.splice(index, 1);
                    }
                    
                    // Quitar visualización de selección
                    cardContainer.clearTint();
                    this.tweens.add({
                        targets: cardContainer,
                        y: y,
                        scale: 1,
                        duration: 200
                    });
                    
                    // Deshabilitar botón de transformar
                    transformButton.setTint(0x888888);
                    transformButton.disableInteractive();
                }
            });
            
            transformPanel.add(cardContainer);
        }
        
        // Botón para transformar (inicialmente deshabilitado)
        const transformButton = this.createButton(100, 220, 'TRANSFORMAR', () => {
            // Transformar cartas seleccionadas
            const newCards = window.game.deckManager.transformSpecificCards(selectedCards, quality);
            
            // Destruir panel
            transformPanel.destroy();
            
            // Mostrar mensaje y nuevas cartas
            this.showTransformationResults(newCards, callback);
        });
        transformButton.setTint(0x888888);
        transformButton.disableInteractive();
        
        // Botón para cancelar
        const cancelButton = this.createButton(-100, 220, 'CANCELAR', () => {
            transformPanel.destroy();
            callback();
        });
        
        transformPanel.add([transformButton, cancelButton]);
    }
    
    showTransformationResults(newCards, callback) {
        // Mostrar las cartas nuevas resultantes de la transformación
        const resultsPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo
        const panelBg = this.add.rectangle(0, 0, 700, 450, 0x442244, 0.95)
            .setStrokeStyle(2, 0xff44ff);
        
        // Título
        const titleText = this.add.text(0, -180, 'CARTAS TRANSFORMADAS', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#ff44ff',
            align: 'center'
        }).setOrigin(0.5);
        
        resultsPanel.add([panelBg, titleText]);
        
        // Mostrar cartas nuevas
        const cardSpacing = 220;
        const startX = -((newCards.length - 1) * cardSpacing) / 2;
        
        for (let i = 0; i < newCards.length; i++) {
            const x = startX + i * cardSpacing;
            
            // Crear carta visual
            const cardContainer = this.createCardVisual(newCards[i], x, 0);
            resultsPanel.add(cardContainer);
            
            // Animación de entrada
            cardContainer.y = 200;
            cardContainer.alpha = 0;
            
            this.tweens.add({
                targets: cardContainer,
                y: 0,
                alpha: 1,
                duration: 500,
                ease: 'Back',
                delay: i * 200
            });
        }
        
        // Botón para continuar
        const continueButton = this.createButton(0, 180, 'CONTINUAR', () => {
            resultsPanel.destroy();
            callback();
        });
        
        resultsPanel.add(continueButton);
    }
    
    returnToScene() {
        if (this.returnToMap) {
            this.scene.start(this.nextScene);
        }
    }
}