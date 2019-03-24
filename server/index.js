let express = require('express')
let os = require('os')
let fs = require('fs')
let path = require('path')
let serveStatic = require('serve-static')
let getImageSize = require('image-size')

let storedTilesets = null

async function getTilesetsByDimension() {
	const tilesetDirectory = path.resolve(__dirname, '../src/assets/tilesets/transparent')
	const columns = 16
	const rows = 16
	console.log(tilesetDirectory)
	fs.readdir(tilesetDirectory, (err, files) => {
		if (err) {
			storedTilesets = null
			console.error(err)
		} else {
			storedTilesets = []
			files.forEach(file => {
				const { width, height } = getImageSize(path.resolve(tilesetDirectory, file))
				storedTilesets.push({
					name: file,
					imageWidth: width,
					imageHeight: height,
					spriteWidth: width / columns,
					spriteHeight: height / rows
				})
			})
		}
	})
}

async function cacheTilesets() {
	let tilesets = await getTilesetsByDimension()
}

cacheTilesets()

// let app = express()

// app.use('/', express.static(path.join(__dirname, 'dist')))

// app.get('/tilesets', (request, response) => {
//     response.send({

//     })
// })

// let port = process.env.PORT || 5000
// app.listen(port)
// console.log('Serving extended-ascii-previewer on port: ' + port)
