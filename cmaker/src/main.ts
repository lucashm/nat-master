import { createSocket } from 'dgram'
import { Buffer } from 'buffer'
import { config } from 'dotenv'
import { address } from 'ip'

config()
const client = createSocket('udp4')
client.bind(4444)

const masterIP = process.env.MASTER_IP

client.on('message', (msg, info) => {
  console.log('Data received from server : ' + msg.toString())
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port)
})

client.on('listening', () => {
  const info = client.address()
  const localIP = address()
  const data = Buffer.from(`${localIP}:${info.port}`)
  console.log('Sending data')
  client.send(data, 5000, masterIP,
    (error) => console.log('error:' + error)
  )
})
