<template>
  <div id="pixi_canvas"/>
</template>

<script>
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
	width: 800,
	height: 600,
	antialias: true,
	backgroundColor: 0x474747
})
// TODO: instantiate Pixi.js app/container outside of vue data context because we don't want reactive setters/getters on pixijs components themselves; pixi internal canvas
// rendering does not require us to track those changes (and furthermore would cause huge performance problems)
export default {
	name: 'PixiRenderer',
	mounted() {
		// When we mount this component, we want to register Pixi with a new HTML5 canvas...
		this.mountCanvas()
	},
	props: {
		tilesets: Array
	},
	watch: {
		tilesets(newState, oldState) {
			this.loadTilesets()
		}
	},
	data() {
		return {
			textureMap: null
		}
	},
	methods: {
		mountCanvas() {
			document.getElementById('pixi_canvas').innerHTML = ''
			document.getElementById('pixi_canvas').appendChild(app.view)
		},
		loadTilesets() {
			if (this.tilesets) {
				PIXI.loader
					.add(this.tilesets)
					.on('progress', (loader, resource) => this.handleAssetLoad(loader, resource))
					.load((loader, resources) => {
						this.clear()
						console.log('Finished loading tilesets')
						this.generateTextures()
					})
			}
		},
		clear() {
			app.stage.removeChildren()
		},
		handleAssetLoad(loader, resource) {
			let { stage, renderer } = app
			console.log(resource)
			this.clear()
			// let graphics = new PIXI.Graphics()
			let cx = stage.width / 2
			let cy = stage.height / 2
			// let barLength = renderer.width / 2
			let text = new PIXI.Text(`Loading ${resource.name}... ${Math.floor(loader.progress)}%`, {
				fill: 0xffffff,
				fontSize: 16,
				fontFamily: ['Source Code Pro', 'Menlo', 'Consolas'],
				x: cx,
				y: cy
			})
			stage.addChild(text)
		},
		getTilesetCoords(index, tileWidth, tileHeight, columns) {
			let rowNumber = Math.floor(index / columns) * tileHeight
			let colNumber = (index % columns) * tileHeight
			return [colNumber, rowNumber]
		},
		generateTextures() {
			for (let i = 0; i <= 255; i++) {
				for (let tileset of this.tilesets.slice(0, 1)) {
					const { spriteWidth, spriteHeight, name } = tileset
					console.log(this.getTilesetCoords(i, spriteWidth, spriteHeight, 16))
					console.log(String.fromCharCode(i))
				}
			}
		},
		renderMap(map) {
			// I want to load every 32x32 frame from the tileset image
			// for (let id = 0; id < this.tileset.tilecount; id++) {
			// 	let coords = this.getTilesetCoords(id)
			// 	let frame = new PIXI.Rectangle(coords[0], coords[1], this.tileSize, this.tileSize)
			// 	let texture = new PIXI.Texture(PIXI.loader.resources['spritesheet'].texture, frame)
			// 	this.tilesetMapping[id] = texture
			// }
		}
	}
}
</script>


