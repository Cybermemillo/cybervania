export class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
    }

    init(data) {
        this.gameData = window.game;
        this.currentFloor = this.gameData.currentFloor || 1;
        this.player = this.gameData.player;
    }

    create() {
        // Fondo para el mapa
        this.add.image(0, 0, 'bg-digital').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Iniciar música de fondo
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playMusic('main-theme');
        }
        
        // Crear el mapa
        this.createMap();
        
        // Interfaz de usuario
        this.createUI();
        
        // Auto-guardar
        this.gameData.saveGame();
    }
    
    createMap() {
        // Obtener o generar el mapa del piso actual
        this.mapData = this.gameData.getMapForFloor(this.currentFloor);
        
        if (!this.mapData) {
            this.mapData = this.generateNewMap();
            this.gameData.setMapForFloor(this.currentFloor, this.mapData);
        }
        
        // Contenedor principal del mapa
        this.mapContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Visualizar nodos del mapa
        this.createMapNodes();
        
        // Dibujar conexiones entre nodos
        this.drawMapConnections();
        
        // Actualizar caminos disponibles
        this.updateAvailablePaths();
        
        // Escalar mapa
        const scale = this.getMapScale();
        this.mapContainer.setScale(scale);
        
        // Centrar en la posición actual
        this.centerMapOnCurrentNode();
    }
    
    generateNewMap() {
        // Configuración del mapa
        const layers = 6; // Número de capas verticales
        const nodesPerLayer = [2, 3, 4, 3, 3, 1]; // Nodos por capa
        const nodeTypes = ['combat', 'elite', 'event', 'shop', 'rest'];
        const nodeTypeWeights = {
            combat: 0.55,
            elite: 0.15,
            event: 0.15,
            shop: 0.08,
            rest: 0.07
        };
        
        // Variables para generación
        let map = {
            nodes: [],
            connections: [],
            startNodeId: 0,
            endNodeId: 0,
            currentNodeId: 0
        };
        
        let nodeId = 0;
        let positionY = 100;
        const spacingY = 120;
        
        // Generar nodos por capa
        for (let layer = 0; layer < layers; layer++) {
            const nodesInLayer = nodesPerLayer[layer];
            const spacingX = 180;
            const offsetX = -(nodesInLayer - 1) * spacingX / 2;
            
            // Crear nodos para esta capa
            for (let i = 0; i < nodesInLayer; i++) {
                // Determinar tipo de nodo
                let nodeType;
                
                // Casos especiales para primera y última capa
                if (layer === 0) {
                    nodeType = 'start';
                } else if (layer === layers - 1) {
                    nodeType = 'boss';
                } else {
                    // Seleccionar tipo basado en pesos
                    // Excluir élites en primera mitad del primer piso
                    if (this.currentFloor === 1 && layer < 3) {
                        nodeType = this.getWeightedRandomType(nodeTypes.filter(t => t !== 'elite'), nodeTypeWeights);
                    } else {
                        nodeType = this.getWeightedRandomType(nodeTypes, nodeTypeWeights);
                        
                        // Asegurar que no haya más de una élite por capa
                        if (nodeType === 'elite' && map.nodes.some(n => n.layer === layer && n.type === 'elite')) {
                            nodeType = 'combat';
                        }
                    }
                }
                
                // Crear nodo
                const node = {
                    id: nodeId,
                    type: nodeType,
                    x: offsetX + i * spacingX,
                    y: positionY + Math.random() * (spacingY * 0.3) - (spacingY * 0.15),
                    layer: layer,
                    visited: layer === 0, // El nodo inicial ya está visitado
                    available: layer === 0, // El nodo inicial está disponible
                    data: {} // Datos adicionales específicos del nodo
                };
                
                // Guardar referencias especiales
                if (nodeType === 'start') {
                    map.startNodeId = nodeId;
                    map.currentNodeId = nodeId;
                } else if (nodeType === 'boss') {
                    map.endNodeId = nodeId;
                }
                
                // Añadir nodo al mapa
                map.nodes.push(node);
                nodeId++;
            }
            
            positionY += spacingY;
        }
        
        // Generar conexiones entre capas
        for (let layer = 0; layer < layers - 1; layer++) {
            const currentLayerNodes = map.nodes.filter(n => n.layer === layer);
            const nextLayerNodes = map.nodes.filter(n => n.layer === layer + 1);
            
            // Crear al menos una conexión para cada nodo
            for (const node of currentLayerNodes) {
                // Determinar número de conexiones (1-2)
                const numConnections = Math.min(nextLayerNodes.length, 1 + Math.floor(Math.random() * 2));
                
                // Seleccionar nodos de la siguiente capa aleatoriamente
                const possibleTargets = [...nextLayerNodes].sort(() => 0.5 - Math.random());
                const targets = possibleTargets.slice(0, numConnections);
                
                // Crear conexiones
                for (const target of targets) {
                    map.connections.push({
                        from: node.id,
                        to: target.id
                    });
                }
            }
            
            // Asegurarse de que todos los nodos de la siguiente capa tengan al menos una conexión entrante
            for (const node of nextLayerNodes) {
                const hasIncomingConnection = map.connections.some(c => c.to === node.id);
                
                if (!hasIncomingConnection) {
                    // Conectar con un nodo aleatorio de la capa actual
                    const randomSourceIndex = Math.floor(Math.random() * currentLayerNodes.length);
                    const sourceNode = currentLayerNodes[randomSourceIndex];
                    
                    map.connections.push({
                        from: sourceNode.id,
                        to: node.id
                    });
                }
            }
        }
        
        // Generar datos específicos para cada nodo
        this.populateNodeData(map);
        
        return map;
    }
    
    populateNodeData(map) {
        // Rellenar datos específicos según el tipo de nodo
        for (const node of map.nodes) {
            switch (node.type) {
                case 'combat':
                    node.data = {
                        enemies: this.generateEnemyEncounter('normal')
                    };
                    break;
                    
                case 'elite':
                    node.data = {
                        enemies: this.generateEnemyEncounter('elite')
                    };
                    break;
                    
                case 'event':
                    node.data = {
                        eventId: this.selectRandomEvent()
                    };
                    break;
                    
                case 'shop':
                    node.data = {
                        inventory: this.generateShopInventory()
                    };
                    break;
                    
                case 'rest':
                    node.data = {
                        options: this.generateRestOptions()
                    };
                    break;
                    
                case 'boss':
                    node.data = {
                        boss: this.selectBossForFloor(this.currentFloor)
                    };
                    break;
            }
        }
    }
    
    getWeightedRandomType(types, weights) {
        // Calcular suma de pesos para los tipos disponibles
        let totalWeight = 0;
        for (const type of types) {
            totalWeight += weights[type];
        }
        
        // Normalizar pesos
        const normalizedWeights = {};
        for (const type of types) {
            normalizedWeights[type] = weights[type] / totalWeight;
        }
        
        // Selección aleatoria basada en pesos
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (const type of types) {
            cumulativeWeight += normalizedWeights[type];
            if (random <= cumulativeWeight) {
                return type;
            }
        }
        
        // Por si acaso, devolver el último tipo
        return types[types.length - 1];
    }
    
    generateEnemyEncounter(difficulty) {
        // Obtener enemigos disponibles para el piso actual
        const availableEnemies = this.gameData.getEnemiesForFloor(this.currentFloor, difficulty);
        
        // Determinar cantidad de enemigos
        let enemyCount = 1;
        if (difficulty === 'normal') {
            // Normal: 1-2 enemigos
            enemyCount = 1 + Math.floor(Math.random() * 2);
        }
        
        // Seleccionar enemigos aleatoriamente
        const enemies = [];
        for (let i = 0; i < enemyCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableEnemies.length);
            enemies.push(availableEnemies[randomIndex]);
        }
        
        return enemies;
    }
    
    selectRandomEvent() {
        // Obtener eventos disponibles para el piso actual
        const availableEvents = this.gameData.getEventsForFloor(this.currentFloor);
        
        // Seleccionar uno aleatoriamente
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        return availableEvents[randomIndex].id;
    }
    
    generateShopInventory() {
        // Simular inventario de tienda
        return {
            cards: this.gameData.getRandomShopCards(3),
            artifacts: this.gameData.getRandomShopArtifacts(2),
            potions: this.gameData.getRandomShopPotions(2),
            cardRemoval: true,
            cardUpgrade: Math.random() < 0.5
        };
    }
    
    generateRestOptions() {
        // Opciones básicas de descanso
        const options = [
            { id: 'rest', name: 'Descansar', description: 'Recupera el 30% de tu salud máxima.', effect: 'heal' },
            { id: 'upgrade', name: 'Mejorar', description: 'Mejora una carta de tu mazo.', effect: 'upgrade' }
        ];
        
        // Opciones adicionales según artefactos, etc.
        if (this.player.hasSpecialRestOption()) {
            options.push(this.player.getSpecialRestOption());
        }
        
        return options;
    }
    
    selectBossForFloor(floor) {
        // Obtener jefes disponibles para el piso
        const availableBosses = this.gameData.getBossesForFloor(floor);
        
        // Seleccionar uno aleatoriamente
        const randomIndex = Math.floor(Math.random() * availableBosses.length);
        return availableBosses[randomIndex];
    }
    
    createMapNodes() {
        // Iterar sobre todos los nodos
        for (const node of this.mapData.nodes) {
            // Determinar apariencia según tipo
            let texture, scale = 1.0;
            
            switch (node.type) {
                case 'start':
                    texture = 'node-start';
                    scale = 1.2;
                    break;
                case 'combat':
                    texture = 'node-combat';
                    break;
                case 'elite':
                    texture = 'node-elite';
                    scale = 1.1;
                    break;
                case 'event':
                    texture = 'node-event';
                    break;
                case 'shop':
                    texture = 'node-shop';
                    break;
                case 'rest':
                    texture = 'node-rest';
                    break;
                case 'boss':
                    texture = 'node-boss';
                    scale = 1.3;
                    break;
                default:
                    texture = 'node-unknown';
            }
            
            // Crear sprite del nodo
            const nodeSprite = this.add.image(node.x, node.y, texture)
                .setScale(scale)
                .setInteractive({ useHandCursor: true });
            
            // Aplicar estado visual
            if (node.visited) {
                nodeSprite.setTint(0x888888);
            } else if (node.available) {
                nodeSprite.setTint(0xffffaa);
            } else {
                nodeSprite.setAlpha(0.6);
                nodeSprite.disableInteractive();
            }
            
            // Eventos del nodo
            nodeSprite.on('pointerover', () => {
                if (node.available) {
                    nodeSprite.setScale(scale * 1.2);
                    this.showNodeInfo(node);
                }
            });
            
            nodeSprite.on('pointerout', () => {
                nodeSprite.setScale(scale);
                this.hideNodeInfo();
            });
            
            nodeSprite.on('pointerdown', () => {
                if (node.available) {
                    this.selectNode(node);
                }
            });
            
            // Guardar referencia al sprite
            node.sprite = nodeSprite;
            
            // Añadir al contenedor del mapa
            this.mapContainer.add(nodeSprite);
            
            // Si el nodo es el actual, resaltarlo
            if (node.id === this.mapData.currentNodeId) {
                nodeSprite.setTint(0x00ff00);
                nodeSprite.setScale(scale * 1.2);
                
                // Añadir indicador de jugador
                const playerIndicator = this.add.sprite(node.x, node.y - 30, 'player-map-icon')
                    .setScale(0.8);
                
                this.mapContainer.add(playerIndicator);
                
                // Animar el indicador
                this.tweens.add({
                    targets: playerIndicator,
                    y: node.y - 35,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
    }
    
    drawMapConnections() {
        // Crear un objeto gráfico para las conexiones
        const graphics = this.add.graphics();
        
        // Estilo para conexiones normales
        graphics.lineStyle(3, 0x888888);
        
        // Dibujar todas las conexiones
        for (const connection of this.mapData.connections) {
            const fromNode = this.mapData.nodes.find(n => n.id === connection.from);
            const toNode = this.mapData.nodes.find(n => n.id === connection.to);
            
            // Dibujar la línea
            graphics.beginPath();
            graphics.moveTo(fromNode.x, fromNode.y);
            graphics.lineTo(toNode.x, toNode.y);
            graphics.strokePath();
            
            // Si la conexión es parte del camino disponible, resaltarla
            if (fromNode.visited && toNode.available) {
                const highlightGraphics = this.add.graphics();
                highlightGraphics.lineStyle(5, 0xffcc44);
                highlightGraphics.beginPath();
                highlightGraphics.moveTo(fromNode.x, fromNode.y);
                highlightGraphics.lineTo(toNode.x, toNode.y);
                highlightGraphics.strokePath();
                
                this.mapContainer.add(highlightGraphics);
            }
        }
        
        // Añadir el gráfico al contenedor del mapa
        this.mapContainer.add(graphics);
    }
    
    updateAvailablePaths() {
        // Marcar como disponibles los nodos conectados a nodos visitados
        const currentNode = this.mapData.nodes.find(n => n.id === this.mapData.currentNodeId);
        const visitedNodeIds = this.mapData.nodes.filter(n => n.visited).map(n => n.id);
        
        // Buscar conexiones desde nodos visitados
        for (const connection of this.mapData.connections) {
            if (visitedNodeIds.includes(connection.from)) {
                const targetNode = this.mapData.nodes.find(n => n.id === connection.to);
                
                // Marcar como disponible si no ha sido visitado
                if (!targetNode.visited) {
                    targetNode.available = true;
                }
            }
        }
    }
    
    getMapScale() {
        // Calcular escala óptima según el tamaño del mapa
        const mapWidth = 1000; // Ancho aproximado del mapa completo
        const mapHeight = 700; // Alto aproximado del mapa completo
        
        const scaleX = this.cameras.main.width / mapWidth;
        const scaleY = this.cameras.main.height / mapHeight;
        
        // Usar la escala más restrictiva
        return Math.min(scaleX, scaleY) * 0.85; // 85% para dejar margen
    }
    
    centerMapOnCurrentNode() {
        // Buscar el nodo actual
        const currentNode = this.mapData.nodes.find(n => n.id === this.mapData.currentNodeId);
        
        if (currentNode) {
            // Centrar el mapa en este nodo
            this.mapContainer.x = this.cameras.main.width / 2 - currentNode.x * this.mapContainer.scale;
            this.mapContainer.y = this.cameras.main.height / 2 - currentNode.y * this.mapContainer.scale;
        }
    }
    
    showNodeInfo(node) {
        // Crear panel de información
        this.hideNodeInfo(); // Eliminar panel anterior si existe
        
        this.nodeInfoPanel = this.add.container(this.cameras.main.width / 2, 100);
        
        // Fondo del panel
        const panelBg = this.add.rectangle(0, 0, 300, 80, 0x000000, 0.7)
            .setStrokeStyle(2, 0xffcc44);
        
        // Título según el tipo de nodo
        let title;
        switch (node.type) {
            case 'start':
                title = 'Punto de Inicio';
                break;
            case 'combat':
                title = 'Combate';
                break;
            case 'elite':
                title = 'Enemigo Élite';
                break;
            case 'event':
                title = 'Evento';
                break;
            case 'shop':
                title = 'Tienda';
                break;
            case 'rest':
                title = 'Punto de Descanso';
                break;
            case 'boss':
                title = 'Jefe';
                break;
            default:
                title = 'Desconocido';
        }
        
        // Texto del título
        const titleText = this.add.text(0, -20, title, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffcc44'
        }).setOrigin(0.5);
        
        // Descripción adicional si está disponible
        let descriptionText;
        
        if (node.type === 'combat' && node.data.enemies) {
            const enemyNames = node.data.enemies.map(e => e.name).join(', ');
            descriptionText = this.add.text(0, 10, `Enemigos: ${enemyNames}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ffffff'
            }).setOrigin(0.5);
        } else if (node.type === 'elite' && node.data.enemies) {
            descriptionText = this.add.text(0, 10, `Élite: ${node.data.enemies[0].name}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ffaaaa'
            }).setOrigin(0.5);
        } else if (node.type === 'boss' && node.data.boss) {
            descriptionText = this.add.text(0, 10, `Jefe: ${node.data.boss.name}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#ff5555'
            }).setOrigin(0.5);
        } else {
            descriptionText = this.add.text(0, 10, `Clic para visitar`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#aaaaff'
            }).setOrigin(0.5);
        }
        
        // Añadir elementos al panel
        this.nodeInfoPanel.add([panelBg, titleText, descriptionText]);
        
        // Animar entrada
        this.nodeInfoPanel.alpha = 0;
        this.tweens.add({
            targets: this.nodeInfoPanel,
            alpha: 1,
            y: 80,
            duration: 200,
            ease: 'Power1'
        });
    }
    
    hideNodeInfo() {
        if (this.nodeInfoPanel) {
            this.tweens.add({
                targets: this.nodeInfoPanel,
                alpha: 0,
                y: 60,
                duration: 200,
                ease: 'Power1',
                onComplete: () => {
                    this.nodeInfoPanel.destroy();
                    this.nodeInfoPanel = null;
                }
            });
        }
    }
    
    selectNode(node) {
        // Verificar si el nodo es accesible
        if (!node.available) return;
        
        // Reproducir sonido
        if (window.dataManager && window.dataManager.audioManager) {
            window.dataManager.audioManager.playSound('click');
        }
        
        // Actualizar estado del mapa
        node.visited = true;
        node.available = false;
        this.mapData.currentNodeId = node.id;
        this.gameData.setMapForFloor(this.currentFloor, this.mapData);
        
        // Guardar juego
        this.gameData.saveGame();
        
        // Ir a la escena correspondiente según tipo de nodo
        switch (node.type) {
            case 'combat':
                this.scene.start('CombatScene', {
                    enemies: node.data.enemies,
                    encounterType: 'normal',
                    nextScene: 'MapScene'
                });
                break;
                
            case 'elite':
                this.scene.start('CombatScene', {
                    enemies: node.data.enemies,
                    encounterType: 'elite',
                    nextScene: 'MapScene',
                    rewards: {
                        credits: 25,
                        cards: this.gameData.getRandomCards(3, 'uncommon'),
                        artifact: Math.random() < 0.3 ? this.gameData.getRandomArtifact('uncommon') : null
                    }
                });
                break;
                
            case 'event':
                this.scene.start('EventScene', {
                    eventId: node.data.eventId,
                    nextScene: 'MapScene'
                });
                break;
                
            case 'shop':
                this.scene.start('ShopScene', {
                    inventory: node.data.inventory,
                    nextScene: 'MapScene'
                });
                break;
                
            case 'rest':
                this.scene.start('RestScene', {
                    options: node.data.options,
                    nextScene: 'MapScene'
                });
                break;
                
            case 'boss':
                this.scene.start('CombatScene', {
                    enemies: [node.data.boss],
                    encounterType: 'boss',
                    nextScene: this.currentFloor < 3 ? 'MapTransitionScene' : 'VictoryScene',
                    rewards: {
                        credits: 100,
                        cards: this.gameData.getRandomCards(3, 'rare'),
                        artifact: this.gameData.getRandomArtifact('boss', node.data.boss.id)
                    }
                });
                break;
        }
    }
    
    createUI() {
        // Contenedor para UI
        this.uiContainer = this.add.container(0, 0);
        
        // Panel superior con información
        const topPanel = this.add.rectangle(0, 0, this.cameras.main.width, 60, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setStrokeStyle(1, 0x444444);
        
        // Información del piso
        const floorText = this.add.text(20, 20, `Piso ${this.currentFloor}`, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Información del jugador
        const playerInfo = this.add.container(this.cameras.main.width / 2, 30);
        
        // Salud
        const healthIcon = this.add.image(0, 0, 'icon-health').setScale(0.6);
        const healthText = this.add.text(25, 0, `${this.player.health}/${this.player.maxHealth}`, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ff6666'
        }).setOrigin(0, 0.5);
        
        // Créditos
        const creditIcon = this.add.image(100, 0, 'icon-credit').setScale(0.6);
        const creditText = this.add.text(125, 0, `${this.player.credits}`, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffff44'
        }).setOrigin(0, 0.5);
        
        playerInfo.add([healthIcon, healthText, creditIcon, creditText]);
        
        // Botones
        const deckButton = this.createButton(this.cameras.main.width - 180, 30, 'Ver Mazo', () => {
            this.showDeckView();
        });
        
        const menuButton = this.createButton(this.cameras.main.width - 60, 30, 'Menú', () => {
            this.showGameMenu();
        });
        
        // Añadir elementos a la UI
        this.uiContainer.add([topPanel, floorText, playerInfo, deckButton, menuButton]);
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const buttonBg = this.add.rectangle(0, 0, text.length * 14, 40, 0x333355)
            .setStrokeStyle(2, 0x4444ff);
        
        const buttonText = this.add.text(0, 0, text, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        button.add([buttonBg, buttonText]);
        
        // Interacción
        button.setInteractive(new Phaser.Geom.Rectangle(-(text.length * 7), -20, text.length * 14, 40), Phaser.Geom.Rectangle.Contains);
        
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
            callback();
        });
        
        return button;
    }
    
    showDeckView() {
        // Crear panel de vista de mazo
        const deckPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo
        const panelBg = this.add.rectangle(0, 0, 1000, 600, 0x000000, 0.9)
            .setStrokeStyle(2, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -260, 'TU MAZO', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        deckPanel.add([panelBg, titleText]);
        
        // Obtener cartas del mazo
        const cards = this.gameData.deckManager.getAllCards();
        const cardsPerRow = 5;
        const cardSpacing = { x: 180, y: 220 };
        const startPos = { x: -450, y: -180 };
        
        // Mostrar cada carta
        for (let i = 0; i < cards.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            
            const x = startPos.x + col * cardSpacing.x;
            const y = startPos.y + row * cardSpacing.y;
            
            const cardUI = this.createCardUI(cards[i], x, y);
            deckPanel.add(cardUI);
        }
        
        // Botón cerrar
        const closeButton = this.createButton(0, 250, 'CERRAR', () => {
            // Animación de salida
            this.tweens.add({
                targets: deckPanel,
                alpha: 0,
                scale: 0.9,
                duration: 200,
                onComplete: () => {
                    deckPanel.destroy();
                }
            });
        });
        
        deckPanel.add(closeButton);
        
        // Animación de entrada
        deckPanel.setScale(0.9);
        deckPanel.alpha = 0;
        
        this.tweens.add({
            targets: deckPanel,
            scale: 1,
            alpha: 1,
            duration: 200
        });
    }
    
    createCardUI(card, x, y) {
        const cardContainer = this.add.container(x, y);
        
        // Fondo de la carta con color según equipo
        let cardColor;
        switch (card.team) {
            case 'red':
                cardColor = 0xffcccc;
                break;
            case 'blue':
                cardColor = 0xccccff;
                break;
            case 'purple':
                cardColor = 0xeeccff;
                break;
            default:
                cardColor = 0xffffff;
        }
        
        const cardBg = this.add.rectangle(0, 0, 160, 200, cardColor, 1)
            .setStrokeStyle(2, 0x000000);
        
        // Nombre
        const nameText = this.add.text(0, -80, card.name, {
            fontFamily: 'Pirata One, cursive',
            fontSize: '16px',
            color: '#000000'
        }).setOrigin(0.5);
        
        // Coste
        const costText = this.add.text(60, -80, card.cost.toString(), {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Tipo
        const typeText = this.add.text(-60, -80, this.getCardTypeText(card.type), {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#000000'
        }).setOrigin(0.5);
        
        // Descripción
        const descriptionText = this.add.text(0, 0, card.description, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#000000',
            wordWrap: { width: 140 }
        }).setOrigin(0.5);
        
        cardContainer.add([cardBg, nameText, costText, typeText, descriptionText]);
        
        return cardContainer;
    }
    
    getCardTypeText(type) {
        switch (type) {
            case 'attack':
                return 'Ataque';
            case 'skill':
                return 'Habilidad';
            case 'power':
                return 'Poder';
            default:
                return 'Desconocido';
        }
    }
    
    showGameMenu() {
        // Crear panel de menú
        const menuPanel = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Fondo
        const panelBg = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.9)
            .setStrokeStyle(2, 0x4444ff);
        
        // Título
        const titleText = this.add.text(0, -120, 'MENÚ', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '36px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        menuPanel.add([panelBg, titleText]);
        
        // Botones
        const resumeButton = this.createButton(0, -40, 'Reanudar', () => {
            menuPanel.destroy();
        });
        
        const saveButton = this.createButton(0, 20, 'Guardar', () => {
            this.gameData.saveGame();
            menuPanel.destroy();
        });
        
        const exitButton = this.createButton(0, 80, 'Salir', () => {
            this.scene.start('MainMenuScene');
        });
        
        menuPanel.add([resumeButton, saveButton, exitButton]);
        
        // Animación de entrada
        menuPanel.setScale(0.9);
        menuPanel.alpha = 0;
        
        this.tweens.add({
            targets: menuPanel,
            scale: 1,
            alpha: 1,
            duration: 200
        });
    }
}