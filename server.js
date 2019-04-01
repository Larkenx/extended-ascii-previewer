let express = require('express')
let os = require('os')
let fs = require('fs')
let path = require('path')
let getImageSize = require('image-size')

const relativePath = 'images/tilesets/transparent'
const tilesetDirectory = path.resolve(__dirname, `public/${relativePath}`)
let storedTilesets = []

function cacheTilesetsByDimension() {
	// ASCII IBM CODE PAGE 437 is always 16x16
	const columns = 16
	const rows = 16
	try {
		const files = fs.readdirSync(tilesetDirectory)
		for (let file of files) {
			if (file !== '.DS_Store') {
				const { width, height } = getImageSize(path.resolve(tilesetDirectory, file))
				storedTilesets.push({
					name: file,
					url: relativePath + `/${file}`,
					imageWidth: width,
					imageHeight: height,
					spriteWidth: width / columns,
					spriteHeight: height / rows
				})
			}
		}
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

cacheTilesetsByDimension()

let app = express()
let port = process.env.PORT || 5000

// Allow CORS for my webpack server
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

app.get('/tilesets', (request, response) => {
	response.send({
		tilesetPath: relativePath,
		tilesets: storedTilesets
	})
})

app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(port)

console.log('Serving extended-ascii-previewer on port: ' + port)
