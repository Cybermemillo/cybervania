/**
 * Utilidad para gestionar la carga de recursos con placeholders para desarrollo
 */
export class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.baseColor = 0x3333cc;
        this.missingAssets = []; // Registro de assets faltantes
    }

    /**
     * Carga una imagen con fallback a un placeholder si no existe
     * @param {string} key - Clave del asset
     * @param {string} path - Ruta de la imagen
     * @param {number} color - Color hexadecimal para el placeholder (opcional)
     */
    loadImageWithPlaceholder(key, path, color = null) {
        // Intentar cargar la imagen real primero
        this.scene.load.image(key, path);
        
        // Preparar generador de placeholder
        this.scene.load.on('fileerror-image-' + key, () => {
            // Registrar el asset faltante
            this.missingAssets.push({ type: 'image', key, path });
            
            // Crear imagen de placeholder
            const placeholderColor = color || this.getColorForType(key);
            this.createPlaceholderImage(key, placeholderColor);
        });
    }
    
    /**
     * Carga un audio con manejo de error silencioso
     * @param {string} key - Clave del asset
     * @param {string} path - Ruta del audio
     */
    loadAudioSilently(key, path) {
        // Intentar cargar el audio, pero manejar el error silenciosamente
        this.scene.load.audio(key, path);
        
        this.scene.load.on('fileerror-audio-' + key, () => {
            // Registrar el asset faltante
            this.missingAssets.push({ type: 'audio', key, path });
            
            // No es necesario cargar un reemplazo ya que Howler maneja los errores
        });
    }
    
    /**
     * Carga un spritesheet con fallback a un placeholder
     * @param {string} key - Clave del asset
     * @param {string} path - Ruta del spritesheet
     * @param {object} frameConfig - Configuración de frames
     * @param {number} color - Color hexadecimal para el placeholder (opcional)
     */
    loadSpritesheetWithPlaceholder(key, path, frameConfig, color = null) {
        // Intentar cargar el spritesheet real primero
        this.scene.load.spritesheet(key, path, frameConfig);
        
        // Preparar generador de placeholder
        this.scene.load.on('fileerror-spritesheet-' + key, () => {
            // Registrar el asset faltante
            this.missingAssets.push({ type: 'spritesheet', key, path, frameConfig });
            
            // Crear spritesheet placeholder
            const placeholderColor = color || this.getColorForType(key);
            this.createPlaceholderSpritesheet(key, frameConfig, placeholderColor);
        });
    }
    
    /**
     * Crea una imagen placeholder y la agrega a la caché
     * @private
     */
    createPlaceholderImage(key, color) {
        // Crear una textura temporal de 64x64
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Dibujar un rectángulo con borde
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, 64, 64);
        graphics.lineStyle(2, 0xffffff, 0.8);
        graphics.strokeRect(1, 1, 62, 62);
        
        // Añadir texto indicativo
        const text = key.substring(0, 8); // Primeros 8 caracteres de la clave
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(2, 25, 60, 14);
        
        // Generar la textura
        graphics.generateTexture(key, 64, 64);
        graphics.destroy();
        
        console.warn(`Asset no encontrado: ${key}. Se ha generado un placeholder.`);
    }
    
    /**
     * Crea un spritesheet placeholder para animaciones
     * @private
     */
    createPlaceholderSpritesheet(key, frameConfig, color) {
        const { frameWidth, frameHeight } = frameConfig;
        const frameCount = 6; // Suficiente para animaciones básicas
        
        // Crear un canvas para el spritesheet
        const width = frameCount * frameWidth;
        const height = frameHeight;
        
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, width, height);
        
        // Crear frames visualmente diferentes
        for (let i = 0; i < frameCount; i++) {
            const x = i * frameWidth;
            
            // Borde
            graphics.lineStyle(2, 0xffffff, 0.8);
            graphics.strokeRect(x + 1, 1, frameWidth - 2, frameHeight - 2);
            
            // Dibujar algo diferente en cada frame para simular animación
            graphics.fillStyle(0xffffff, 0.6);
            
            // Dibujo diferente según el frame
            if (i % 3 === 0) {
                graphics.fillCircle(x + frameWidth/2, frameHeight/2, frameWidth/4);
            } else if (i % 3 === 1) {
                graphics.fillRect(x + frameWidth/4, frameHeight/4, frameWidth/2, frameHeight/2);
            } else {
                graphics.fillTriangle(
                    x + frameWidth/2, frameHeight/4,
                    x + frameWidth/4, frameHeight * 3/4,
                    x + frameWidth * 3/4, frameHeight * 3/4
                );
            }
            
            // Número de frame para depuración
            graphics.fillStyle(0x000000, 1);
            graphics.fillRect(x + 2, 2, 16, 16);
            
            // No se puede añadir texto en graphics directamente,
            // pero para un placeholder esto es suficiente
        }
        
        // Generar textura
        graphics.generateTexture(key, width, height);
        graphics.destroy();
        
        console.warn(`Spritesheet no encontrado: ${key}. Se ha generado un placeholder.`);
    }
    
    /**
     * Obtiene un color basado en el tipo de asset
     * @private
     */
    getColorForType(key) {
        if (key.includes('enemy') || key.includes('boss')) {
            return 0xcc3333; // Rojo para enemigos
        }
        if (key.includes('card')) {
            return 0x33cc33; // Verde para cartas
        }
        if (key.includes('artifact')) {
            return 0xcccc33; // Amarillo para artefactos
        }
        if (key.includes('bg') || key.includes('background')) {
            return 0x333333; // Gris oscuro para fondos
        }
        if (key.includes('ui')) {
            return 0x3333cc; // Azul para UI
        }
        if (key.includes('event')) {
            return 0xcc33cc; // Púrpura para eventos
        }
        if (key.includes('node')) {
            return 0x33cccc; // Cian para nodos
        }
        // Color por defecto
        return 0x5555aa;
    }
    
    /**
     * Muestra un reporte de assets faltantes en la consola
     */
    reportMissingAssets() {
        if (this.missingAssets.length === 0) {
            console.log('✅ Todos los assets se cargaron correctamente.');
            return;
        }
        
        console.warn(`⚠️ Se detectaron ${this.missingAssets.length} assets faltantes:`);
        
        // Agrupar por tipo
        const byType = {};
        this.missingAssets.forEach(asset => {
            if (!byType[asset.type]) {
                byType[asset.type] = [];
            }
            byType[asset.type].push(asset);
        });
        
        // Mostrar resumen por tipo
        for (const type in byType) {
            console.warn(`- ${type}: ${byType[type].length} assets faltantes`);
            
            // Mostrar los primeros 5 ejemplos de cada tipo
            byType[type].slice(0, 5).forEach(asset => {
                console.warn(`  · ${asset.key}: ${asset.path}`);
            });
            
            if (byType[type].length > 5) {
                console.warn(`  · ... y ${byType[type].length - 5} más`);
            }
        }
        
        console.warn('ℹ️ Se han utilizado placeholders para estos assets.');
    }
}
