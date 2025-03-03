/**
 * Clase que proporciona rutas normalizadas para los assets del juego
 * Ayuda a manejar diferentes formatos y placeholders
 */
export class AssetPaths {
    constructor() {
        // Base de rutas
        this.basePath = '/assets';
        
        // Formatos de archivo según tipo
        this.formats = {
            image: ['png', 'jpg', 'svg'],
            audio: ['mp3', 'ogg', 'wav']
        };
        
        // Placeholders por tipo
        this.placeholders = {
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABg0lEQVR4Xu2a0U0DMRBEZyogHdAJUAp0QiekBOgDhFIBFUAJUAJ0AqKDdMB6ythCyVk6SxaWPPPtxzt7Z51Fsu9wd+si4vJ4bTSR5+1+iMdxc7caXn89n6zcKrzGKdgGA+wAqGC+Fpw+4rGqBZ8Pj303wMQXowFm0AA7ALPAswoc1UgF+DHEw2B0zhygYqtRmAPsANQCz5XgNEfUnAOUpYrd4gDUCs6sA7y1mH3N5zqayulQiwMwF3BWgYxTkA8O9gE+Bs8JEA2wA1AreK4EpzWAUzA0wA5AreC5EpzWAE7B0AA7ALWC50rwWQU4BRvrACZyPYsD8NcKXvsU5F8CNMAOQK3guRI8qwDnL4EwB9gBqBU8V4LTGsApGBpgB6BW8FwJTmsAp2BogB2AWsFzJfisApyCjV+H9T/CbgjYAbgvA+wAzA7OnQCfguGHEDsAtYLnSnBaAzgFQwPsANQKnivBswr4FGxs78vs4NwJ+D8DTn4V/gJYjb8/ZfEXUwAAAABJRU5ErkJggg==',
            audio: null
        };
    }
    
    /**
     * Obtiene la ruta normalizada para una imagen
     * @param {string} key - Clave de identificación 
     * @param {string} subdir - Subdirectorio dentro de images/
     * @returns {string} - Ruta del asset
     */
    getImagePath(key, subdir = '') {
        return `${this.basePath}/images${subdir ? '/' + subdir : ''}/${key}`;
    }
    
    /**
     * Obtiene la ruta normalizada para un archivo de audio
     * @param {string} key - Clave de identificación 
     * @param {string} type - Tipo de audio (music o sfx)
     * @returns {string} - Ruta del asset
     */
    getAudioPath(key, type = 'sfx') {
        return `${this.basePath}/audio/${type}/${key}`;
    }
    
    /**
     * Obtiene el placeholder para cuando un asset no está disponible
     * @param {string} type - Tipo de asset (image o audio)
     * @returns {string|null} - URL del placeholder o null
     */
    getPlaceholder(type) {
        return this.placeholders[type] || null;
    }
    
    /** 
     * Rutas específicas para diferentes tipos de assets 
     * Métodos utilitarios
     */
    
    // Backgrounds
    getBackgroundPath(key) {
        return this.getImagePath(key, 'backgrounds');
    }
    
    // Personajes
    getCharacterPath(key) {
        return this.getImagePath(key, 'characters');
    }
    
    // Enemigos
    getEnemyPath(key) {
        return this.getImagePath(key, 'enemies');
    }
    
    // UI
    getUIPath(key) {
        return this.getImagePath(key, 'ui');
    }
    
    // Efectos
    getEffectPath(key) {
        return this.getImagePath(key, 'effects');
    }
    
    // Artefactos
    getArtifactPath(key) {
        return this.getImagePath(key, 'artifacts');
    }
    
    // Cartas
    getCardPath(key) {
        return this.getImagePath(key, 'cards');
    }
    
    // Nodos del mapa
    getMapNodePath(key) {
        return this.getImagePath(key, 'map');
    }
    
    // Eventos
    getEventPath(key) {
        return this.getImagePath(key, 'events');
    }
    
    // Música
    getMusicPath(key) {
        return this.getAudioPath(key, 'music');
    }
    
    // Efectos de sonido
    getSfxPath(key) {
        return this.getAudioPath(key, 'sfx');
    }
}

// Crear instancia singleton
export const assetPaths = new AssetPaths();
