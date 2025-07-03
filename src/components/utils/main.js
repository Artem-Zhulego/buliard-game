import { io } from 'socket.io-client'

class WebSocketClass {
    constructor() {
        this.socket = null
    }

    connect() {
        return

        this.socket = io('wss://api.billiards-telegram.xyz:8443', {
            query: {
                userId: "1038855897"
            }
        });

        this.socket.on('connect', () => {
            console.log(`[WSS] | Connected | ${this.socket.id}`);
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`[WSS] | Disconnect | ${reason}`)
            this.socket = null
        })
    }

    send(key, data) { 
        if (this.socket) {
            this.socket.emit(key, data)
        }
    }

    subscribe(name, callback) {
        this.socket.on(name, callback)
    }

    unsubscribe(name, callback) {
        this.socket.off(name, callback)
    }
}

const socket = new WebSocketClass()
export default socket