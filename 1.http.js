const fs = require('node:fs')
const http = require('node:http')

const desiredPort = process.env.PORT ?? 1237
//call back una vez que recibe una request y ejecuta

const processRequest = (req, res) => {
  console.log('request received:', req.url)
  res.setHeader('Content-Type', 'text/html; charset:utf-8')
  if (req.url === '/') {
    res.statusCode = 200
    res.end('<h1>Bienvenido a mi Mundo</h1>')
  } else if (req.url === '/imagen-super-bonita.png') {
    fs.readFile('./placa.jpeg', (err, data) => { // actua como buffer
      if (err) {
        res.statusCode = 500
        res.end('<h1>500 Int Server Error </h1>')
      } else {
        res.setHeader('Content-Type', 'image/png')// aca le aviso que es una imagen
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.statusCode = 200
    res.end('<h1>Contacto</h1>')
  } else {
    res.statusCode = 404
    res.end('<h1>404</h1>')
  }
}

const server = http.createServer(processRequest)

//busca el primer puerto disponible
//server.listen(0, ()=>{
//  console.log(`server listening on port ${server.address().port}`)
//})

server.listen(desiredPort, () => {
  // se levanta el servidor muestra la info en cosola
  console.log(`server listening on port http://localhost:${desiredPort}`)
})
