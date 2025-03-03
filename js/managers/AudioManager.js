export class AudioManager {
    constructor() {
        this.musicTracks = {};
        this.sounds = {};
        this.currentMusic = null;
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;
        this.musicEnabled = true;
        this.soundEnabled = true;
        
        // Estado de inicialización
        this.initialized = false;
        this.audioQueue = [];
        
        // Intento de inicialización en constructor (probablemente bloqueado)
        this.initializeAudio();
    }
    
    // Nueva función para inicializar audio después de interacción del usuario
    initializeAudio() {
        if (this.initialized) return;
        
        try {
            // Crear contexto de audio global para Howler
            if (Howler.ctx && Howler.ctx.state !== 'running') {
                Howler.ctx.resume().then(() => {
                    console.log('Contexto de audio de Howler iniciado');
                    this.initializeSounds();
                    this.initialized = true;
                    this.processAudioQueue();
                }).catch(err => {
                    console.error('Error al iniciar contexto de audio:', err);
                });
            } else {
                this.initializeSounds();
                this.initialized = true;
            }
        } catch (error) {
            console.error('Error al inicializar audio:', error);
            // Inicializar con sonidos mudos como fallback
            this.initializeSilentFallbacks();
        }
    }
    
    processAudioQueue() {
        while(this.audioQueue.length > 0) {
            const queuedAction = this.audioQueue.shift();
            if (queuedAction.type === 'music') {
                this._playMusic(queuedAction.key);
            } else if (queuedAction.type === 'sound') {
                this._playSound(queuedAction.key);
            }
        }
    }
    
    initializeSilentFallbacks() {
        // Crear objetos falsos para permitir que el juego siga funcionando sin audio
        this.initialized = true;
        this.dummyAudio = {
            play: () => {},
            stop: () => {},
            fade: () => {},
            volume: () => {}
        };
        
        // Música
        const musicList = ['main-theme', 'combat', 'boss', 'event', 'shop', 'game-over', 'victory'];
        musicList.forEach(key => {
            this.musicTracks[key] = this.dummyAudio;
        });
        
        // Efectos de sonido
        const soundList = ['click', 'card-play', 'card-draw', 'hover', 'enemy-hit', 'player-hurt', 
                          'defend', 'heal', 'buff', 'debuff', 'item-pickup', 'victory', 
                          'error', 'success', 'enemy-attack', 'level-up'];
        soundList.forEach(key => {
            this.sounds[key] = this.dummyAudio;
        });
    }
    
    initializeSounds() {
        // Música
        this.initMusicWithFallback('main-theme', 'assets/audio/music/main-theme.mp3');
        this.initMusicWithFallback('combat', 'assets/audio/music/combat.mp3');
        this.initMusicWithFallback('boss', 'assets/audio/music/boss.mp3');
        this.initMusicWithFallback('event', 'assets/audio/music/event.mp3');
        this.initMusicWithFallback('shop', 'assets/audio/music/shop.mp3');
        this.initMusicWithFallback('game-over', 'assets/audio/music/game-over.mp3');
        this.initMusicWithFallback('victory', 'assets/audio/music/victory.mp3');
        
        // Efectos de sonido
        this.initSoundWithFallback('click', 'assets/audio/sfx/click.mp3');
        this.initSoundWithFallback('card-play', 'assets/audio/sfx/card-play.mp3');
        this.initSoundWithFallback('card-draw', 'assets/audio/sfx/card-draw.mp3');
        this.initSoundWithFallback('hover', 'assets/audio/sfx/hover.mp3');
        this.initSoundWithFallback('enemy-hit', 'assets/audio/sfx/enemy-hit.mp3');
        this.initSoundWithFallback('player-hurt', 'assets/audio/sfx/player-hurt.mp3');
        this.initSoundWithFallback('defend', 'assets/audio/sfx/defend.mp3');
        this.initSoundWithFallback('heal', 'assets/audio/sfx/heal.mp3');
        this.initSoundWithFallback('buff', 'assets/audio/sfx/buff.mp3');
        this.initSoundWithFallback('debuff', 'assets/audio/sfx/debuff.mp3');
        this.initSoundWithFallback('item-pickup', 'assets/audio/sfx/item-pickup.mp3');
        this.initSoundWithFallback('victory', 'assets/audio/sfx/victory.mp3');
        this.initSoundWithFallback('error', 'assets/audio/sfx/error.mp3');
        this.initSoundWithFallback('success', 'assets/audio/sfx/success.mp3');
        this.initSoundWithFallback('enemy-attack', 'assets/audio/sfx/enemy-attack.mp3');
        this.initSoundWithFallback('level-up', 'assets/audio/sfx/level-up.mp3');
    }
    
    initMusicWithFallback(key, url) {
        try {
            // Opciones para prevenir errores de autoplay
            const options = {
                src: [url],
                html5: true,
                loop: true,
                volume: this.musicVolume,
                preload: true,
                autoplay: false
            };
            
            // Crear objeto de audio con manejo de errores
            this.musicTracks[key] = new Howl(options);
            
            // Manejar errores
            this.musicTracks[key].on('loaderror', () => {
                console.warn(`Error al cargar música: ${key}`);
                this.createDummyAudio(key, 'music');
            });
        } catch (error) {
            console.error(`Error al crear música ${key}:`, error);
            this.createDummyAudio(key, 'music');
        }
    }
    
    initSoundWithFallback(key, url) {
        try {
            // Opciones para prevenir errores de autoplay
            const options = {
                src: [url],
                volume: this.soundVolume,
                preload: true,
                autoplay: false
            };
            
            // Crear objeto de audio con manejo de errores
            this.sounds[key] = new Howl(options);
            
            // Manejar errores
            this.sounds[key].on('loaderror', () => {
                console.warn(`Error al cargar sonido: ${key}`);
                this.createDummyAudio(key, 'sound');
            });
        } catch (error) {
            console.error(`Error al crear sonido ${key}:`, error);
            this.createDummyAudio(key, 'sound');
        }
    }
    
    createDummyAudio(key, type) {
        const dummyAudio = {
            play: () => {},
            stop: () => {},
            fade: () => {},
            volume: () => {},
            _isDummy: true
        };
        
        if (type === 'music') {
            this.musicTracks[key] = dummyAudio;
        } else {
            this.sounds[key] = dummyAudio;
        }
    }
    
    playMusic(key) {
        // Intentar inicializar audio si aún no está listo
        if (!this.initialized) {
            this.audioQueue.push({type: 'music', key});
            this.initializeAudio();
            return;
        }
        
        // Método interno de reproducción
        this._playMusic(key);
    }
    
    _playMusic(key) {
        if (!this.musicEnabled) return;
        
        // No hacer nada si es la misma pista
        if (this.currentMusic === key) return;
        
        // Detener música anterior
        if (this.currentMusic && this.musicTracks[this.currentMusic] && !this.musicTracks[this.currentMusic]._isDummy) {
            this.musicTracks[this.currentMusic].stop();
        }
        
        // Reproducir nueva
        if (this.musicTracks[key] && !this.musicTracks[key]._isDummy) {
            this.currentMusic = key;
            try {
                this.musicTracks[key].volume(this.musicVolume);
                this.musicTracks[key].play();
            } catch (e) {
                console.warn(`Error reproduciendo música ${key}:`, e);
            }
        }
    }
    
    playSound(key) {
        // Intentar inicializar audio si aún no está listo
        if (!this.initialized) {
            this.audioQueue.push({type: 'sound', key});
            this.initializeAudio();
            return;
        }
        
        // Método interno de reproducción
        this._playSound(key);
    }
    
    _playSound(key) {
        if (!this.soundEnabled) return;
        
        if (this.sounds[key] && !this.sounds[key]._isDummy) {
            try {
                this.sounds[key].volume(this.soundVolume);
                this.sounds[key].play();
            } catch (e) {
                console.warn(`Error reproduciendo sonido ${key}:`, e);
            }
        }
    }
    
    stopMusic() {
        if (this.currentMusic && this.musicTracks[this.currentMusic] && !this.musicTracks[this.currentMusic]._isDummy) {
            this.musicTracks[this.currentMusic].stop();
            this.currentMusic = null;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.currentMusic && this.musicTracks[this.currentMusic] && !this.musicTracks[this.currentMusic]._isDummy) {
            this.musicTracks[this.currentMusic].volume(this.musicVolume);
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (!this.musicEnabled && this.currentMusic) {
            this.stopMusic();
        } else if (this.musicEnabled && this.currentMusic) {
            this.playMusic(this.currentMusic);
        }
        
        return this.musicEnabled;
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }
}
