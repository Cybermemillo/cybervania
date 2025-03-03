/**
 * Script para crear la estructura de directorios y assets placeholder
 * Ejecutar con Node.js: node create-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Estructura de directorios a crear
const directories = [
    'assets',
    'assets/images',
    'assets/images/backgrounds',
    'assets/images/cards',
    'assets/images/characters',
    'assets/images/effects',
    'assets/images/enemies',
    'assets/images/artifacts',
    'assets/images/events',
    'assets/images/map',
    'assets/images/ui',
    'assets/audio',
    'assets/audio/music',
    'assets/audio/sfx'
];

// Crear directorios si no existen
console.log('Creando estructura de directorios...');
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Creado: ${dir}`);
    } else {
        console.log(`✓ Ya existe: ${dir}`);
    }
});

// Crear placeholder SVG para imágenes
const createPlaceholderSVG = (fileName, text, bgColor = '#333', textColor = '#fff') => {
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
        console.log(`✓ Ya existe: ${fileName}`);
        return;
    }

    // Truncar texto si es muy largo
    const displayText = text.length > 15 ? text.substring(0, 12) + '...' : text;

    // Crear SVG básico
    const svg = `
        <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${bgColor}"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${displayText}</text>
        </svg>
    `;

    fs.writeFileSync(filePath, svg.trim());
    console.log(`✓ Creado: ${fileName}`);
};

// Crear placeholder audio para sonidos
const createPlaceholderAudio = (fileName) => {
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
        console.log(`✓ Ya existe: ${fileName}`);
        return;
    }

    // Crear un archivo MP3 mínimo (1KB de datos aleatorios)
    const buffer = Buffer.alloc(1024);
    buffer.fill(0);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Creado: ${fileName}`);
};

// Crear placeholders para fondos
console.log('\nCreando placeholders para fondos...');
createPlaceholderSVG('assets/images/backgrounds/menu_bg.jpg', 'MENU BG', '#221133');
createPlaceholderSVG('assets/images/backgrounds/digital_bg.jpg', 'DIGITAL BG', '#112244');
createPlaceholderSVG('assets/images/backgrounds/combat_bg.jpg', 'COMBAT BG', '#223322');
createPlaceholderSVG('assets/images/backgrounds/event_bg.jpg', 'EVENT BG', '#332222');
createPlaceholderSVG('assets/images/backgrounds/shop_bg.jpg', 'SHOP BG', '#222233');
createPlaceholderSVG('assets/images/backgrounds/rest_bg.jpg', 'REST BG', '#222222');

// Crear placeholders para UI
console.log('\nCreando placeholders para UI...');
createPlaceholderSVG('assets/images/ui/card_frame.png', 'CARD FRAME', '#335577');
createPlaceholderSVG('assets/images/ui/card_back.png', 'CARD BACK', '#553377');
createPlaceholderSVG('assets/images/cards/default.png', 'DEFAULT CARD', '#339977');
createPlaceholderSVG('assets/images/ui/health_icon.png', 'HEALTH', '#cc3333');
createPlaceholderSVG('assets/images/ui/credit_icon.png', 'CREDITS', '#cccc33');
createPlaceholderSVG('assets/images/ui/defense_icon.png', 'DEFENSE', '#3333cc');
createPlaceholderSVG('assets/images/ui/action_icon.png', 'ACTION', '#33cc33');

// Crear placeholders para nodos del mapa
console.log('\nCreando placeholders para nodos del mapa...');
createPlaceholderSVG('assets/images/map/node_start.png', 'START', '#33ff33');
createPlaceholderSVG('assets/images/map/node_combat.png', 'COMBAT', '#ff3333');
createPlaceholderSVG('assets/images/map/node_elite.png', 'ELITE', '#ffaa33');
createPlaceholderSVG('assets/images/map/node_event.png', 'EVENT', '#aa33ff');
createPlaceholderSVG('assets/images/map/node_shop.png', 'SHOP', '#3333ff');
createPlaceholderSVG('assets/images/map/node_rest.png', 'REST', '#33aaff');
createPlaceholderSVG('assets/images/map/node_boss.png', 'BOSS', '#ff3333');

// Crear placeholders para enemigos
console.log('\nCreando placeholders para enemigos...');
const enemies = [
    { file: 'gargoyle.png', name: 'GARGOYLE' },
    { file: 'mimic.png', name: 'MIMIC' },
    { file: 'vampire.png', name: 'VAMPIRE' },
    { file: 'executioner.png', name: 'EXECUTOR' },
    { file: 'trojan-knight.png', name: 'TROJAN' },
    { file: 'worm-serpent.png', name: 'WORM' },
    { file: 'botnet-swarm.png', name: 'BOTNET' },
    { file: 'ransomware-thief.png', name: 'THIEF' },
    { file: 'malware-golem.png', name: 'GOLEM', color: '#aa5500' },
    { file: 'logic-bomb-specter.png', name: 'SPECTER', color: '#5500aa' },
    { file: 'zero-day-dragon.png', name: 'DRAGON', color: '#00aa55' },
    { file: 'firewall-guardian.png', name: 'GUARDIAN', color: '#aa0000' },
    { file: 'ransomware-knight.png', name: 'KNIGHT', color: '#aa0055' },
    { file: 'threat-admin.png', name: 'ADMIN', color: '#550000' }
];

for (const enemy of enemies) {
    createPlaceholderSVG(
        `assets/images/enemies/${enemy.file}`, 
        enemy.name, 
        enemy.color || '#553333'
    );
}

// Crear placeholders para artefactos
console.log('\nCreando placeholders para artefactos...');
const artifacts = [
    'proxy-server.png', 'usb-booster.png', 'packet-sniffer.png', 
    'cached-memory.png', 'protocol-buffer.png', 'encryption-key.png', 
    'binary-optimizer.png', 'quantum-processor.png', 'vpn-shield.png', 
    'gpu-accelerator.png', 'rootkit-module.png', 'quantum-entangler.png', 
    'neural-implant.png', 'polymorphic-code.png', 'backdoor-access.png', 
    'firewall-core.png', 'ransomware-key.png', 'threat-database.png', 
    'digital-crown.png', 'castle-key.png', 'belnades-amulet.png'
];

for (const artifact of artifacts) {
    const name = artifact.replace('.png', '').replace(/-/g, ' ').toUpperCase();
    createPlaceholderSVG(`assets/images/artifacts/${artifact}`, name, '#333355');
}

// Crear placeholders para eventos
console.log('\nCreando placeholders para eventos...');
const events = [
    'abandoned-terminal.png', 'ctf-challenge.png', 'digital-shrine.png',
    'code-anomaly.png', 'encrypted-cache.png', 'hacker-merchant.png',
    'neural-interface.png', 'quantum-glitch.png', 'virtual-arena.png'
];

for (const event of events) {
    const name = event.replace('.png', '').replace(/-/g, ' ').toUpperCase();
    createPlaceholderSVG(`assets/images/events/${event}`, name, '#553355');
}

// Crear placeholders para efectos
console.log('\nCreando placeholders para efectos...');
const effects = ['hit.png', 'shield.png', 'heal.png', 'buff.png', 'debuff.png'];

for (const effect of effects) {
    const name = effect.replace('.png', '').toUpperCase();
    // Crear spritesheet sencilla para efectos (6 frames horizontales)
    const filePath = path.join(__dirname, `assets/images/effects/${effect}`);
    if (!fs.existsSync(filePath)) {
        const svg = `
            <svg width="384" height="64" xmlns="http://www.w3.org/2000/svg">
                <!-- Frame 1 -->
                <rect x="0" y="0" width="64" height="64" fill="#555"/>
                <text x="32" y="32" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle">${name} 1</text>
                
                <!-- Frame 2 -->
                <rect x="64" y="0" width="64" height="64" fill="#555"/>
                <text x="96" y="32" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle">${name} 2</text>
                
                <!-- Frame 3 -->
                <rect x="128" y="0" width="64" height="64" fill="#555"/>
                <text x="160" y="32" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle">${name} 3</text>
                
                <!-- Frame 4 -->
                <rect x="192" y="0" width="64" height="64" fill="#555"/>
                <text x="224" y="32" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle">${name} 4</text>
                
                <!-- Frame 5 -->
                <rect x="256" y="0" width="64" height="64" fill="#555"/>
                <text x="288" y="32" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle">${name} 5</text>
                
                <!-- Frame 6 -->
                <rect x="320" y="0" width="64" height="64" fill="#555"/>
                <text x="352" y="32" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle">${name} 6</text>
            </svg>
        `;
        fs.writeFileSync(filePath, svg.trim());
        console.log(`✓ Creado: assets/images/effects/${effect}`);
    } else {
        console.log(`✓ Ya existe: assets/images/effects/${effect}`);
    }
}

// Crear placeholder para personaje del jugador
console.log('\nCreando placeholder para personaje del jugador...');
const playerPath = path.join(__dirname, 'assets/images/characters/player.png');
if (!fs.existsSync(playerPath)) {
    const svg = `
        <svg width="768" height="128" xmlns="http://www.w3.org/2000/svg">
            <!-- Idle frames -->
            <rect x="0" y="0" width="128" height="128" fill="#335577"/>
            <text x="64" y="64" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dominant-baseline="middle">IDLE 1</text>
            
            <rect x="128" y="0" width="128" height="128" fill="#335577"/>
            <text x="192" y="64" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dominant-baseline="middle">IDLE 2</text>
            
            <rect x="256" y="0" width="128" height="128" fill="#335577"/>
            <text x="320" y="64" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dominant-baseline="middle">IDLE 3</text>
            
            <rect x="384" y="0" width="128" height="128" fill="#335577"/>
            <text x="448" y="64" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dominant-baseline="middle">IDLE 4</text>
            
            <!-- Attack frames -->
            <rect x="512" y="0" width="128" height="128" fill="#553333"/>
            <text x="576" y="64" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dominant-baseline="middle">ATTACK</text>
            
            <rect x="640" y="0" width="128" height="128" fill="#553333"/>
            <text x="704" y="64" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dominant-baseline="middle">ATTACK</text>
        </svg>
    `;
    fs.writeFileSync(playerPath, svg.trim());
    console.log(`✓ Creado: assets/images/characters/player.png`);
} else {
    console.log(`✓ Ya existe: assets/images/characters/player.png`);
}

// Crear placeholders para audio
console.log('\nCreando placeholders para audio...');
const musicFiles = [
    'main-theme.mp3', 'combat.mp3', 'boss.mp3', 'event.mp3', 
    'shop.mp3', 'game-over.mp3', 'victory.mp3'
];

const sfxFiles = [
    'click.mp3', 'card-play.mp3', 'card-draw.mp3', 'hover.mp3', 
    'enemy-hit.mp3', 'player-hurt.mp3', 'defend.mp3', 'heal.mp3', 
    'buff.mp3', 'debuff.mp3', 'item-pickup.mp3', 'victory.mp3', 
    'error.mp3', 'success.mp3', 'enemy-attack.mp3', 'level-up.mp3'
];

for (const music of musicFiles) {
    createPlaceholderAudio(`assets/audio/music/${music}`);
}

for (const sfx of sfxFiles) {
    createPlaceholderAudio(`assets/audio/sfx/${sfx}`);
}

console.log('\n✓ Proceso completo. ¡Los directorios y placeholders están listos!');
