let express = require('express')
let os = require('os')
let fs = require('fs')
let path = require('path')
let getImageSize = require('image-size')
let plist = require('plist')

const relativePath = 'images/tilesets/transparent'
const tilesetDirectory = path.resolve(__dirname, `public/${relativePath}`)
const colorThemeDirectory = path.resolve(__dirname, `public/themes`)
let storedTilesets = []
let storedColorThemes = []

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

function cacheColorThemes() {
	// Loop through all of the OSX term themes, and load them as JSON
	try {
		const files = fs.readdirSync(colorThemeDirectory)
		for (let file of files) {
			let properties = plist.parse(fs.readFileSync(path.resolve(colorThemeDirectory, file), 'utf8'))
			let theme = { name: properties.name }
			for (let property in properties) {
				if ((property.startsWith('ANSI') || property.startsWith('Background')) && property.includes('Color')) {
					let formattedColor = property.replace('ANSI', '').replace('Color', '')
					let regexp = /\d(?:\.?\d+)? \d(?:\.?\d+)? \d(?:\.?\d+)?/
					let parsedBase64Buffer = properties[property].toString()
					let matches = parsedBase64Buffer.match(regexp)
					if (matches && matches.length === 1) {
						let colors = matches[0].split(' ')
						if (colors.length === 3) {
							let hex = colors
								.map(c => {
									let hex = (~~(parseFloat(c) * 255)).toString(16)
									if (hex.length < 2) hex = '0' + hex
									return hex
								})
								.join('')
							theme[formattedColor] = '#' + hex
						} else {
							console.log(`Failed to parse ${property} for RGB - ${parsedBase64Buffer}`)
						}
					} else {
						console.log(`Failed to parse ${property} for RGB - ${parsedBase64Buffer}`)
					}
				}
			}
			storedColorThemes.push(theme)
		}
	} catch (err) {
		console.error(err.stack)
	}
}

cacheTilesetsByDimension()
cacheColorThemes()
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

app.get('/color-themes', (request, response) => {
	response.send({
		themes: storedColorThemes
	})
})

app.get('/themes-and-tilesets', (request, response) => {
	response.send({
		tilesetPath: relativePath,
		tilesets: storedTilesets,
		themes: storedColorThemes
	})
})

app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(port)

console.log('Serving extended-ascii-previewer on port: ' + port)
