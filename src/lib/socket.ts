import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    })
  }
  return socket
}

export const connectSocket = (token: string) => {
  const s = getSocket()
  s.auth = { token }
  s.connect()
}

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
}
