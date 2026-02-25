import { io } from 'socket.io-client'

class SocketService {
    constructor() {
        this.socket = null
        this.listeners = new Map()
    }

    connect(token) {
        if (this.socket) {
            this.disconnect()
        }

        this.socket = io('http://localhost:5000', {
            transports: ['polling'],
            query: { token }
        })

        this.socket.on('connect', () => {
            console.log('[WebSocket] 连接成功')
        })

        this.socket.on('disconnect', () => {
            console.log('[WebSocket] 连接断开')
        })

        this.socket.on('connected', (data) => {
            console.log('[WebSocket] 用户连接成功:', data)
        })

        this.socket.on('new_notification', (data) => {
            console.log('[WebSocket] 收到新通知:', data)
            this.emit('new_notification', data)
        })

        this.socket.on('error', (error) => {
            console.error('[WebSocket] 错误:', error)
        })
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event).push(callback)
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event)
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data))
        }
    }

    isConnected() {
        return this.socket && this.socket.connected
    }
}

export default new SocketService()
