import { createSocket } from 'dgram'

const server = createSocket('udp4')

server.on('error', (error) => {
  console.log('Error: ' + error)
})

server.on('message', (msg, info) => {
  console.log(`Received ${msg.length} bytes.`)
  console.log(`InternalIP: ${msg.toString()}`)
  console.log(`External IP: ${info.address}:${info.port}`)
  server.send(`take it back: ${msg}`, info.port, info.address,
    (err) => console.log('err:' + err))
})

server.on('listening', () => {
  const address = server.address()
  const port = address.port
  const family = address.family
  const ipaddr = address.address
  console.log('Server is listening at port: ' + port)
  console.log('Server ip :' + ipaddr)
  console.log('Server is IP4/IP6 : ' + family)
})

server.bind(5000)
