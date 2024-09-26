const config = {
  serviceHost: 'ligerbots.4msg.net',
  servicePort: 8055,
  serviceProtocol: 'http'
}

config.serviceUrl = `${config.serviceProtocol}://${config.serviceHost}:${config.servicePort}`

export default config

console.log(JSON.stringify({ config }, null, 2))
