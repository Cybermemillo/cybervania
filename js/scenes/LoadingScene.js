import { AssetLoader } from '../utils/AssetLoader.js';

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Crear pantalla de carga
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Texto de carga
        this.loadingText = this.add.text(width / 2, height / 2 - 50, 'CARGANDO...', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Barra de progreso
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);
        
        // Textos informativos
        this.percentText = this.add.text(width / 2, height / 2 + 15, '0%', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.assetText = this.add.text(width / 2, height / 2 + 60, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Eventos de carga
        this.load.on('progress', (value) => {
            this.percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x4444ff, 1);
            progressBar.fillRect(width / 2 - 155, height / 2 + 5, 310 * value, 20);
        });
        
        this.load.on('fileprogress', (file) => {
            this.assetText.setText('Cargando: ' + file.key);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.loadingText.destroy();
            this.percentText.destroy();
            this.assetText.destroy();
            
            // Reportar assets faltantes
            this.assetLoader.reportMissingAssets();
            
            this.showStartButton();
        });
        
        // Inicializar el gestor de assets con placeholders
        this.assetLoader = new AssetLoader(this);
        
        // Cargar recursos con fallbacks
        this.loadAssetsWithPlaceholders();
    }
    
    loadAssetsWithPlaceholders() {
        // Fondos
        this.assetLoader.loadImageWithPlaceholder('bg-menu', 'assets/images/backgrounds/menu_bg.jpg', 0x221133);
        this.assetLoader.loadImageWithPlaceholder('bg-digital', 'assets/images/backgrounds/digital_bg.jpg', 0x112244);
        this.assetLoader.loadImageWithPlaceholder('bg-combat', 'assets/images/backgrounds/combat_bg.jpg', 0x223322);
        this.assetLoader.loadImageWithPlaceholder('bg-event', 'assets/images/backgrounds/event_bg.jpg', 0x332222);
        this.assetLoader.loadImageWithPlaceholder('bg-shop', 'assets/images/backgrounds/shop_bg.jpg', 0x222233);
        this.assetLoader.loadImageWithPlaceholder('bg-rest', 'assets/images/backgrounds/rest_bg.jpg', 0x222222);
        
        // UI
        this.assetLoader.loadImageWithPlaceholder('card-frame', 'assets/images/ui/card_frame.png');
        this.assetLoader.loadImageWithPlaceholder('card-back', 'assets/images/ui/card_back.png');
        this.assetLoader.loadImageWithPlaceholder('card-default', 'assets/images/cards/default.png');
        
        this.assetLoader.loadImageWithPlaceholder('icon-health', 'assets/images/ui/health_icon.png');
        this.assetLoader.loadImageWithPlaceholder('icon-credit', 'assets/images/ui/credit_icon.png');
        this.assetLoader.loadImageWithPlaceholder('icon-defense', 'assets/images/ui/defense_icon.png');
        this.assetLoader.loadImageWithPlaceholder('icon-action', 'assets/images/ui/action_icon.png');
        
        // Nodos de mapa
        this.assetLoader.loadImageWithPlaceholder('node-start', 'assets/images/map/node_start.png');
        this.assetLoader.loadImageWithPlaceholder('node-combat', 'assets/images/map/node_combat.png');
        this.assetLoader.loadImageWithPlaceholder('node-elite', 'assets/images/map/node_elite.png');
        this.assetLoader.loadImageWithPlaceholder('node-event', 'assets/images/map/node_event.png');
        this.assetLoader.loadImageWithPlaceholder('node-shop', 'assets/images/map/node_shop.png');
        this.assetLoader.loadImageWithPlaceholder('node-rest', 'assets/images/map/node_rest.png');
        this.assetLoader.loadImageWithPlaceholder('node-boss', 'assets/images/map/node_boss.png');
        
        // Enemigos
        this.assetLoader.loadImageWithPlaceholder('enemy-gargoyle', 'assets/images/enemies/gargoyle.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-mimic', 'assets/images/enemies/mimic.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-vampire', 'assets/images/enemies/vampire.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-executioner', 'assets/images/enemies/executioner.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-knight', 'assets/images/enemies/trojan-knight.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-serpent', 'assets/images/enemies/worm-serpent.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-swarm', 'assets/images/enemies/botnet-swarm.png');
        this.assetLoader.loadImageWithPlaceholder('enemy-thief', 'assets/images/enemies/ransomware-thief.png');
        
        // Jefes y élites
        this.assetLoader.loadImageWithPlaceholder('elite-golem', 'assets/images/enemies/malware-golem.png');
        this.assetLoader.loadImageWithPlaceholder('elite-specter', 'assets/images/enemies/logic-bomb-specter.png');
        this.assetLoader.loadImageWithPlaceholder('elite-dragon', 'assets/images/enemies/zero-day-dragon.png');
        this.assetLoader.loadImageWithPlaceholder('boss-guardian', 'assets/images/enemies/firewall-guardian.png');
        this.assetLoader.loadImageWithPlaceholder('boss-knight', 'assets/images/enemies/ransomware-knight.png');
        this.assetLoader.loadImageWithPlaceholder('boss-admin', 'assets/images/enemies/threat-admin.png');
        
        // Artefactos
        this.assetLoader.loadImageWithPlaceholder('artifact-proxy', 'assets/images/artifacts/proxy-server.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-usb', 'assets/images/artifacts/usb-booster.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-sniffer', 'assets/images/artifacts/packet-sniffer.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-cache', 'assets/images/artifacts/cached-memory.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-buffer', 'assets/images/artifacts/protocol-buffer.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-key', 'assets/images/artifacts/encryption-key.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-optimizer', 'assets/images/artifacts/binary-optimizer.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-processor', 'assets/images/artifacts/quantum-processor.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-vpn', 'assets/images/artifacts/vpn-shield.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-gpu', 'assets/images/artifacts/gpu-accelerator.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-rootkit', 'assets/images/artifacts/rootkit-module.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-entangler', 'assets/images/artifacts/quantum-entangler.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-implant', 'assets/images/artifacts/neural-implant.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-polymorph', 'assets/images/artifacts/polymorphic-code.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-backdoor', 'assets/images/artifacts/backdoor-access.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-firewall', 'assets/images/artifacts/firewall-core.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-ransomkey', 'assets/images/artifacts/ransomware-key.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-database', 'assets/images/artifacts/threat-database.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-crown', 'assets/images/artifacts/digital-crown.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-key-special', 'assets/images/artifacts/castle-key.png');
        this.assetLoader.loadImageWithPlaceholder('artifact-amulet', 'assets/images/artifacts/belnades-amulet.png');
        
        // Eventos
        this.assetLoader.loadImageWithPlaceholder('event-terminal', 'assets/images/events/abandoned-terminal.png');
        this.assetLoader.loadImageWithPlaceholder('event-ctf', 'assets/images/events/ctf-challenge.png');
        this.assetLoader.loadImageWithPlaceholder('event-shrine', 'assets/images/events/digital-shrine.png');
        this.assetLoader.loadImageWithPlaceholder('event-anomaly', 'assets/images/events/code-anomaly.png');
        this.assetLoader.loadImageWithPlaceholder('event-cache', 'assets/images/events/encrypted-cache.png');
        this.assetLoader.loadImageWithPlaceholder('event-merchant', 'assets/images/events/hacker-merchant.png');
        this.assetLoader.loadImageWithPlaceholder('event-neural', 'assets/images/events/neural-interface.png');
        this.assetLoader.loadImageWithPlaceholder('event-quantum', 'assets/images/events/quantum-glitch.png');
        this.assetLoader.loadImageWithPlaceholder('event-arena', 'assets/images/events/virtual-arena.png');
        
        // Crear imagen de partícula usando gráficos:
        const particleTexture = this.make.graphics({ x: 0, y: 0, add: false });
        particleTexture.fillStyle(0xffffff, 1);
        particleTexture.fillCircle(4, 4, 4);
        particleTexture.generateTexture('particle', 8, 8);
        
        // Placeholders para spritesheets que usamos en animaciones
        this.assetLoader.loadSpritesheetWithPlaceholder(
            'effect-hit',
            'assets/images/effects/hit.png',
            { frameWidth: 64, frameHeight: 64 },
            0xff3333
        );
        
        this.assetLoader.loadSpritesheetWithPlaceholder(
            'effect-shield',
            'assets/images/effects/shield.png', 
            { frameWidth: 64, frameHeight: 64 },
            0x3333ff
        );
        
        this.assetLoader.loadSpritesheetWithPlaceholder(
            'effect-heal',
            'assets/images/effects/heal.png', 
            { frameWidth: 64, frameHeight: 64 },
            0x33ff33
        );
        
        this.assetLoader.loadSpritesheetWithPlaceholder(
            'effect-buff',
            'assets/images/effects/buff.png', 
            { frameWidth: 64, frameHeight: 64 },
            0xffff33
        );
        
        this.assetLoader.loadSpritesheetWithPlaceholder(
            'effect-debuff',
            'assets/images/effects/debuff.png', 
            { frameWidth: 64, frameHeight: 64 },
            0xff33ff
        );
        
        this.assetLoader.loadSpritesheetWithPlaceholder(
            'player',
            'assets/images/characters/player.png',
            { frameWidth: 128, frameHeight: 128 },
            0x33ffff
        );
    }
    
    create() {
        // Crear animaciones
        this.createAnimations();
        
        // Ir al menú principal
        this.scene.start('MainMenuScene');
    }
    
    createAnimations() {
        // Animaciones de efectos visuales
        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNumbers('effect-hit', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.anims.create({
            key: 'shield',
            frames: this.anims.generateFrameNumbers('effect-shield', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.anims.create({
            key: 'heal',
            frames: this.anims.generateFrameNumbers('effect-heal', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.anims.create({
            key: 'buff',
            frames: this.anims.generateFrameNumbers('effect-buff', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.anims.create({
            key: 'debuff',
            frames: this.anims.generateFrameNumbers('effect-debuff', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });
        
        // Animaciones del personaje
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player-attack',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.anims.create({
            key: 'player-hit',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
            frameRate: 5,
            repeat: 0
        });
    }
    
    showStartButton() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Crear botón de inicio
        const startButton = this.add.container(width/2, height/2 + 50);
        
        // Fondo del botón
        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x4444aa, 0.8)
            .setStrokeStyle(2, 0x8888ff);
        
        // Texto del botón
        const buttonText = this.add.text(0, 0, 'INICIAR', {
            fontFamily: 'Pirata One, cursive',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        startButton.add([buttonBg, buttonText]);
        
        // Hacer el botón interactivo
        startButton.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);
        
        // Eventos de hover
        startButton.on('pointerover', () => {
            buttonBg.setFillStyle(0x6666cc, 0.8);
        });
        
        startButton.on('pointerout', () => {
            buttonBg.setFillStyle(0x4444aa, 0.8);
        });
        
        // Evento de clic
        startButton.on('pointerdown', () => {
            buttonBg.setFillStyle(0x2222aa, 0.8);
        });
        
        startButton.on('pointerup', () => {
            // Ir al menú principal
            this.scene.start('MainMenuScene');
        });
        
        // Animar la aparición del botón
        startButton.setScale(0.5);
        startButton.alpha = 0;
        
        this.tweens.add({
            targets: startButton,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
}