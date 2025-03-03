/**
 * Sistema de audio para Cybervania
 */
export class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        
        // Volúmenes entre 0 y 1
        this.volumes = {
            master: 1.0,
            music: 0.7,
            sfx: 0.8
        };
        
        // Tracks de audio cargados
        this.tracks = {};
        
        // Reproductor de música actual
        this.currentMusic = null;
        
        // Inicializar si es compatible
        this.initialize();
    }
    
    /**
     * Inicializa el sistema de audio
     */
    initialize() {
        try {
            // Crear contexto de audio
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.warn('AudioContext no soportado en este navegador');
                return false;
            }
            
            this.context = new AudioContext();
            
            // Configurar nodos de ganancia
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            
            this.musicGain = this.context.createGain();
            this.musicGain.connect(this.masterGain);
            
            this.sfxGain = this.context.createGain();
            this.sfxGain.connect(this.masterGain);
            
            // Aplicar volúmenes iniciales
            this.setMasterVolume(this.volumes.master);
            this.setMusicVolume(this.volumes.music);
            this.setSFXVolume(this.volumes.sfx);
            
            console.log('Sistema de audio inicializado correctamente');
            return true;
            
        } catch (e) {
            console.error('Error inicializando el sistema de audio:', e);
            return false;
        }
    }
    
    /**
     * Verifica si el sistema de audio está activo
     */
    isReady() {
        return !!this.context;
    }
    
    /**
     * Resume el contexto de audio (necesario en navegadores modernos)
     */
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume().then(() => {
                console.log('Contexto de audio activado');
            });
        }
    }
    
    /**
     * Carga un archivo de audio y lo almacena en memoria
     */
    loadTrack(id, url, type = 'sfx') {
        // Evitar cargar duplicados
        if (this.tracks[id]) return;
        
        // Carga mediante promesas
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.tracks[id] = {
                    buffer: audioBuffer,
                    type: type
                };
                console.log(`Audio '${id}' cargado correctamente`);
            })
            .catch(error => {
                console.error(`Error cargando audio '${id}':`, error);
            });
    }
    
    /**
     * Reproductor de efectos de sonido
     */
    playSound(id) {
        if (!this.isReady() || !this.tracks[id]) {
            console.warn(`No se puede reproducir sonido '${id}'`);
            return null;
        }
        
        try {
            // Crear nodo de fuente
            const source = this.context.createBufferSource();
            source.buffer = this.tracks[id].buffer;
            
            // Conectar al nodo de ganancia correcto
            const gainNode = this.tracks[id].type === 'music' ? this.musicGain : this.sfxGain;
            source.connect(gainNode);
            
            // Reproducir
            source.start(0);
            return source;
            
        } catch (e) {
            console.error(`Error reproduciendo '${id}':`, e);
            return null;
        }
    }
    
    /**
     * Reproduce música con opciones de loop
     */
    playMusic(id, options = { loop: true, fadeIn: 1 }) {
        if (!this.isReady() || !this.tracks[id]) {
            console.warn(`No se puede reproducir música '${id}'`);
            return;
        }
        
        // Si ya estamos reproduciendo esta música, salir
        if (this.currentMusic && this.currentMusic.id === id) return;
        
        // Detener música anterior si existe
        this.stopMusic();
        
        try {
            // Crear fuente de buffer
            const source = this.context.createBufferSource();
            source.buffer = this.tracks[id].buffer;
            source.loop = options.loop;
            
            // Fade-in opcional
            if (options.fadeIn > 0) {
                const currentTime = this.context.currentTime;
                this.musicGain.gain.setValueAtTime(0, currentTime);
                this.musicGain.gain.linearRampToValueAtTime(
                    this.volumes.music, 
                    currentTime + options.fadeIn
                );
            }
            
            // Conectar y reproducir
            source.connect(this.musicGain);
            source.start(0);
            
            // Guardar referencia
            this.currentMusic = {
                id: id,
                source: source,
                startTime: this.context.currentTime
            };
            
            console.log(`Música '${id}' iniciada`);
            
        } catch (e) {
            console.error(`Error reproduciendo música '${id}':`, e);
        }
    }
    
    /**
     * Detiene la música actual con fade opcional
     */
    stopMusic(fadeOut = 1) {
        if (!this.currentMusic) return;
        
        try {
            const source = this.currentMusic.source;
            
            // Fade-out opcional
            if (fadeOut > 0) {
                const currentTime = this.context.currentTime;
                this.musicGain.gain.setValueAtTime(this.volumes.music, currentTime);
                this.musicGain.gain.linearRampToValueAtTime(0, currentTime + fadeOut);
                
                // Detener después del fade
                setTimeout(() => {
                    source.stop(0);
                }, fadeOut * 1000);
                
            } else {
                // Detener inmediatamente
                source.stop(0);
            }
            
            this.currentMusic = null;
            
        } catch (e) {
            console.error('Error al detener música:', e);
            this.currentMusic = null;
        }
    }
    
    /**
     * Pausa la música actual
     */
    pauseMusic() {
        if (!this.currentMusic) return;
        
        try {
            this.currentMusic.source.stop(0);
            this.currentMusic.pauseTime = this.context.currentTime - this.currentMusic.startTime;
            console.log(`Música pausada en ${this.currentMusic.pauseTime}`);
        } catch (e) {
            console.error('Error al pausar música:', e);
        }
    }
    
    /**
     * Ajusta el volumen maestro
     */
    setMasterVolume(volume) {
        if (!this.isReady()) return;
        
        volume = Math.max(0, Math.min(1, volume));
        this.volumes.master = volume;
        this.masterGain.gain.value = volume;
    }
    
    /**
     * Ajusta el volumen de música
     */
    setMusicVolume(volume) {
        if (!this.isReady()) return;
        
        volume = Math.max(0, Math.min(1, volume));
        this.volumes.music = volume;
        this.musicGain.gain.value = volume;
    }
    
    /**
     * Ajusta el volumen de efectos
     */
    setSFXVolume(volume) {
        if (!this.isReady()) return;
        
        volume = Math.max(0, Math.min(1, volume));
        this.volumes.sfx = volume;
        this.sfxGain.gain.value = volume;
    }
    
    /**
     * Precarga efectos de sonido comunes
     */
    preloadCommonSounds() {
        // Cargar sonidos de la interfaz
        this.loadTrack('menu_hover', 'assets/audio/sfx/menu_hover.mp3', 'sfx');
        this.loadTrack('menu_select', 'assets/audio/sfx/menu_select.mp3', 'sfx');
        this.loadTrack('menu_back', 'assets/audio/sfx/menu_back.mp3', 'sfx');
        
        // Cargar música
        this.loadTrack('menu_theme', 'assets/audio/music/menu_theme.mp3', 'music');
    }
}

// Instancia global para acceso desde cualquier parte
let audioManagerInstance = null;

export function getAudioManager() {
    if (!audioManagerInstance) {
        audioManagerInstance = new AudioManager();
    }
    return audioManagerInstance;
}
