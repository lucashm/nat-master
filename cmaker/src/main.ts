import { createSocket } from 'dgram'
import { Buffer } from 'buffer'
import { address } from 'ip'
import { config } from 'dotenv'

config()
const client = createSocket('udp4')
client.bind(4444)

const localIP = address()
const data = Buffer.from(localIP)

const masterIP = process.env.MASTER_IP

client.on('message', (msg, info) => {
  console.log('Data received from server : ' + msg.toString())
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port)
})

client.send(data, 5000, masterIP, (error) => {
  if (error) {
    client.close()
  } else {
    console.log('Data sent !!!')
  }
})

// const data1 = Buffer.from('hello')
// const data2 = Buffer.from('world')

// client.send([data1, data2], 5000, masterIP, (error) => {
//   if (error) {
//     client.close()
//   } else {
//     console.log('Data sent')
//   }
// })
