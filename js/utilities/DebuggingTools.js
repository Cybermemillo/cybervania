/**
 * Utilidades para debugging y diagnóstico
 */
export class DebuggingTools {
    constructor() {
        this.logs = [];
        this.errors = [];
        this.warnings = [];
        this.maxLogs = 100;
        
        // Registra la versión del navegador y motor para diagnóstico
        this.browserInfo = this.getBrowserInfo();
        
        // Interceptar console.log para debugging
        this.setupConsoleOverrides();
    }
    
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            windowDimensions: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight
            }
        };
    }
    
    setupConsoleOverrides() {
        // Guardar las funciones originales
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        // Referencia a esta instancia
        const self = this;
        
        // Sobrescribir console.log
        console.log = function(...args) {
            // Llamar a la función original
            originalLog.apply(console, args);
            
            // Guardar en nuestro registro
            self.logs.push({
                timestamp: new Date(),
                message: args.map(arg => self.stringifyArg(arg)).join(' '),
                type: 'log'
            });
            
            // Limitar tamaño del log
            if (self.logs.length > self.maxLogs) {
                self.logs.shift();
            }
        };
        
        // Sobrescribir console.error
        console.error = function(...args) {
            // Llamar a la función original
            originalError.apply(console, args);
            
            // Guardar en nuestro registro de errores
            self.errors.push({
                timestamp: new Date(),
                message: args.map(arg => self.stringifyArg(arg)).join(' '),
                stack: new Error().stack,
                type: 'error'
            });
            
            // Guardar también en el log general
            self.logs.push({
                timestamp: new Date(),
                message: args.map(arg => self.stringifyArg(arg)).join(' '),
                type: 'error'
            });
            
            // Limitar tamaño
            if (self.errors.length > self.maxLogs) {
                self.errors.shift();
            }
            if (self.logs.length > self.maxLogs) {
                self.logs.shift();
            }
        };
        
        // Sobrescribir console.warn
        console.warn = function(...args) {
            // Llamar a la función original
            originalWarn.apply(console, args);
            
            // Guardar en nuestro registro de warnings
            self.warnings.push({
                timestamp: new Date(),
                message: args.map(arg => self.stringifyArg(arg)).join(' '),
                type: 'warning'
            });
            
            // Guardar también en el log general
            self.logs.push({
                timestamp: new Date(),
                message: args.map(arg => self.stringifyArg(arg)).join(' '),
                type: 'warning'
            });
            
            // Limitar tamaño
            if (self.warnings.length > self.maxLogs) {
                self.warnings.shift();
            }
            if (self.logs.length > self.maxLogs) {
                self.logs.shift();
            }
        };
    }
    
    stringifyArg(arg) {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        
        try {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return String(arg);
        } catch (e) {
            return '[Objeto no serializable]';
        }
    }
    
    checkPhaserVersion() {
        // Verificar si Phaser está definido
        if (typeof Phaser === 'undefined') {
            console.error('Phaser no está definido. ¿Se ha cargado correctamente la librería?');
            return null;
        }
        
        return {
            version: Phaser.VERSION,
            isWebGLSupported: Phaser.Device.Features.webGL,
            isCanvasSupported: Phaser.Device.Features.canvas,
            audioAPI: Phaser.Device.Audio
        };
    }
    
    checkHowlerVersion() {
        // Verificar si Howler está definido
        if (typeof Howler === 'undefined') {
            console.error('Howler no está definido. ¿Se ha cargado correctamente la librería?');
            return null;
        }
        
        return {
            version: Howler.VERSION,
            codecs: Howler._codecs,
            audioContext: Howler.ctx ? {
                state: Howler.ctx.state,
                sampleRate: Howler.ctx.sampleRate
            } : null
        };
    }
    
    // Método para mostrar UI de debug
    showDebugOverlay() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-overlay';
        debugDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 300px;
            height: 200px;
            background-color: rgba(0,0,0,0.7);
            color: white;
            font-family: monospace;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            overflow: auto;
        `;
        
        // Añadir información
        const phaserInfo = this.checkPhaserVersion();
        const howlerInfo = this.checkHowlerVersion();
        
        debugDiv.innerHTML = `
            <h3>Debug Info</h3>
            <div>Browser: ${this.browserInfo.userAgent}</div>
            <div>Phaser: ${phaserInfo ? phaserInfo.version : 'Not loaded'}</div>
            <div>Howler: ${howlerInfo ? howlerInfo.version : 'Not loaded'}</div>
            <div>Errors: ${this.errors.length}</div>
            <div>Warnings: ${this.warnings.length}</div>
            <button id="debug-close" style="margin-top:10px;padding:5px">Close</button>
        `;
        
        document.body.appendChild(debugDiv);
        
        // Botón para cerrar
        document.getElementById('debug-close').addEventListener('click', () => {
            document.body.removeChild(debugDiv);
        });
    }
    
    // Registro de errores para el juego
    logGameError(error) {
        this.errors.push({
            timestamp: new Date(),
            message: error.message || String(error),
            stack: error.stack,
            type: 'game_error'
        });
        
        console.error('Game Error:', error);
    }
    
    // Diagnóstico general del entorno de juego
    diagnose() {
        return {
            browser: this.browserInfo,
            phaser: this.checkPhaserVersion(),
            howler: this.checkHowlerVersion(),
            errors: this.errors.length,
            warnings: this.warnings.length,
            timestamp: new Date()
        };
    }
}

// Instancia global para debugging
window.debugTools = new DebuggingTools();

// Atajo para mostrar debug overlay
window.showDebug = function() {
    window.debugTools.showDebugOverlay();
};
