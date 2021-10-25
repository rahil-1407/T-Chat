const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages')

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'T-Chat Bot'

// Run when client connects
io.on('connection', (socket) => {
  // Welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to TChat!'))

  // Broadcast when a user connects
  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user has joined the chat'),
  )

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'))
  })

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg))
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
