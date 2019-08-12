const express = require('express')
const proxy = require('express-http-proxy')
const socketIo = require('socket.io')
const line = require('@line/bot-sdk')
const http = require('http')

const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
}
const targetUrl = process.env.LINE_WEBHOOK_URL || 'www.google.com'
const targetPort = process.env.LINE_WEBHOOK_PORT || '80'

const app = express()
const port = process.env.PORT || 3100
const server = http.createServer(app)
const io = socketIo(server)
let socket = null

server.listen(port)

app.use('/proxy', proxy(targetUrl, {
  https: false,
  port: parseInt(targetPort)
}))

app.post('/linewebhook/socket', line.middleware(lineConfig), (req, res) => {
  if (socket !== null) {
    socket.emit('webhook-body', req.body)
    res.json('success')
  }
})

io.on('connection', socketConnection => {
  console.log('a user connected thorough socket')
  socket = socketConnection
})
