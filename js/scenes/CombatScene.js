export class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
    }

    init(data) {
        this.enemies = data.enemies || [];
        this.rewards = data.rewards || { credits: 10 };
        this.nextScene = data.nextScene || 'MapScene';
        this.encounterType = data.encounterType || 'normal'; // normal, elite, boss
        this.encounterData = data.encounterData || {};
    }

    create() {
        // Configurar el fondo
        this.add.image(0, 0, 'bg-combat').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Referencias al gameData y player
        this.gameData = window.game;
        this.player = this.gameData.player;
        this.deckManager = this.gameData.deckManager;

        // Inicializar variables de combate
        this.currentTurn = 0;
        this.isPlayerTurn = true;
        this.selectedCardIndex = -1;
        this.targetedEnemyIndex = 0;
        this.cardsPlayedThisTurn = 0;
        this.attacksPlayedThisTurn = 0;
        this.skillsPlayedThisTurn = 0;
        this.damageDealtThisTurn = 0;
        this.nextTurnEffects = [];

        // Crear enemigos
        this.combatEnemies = [];
        this.createEnemies();

        // Configurar interfaz
        this.createUI();

        // Iniciar la primera ronda
        this.startCombat();

        // Música de combate
        if (this.encounterType === 'boss') {
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playMusic('boss');
            }
        } else {
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playMusic('combat');
            }
        }
    }

    createEnemies() {
        // Posicionar enemigos según la cantidad
        const enemyCount = this.enemies.length;
        const spacing = 180;
        const startX = this.cameras.main.width / 2 - ((enemyCount - 1) * spacing) / 2;
        const y = 250;

        for (let i = 0; i < enemyCount; i++) {
            const enemyData = this.enemies[i];
            const x = startX + i * spacing;

            // Crear sprite del enemigo
            const enemySprite = this.add.image(x, y, enemyData.imageKey);
            
            // Ajustar tamaño según tipo de enemigo
            if (enemyData.type === 'elite') {
                enemySprite.setScale(1.2);
                enemySprite.setTint(0xffcc00);
            } else if (enemyData.type === 'boss') {
                enemySprite.setScale(1.5);
                enemySprite.setTint(0xff4444);
            } else {
                enemySprite.setScale(1.0);
            }

            // Hacer interactivo para selección
            enemySprite.setInteractive({ useHandCursor: true });
            enemySprite.on('pointerdown', () => {
                this.selectEnemy(i);
            });

            // Crear objeto de enemigo para el combate
            const enemy = { 
                ...enemyData,
                sprite: enemySprite,
                currentHealth: enemyData.health,
                maxHealth: enemyData.health,
                defense: 0,
                status: {
                    vulnerable: 0,
                    weak: 0,
                    poisoned: 0,
                    burning: 0,
                    frozen: 0,
                    stunned: 0
                },
                nextAction: null
            };

            // Determinar intención inicial
            this.setEnemyIntent(enemy);

            // Añadir interfaz de salud
            this.createEnemyHealthBar(enemy, x, y + 80);

            this.combatEnemies.push(enemy);
        }

        // Marcar el primer enemigo como objetivo por defecto
        if (this.combatEnemies.length > 0) {
            this.selectEnemy(0);
        }
    }

    createUI() {
        // Contenedor de la interfaz de jugador
        this.playerUI = this.add.container(0, 0);

        // Barra de salud del jugador
        const playerHealthBg = this.add.rectangle(150, 650, 200, 30, 0x000000, 0.7).setOrigin(0, 0.5);
        const playerHealthBar = this.add.rectangle(150, 650, 200, 30, 0x00ff00).setOrigin(0, 0.5);
        this.playerHealthBar = playerHealthBar;

        // Texto de salud
        const healthText = this.add.text(250, 650, `${this.player.health}/${this.player.maxHealth}`, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.healthText = healthText;

        // Puntos de acción
        this.actionPointsContainer = this.add.container(150, 600);
        this.updateActionPoints();

        // Nombre del jugador
        const playerName = this.add.text(150, 600, this.player.name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Defensa del jugador
        const defenseIcon = this.add.image(100, 650, 'defense-icon').setScale(0.6);
        const defenseText = this.add.text(100, 650, this.player.defense.toString(), {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#99ccff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.defenseText = defenseText;

        // Área de mano de cartas
        this.handContainer = this.add.container(640, 550);

        // Botones de interfaz
        this.createEndTurnButton();
        this.createDeckViewButton();
        this.createDiscardViewButton();

        // Contador de turno
        this.turnText = this.add.text(640, 50, "Turno 1", {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Añadir todo a la UI
        this.playerUI.add([
            playerHealthBg,
            playerHealthBar,
            healthText,
            playerName,
            defenseIcon,
            defenseText,
            this.turnText
        ]);

        // Actualizar interfaz de salud
        this.updateHealthBar();
    }

    createEndTurnButton() {
        // Botón de fin de turno
        const endTurnButton = this.add.container(1150, 650);
        
        const buttonBg = this.add.rectangle(0, 0, 160, 50, 0x880000).setStrokeStyle(2, 0xff0000);
        const buttonText = this.add.text(0, 0, "Fin del Turno", {
            fontFamily: 'Pirata One, cursive',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        endTurnButton.add([buttonBg, buttonText]);
        endTurnButton.setInteractive(new Phaser.Geom.Rectangle(-80, -25, 160, 50), Phaser.Geom.Rectangle.Contains);
        
        endTurnButton.on('pointerover', () => {
            buttonBg.setFillStyle(0xaa0000);
        });
        
        endTurnButton.on('pointerout', () => {
            buttonBg.setFillStyle(0x880000);
        });
        
        endTurnButton.on('pointerdown', () => {
            buttonBg.setFillStyle(0x660000);
        });
        
        endTurnButton.on('pointerup', () => {
            buttonBg.setFillStyle(0xaa0000);
            this.endPlayerTurn();
        });
        
        this.playerUI.add(endTurnButton);
    }

    createDeckViewButton() {
        // Botón para ver el mazo
        const deckButton = this.add.container(1030, 650);
        
        const buttonBg = this.add.rectangle(0, 0, 100, 50, 0x222266).setStrokeStyle(2, 0x4444ff);
        const buttonText = this.add.text(0, 0, "Mazo", {
            fontFamily: 'Pirata One, cursive',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        deckButton.add([buttonBg, buttonText]);
        deckButton.setInteractive(new Phaser.Geom.Rectangle(-50, -25, 100, 50), Phaser.Geom.Rectangle.Contains);
        
        deckButton.on('pointerover', () => {
            buttonBg.setFillStyle(0x3333aa);
        });
        
        deckButton.on('pointerout', () => {
            buttonBg.setFillStyle(0x222266);
        });
        
        deckButton.on('pointerdown', () => {
            buttonBg.setFillStyle(0x111144);
        });
        
        deckButton.on('pointerup', () => {
            buttonBg.setFillStyle(0x3333aa);
            this.showDeckView();
        });
        
        this.playerUI.add(deckButton);
    }

    createDiscardViewButton() {
        // Botón para ver el descarte
        const discardButton = this.add.container(910, 650);
        
        const buttonBg = this.add.rectangle(0, 0, 100, 50, 0x662222).setStrokeStyle(2, 0xff4444);
        const buttonText = this.add.text(0, 0, "Descarte", {
            fontFamily: 'Pirata One, cursive',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        discardButton.add([buttonBg, buttonText]);
        discardButton.setInteractive(new Phaser.Geom.Rectangle(-50, -25, 100, 50), Phaser.Geom.Rectangle.Contains);
        
        discardButton.on('pointerover', () => {
            buttonBg.setFillStyle(0xaa3333);
        });
        
        discardButton.on('pointerout', () => {
            buttonBg.setFillStyle(0x662222);
        });
        
        discardButton.on('pointerdown', () => {
            buttonBg.setFillStyle(0x441111);
        });
        
        discardButton.on('pointerup', () => {
            buttonBg.setFillStyle(0xaa3333);
            this.showDiscardView();
        });
        
        this.playerUI.add(discardButton);
    }

    createEnemyHealthBar(enemy, x, y) {
        const width = 120;
        const height = 15;
        
        // Background
        const healthBg = this.add.rectangle(x, y, width, height, 0x000000, 0.7).setOrigin(0.5);
        
        // Health bar
        const healthBar = this.add.rectangle(x - width/2, y, width, height, 0xcc0000).setOrigin(0, 0.5);
        
        // Health text
        const healthText = this.add.text(x, y + 20, `${enemy.currentHealth}/${enemy.maxHealth}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Defensa
        const defenseText = this.add.text(x, y - 20, '0', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#99ccff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        defenseText.setVisible(false); // Solo visible cuando tiene defensa
        
        // Intent icon (placeholder)
        const intentIcon = this.add.text(x - 50, y - 20, '?', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#880000',
            padding: {
                x: 5,
                y: 5
            }
        }).setOrigin(0.5);
        
        // Intent value
        const intentValue = this.add.text(x - 50, y - 40, '', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Añadir al enemigo
        enemy.ui = {
            healthBar,
            healthText,
            defenseText,
            intentIcon,
            intentValue
        };
    }

    updateEnemyHealth(enemy) {
        const healthPercentage = Math.max(0, enemy.currentHealth / enemy.maxHealth);
        const barWidth = 120 * healthPercentage;
        
        enemy.ui.healthBar.width = barWidth;
        enemy.ui.healthText.setText(`${enemy.currentHealth}/${enemy.maxHealth}`);

        // Actualizar defensa
        if (enemy.defense > 0) {
            enemy.ui.defenseText.setText(enemy.defense.toString());
            enemy.ui.defenseText.setVisible(true);
        } else {
            enemy.ui.defenseText.setVisible(false);
        }

        // Si el enemigo está derrotado
        if (enemy.currentHealth <= 0) {
            enemy.sprite.setTint(0x666666);
            enemy.ui.intentIcon.setVisible(false);
            enemy.ui.intentValue.setVisible(false);
        }
    }

    setEnemyIntent(enemy) {
        if (!enemy.nextAction) {
            this.determineEnemyIntent(enemy);
        }

        // Actualizar icono de intención
        let intentIcon = '?';
        let intentColor = '#880000';
        
        if (enemy.nextAction) {
            switch (enemy.nextAction.type) {
                case 'attack':
                    intentIcon = '⚔️';
                    intentColor = '#aa2222';
                    enemy.ui.intentValue.setText(enemy.nextAction.value.toString());
                    break;
                case 'defend':
                    intentIcon = '🛡️';
                    intentColor = '#2222aa';
                    enemy.ui.intentValue.setText(enemy.nextAction.value.toString());
                    break;
                case 'debuff':
                    intentIcon = '⚡';
                    intentColor = '#aa22aa';
                    enemy.ui.intentValue.setText('');
                    break;
                case 'special':
                    intentIcon = '✨';
                    intentColor = '#aaaa22';
                    enemy.ui.intentValue.setText('');
                    break;
                default:
                    intentIcon = '?';
                    intentColor = '#666666';
                    enemy.ui.intentValue.setText('');
            }
        }
        
        enemy.ui.intentIcon.setText(intentIcon);
        enemy.ui.intentIcon.setBackgroundColor(intentColor);
    }

    determineEnemyIntent(enemy) {
        // Lógica básica: usar el patrón de ataque del enemigo
        if (enemy.attackPattern && enemy.attackPattern.length > 0) {
            // Si no tiene índice de patrón, inicializar
            if (enemy.patternIndex === undefined) {
                enemy.patternIndex = 0;
            }

            const actionType = enemy.attackPattern[enemy.patternIndex];
            enemy.patternIndex = (enemy.patternIndex + 1) % enemy.attackPattern.length;

            switch (actionType) {
                case 'attack':
                    enemy.nextAction = {
                        type: 'attack',
                        value: enemy.damage,
                        description: `${enemy.name} atacará por ${enemy.damage} daño.`
                    };
                    break;
                case 'defend':
                    const defenseAmount = Math.floor(enemy.damage * 0.8);
                    enemy.nextAction = {
                        type: 'defend',
                        value: defenseAmount,
                        description: `${enemy.name} ganará ${defenseAmount} de defensa.`
                    };
                    break;
                case 'debuff':
                    enemy.nextAction = {
                        type: 'debuff',
                        effect: 'vulnerable',
                        duration: 2,
                        description: `${enemy.name} te hará vulnerable por 2 turnos.`
                    };
                    break;
                case 'special':
                    if (enemy.specialAbilities && enemy.specialAbilities.length > 0) {
                        const special = enemy.specialAbilities[Math.floor(Math.random() * enemy.specialAbilities.length)];
                        enemy.nextAction = {
                            type: 'special',
                            ...special,
                            description: special.description || `${enemy.name} usará una habilidad especial.`
                        };
                    } else {
                        // Volver a ataque normal si no hay habilidades especiales
                        enemy.nextAction = {
                            type: 'attack',
                            value: enemy.damage,
                            description: `${enemy.name} atacará por ${enemy.damage} daño.`
                        };
                    }
                    break;
                default:
                    // Por defecto, ataque básico
                    enemy.nextAction = {
                        type: 'attack',
                        value: enemy.damage,
                        description: `${enemy.name} atacará por ${enemy.damage} daño.`
                    };
            }
        } else {
            // Si no tiene patrón, simplemente atacar
            enemy.nextAction = {
                type: 'attack',
                value: enemy.damage,
                description: `${enemy.name} atacará por ${enemy.damage} daño.`
            };
        }
    }

    startCombat() {
        this.currentTurn = 1;
        this.turnText.setText(`Turno ${this.currentTurn}`);
        this.startPlayerTurn();
    }

    startPlayerTurn() {
        this.isPlayerTurn = true;
        this.cardsPlayedThisTurn = 0;
        this.attacksPlayedThisTurn = 0;
        this.skillsPlayedThisTurn = 0;
        this.damageDealtThisTurn = 0;

        // Aplicar efectos de inicio de turno
        this.applyStartTurnEffects();

        // Resetear puntos de acción
        this.player.actionPoints = this.player.maxActionPoints;
        this.updateActionPoints();

        // Procesar estados del jugador
        this.processPlayerStatus();

        // Robar cartas iniciales (normalmente 5)
        this.drawStartingHand();

        // Mostrar mano
        this.displayHand();
    }

    applyStartTurnEffects() {
        // Aplicar efectos pendientes del turno anterior
        for (const effect of this.nextTurnEffects) {
            if (effect.type === 'defense') {
                this.player.defense += effect.value;
                this.defenseText.setText(this.player.defense.toString());
                
                // Mostrar animación de defensa
                this.showDefenseAnimation(this.player.sprite, effect.value);
            }
        }
        
        // Limpiar efectos ya aplicados
        this.nextTurnEffects = [];
    }

    processPlayerStatus() {
        // Procesar veneno si está activo
        if (this.player.status.poisoned > 0) {
            const poisonDamage = Math.ceil(this.player.status.poisoned / 2);
            this.player.health -= poisonDamage;
            this.player.status.poisoned--;
            
            // Mostrar daño por veneno
            this.showDamageNumber(this.player.sprite, poisonDamage, 0x00ff00);
            this.updateHealthBar();
        }
        
        // Reducir duración de otros estados
        for (const statusEffect in this.player.status) {
            if (statusEffect !== 'poisoned' && statusEffect !== 'strength' && statusEffect !== 'dexterity') {
                if (this.player.status[statusEffect] > 0) {
                    this.player.status[statusEffect]--;
                }
            }
        }
        
        // Comprobar si el jugador ha muerto por veneno
        if (this.player.health <= 0) {
            this.gameOver();
            return;
        }
    }

    drawStartingHand() {
        // Número de cartas a robar (normalmente 5)
        let cardsToDraw = 5;
        
        // Comprobar si hay bonificaciones de cartas por especialización
        if (this.player.specialization === 'purple') {
            // La especialización Purple Team roba 1 carta adicional a nivel 1
            cardsToDraw += 1;
        }
        
        // Robar cartas
        for (let i = 0; i < cardsToDraw; i++) {
            this.deckManager.drawCard();
        }
    }

    displayHand() {
        // Limpiar contenedor de mano
        this.handContainer.removeAll(true);
        
        const hand = this.deckManager.hand;
        const cardSpacing = 160;
        const startX = -((hand.length - 1) * cardSpacing) / 2;
        
        for (let i = 0; i < hand.length; i++) {
            const card = hand[i];
            const x = startX + i * cardSpacing;
            
            // Crear visual de carta
            const cardContainer = this.createCardVisual(card, x, 0);
            cardContainer.originalY = 0;
            cardContainer.cardIndex = i;
            
            // Hacer la carta interactiva
            cardContainer.setInteractive(new Phaser.Geom.Rectangle(-75, -100, 150, 200), Phaser.Geom.Rectangle.Contains);
            
            // Eventos de la carta
            cardContainer.on('pointerover', () => {
                this.hoverCard(cardContainer);
            });
            
            cardContainer.on('pointerout', () => {
                this.unhoverCard(cardContainer);
            });
            
            cardContainer.on('pointerdown', () => {
                this.selectCard(i);
            });
            
            this.handContainer.add(cardContainer);
        }
    }

    createCardVisual(card, x, y) {
        const cardContainer = this.add.container(x, y);
        
        // Fondo de la carta
        const cardBg = this.add.image(0, 0, 'card-frame');
        
        // Determinar color de la carta según su equipo
        let cardTint = 0xffffff;
        if (card.team === 'red') {
            cardTint = 0xffcccc;
        } else if (card.team === 'blue') {
            cardTint = 0xccccff;
        } else if (card.team === 'purple') {
            cardTint = 0xeeccff;
        }
        
        cardBg.setTint(cardTint);
        
        // Imagen de la carta (usa el imageKey o un placeholder)
        const cardImage = this.add.image(0, -30, card.imageKey || 'card-default');
        cardImage.setScale(0.7);
        
        // Título de la carta
        const titleText = this.add.text(0, -80, card.name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '18px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Coste de la carta
        const costText = this.add.text(55, -80, card.cost.toString(), {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Tipo de la carta
        const typeText = this.add.text(-55, -80, this.getCardTypeText(card), {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#333333'
        }).setOrigin(0.5);
        
        // Descripción de la carta
        const descriptionText = this.add.text(0, 60, card.description, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 140 }
        }).setOrigin(0.5);
        
        // Verificar si la carta está bloqueada (no se puede jugar)
        let isLocked = false;
        
        // Verificar si hay suficientes puntos de acción
        if (card.cost > this.player.actionPoints) {
            isLocked = true;
        }
        
        // Verificar cualquier otra condición para bloquear la carta
        // ...
        
        // Si está bloqueada, mostrar visual diferente
        if (isLocked) {
            cardBg.setTint(0x888888);
            cardContainer.locked = true;
        } else {
            cardContainer.locked = false;
        }
        
        cardContainer.add([cardBg, cardImage, titleText, costText, typeText, descriptionText]);
        
        return cardContainer;
    }

    getCardTypeText(card) {
        switch(card.type) {
            case 'attack':
                return 'ATQ';
            case 'defense':
                return 'DEF';
            case 'skill':
                return 'HAB';
            case 'power':
                return 'POD';
            default:
                return 'NOR';
        }
    }

    hoverCard(cardContainer) {
        // No elevar cartas bloqueadas
        if (cardContainer.locked) return;
        
        // Animación de elevación
        this.tweens.add({
            targets: cardContainer,
            y: cardContainer.originalY - 30,
            scale: 1.1,
            duration: 200,
            ease: 'Cubic.easeOut'
        });
        
        // Reproducir sonido de hover
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playSound('hover');
        }
    }

    unhoverCard(cardContainer) {
        // Animación de retorno
        this.tweens.add({
            targets: cardContainer,
            y: cardContainer.originalY,
            scale: 1.0,
            duration: 200,
            ease: 'Cubic.easeOut'
        });
    }

    selectCard(index) {
        // No permitir selección durante el turno enemigo
        if (!this.isPlayerTurn) return;
        
        const card = this.deckManager.hand[index];
        const cardContainer = this.handContainer.getAt(index);
        
        // Verificar si la carta está bloqueada
        if (cardContainer.locked) {
            // Sonido de error
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('error');
            }
            return;
        }
        
        // Verificar si hay suficientes puntos de acción
        if (card.cost > this.player.actionPoints) {
            // Sonido de error
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('error');
            }
            return;
        }
        
        this.selectedCardIndex = index;
        
        // Para cartas de ataque, necesitamos un objetivo
        if (card.type === 'attack') {
            this.highlightTargets();
            return;
        }
        
        // Para cartas de defensa o habilidad, aplicar directamente
        this.playCard(index, 0); // 0 es el índice del jugador como objetivo
    }

    highlightTargets() {
        // Resaltar enemigos vivos como posibles objetivos
        for (let i = 0; i < this.combatEnemies.length; i++) {
            const enemy = this.combatEnemies[i];
            if (enemy.currentHealth > 0) {
                enemy.sprite.setTint(0xff9999);
            }
        }
    }

    selectEnemy(index) {
        // Solo permitir selección durante el turno del jugador
        if (!this.isPlayerTurn) return;
        
        const enemy = this.combatEnemies[index];
        
        // No permitir seleccionar enemigos muertos
        if (enemy.currentHealth <= 0) return;
        
        // Si hay una carta seleccionada, jugarla contra este enemigo
        if (this.selectedCardIndex !== -1) {
            this.playCard(this.selectedCardIndex, index);
            
            // Quitar resaltado de todos los enemigos
            for (const enemy of this.combatEnemies) {
                if (enemy.currentHealth > 0) {
                    enemy.sprite.clearTint();
                }
            }
            
            return;
        }
        
        // De lo contrario, simplemente actualizar el objetivo seleccionado
        this.targetedEnemyIndex = index;
        
        // Visual feedback
        for (let i = 0; i < this.combatEnemies.length; i++) {
            const e = this.combatEnemies[i];
            if (e.currentHealth > 0) {
                if (i === index) {
                    e.sprite.setTint(0xff6666);
                } else {
                    e.sprite.clearTint();
                }
            }
        }
    }

    playCard(cardIndex, targetIndex) {
        const card = this.deckManager.hand[cardIndex];
        const target = this.combatEnemies[targetIndex];

        // Verificar si el objetivo es válido
        if (card.type === 'attack' && (target.currentHealth <= 0)) {
            return false;
        }

        // Usar puntos de acción
        if (!this.player.spendActionPoints(card.cost)) {
            return false;
        }

        // Actualizar UI de puntos de acción
        this.updateActionPoints();

        // Aplicar efectos de la carta
        const result = this.applyCardEffects(card, target);

        // Incrementar contadores de cartas jugadas
        this.cardsPlayedThisTurn++;
        if (card.type === 'attack') {
            this.attacksPlayedThisTurn++;
        } else if (card.type === 'skill') {
            this.skillsPlayedThisTurn++;
        }

        // Sonido de carta jugada
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playSound(card.sound || 'card-play');
        }

        // Animar y remover carta
        this.animateCardPlay(cardIndex, targetIndex, () => {
            this.deckManager.discardCard(cardIndex);
            this.displayHand();

            // Comprobar si el combate ha terminado
            this.checkCombatEnd();
        });

        return true;
    }

    applyCardEffects(card, target) {
        let totalDamage = 0;

        // Aplicar efectos según tipo de carta
        if (card.type === 'attack') {
            // Calcular daño base
            let damage = card.effects.find(e => e.type === 'damage')?.value || 0;
            
            // Aplicar modificadores (fortaleza, etc.)
            if (this.player.status.strength > 0) {
                damage += this.player.status.strength;
            }
            
            // Efectos especiales de ataque
            if (card.effects.some(e => e.type === 'special')) {
                const specialEffect = card.effects.find(e => e.type === 'special');
                switch (specialEffect.id) {
                    case 'ignore_defense':
                        // Ignorar defensa del enemigo
                        target.currentHealth -= specialEffect.damage;
                        totalDamage = specialEffect.damage;
                        break;
                    case 'brute_force':
                        // Múltiples ataques con probabilidad
                        let hits = 0;
                        for (let i = 0; i < specialEffect.maxHits; i++) {
                            if (Math.random() <= specialEffect.hitChance) {
                                target.currentHealth -= specialEffect.damage;
                                totalDamage += specialEffect.damage;
                                hits++;
                            }
                        }
                        break;
                    default:
                        // Daño normal
                        target.currentHealth -= damage;
                        totalDamage = damage;
                }
            } else {
                // Daño normal
                const damageToDeal = damage;
                const actualDamage = this.dealDamageToEnemy(target, damageToDeal);
                totalDamage = actualDamage;
            }

            // Actualizar UI del enemigo
            this.updateEnemyHealth(target);
            
            // Mostrar número de daño
            this.showDamageNumber(target.sprite, totalDamage);
            
            // Registrar daño para estadísticas
            this.damageDealtThisTurn += totalDamage;
            this.player.stats.damageDealt += totalDamage;

        } else if (card.type === 'defense') {
            // Obtener defensa base
            let defense = card.effects.find(e => e.type === 'defense')?.value || 0;
            
            // Aplicar modificadores (destreza, etc.)
            if (this.player.status.dexterity > 0) {
                defense += this.player.status.dexterity;
            }
            
            // Aplicar defensa
            this.player.defense += defense;
            
            // Actualizar UI de defensa
            this.defenseText.setText(this.player.defense.toString());
            
            // Mostrar animación de defensa
            this.showDefenseAnimation(this.player, defense);

        } else if (card.type === 'skill') {
            // Manejar efectos de habilidades
            for (const effect of card.effects) {
                switch (effect.type) {
                    case 'draw':
                        // Robar cartas
                        for (let i = 0; i < effect.value; i++) {
                            this.deckManager.drawCard();
                        }
                        this.displayHand();
                        break;
                    case 'heal':
                        // Curar al jugador
                        const healAmount = Math.min(effect.value, this.player.maxHealth - this.player.health);
                        this.player.health += healAmount;
                        this.showHealNumber(this.player, healAmount);
                        this.updateHealthBar();
                        break;
                    case 'buff':
                        // Aplicar efecto positivo al jugador
                        this.player.status[effect.effect] += effect.duration;
                        this.showBuffAnimation(this.player, effect.effect);
                        break;
                    case 'debuff':
                        // Aplicar efecto negativo al enemigo
                        target.status[effect.effect] += effect.duration;
                        this.showDebuffAnimation(target, effect.effect);
                        break;
                    case 'special':
                        // Efectos especiales
                        this.handleSpecialEffect(effect, target);
                        break;
                }
            }
        }

        return { damage: totalDamage };
    }

    dealDamageToEnemy(enemy, amount) {
        // Aplicar vulnerabilidad si corresponde
        if (enemy.status.vulnerable > 0) {
            amount = Math.floor(amount * 1.5);
        }
        
        // Reducir daño por defensa
        const actualDamage = Math.max(0, amount - enemy.defense);
        
        // Reducir defensa
        enemy.defense = Math.max(0, enemy.defense - amount);
        
        // Aplicar daño
        enemy.currentHealth = Math.max(0, enemy.currentHealth - actualDamage);
        
        return actualDamage;
    }

    handleSpecialEffect(effect, target) {
        switch (effect.id) {
            case 'reveal_intent':
                // Revelar intención del enemigo
                // No es necesario hacer nada aquí, ya que las intenciones ya son visibles
                this.showInfoMessage(`${target.name} planea: ${target.nextAction.description}`);
                break;
                
            case 'next_turn_defense':
                // Defensa para el próximo turno
                this.nextTurnEffects.push({
                    type: 'defense',
                    value: effect.value
                });
                break;
                
            case 'remove_debuff':
                // Eliminar un estado negativo
                const debuffs = Object.keys(this.player.status).filter(key => 
                    this.player.status[key] > 0 && 
                    ['vulnerable', 'weak', 'poisoned', 'stunned'].includes(key)
                );
                
                if (debuffs.length > 0) {
                    const debuffToRemove = debuffs[Math.floor(Math.random() * debuffs.length)];
                    this.player.status[debuffToRemove] = 0;
                    this.showInfoMessage(`¡${debuffToRemove} ha sido eliminado!`);
                }
                break;
                
            // Manejar otros efectos especiales según sea necesario
        }
    }

    animateCardPlay(cardIndex, targetIndex, callback) {
        const cardContainer = this.handContainer.getAt(cardIndex);
        const card = this.deckManager.hand[cardIndex];
        const target = this.combatEnemies[targetIndex];
        
        // Quitar interactividad
        cardContainer.disableInteractive();
        
        // Determinar punto final según tipo de carta
        let endX, endY;
        
        if (card.type === 'attack') {
            // Para ataques, mover hacia el enemigo
            endX = target.sprite.x;
            endY = target.sprite.y;
        } else {
            // Para otras cartas, mover hacia el jugador
            endX = 150;
            endY = 650;
        }
        
        // Animar la carta
        this.tweens.add({
            targets: cardContainer,
            x: endX,
            y: endY,
            scale: 0.5,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                // Reset de carta seleccionada
                this.selectedCardIndex = -1;
                
                // Llamar al callback
                if (callback) callback();
            }
        });
    }

    showDamageNumber(target, amount, color = 0xff0000) {
        if (!target) return;
        
        // Crear texto de daño
        const x = target.x;
        const y = target.y - 50;
        
        const damageText = this.add.text(x, y, `-${amount}`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: color === 0xff0000 ? '#ff0000' : '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Animar
        this.tweens.add({
            targets: damageText,
            y: y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }

    showHealNumber(target, amount) {
        if (!target) return;
        
        // Crear texto de curación
        const x = target.x || 150;
        const y = target.y || 650;
        
        const healText = this.add.text(x, y - 50, `+${amount}`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Animar
        this.tweens.add({
            targets: healText,
            y: y - 80,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                healText.destroy();
            }
        });
        
        // Efecto visual de curación
        this.showHealAnimation(target);
    }

    showDefenseAnimation(target, amount) {
        if (!target) return;
        
        // Crear texto de defensa
        const x = target.x || 150;
        const y = target.y || 650;
        
        const defenseText = this.add.text(x, y - 30, `+${amount} DEF`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#99ccff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animar
        this.tweens.add({
            targets: defenseText,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                defenseText.destroy();
            }
        });
        
        // Efecto visual de escudo
        this.showShieldAnimation(target);
    }

    showShieldAnimation(target) {
        // Shield effect animation
        const x = target.x || 150;
        const y = target.y || 650;
        
        const shield = this.add.sprite(x, y, 'effect-shield');
        shield.setScale(1.5);
        shield.play('shield');
        
        shield.on('animationcomplete', () => {
            shield.destroy();
        });
    }

    showHealAnimation(target) {
        // Heal effect animation
        const x = target.x || 150;
        const y = target.y || 650;
        
        const heal = this.add.sprite(x, y, 'effect-heal');
        heal.setScale(1.5);
        heal.play('heal');
        
        heal.on('animationcomplete', () => {
            heal.destroy();
        });
    }

    showBuffAnimation(target, buffType) {
        // Buff effect animation
        const x = target.x || 150;
        const y = target.y || 650;
        
        const buff = this.add.sprite(x, y, 'effect-buff');
        buff.setScale(1.5);
        buff.play('buff');
        
        // Mostrar tipo de buff
        const buffText = this.add.text(x, y - 40, buffType, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animar texto
        this.tweens.add({
            targets: buffText,
            y: y - 70,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                buffText.destroy();
            }
        });
        
        buff.on('animationcomplete', () => {
            buff.destroy();
        });
    }

    showDebuffAnimation(target, debuffType) {
        // Debuff effect animation
        const x = target.x;
        const y = target.y;
        
        const debuff = this.add.sprite(x, y, 'effect-debuff');
        debuff.setScale(1.5);
        debuff.play('debuff');
        
        // Mostrar tipo de debuff
        const debuffText = this.add.text(x, y - 40, debuffType, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ff99ff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animar texto
        this.tweens.add({
            targets: debuffText,
            y: y - 70,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                debuffText.destroy();
            }
        });
        
        debuff.on('animationcomplete', () => {
            debuff.destroy();
        });
    }

    showInfoMessage(message) {
        const x = this.cameras.main.width / 2;
        const y = 100;
        
        const infoText = this.add.text(x, y, message, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        
        // Animar
        this.tweens.add({
            targets: infoText,
            y: y - 20,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                infoText.destroy();
            }
        });
    }

    updateActionPoints() {
        // Limpiar contenedor
        this.actionPointsContainer.removeAll(true);
        
        // Añadir iconos de puntos de acción
        const spacing = 30;
        
        for (let i = 0; i < this.player.maxActionPoints; i++) {
            const active = i < this.player.actionPoints;
            const color = active ? 0x32cd32 : 0x555555;
            
            const actionPoint = this.add.circle(i * spacing, 0, 12, color);
            
            if (active) {
                actionPoint.setStrokeStyle(2, 0x00ff00);
            }
            
            this.actionPointsContainer.add(actionPoint);
        }
    }

    updateHealthBar() {
        // Actualizar barra de vida del jugador
        const healthPercentage = this.player.health / this.player.maxHealth;
        const width = 200 * healthPercentage;
        
        this.playerHealthBar.width = width;
        this.healthText.setText(`${this.player.health}/${this.player.maxHealth}`);
        
        // Cambiar color según la salud
        if (healthPercentage < 0.3) {
            this.playerHealthBar.setFillStyle(0xff0000);
        } else if (healthPercentage < 0.6) {
            this.playerHealthBar.setFillStyle(0xffff00);
        } else {
            this.playerHealthBar.setFillStyle(0x00ff00);
        }
    }

    endPlayerTurn() {
        // Finalizar el turno del jugador
        this.isPlayerTurn = false;
        
        // Descartar mano
        this.deckManager.discardHand();
        this.handContainer.removeAll(true);
        
        // Reiniciar defensa del jugador al final del turno
        // (a menos que tenga habilidades especiales que la conserven)
        const retainedDefense = this.calculateRetainedDefense();
        this.player.defense = retainedDefense;
        this.defenseText.setText(this.player.defense.toString());
        
        // Iniciar turno de enemigos
        this.startEnemyTurn();
    }

    calculateRetainedDefense() {
        // Por defecto no se retiene defensa entre turnos
        let retainedDefense = 0;
        
        // Especialización Blue Team puede retener defensa
        if (this.player.specialization === 'blue') {
            // Nivel 3 de Blue Team permite retener hasta 5 de defensa
            retainedDefense = Math.min(this.player.defense, 5);
        }
        
        return retainedDefense;
    }

    startEnemyTurn() {
        // Ejecutar acciones para cada enemigo vivo
        this.processEnemyTurns(0);
    }

    processEnemyTurns(index) {
        // Si hemos procesado todos los enemigos, terminar el turno
        if (index >= this.combatEnemies.length) {
            this.endEnemyTurn();
            return;
        }
        
        const enemy = this.combatEnemies[index];
        
        // Saltar enemigos muertos
        if (enemy.currentHealth <= 0) {
            this.processEnemyTurns(index + 1);
            return;
        }
        
        // Procesar efectos de estado
        this.processEnemyStatus(enemy);
        
        // Si el enemigo murió por efectos de estado, pasar al siguiente
        if (enemy.currentHealth <= 0) {
            this.updateEnemyHealth(enemy);
            this.processEnemyTurns(index + 1);
            return;
        }
        
        // Si el enemigo está aturdido, saltar su turno
        if (enemy.status.stunned > 0) {
            this.showInfoMessage(`${enemy.name} está aturdido y pierde su turno!`);
            enemy.status.stunned--;
            this.processEnemyTurns(index + 1);
            return;
        }
        
        // Ejecutar acción del enemigo con una pequeña animación
        this.time.delayedCall(500, () => {
            this.executeEnemyAction(enemy);
            
            // Verificar si el jugador ha muerto
            if (this.player.health <= 0) {
                this.gameOver();
                return;
            }
            
            // Procesar siguiente enemigo tras un pequeño retraso
            this.time.delayedCall(500, () => {
                this.processEnemyTurns(index + 1);
            });
        });
    }

    processEnemyStatus(enemy) {
        // Procesar veneno
        if (enemy.status.poisoned > 0) {
            const poisonDamage = Math.ceil(enemy.status.poisoned / 2);
            enemy.currentHealth -= poisonDamage;
            enemy.status.poisoned--;
            
            // Mostrar daño por veneno
            this.showDamageNumber(enemy.sprite, poisonDamage, 0x00ff00);
            this.updateEnemyHealth(enemy);
        }
        
        // Procesar quemadura
        if (enemy.status.burning > 0) {
            const burnDamage = 3;
            enemy.currentHealth -= burnDamage;
            enemy.status.burning--;
            
            // Mostrar daño por quemadura
            this.showDamageNumber(enemy.sprite, burnDamage, 0xffaa00);
            this.updateEnemyHealth(enemy);
        }
        
        // Reducir duración de otros estados
        for (const status in enemy.status) {
            if (status !== 'poisoned' && status !== 'burning') {
                if (enemy.status[status] > 0) {
                    enemy.status[status]--;
                }
            }
        }
    }

    executeEnemyAction(enemy) {
        // Si no tiene acción definida, determinar una
        if (!enemy.nextAction) {
            this.determineEnemyIntent(enemy);
        }
        
        const action = enemy.nextAction;
        
        // Ejecutar acción según tipo
        switch (action.type) {
            case 'attack':
                this.executeEnemyAttack(enemy, action);
                break;
            case 'defend':
                this.executeEnemyDefend(enemy, action);
                break;
            case 'debuff':
                this.executeEnemyDebuff(enemy, action);
                break;
            case 'special':
                this.executeEnemySpecial(enemy, action);
                break;
            default:
                // Acción desconocida, hacer nada
                console.warn('Acción de enemigo desconocida:', action);
        }
        
        // Actualizar intención para el próximo turno
        this.determineEnemyIntent(enemy);
        this.setEnemyIntent(enemy);
    }

    executeEnemyAttack(enemy, action) {
        // Calcular daño final
        let damage = action.value;
        
        // Aplicar debilidad si corresponde
        if (enemy.status.weak > 0) {
            damage = Math.floor(damage * 0.75);
        }
        
        // Aplicar vulnerabilidad del jugador
        if (this.player.status.vulnerable > 0) {
            damage = Math.floor(damage * 1.5);
        }
        
        // Reducir por defensa del jugador
        const actualDamage = Math.max(0, damage - this.player.defense);
        this.player.defense = Math.max(0, this.player.defense - damage);
        
        // Aplicar daño
        this.player.health = Math.max(0, this.player.health - actualDamage);
        
        // Actualizar UI de salud y defensa
        this.updateHealthBar();
        this.defenseText.setText(this.player.defense.toString());
        
        // Mostrar daño al jugador
        if (actualDamage > 0) {
            // Sonido de daño
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('player-hurt');
            }
            
            // Mostrar número de daño
            this.showDamageNumber({x: 150, y: 650}, actualDamage);
        }
        
        // Mostrar mensaje
        this.showInfoMessage(`${enemy.name} ataca por ${actualDamage} de daño!`);
    }

    executeEnemyDefend(enemy, action) {
        // Aplicar defensa
        enemy.defense += action.value;
        
        // Actualizar UI
        this.updateEnemyHealth(enemy);
        
        // Mostrar animación de defensa
        this.showDefenseAnimation(enemy.sprite, action.value);
        
        // Mostrar mensaje
        this.showInfoMessage(`${enemy.name} gana ${action.value} de defensa!`);
    }

    executeEnemyDebuff(enemy, action) {
        // Aplicar efecto negativo al jugador
        this.player.status[action.effect] += action.duration;
        
        // Mostrar animación de debuff
        this.showDebuffAnimation({x: 150, y: 650}, action.effect);
        
        // Mostrar mensaje
        this.showInfoMessage(`${enemy.name} te aplica ${action.effect} por ${action.duration} turnos!`);
    }

    executeEnemySpecial(enemy, action) {
        // Ejecutar habilidad especial
        switch (action.id) {
            case 'data_leech':
                // Absorber vida
                const leechAmount = Math.min(action.value, this.player.health);
                this.player.health -= leechAmount;
                enemy.currentHealth = Math.min(enemy.maxHealth, enemy.currentHealth + leechAmount);
                
                // Actualizar UI
                this.updateHealthBar();
                this.updateEnemyHealth(enemy);
                
                // Mostrar daño y curación
                this.showDamageNumber({x: 150, y: 650}, leechAmount);
                this.showHealNumber(enemy.sprite, leechAmount);
                
                // Mostrar mensaje
                this.showInfoMessage(`${enemy.name} absorbe ${leechAmount} de tu salud!`);
                break;
                
            case 'ddos_attack':
                // Múltiples ataques pequeños
                const hits = action.hits || 3;
                let totalDamage = 0;
                
                for (let i = 0; i < hits; i++) {
                    const dmg = Math.floor(enemy.damage * 0.4);
                    const actualDmg = Math.max(0, dmg - Math.floor(this.player.defense / hits));
                    this.player.health -= actualDmg;
                    totalDamage += actualDmg;
                    
                    // Breve pausa entre ataques
                    this.time.delayedCall(i * 150, () => {
                        // Pequeña animación para cada golpe
                        this.showDamageNumber({x: 150 + (Math.random() * 40 - 20), y: 650 + (Math.random() * 40 - 20)}, Math.floor(actualDmg));
                    });
                }
                
                // Reducir parte de la defensa
                this.player.defense = Math.max(0, this.player.defense - enemy.damage);
                
                // Actualizar UI
                this.updateHealthBar();
                this.defenseText.setText(this.player.defense.toString());
                
                // Mostrar mensaje
                this.showInfoMessage(`${enemy.name} realiza ${hits} ataques por un total de ${totalDamage} de daño!`);
                break;
                
            case 'encrypt_cards':
                // Cifrar cartas del jugador
                const count = action.count || 2;
                const encryptedCount = this.deckManager.encryptCards(count);
                
                // Mostrar mensaje
                this.showInfoMessage(`${enemy.name} cifra ${encryptedCount} cartas de tu mazo!`);
                break;
                
            // Más habilidades especiales aquí
                
            default:
                console.warn('Habilidad especial de enemigo desconocida:', action.id);
                this.showInfoMessage(`${enemy.name} usa una técnica especial!`);
        }
    }

    endEnemyTurn() {
        // Incrementar contador de turno
        this.currentTurn++;
        this.turnText.setText(`Turno ${this.currentTurn}`);
        
        // Iniciar el turno del jugador
        this.startPlayerTurn();
    }

    checkCombatEnd() {
        // Verificar si todos los enemigos están derrotados
        const allEnemiesDefeated = this.combatEnemies.every(enemy => enemy.currentHealth <= 0);
        
        if (allEnemiesDefeated) {
            // Victoria!
            this.combatVictory();
        } else if (this.player.health <= 0) {
            // Derrota
            this.gameOver();
        }
    }

    combatVictory() {
        // Detener interacción
        this.isPlayerTurn = false;
        
        // Actualizar estadísticas
        this.player.stats.enemiesDefeated += this.combatEnemies.length;
        
        // Mostrar mensaje de victoria
        const victoryText = this.add.text(this.cameras.main.width / 2, 100, '¡VICTORIA!', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '64px',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Animar texto
        this.tweens.add({
            targets: victoryText,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 1
        });
        
        // Sonido de victoria
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playSound('victory');
        }
        
        // Mostrar recompensas tras un breve retraso
        this.time.delayedCall(1500, () => {
            this.showRewards();
        });
    }

    showRewards() {
        // Crear panel de recompensas
        const rewardsPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 600, 400, 0x222222, 0.9)
            .setStrokeStyle(3, 0xffcc00);
        
        // Título
        const titleText = this.add.text(0, -160, 'RECOMPENSAS', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffcc00',
            align: 'center'
        }).setOrigin(0.5);
        
        rewardsPanel.add([panelBg, titleText]);
        
        // Añadir recompensas
        let yPos = -80;
        
        // Créditos
        if (this.rewards.credits) {
            const creditsText = this.add.text(0, yPos, `${this.rewards.credits} Créditos`, {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            rewardsPanel.add(creditsText);
            
            // Actualizar créditos del jugador
            this.player.credits += this.rewards.credits;
            
            yPos += 50;
        }
        
        // Cartas (si hay)
        if (this.rewards.cards && this.rewards.cards.length > 0) {
            const cardRewardText = this.add.text(0, yPos, 'Nuevas Cartas:', {
                fontFamily: 'Pirata One, cursive',
                fontSize: '24px',
                color: '#ffcc00',
                align: 'center'
            }).setOrigin(0.5);
            
            rewardsPanel.add(cardRewardText);
            yPos += 40;
            
            // Mostrar cartas para elegir
            const cardSpacing = 150;
            const startX = -((this.rewards.cards.length - 1) * cardSpacing) / 2;
            
            for (let i = 0; i < this.rewards.cards.length; i++) {
                const card = this.rewards.cards[i];
                const x = startX + i * cardSpacing;
                
                // Versión reducida de la carta
                const cardContainer = this.createMiniCardVisual(card, x, yPos);
                cardContainer.cardData = card;
                
                // Hacer interactiva
                cardContainer.setInteractive(new Phaser.Geom.Rectangle(-60, -80, 120, 160), Phaser.Geom.Rectangle.Contains);
                
                cardContainer.on('pointerover', () => {
                    this.hoverRewardCard(cardContainer);
                });
                
                cardContainer.on('pointerout', () => {
                    this.unhoverRewardCard(cardContainer);
                });
                
                cardContainer.on('pointerdown', () => {
                    this.selectRewardCard(cardContainer, rewardsPanel);
                });
                
                rewardsPanel.add(cardContainer);
            }
            
            yPos += 120;
        }
        
        // Artefacto (si hay)
        if (this.rewards.artifact) {
            const artifactText = this.add.text(0, yPos, 'Nuevo Artefacto:', {
                fontFamily: 'Pirata One, cursive',
                fontSize: '24px',
                color: '#ffcc00',
                align: 'center'
            }).setOrigin(0.5);
            
            rewardsPanel.add(artifactText);
            yPos += 40;
            
            // Mostrar artefacto
            const artifactImg = this.add.image(0, yPos, this.rewards.artifact.imageKey);
            const artifactName = this.add.text(0, yPos + 40, this.rewards.artifact.name, {
                fontFamily: 'monospace',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            rewardsPanel.add([artifactImg, artifactName]);
            
            // Añadir artefacto al jugador
            this.player.addArtifact(this.rewards.artifact);
            
            yPos += 90;
        }
        
        // Botón para continuar
        const continueButton = this.createButton(0, 150, 'CONTINUAR', () => {
            // Volver al mapa
            this.scene.start(this.nextScene);
        });
        
        rewardsPanel.add(continueButton);
    }
    
    createMiniCardVisual(card, x, y) {
        const cardContainer = this.add.container(x, y);
        
        // Fondo de la carta
        const cardBg = this.add.image(0, 0, 'card-frame').setScale(0.7);
        
        // Determinar color de la carta
        let cardTint = 0xffffff;
        if (card.team === 'red') {
            cardTint = 0xffcccc;
        } else if (card.team === 'blue') {
            cardTint = 0xccccff;
        } else if (card.team === 'purple') {
            cardTint = 0xeeccff;
        }
        
        cardBg.setTint(cardTint);
        
        // Título de la carta
        const titleText = this.add.text(0, -50, card.name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '14px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Imagen de la carta
        const cardImage = this.add.image(0, -15, card.imageKey || 'card-default').setScale(0.5);
        
        // Tipo y coste
        const typeText = this.add.text(-35, -50, this.getCardTypeText(card), {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#333333'
        }).setOrigin(0.5);
        
        const costText = this.add.text(35, -50, card.cost.toString(), {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Descripción (más pequeña)
        const descriptionText = this.add.text(0, 30, card.description, {
            fontFamily: 'monospace',
            fontSize: '8px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 120 }
        }).setOrigin(0.5);
        
        cardContainer.add([cardBg, titleText, cardImage, typeText, costText, descriptionText]);
        cardContainer.setScale(0.8); // Escala global
        
        return cardContainer;
    }
    
    hoverRewardCard(cardContainer) {
        this.tweens.add({
            targets: cardContainer,
            scale: 0.95,
            y: cardContainer.y - 20,
            duration: 200,
            ease: 'Power1'
        });
    }
    
    unhoverRewardCard(cardContainer) {
        this.tweens.add({
            targets: cardContainer,
            scale: 0.8,
            y: cardContainer.originalY || cardContainer.y + 20,
            duration: 200,
            ease: 'Power1'
        });
    }
    
    selectRewardCard(cardContainer, rewardsPanel) {
        // Añadir carta al mazo del jugador
        const card = cardContainer.cardData;
        this.deckManager.addCard(card);
        
        // Animación de selección
        this.tweens.add({
            targets: cardContainer,
            scale: 1.2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                // Eliminar todas las cartas de recompensa
                const cardsToRemove = [];
                rewardsPanel.each(child => {
                    if (child.cardData) {
                        cardsToRemove.push(child);
                    }
                });
                
                cardsToRemove.forEach(child => {
                    rewardsPanel.remove(child, true);
                });
                
                // Mostrar mensaje
                const selectedText = this.add.text(0, 0, `¡Carta añadida a tu mazo!`, {
                    fontFamily: 'Pirata One, cursive',
                    fontSize: '24px',
                    color: '#00ff00',
                    align: 'center'
                }).setOrigin(0.5);
                
                rewardsPanel.add(selectedText);
            }
        });
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const buttonBg = this.add.rectangle(0, 0, 200, 50, 0x3a3a3a)
            .setStrokeStyle(2, 0xffcc00);
        
        const buttonText = this.add.text(0, 0, text, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.add([buttonBg, buttonText]);
        
        // Interacción
        button.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
        
        button.on('pointerover', () => {
            buttonBg.setFillStyle(0x555555);
        });
        
        button.on('pointerout', () => {
            buttonBg.setFillStyle(0x3a3a3a);
        });
        
        button.on('pointerdown', () => {
            buttonBg.setFillStyle(0x222222);
        });
        
        button.on('pointerup', () => {
            buttonBg.setFillStyle(0x555555);
            if (window.dataManager && window.dataManager.audioManager) {
                window.dataManager.audioManager.playSound('click');
            }
            callback();
        });
        
        return button;
    }

    gameOver() {
        // Detener interacción
        this.isPlayerTurn = false;
        
        // Actualizar estadísticas
        this.player.stats.losses++;
        
        // Mostrar mensaje de derrota
        const defeatText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'DERROTA', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '64px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Animar texto
        this.tweens.add({
            targets: defeatText,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 1
        });
        
        // Sonido de derrota
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playMusic('game-over');
        }
        
        // Ir a pantalla de game over tras breve retraso
        this.time.delayedCall(2500, () => {
            this.scene.start('GameOverScene', {
                enemyName: this.combatEnemies[0]?.name || "Enemigo",
                floor: this.gameData.currentFloor,
                stats: this.player.stats
            });
        });
    }

    showDeckView() {
        // Crear panel de vista de mazo
        const deckViewPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 800, 600, 0x222222, 0.95)
            .setStrokeStyle(3, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -260, 'TU MAZO', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#4444ff',
            align: 'center'
        }).setOrigin(0.5);
        
        deckViewPanel.add([panelBg, titleText]);
        
        // Mostrar cartas
        const cards = this.deckManager.drawPile;
        const cardsPerRow = 6;
        const cardSpacing = { x: 120, y: 150 };
        const startPos = { x: -300, y: -180 };
        
        for (let i = 0; i < cards.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            
            const x = startPos.x + col * cardSpacing.x;
            const y = startPos.y + row * cardSpacing.y;
            
            const cardContainer = this.createMiniCardVisual(cards[i], x, y);
            deckViewPanel.add(cardContainer);
        }
        
        // Botón para cerrar
        const closeButton = this.createButton(0, 250, 'CERRAR', () => {
            deckViewPanel.destroy();
        });
        
        deckViewPanel.add(closeButton);
        
        // Contador de cartas
        const cardCounts = this.deckManager.getCardCounts();
        const countText = this.add.text(0, 200, 
            `Mazo: ${cardCounts.deck} | Mano: ${cardCounts.hand} | Descarte: ${cardCounts.discard} | Agotadas: ${cardCounts.exhaust}`, 
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
        
        deckViewPanel.add(countText);
    }
    
    showDiscardView() {
        // Crear panel de vista de descarte
        const discardViewPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 800, 600, 0x222222, 0.95)
            .setStrokeStyle(3, 0x884444);
        
        // Título
        const titleText = this.add.text(0, -260, 'CARTAS DESCARTADAS', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#884444',
            align: 'center'
        }).setOrigin(0.5);
        
        discardViewPanel.add([panelBg, titleText]);
        
        // Mostrar cartas
        const cards = this.deckManager.discardPile;
        const cardsPerRow = 6;
        const cardSpacing = { x: 120, y: 150 };
        const startPos = { x: -300, y: -180 };
        
        for (let i = 0; i < cards.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            
            const x = startPos.x + col * cardSpacing.x;
            const y = startPos.y + row * cardSpacing.y;
            
            const cardContainer = this.createMiniCardVisual(cards[i], x, y);
            discardViewPanel.add(cardContainer);
        }
        
        // Botón para cerrar
        const closeButton = this.createButton(0, 250, 'CERRAR', () => {
            discardViewPanel.destroy();
        });
        
        discardViewPanel.add(closeButton);
        
        // Contador de cartas
        const cardCounts = this.deckManager.getCardCounts();
        const countText = this.add.text(0, 200, 
            `Mazo: ${cardCounts.deck} | Mano: ${cardCounts.hand} | Descarte: ${cardCounts.discard} | Agotadas: ${cardCounts.exhaust}`, 
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
        
        discardViewPanel.add(countText);
    }
}