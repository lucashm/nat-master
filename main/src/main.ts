import { createSocket } from 'dgram'
import { Buffer } from 'buffer'

const server = createSocket('udp4')

const serverList:{ip:string, port: number}[] = []

const errorHandler = (e: Error | null) => e && console.log('err:' + e)

server.on('error', (error) => {
  console.log('Error: ' + error)
})

server.on('message', (msg, info) => {
  const jsonMsg: {ip:string, port:number, msg:string} = JSON.parse(msg.toString())
  if (jsonMsg.msg === 'KA') return
  console.log(`Received ${msg.length} bytes.`)
  console.log(`Message: ${jsonMsg.msg}`)
  console.log(`External IP: ${info.address}:${info.port}`)

  switch (jsonMsg.msg) {
    case 'create_server': {
      const idx = serverList.findIndex(i => i.ip === info.address)
      const { address, port } = info
      if (idx === -1) {
        serverList.push({ ip: address, port })
        server.send(`Server created successfully for ${info.address}:${info.port}`,
          info.port, info.address, errorHandler)
      } else {
        serverList[idx] = { ip: address, port }
        server.send(`Server already exists for ${info.address}:${info.port}`,
          info.port, info.address, errorHandler)
      }
      break
    }
    case 'list_servers':
      server.send(JSON.stringify(serverList), info.port, info.address, errorHandler)
      break
    case 'join_server': {
      const data = Buffer.from(`${info.address}:${info.port}`)
      console.log(`Sending data to ${jsonMsg.ip}:${jsonMsg.port}`)
      server.send(data, jsonMsg.port, jsonMsg.ip, errorHandler)
      break
    }
    default:
      server.send("Command doesn't compute", info.port, info.address, errorHandler)
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
