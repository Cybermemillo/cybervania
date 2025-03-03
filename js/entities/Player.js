/**
 * Clase para el jugador del juego
 */
export class Player {
    constructor(data = {}) {
        // Datos básicos
        this.name = data.name || 'Hacker';
        this.gender = data.gender || 'male';
        this.specialization = data.specialization || 'neutral';
        this.backstory = data.backstory || '';
        
        // Estadísticas
        this.level = data.level || 1;
        this.experience = data.experience || 0;
        this.health = data.health || 100;
        this.maxHealth = data.maxHealth || 100;
        this.energy = data.energy || 100;
        this.maxEnergy = data.maxEnergy || 100;
        
        // Recursos
        this.credits = data.credits || 500;
        this.inventory = data.inventory || [];
        
        // Metadatos
        this.slot = data.slot || -1;
        this.lastSaved = data.lastSaved || new Date().toISOString();
        this.playTime = data.playTime || 0;
        
        // Ajustar estadísticas según especialización
        this.applySpecializationBonus();
    }
    
    applySpecializationBonus() {
        switch(this.specialization) {
            case 'red':
                // Bonus ofensivo (daño +25%, salud -5%, defensa -10%)
                this.attackBonus = 0.25;
                this.maxHealth = Math.round(this.maxHealth * 0.95);
                this.health = this.maxHealth;
                this.defenseBonus = -0.1;
                this.actionPoints = 3;
                break;
                
            case 'blue':
                // Bonus defensivo (salud +15%, defensa +20%, ataque -5%)
                this.maxHealth = Math.round(this.maxHealth * 1.15);
                this.health = this.maxHealth;
                this.defenseBonus = 0.2;
                this.attackBonus = -0.05;
                this.actionPoints = 3;
                break;
                
            case 'purple':
                // Equilibrado con acción extra (todo +5%)
                this.maxHealth = Math.round(this.maxHealth * 1.05);
                this.health = this.maxHealth;
                this.defenseBonus = 0.05;
                this.attackBonus = 0.05;
                this.actionPoints = 4;
                break;
                
            default:
                // Sin bonificaciones
                this.attackBonus = 0;
                this.defenseBonus = 0;
                this.actionPoints = 3;
        }
    }
    
    /**
     * Guarda el estado del jugador en un slot
     */
    save(slotIndex) {
        this.slot = slotIndex;
        this.lastSaved = new Date().toISOString();
        
        // Guardar en localStorage
        const saveData = this.serialize();
        localStorage.setItem(`cybervania_save_${slotIndex}`, JSON.stringify(saveData));
        
        // Actualizar información de slots
        const slots = Player.getSaveSlotInfo();
        slots[slotIndex] = {
            isEmpty: false,
            playerName: this.name,
            level: this.level,
            specialization: this.specialization,
            gender: this.gender,
            timestamp: new Date().getTime()
        };
        
        localStorage.setItem('cybervania_save_slots', JSON.stringify(slots));
        
        return true;
    }
    
    /**
     * Serializa el objeto para guardado
     */
    serialize() {
        return {
            name: this.name,
            gender: this.gender,
            specialization: this.specialization,
            backstory: this.backstory,
            level: this.level,
            experience: this.experience,
            health: this.health,
            maxHealth: this.maxHealth,
            energy: this.energy,
            maxEnergy: this.maxEnergy,
            credits: this.credits,
            inventory: this.inventory,
            slot: this.slot,
            lastSaved: this.lastSaved,
            playTime: this.playTime
        };
    }
    
    /**
     * Inicia una nueva partida
     */
    static startNewGame(name, specialization, gender, backstory = '') {
        return new Player({
            name,
            specialization,
            gender,
            backstory,
            slot: -1 // Aún no guardada
        });
    }
    
    /**
     * Carga una partida desde un slot
     */
    static loadGame(slotIndex) {
        try {
            const saveData = localStorage.getItem(`cybervania_save_${slotIndex}`);
            if (!saveData) return null;
            
            return new Player(JSON.parse(saveData));
        } catch (e) {
            console.error('Error cargando partida:', e);
            return null;
        }
    }
    
    /**
     * Obtiene información de los slots de guardado
     */
    static getSaveSlotInfo() {
        let slots;
        try {
            const slotsData = localStorage.getItem('cybervania_save_slots');
            slots = slotsData ? JSON.parse(slotsData) : [];
        } catch (e) {
            slots = [];
        }
        
        // Asegurar que tenemos 3 slots
        while (slots.length < 3) {
            slots.push({ isEmpty: true });
        }
        
        return slots;
    }
    
    /**
     * Obtiene el tema del menú principal (personalizado en futuras versiones)
     */
    static getMainMenuTheme() {
        return {
            title: "CYBERVANIA",
            subtitle: "Donde la oscuridad se encuentra con el código",
            uiElements: {
                menuFrameColor: "rgba(50, 10, 40, 0.9)",
                textGlowColor: "rgba(220, 20, 120, 0.6)",
                mistOpacity: "0.4",
                backgroundBlur: "5px",
                font: "'NeoGothic', 'Cinzel', serif",
                cursor: "default"
            },
            menuItems: [
                { id: "new-game", text: "Nueva Partida", icon: "glyph-plus" },
                { id: "load-game", text: "Cargar Partida", icon: "glyph-load" },
                { id: "options", text: "Opciones", icon: "glyph-gear" },
                { id: "exit", text: "Salir", icon: "glyph-power" }
            ],
            audio: {
                backgroundTrack: "menu_theme.mp3",
                hoverSound: "menu_hover.mp3",
                selectSound: "menu_select.mp3",
                backSound: "menu_back.mp3"
            },
            animations: {
                menuEntrance: "fade-from-mist",
                transitionEffect: "digital-dissolve"
            }
        };
    }
}
