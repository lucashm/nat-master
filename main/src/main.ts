import { createSocket } from 'dgram'
import { stringify } from 'querystring'

const server = createSocket('udp4')

const serverList:{ip:string, port: number}[] = []

server.on('error', (error) => {
  console.log('Error: ' + error)
})

server.on('message', (msg, info) => {
  const strMsg = msg.toString()
  console.log(`Received ${msg.length} bytes.`)
  console.log(`Message: ${strMsg}`)
  console.log(`External IP: ${info.address}:${info.port}`)

  if (strMsg === 'create_server') {
    if (!serverList.some(i => i.ip === info.address)) {
      const { address, port } = info
      serverList.push({ ip: address, port })
      server.send(`Server created successfully for ${info.address}:${info.port}`,
        info.port, info.address, (err) => err && console.log('err:' + err))
    }
  }
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
