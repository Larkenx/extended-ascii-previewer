let express = require('express')
let fs = require('fs')
let path = require('path')
let serveStatic = require('serve-static')
let app = express()

const storedTilesets = null

async function cacheTilesets() {
	const tilesetDirectory = path.resolve('../src/assets/tilesets/transparent')
	console.log(tilesetDirectory)
	fs.readdir(tilesetDirectory, (err, files) => {
		files.forEach(file => {
			console.log(file)
		})
	})
}

cacheTilesets()

// app.use('/', express.static(path.join(__dirname, 'dist')))

// app.get('/tilesets', (request, response) => {
//     response.send({

//     })
// })

// let port = process.env.PORT || 5000
// app.listen(port)
// console.log('Serving extended-ascii-previewer on port: ' + port)
